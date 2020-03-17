import { Injectable, NestMiddleware } from '@nestjs/common'
import { Handler } from 'express'

@Injectable ()
export class AuthMiddleware implements NestMiddleware {
	use: Handler = (req, res, next) => {
		req.user = { name: 'Ivan', roles: ['admin'], id: '1' }
		next ()
	}
}

