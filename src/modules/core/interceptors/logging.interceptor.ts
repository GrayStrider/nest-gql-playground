import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { Request, Response } from 'express'
import { log } from '@/common/message'
import { sig } from '@qdev/utils-ts'

@Injectable ()
export class LoggingInterceptor implements NestInterceptor {
	intercept (context: ExecutionContext, next: CallHandler): Observable<any> {
		const start = Date.now ()
		const ctx = context.switchToHttp ()
		const { method, url } = ctx.getRequest<Request> ()
		const { statusCode } = ctx.getResponse<Response> ()
		const msg = log(statusCode, url, method, start)
		return next
			.handle ()
			.pipe (tap (() => sig.info (msg)))
	}
}

