import { Module } from '@nestjs/common'
import { GraphQLModule, GqlModuleOptions } from '@nestjs/graphql'
import { TaskResolver } from '@M/KBF/resolvers/TaskResolver'
import { CatFactsAPI } from '@M/cat-facts/cat-facts.datasource'
import { formatError } from '@/graphql/apollo/formatError'
import { BoardResolver } from '@M/KBF/resolvers/BoardResolver'
import { DBModule } from '@M/db/db.module'

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
	formatError,
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
	],
	controllers: [],
	exports: []
})
export class KBFModule {}
