import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common'
import { ErrorCodes } from '@/common/errors'
import { ApolloError } from 'apollo-server-errors'

@Catch ()
export class GqlExceptionFilter implements ExceptionFilter {
	catch (exception: ApolloError, host: ArgumentsHost): void {
		const ctx = host.switchToHttp ()
		const response = ctx.getResponse ()
		const request = ctx.getRequest ()
		const next = ctx.getNext ()
		if(exception.validationErrors) {
			console.log(exception.validationErrors)
		} else {
			console.log(exception)
		}
		throw exception
	}
}
