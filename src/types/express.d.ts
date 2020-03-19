declare namespace Express {
	
	export interface User {
		id: string
		name: string
		roles: Role[]
	}
	
	export type Role =
		'admin'
		| 'guest'
		| 'user'
	
}
