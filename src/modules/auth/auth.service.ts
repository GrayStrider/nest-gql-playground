import { Injectable } from '@nestjs/common'
import { UsersService } from '@M/users/users.service'
import { omit } from 'ramda'
import { JwtService } from '@nestjs/jwt'

@Injectable ()
export class AuthService {
	constructor (
		private usersService: UsersService,
		private jwtService: JwtService
	) {}
	
	async validateUser (username: string, pass: string) {
		const user = await this.usersService.findOne (username)
		
		return user && user.password === pass
			? omit (['password'], user)
			: null
	}
	
	async login (user: Express.User) {
		const payload = { username: user.name, sub: user.id }
		return {
			access_token: this.jwtService.sign (payload)
		}
	}
}

