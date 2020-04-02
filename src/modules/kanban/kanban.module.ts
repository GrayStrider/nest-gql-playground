import { Module } from '@nestjs/common'
import { TaskResolver } from '@M/kanban/resolvers/task.resolver'
import { BoardResolver } from '@M/kanban/resolvers/board.resolver'
import { ColorResolver } from '@M/kanban/resolvers/color.resolver'
import { CommentResolver } from '@M/kanban/resolvers/comment.resolver'
import { UserResolver } from '@M/kanban/resolvers/user.resolver'
import { TagResolver } from '@M/kanban/resolvers/tag.resolver'
import { SwimlaneResolver } from '@M/kanban/resolvers/swimlane.resolver'


@Module ({
	providers: [
		BoardResolver,
		TaskResolver,
		SwimlaneResolver,
		UserResolver,
		TagResolver,
		CommentResolver,
		ColorResolver
	]
})

export class KanbanModule {}

