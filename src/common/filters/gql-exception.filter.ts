import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common'

@Catch ()
export class GqlExceptionFilter implements ExceptionFilter {
	catch (exception: any, host: ArgumentsHost): void {
		const ctx = host.switchToHttp ()
		const response = ctx.getResponse ()
		const request = ctx.getRequest ()
		const next = ctx.getNext ()
	}
}
