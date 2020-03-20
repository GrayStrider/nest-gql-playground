import { Injectable, Inject } from '@nestjs/common'
import { AuthService } from '@M/auth/auth.service'
import { omit } from 'ramda'
import { UsersService } from '@M/users/users.service'
import { JwtService } from '@nestjs/jwt'

@Injectable ()
export class AuthJwtService extends AuthService {
	@Inject (UsersService)
	protected usersService: UsersService
	@Inject (JwtService)
	private jwtService: JwtService
	
	constructor () { super ()}
	
	async validateUser (username: string, pass: string) {
		const user = await this.usersService.findOne (username)
		
		return user && user.password === pass
			? omit (['password'], user)
			: null
	}
	
	async login (user: Express.User) {
		const payload = { username: user.name, sub: user.id }
		return {
			access_token: this.jwtService.sign (payload),
			user
		}
	}
}
