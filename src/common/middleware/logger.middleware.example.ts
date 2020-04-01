import { Injectable, NestMiddleware } from '@nestjs/common'
import { Handler } from 'express'

/**
 * Middleware is called only before the route handler is called.
 * You have access to the response object, but you don't have the result
 * of the route handler.
 * They are basically express middleware functions.
 */
@Injectable ()
class LoggerMiddleware implements NestMiddleware {
	constructor (private someService = {}) {}
	/**
	 * Does not inherit types; generic types only used when
	 * generating implementation with IDE;
	 * better use Handler from Express
	 */
	use: Handler = (req, res, next) => {
		this.someService.toString()
		next ()
	}
}
