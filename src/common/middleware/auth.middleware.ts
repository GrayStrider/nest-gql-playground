import { Handler } from 'express'

export const AuthMiddleware: Handler = (req, res, next) => {
	// validation steps here
	req.user = { name: 'Ivan', roles: ['admin', 'user'], id: '1' }
	next ()
}

