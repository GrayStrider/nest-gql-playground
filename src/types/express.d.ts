declare namespace Express {
	export interface Request {
		user?: User
	}
}

interface User {
	name: string
	id: string
	roles: string[]
}
