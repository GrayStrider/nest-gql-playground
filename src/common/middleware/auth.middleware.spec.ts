import { AuthMiddleware } from '@/common/middleware/auth.middleware'

describe ('AuthMiddleware', () => {
	it ('should be defined', () => {
		expect (new AuthMiddleware ()).toBeDefined ()
	})
})
