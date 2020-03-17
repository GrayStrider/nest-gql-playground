import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable, of } from 'rxjs'


/**
 * we return a new stream here, created by the RxJS of() operator,
 * therefore the route handler _won't be called at all_.
 */
@Injectable ()
export class CacheInterceptor implements NestInterceptor {
	intercept (context: ExecutionContext, next: CallHandler): Observable<any> {
		// stub implementation
		const isCached = true
		if (isCached) {
			return of ([])
		}
		return next.handle ()
	}
}
