declare module 'graphql-fields' {
	import { AnyObject } from 'tsdef'
	import { GraphQLResolveInfo } from 'graphql'
	
	function graphqlFields (
		info: GraphQLResolveInfo,
		initialObject = {},
		opts = { processArguments: false }): AnyObject & typeof initialObject
	
	export = graphqlFields
}
