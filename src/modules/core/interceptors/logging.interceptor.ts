import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { Request, Response } from 'express'
import { log } from '@/common/message'
import { sig } from '@qdev/utils-ts'
import chalk from 'chalk'

/**
 * Interceptors have access to response/request
 * before and after the route handler is called.
 */
@Injectable ()
export class LoggingInterceptor implements NestInterceptor {
	intercept (context: ExecutionContext, next: CallHandler): Observable<any> {
		const start = Date.now ()
		sig.info (`${chalk.underline(`Handler`)}: ${context.getHandler ().name}`)
		sig.info (`${chalk.underline(`Class`)}: ${context.getClass ().name}`)
		const ctx = context.switchToHttp ()
		const { method, url, session, sessionID } = ctx.getRequest<Request> ()
		const { statusCode } = ctx.getResponse<Response> ()
		sig.info (`${chalk.underline(`sessionID`)}: ${sessionID}`)
		sig.info (`${chalk.underline(`session`)}:`)
		console.dir(session)
		
		const msg = log(statusCode, url, method, start)
		return next
			.handle ()
			.pipe (tap (() => sig.info (msg + '\n')))
	}
}

