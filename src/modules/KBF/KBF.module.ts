import { Module } from '@nestjs/common'
import { GraphQLModule, GqlModuleOptions } from '@nestjs/graphql'
import { KBFResolver } from '@M/KBF/KBF.resolver'
import { CatFactsAPI } from '@M/cat-facts/cat-facts.datasource'
import { formatError } from '@/graphql/apollo/formatError'

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
		GraphQLModule.forRoot (apolloOptions)
	],
	providers: [KBFResolver],
	controllers: [],
	exports: []
})
export class KBFModule {}
