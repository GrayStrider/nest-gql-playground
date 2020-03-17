import { Injectable, NestMiddleware } from '@nestjs/common'
import { Handler } from 'express'

@Injectable ()
export class LoggerMiddleware implements NestMiddleware{
	/**
	 * Does not inherit types; generic types only used when
	 * generating implementation with IDE;
	 * better use Handler from Express
	 */
	use: Handler = (req, res, next) => {
	
	}
}
