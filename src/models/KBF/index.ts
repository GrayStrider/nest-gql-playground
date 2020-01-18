import {createSchema} from '@/graphql'
import {log} from '@/utils/libsExport'
import {SERVER_URL} from 'config/_consts'
import {genericApolloServer} from '@/graphql/apollo/genericServer'
import {GetResolver} from '@/models/KBF/entity/resolvers/Get'
import {CreateResolver} from '@/models/KBF/entity/resolvers/Create'

export const makeKBFServer = async () => {
	const path = '/kbf'
	const schema = await createSchema([
		GetResolver,
		CreateResolver
	])
	log.info(SERVER_URL + path)
	return genericApolloServer(schema)
		.getMiddleware(
			{path},
		)
}
