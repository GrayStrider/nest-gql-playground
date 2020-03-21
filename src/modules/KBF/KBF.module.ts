import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { KBFResolver } from '@M/KBF/KBF.resolver'
import { CatFactsAPI } from '@M/cat-facts/cat-facts.datasource'
import { formatError } from '@/graphql/apollo/formatError'

@Module ({
	imports: [
		GraphQLModule.forRoot ({
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
			context: (args) => ({
			
			})
		})
	],
	providers: [KBFResolver],
	controllers: [],
	exports: []
})
export class KBFModule {}
