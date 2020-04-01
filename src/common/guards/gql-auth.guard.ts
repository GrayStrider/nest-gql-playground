import { CanActivate, ExecutionContext } from '@nestjs/common'
import Errors from '@/common/errors'
import { GqlExecutionContext } from '@nestjs/graphql'
import { MyContext } from '@M/gql/gql.module'

export class GqlAuthGuard implements CanActivate {
	canActivate (context: ExecutionContext) {
		const eCtx = GqlExecutionContext.create (context)
		
		// Apollo context
		const ctx = eCtx.getContext<MyContext> ()
		// Query arguments
		const args = eCtx.getArgs ()
		// Query info: operation, field name, path, parent,
		// return type, variables (?)...
		const info = eCtx.getInfo ()
		// 'graphql'
		const type = eCtx.getType ()
		// Invoked class
		const class_ = eCtx.getClass ()
		
		const handler = eCtx.getHandler ()
		// undefined ?
		const root = eCtx.getRoot ()
		// Request, Response
		const http = eCtx.switchToHttp ()
		const [req, res, next] = [
			http.getRequest (),
			http.getResponse (),
			http.getNext ()
		]
		throw new Errors.Unathorized
		return true
	}
	
}
