import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'

@Injectable ()
export class LoggerMiddleware implements NestMiddleware<Request, Response> {
	/**
	 * Does not inherit types; generic types only used when
	 * generating implementation with IDE
	 */
	use (req: Request, res: Response, next: () => void): any {
	
	}
}
