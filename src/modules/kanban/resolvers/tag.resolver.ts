import { Resolver, Query, Args, Mutation, Info } from '@nestjs/graphql'
import { Tag } from '@M/kanban/entity/Tag'
import { TagInput, TagSearchByInput } from '@M/kanban/inputs/tag.input'
import { Task } from '@M/kanban/entity/Task'
import { without, isEmpty, keys, intersection, last } from 'ramda'
import Errors, { NotFoundByIDError } from '@/common/errors'
import { getBoard } from '@M/kanban/resolvers/task.resolver'
import { toDefault, sig } from '@qdev/utils-ts'
import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'
import { AnyObject } from 'tsdef'
import { SelectQueryBuilder } from 'typeorm'

const dot = (a: string) => (b: string) => a + '.' + b
type KeyR = keyof typeof datamodel.relations
type KeyF = keyof typeof datamodel.fields

const datamodel = {
	fields: {
		task: ['id', 'title', 'description'],
		tasks: ['id', 'title', 'description'],
		tag: ['id', 'name', 'description', 'pinned'],
		tags: ['id', 'name', 'description', 'pinned'],
		board: ['id', 'name'],
		boards: ['id', 'name'],
		color: ['name', 'value'],
		colors: ['name', 'value']
	},
	
	relations: {
		task: ['tags', 'board', 'color'],
		tasks: ['tags', 'board', 'color'],
		tag: ['tasks', 'board'],
		tags: ['tasks', 'board'],
		board: ['tags', 'tasks', 'colors'],
		boards: ['tags', 'tasks', 'colors'],
		color: ['tasks', 'board'],
		colors: ['tasks', 'board']
	}
}


@Resolver ()
export class TagResolver {
	@Query (returns => [Tag])
	async tags (
		@Args ('searchBy', { nullable: true }) { boardName }: TagSearchByInput,
		@Info () info: GraphQLResolveInfo
	): Promise<Tag[]> {
		const schema = graphqlFields (info)
		const alreadyIncludedRelations = ['board']
		
		const rootParentName = 'tag'
		const filteredByBoard = Tag
			.createQueryBuilder (rootParentName)
			.leftJoin ('tag.board', 'tag_board')
			.where ('tag_board.name = :boardName', { boardName })
		
		function buildQuery (schema: AnyObject, qb: SelectQueryBuilder<any>, alias = rootParentName) {
			// sig.debug ('schema: ', schema)
			// sig.info ('current alias:', alias)
			const key = last (alias.split ('_')) ?? alias
			// sig.info ('current key:', key)
			const toTraverse = keys (schema).map (String)
			
			// sig.debug ('toTraverse:', toTraverse)
			const relevantFields = intersection
			(datamodel.fields[key as KeyF], toTraverse)
			const relevantRelations = intersection
			(datamodel.relations[key as KeyR], toTraverse)
			
			// sig.info (`adding fields ${relevantFields} for`, key)
			for (const field of relevantFields)
				qb = qb.addSelect (dot (alias) (field))
			
			// sig.debug ('relations', relevantRelations)
			for (const relation of relevantRelations) {
				// sig.debug ('alias:', relation, '\n')
				const new_alias = alias + '_' + relation
				if (!(relation === 'board' && alias === 'tag')) { // TODO exclude already added initial join
					// sig.debug ('new alias:', new_alias)
					qb = qb.leftJoin (dot (alias) (relation), new_alias)
				}
				
				qb = buildQuery (schema[relation], qb, new_alias)
			}
			
			return qb
		}
		
		const query = buildQuery (schema, filteredByBoard)
		return query.getMany ()
	}
	
	@Mutation (returns => Tag)
	async addTag (@Args ('data') data: TagInput): Promise<Tag> {
		const { tasksIDs, boardName, name, ...rest } = data
		const board = await getBoard (boardName)
		
		toDefault (
			!await Tag.findOne ({ name, board }),
			new Errors.NotUnique (`Tag with the name <${name}> already exists on the board: <${boardName}>`,
				{ boardName, name }))
		
		const tasks = await getTasks (tasksIDs)
		
		return Tag.create ({ name, board, tasks, ...rest }).save ()
		
	}
}

async function getTasks (lookupIDs: string[]) {
	const tasks = await Task.findByIds (lookupIDs)
	const notFound = without (tasks.map (t => t.id), lookupIDs)
	if (!isEmpty (notFound)) {
		throw NotFoundByIDError ('tasks',
			notFound.join (', '))
	}
	return tasks
}
