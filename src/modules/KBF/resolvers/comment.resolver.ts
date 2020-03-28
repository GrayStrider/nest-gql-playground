import { Query, Resolver, Args, Mutation } from '@nestjs/graphql'
import { SearchByIDInput } from '@M/KBF/inputs/search-by-id.input'
import { Comment } from '@M/KBF/entity/Comment'
import { CommentInput } from '@M/KBF/inputs/comment.input'
import { Task } from '@M/KBF/entity/Task'
import { User } from '@M/KBF/entity/User'
import { bb } from '@qdev/utils-ts'
import { NotFoundByIDError } from '@/common/errors'
import { Like } from 'typeorm'

@Resolver ()
export class CommentResolver {
	@Query (returns => Comment)
	async comment (@Args () data: SearchByIDInput) {
		return Comment.findOne (data)
	}
	
	@Query (returns => [Comment])
	async comments (@Args ('data') {
		authorID, taskID, text
	}: CommentInput) {
		const [task, author] = await bb.all ([
			Task.findOne (taskID),
			User.findOne (authorID)
		])
		
		if (!task) throw NotFoundByIDError ('task', taskID)
		if (!author) throw NotFoundByIDError ('author', authorID)
		
		return Comment.find ({
			where: {
				task,
				author,
				text: Like (`%${text}%`)
			}
		})
	}
	
	@Mutation (returns => Comment)
	async addComment (@Args ('data') {
		authorID, taskID, text
	}: CommentInput) {
		const [task, author] = await bb.all ([
			Task.findOne (taskID),
			User.findOne (authorID)
		])
		
		if (!task) throw NotFoundByIDError ('task', taskID)
		if (!author) throw NotFoundByIDError ('author', authorID)
		
		return Comment.create ({ text, task, author }).save ()
	}
}
