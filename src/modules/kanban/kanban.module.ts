import { Module } from '@nestjs/common'
import { TaskResolver } from '@M/kanban/resolvers/task.resolver'
import { BoardResolver } from '@M/kanban/resolvers/board.resolver'
import { ColorResolver } from '@M/kanban/resolvers/color.resolver'
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core'
import { CommentResolver } from '@M/kanban/resolvers/comment.resolver'
import { UserResolver } from '@M/kanban/resolvers/user.resolver'
import { TagResolver } from '@M/kanban/resolvers/tag.resolver'
import { TimeoutInterceptor } from '@/common/interceptors/timeout.interceptor'
import { GqlExceptionFilter } from '@/common/filters/gql-exception.filter'


@Module ({
	providers: [
		BoardResolver,
		TaskResolver,
		UserResolver,
		TagResolver,
		CommentResolver,
		ColorResolver,
		{ provide: APP_INTERCEPTOR, useClass: TimeoutInterceptor },
		{ provide: APP_FILTER, useClass: GqlExceptionFilter }
	]
})

export class KanbanModule {}

