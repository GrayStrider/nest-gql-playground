declare module 'graphql-depth-limit' {
	import { ValidationContext, GraphqlError } from 'graphql'
	
	
	interface Options {
		ignore: string | RegExp
	}
	
	interface QueryDepths {
		[key: string]: GraphqlError
	}
	
	function depthLimit (
		maxDepth: number,
		options?: Options,
		callback = (queryDepths: QueryDepths) => {}
	): () => ValidationContext
	
	export = depthLimit
}
