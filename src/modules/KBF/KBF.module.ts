import { Module, ValidationPipe } from '@nestjs/common'
import { GraphQLModule, GqlModuleOptions } from '@nestjs/graphql'
import { TaskResolver, ErrorCodes2 } from '@M/KBF/resolvers/task.resolver'
import { CatFactsAPI } from '@M/cat-facts/cat-facts.datasource'
import { BoardResolver } from '@M/KBF/resolvers/board.resolver'
import { DBModule } from '@M/db/db.module'
import { ColorResolver } from '@M/KBF/resolvers/color.resolver'
import { APP_PIPE, APP_FILTER } from '@nestjs/core'
import { validatorOptions } from '@M/cats/config/validator'
import { ApolloError } from 'apollo-server-errors'
import { prop } from 'ramda'
import { CommentResolver } from '@M/KBF/resolvers/comment.resolver'
import { UserResolver } from '@M/KBF/resolvers/user.resolver'
import { GqlExceptionFilter } from '@/common/filters/gql-exception.filter'
import { TagResolver } from '@M/KBF/resolvers/tag.resolver'

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

const GqlValidationPipe = new ValidationPipe ({
	...validatorOptions,
	exceptionFactory (errors) {
		const validationErrors = errors.map
		(prop ('constraints'))
		
		return new ApolloError ('Validation failed', ErrorCodes2.VALIDATION_ERROR, { validationErrors })
	}
})

@Module ({
	imports: [
		GraphQLModule.forRoot (apolloOptions),
		DBModule
	],
	providers: [
		BoardResolver,
		TaskResolver,
		UserResolver,
		TagResolver,
		CommentResolver,
		ColorResolver,
		{ provide: APP_PIPE, useValue: GqlValidationPipe }
	],
	controllers: [],
	exports: []
})
export class KBFModule {}
