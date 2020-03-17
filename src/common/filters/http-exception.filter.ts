import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import { log } from '@/common/message'
import { sig } from '@qdev/utils-ts'


/**
 * Exception Filters are called after the route handler and after the interceptors.
 * They are the last place to make changes before a response goes out.
 */
@Catch (HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
	catch (exception: HttpException, host: ArgumentsHost) {
		const start = Date.now ()
		const ctx = host.switchToHttp ()
		const response = ctx.getResponse ()
		const { url, method } = ctx.getRequest ()
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
