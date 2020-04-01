import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { Request, Response } from 'express'
import { formattedMessage } from '@/common/formatted-message'
import { sig } from '@qdev/utils-ts'
import chalk from 'chalk'

/**
 * Interceptors have access to response/request
 * before and after the route handler is called.
 */
@Injectable ()
export class HTTPLoggingInterceptor implements NestInterceptor {
	intercept (context: ExecutionContext, next: CallHandler): Observable<any> {
		if (!(context.getType () === 'http')) return next.handle ()
		
		const start = Date.now ()
		sig.info (`${chalk.underline (`Handler`)}: ${context.getHandler ().name}`)
		sig.info (`${chalk.underline (`Class`)}: ${context.getClass ().name}`)
		
		
		const ctx = context.switchToHttp ()
		const request = ctx.getRequest<Request> ()
		const response = ctx.getResponse<Response> ()
		sig.info (`${chalk.underline (`sessionID`)}: ${(request.sessionID) ?? 'none found'}`)
		
		const msg = formattedMessage (
			response.statusCode.toString() ?? 'no status code',
			request.url ?? 'no url',
			request.method ?? 'no method',
			start)
		
		
		return next
			.handle ()
			.pipe (tap (() => sig.info (msg + '\n')))
	}
}

