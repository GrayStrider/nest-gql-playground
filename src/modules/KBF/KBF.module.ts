import { Module } from '@nestjs/common'
import { GraphQLModule, GqlModuleOptions } from '@nestjs/graphql'
import { TaskResolver } from '@M/KBF/resolvers/task.resolver'
import { CatFactsAPI } from '@M/cat-facts/cat-facts.datasource'
import { formatError } from '@/graphql/apollo/formatError'
import { BoardResolver } from '@M/KBF/resolvers/board.resolver'
import { DBModule } from '@M/db/db.module'
import { ColorResolver } from '@M/KBF/resolvers/color.resolver'

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
		ColorResolver
	],
	controllers: [],
	exports: []
})
export class KBFModule {}
