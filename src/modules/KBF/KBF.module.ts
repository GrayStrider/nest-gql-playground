import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeormConfig } from '@config'
import { Connection } from 'typeorm'
import { sig } from '@qdev/utils-ts'
import { GraphQLModule } from '@nestjs/graphql'
import { CreateResolver } from '@/models/resolvers/CreateResolver'
import { TasksResolver } from '@/models/resolvers/TasksResolver'
import { redisSessionClient } from '@/DB/redis'

@Module ({
	imports: [
		GraphQLModule.forRoot ({
			autoSchemaFile: 'src/graphql/generated/schema.graphql'
		}),
	],
	providers: [CreateResolver, TasksResolver],
	controllers: [],
	exports: []
})
export class KBFModule {

}
