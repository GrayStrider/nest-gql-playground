import { Query, Resolver, Args, Mutation } from '@nestjs/graphql'
import { SearchByIDInput } from '@M/KBF/inputs/shared/search-by-id.input'
import { Comment } from '@M/KBF/entity/Comment'
import { CommentInput } from '@M/KBF/inputs/comment.input'
import { Task } from '@M/KBF/entity/Task'
import { User } from '@M/KBF/entity/User'
import { bb, toDefault } from '@qdev/utils-ts'
import { NotFoundByIDError } from '@/common/errors'
import { Like } from 'typeorm'

@Resolver ()
export class CommentResolver {
	@Query (returns => Comment)
	async comment (@Args () { id }: SearchByIDInput): Promise<Comment> {
		return toDefault (
			await Comment.findOne (id),
			NotFoundByIDError ('comment', id))
	}
	
	@Query (returns => [Comment])
	async comments (@Args ('data') {
		userID, taskID, text
	}: CommentInput) {
		const [task, user] = await bb.all ([
			Task.findOne (taskID),
			User.findOne (userID)
		])
		
		if (!task) throw NotFoundByIDError ('task', taskID)
		if (!user) throw NotFoundByIDError ('user', userID)
		
		return Comment.find ({
			where: {
				task,
				user,
				text: Like (`%${text}%`)
			}
		})
	}
	
	@Mutation (returns => Comment)
	async addComment (@Args ('data') {
		userID, taskID, text
	}: CommentInput) {
		const [task, user] = await bb.all ([
			Task.findOne (taskID),
			User.findOne (userID)
		])
		
		if (!task) throw NotFoundByIDError ('task', taskID)
		if (!user) throw NotFoundByIDError ('user', userID)
		
		return Comment.create ({ text, task, user }).save ()
	}
}
