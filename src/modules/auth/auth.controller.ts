import { Controller, UseGuards, Post, Get } from '@nestjs/common'
import { LocalAuthGuard } from '@M/auth/guards/local-auth.guard'
import { User } from '@/common/decorators/user.decorator'
import { AuthService } from '@M/auth/auth.service'
import { AuthJwtService } from '@M/auth/auth-jwt.service'

@Controller ('auth')
export class AuthController {
	constructor (
		private authService: AuthService,
		private authJwtService: AuthJwtService
	) {}
	
	@UseGuards (LocalAuthGuard)
	@Post ('login')
	async login (@User () user: Express.User) {
		return this.authService.login (user)
	}
	
	@Get ('profile')
	getProfile (@User () user: Express.User) {
		return user
	}
	
	async issueJWT (@User () user: Express.User) {
		return this.authJwtService.login(user)
	}
}
