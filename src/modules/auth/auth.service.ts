import { Injectable, Inject } from '@nestjs/common'
import { UsersService } from '@M/users/users.service'
import { omit } from 'ramda'

@Injectable ()
export class AuthService {
	@Inject (UsersService)
	protected usersService: UsersService
	
	async validateUser (username: string, pass: string) {
		const user = await this.usersService.findOne (username)
		
		return user && user.password === pass
			? omit (['password'], user)
			: null
	}
	
	async login (user: Express.User) {
		return { user }
	}
}
