import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import { log } from '@/common/message'
import { sig } from '@qdev/utils-ts'
import { Request, Response } from 'express'

/**
 * Exception Filters are called after the route handler and after the interceptors.
 * They are the last place to make changes before a response goes out.
 */
@Catch (HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
	/**
	 *
	 * @param exception
	 * @param host
	 * ArgumentsHost simply acts as an abstraction over a handler's arguments.
	 * For example, for HTTP server applications the host object
	 * encapsulates Express's [request, response, next] array.
	 * On the other hand, for GraphQL applications, the host object contains the [root, args, context, info] array.
	 */
	catch (exception: HttpException, host: ArgumentsHost) {
		sig.info (`Type: ${host.getType ()}`)
		
		const start = Date.now ()
		const ctx = host.switchToHttp () // Or WebSockets / RPC
		const response = ctx.getResponse <Response> ()
		const { url, method } = ctx.getRequest <Request> ()
		const statusCode = exception.getStatus ()
		
		const msg = log (statusCode, url, method, start)
		sig.error (msg)
		response.status (statusCode).json ({
			kind: 'HTTP Exception',
			statusCode,
			timestamp: new Date ().toISOString (),
			path: url
		})
	}
}
