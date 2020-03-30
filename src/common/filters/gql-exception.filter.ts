import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common'

@Catch ()
export class GqlExceptionFilter implements ExceptionFilter {
	catch (exception: any, host: ArgumentsHost): void {
		const ctx = host.switchToHttp ()
		const response = ctx.getResponse ()
		const request = ctx.getRequest ()
		const next = ctx.getNext ()
		
		if (exception.routine === '_bt_check_unique') {
			throw new Error('unique constraint violation')
		} else {
			throw exception
		}
	}
}
