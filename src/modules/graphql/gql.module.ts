import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'

@Module ({
	imports: [
		GraphQLModule.forRoot ({
			autoSchemaFile: './generated/schema.graphql',
		})
	],
	providers: [],
	controllers: [],
	exports: []
})
export class GqlModule implements NestModule {
	configure (consumer: MiddlewareConsumer): void {
		consumer.apply ([]).forRoutes ('*')
	}
}
