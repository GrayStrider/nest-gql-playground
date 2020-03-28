import { Module, ValidationPipe } from '@nestjs/common'
import { GraphQLModule, GqlModuleOptions } from '@nestjs/graphql'
import { TaskResolver, ErrorCodes } from '@M/KBF/resolvers/task.resolver'
import { CatFactsAPI } from '@M/cat-facts/cat-facts.datasource'
import { BoardResolver } from '@M/KBF/resolvers/board.resolver'
import { DBModule } from '@M/db/db.module'
import { ColorResolver } from '@M/KBF/resolvers/color.resolver'
import { APP_PIPE } from '@nestjs/core'
import { validatorOptions } from '@M/cats/config/validator'
import { ApolloError } from 'apollo-server-errors'

const apolloOptions: GqlModuleOptions = {
	autoSchemaFile: 'src/graphql/generated/schema.graphql',
	dataSources: () => ({
		catFacts: new CatFactsAPI ()
	}),
	playground: {
		settings: {
			'request.credentials': 'include'
		}
	},
	// formatError, // TODO
	context: (args) => ({})
}

@Module ({
	imports: [
		GraphQLModule.forRoot (apolloOptions),
		DBModule
	],
	providers: [
		BoardResolver,
		TaskResolver,
		ColorResolver,
		{
			provide: APP_PIPE, useValue: new ValidationPipe ({
				...validatorOptions,
				exceptionFactory (errors) {
					return new ApolloError ('Validation failed', ErrorCodes.VALIDATION_ERROR, { validationErrors: errors })
				}
			})
		}
	],
	controllers: [],
	exports: []
})
export class KBFModule {}
