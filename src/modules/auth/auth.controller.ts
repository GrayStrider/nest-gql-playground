import { Controller, UseGuards, Post, Get } from '@nestjs/common'
import { LocalAuthGuard } from '@M/auth/guards/local-auth.guard'
import { User } from '@/common/decorators/user.decorator'
import { AuthService } from '@M/auth/auth.service'
import { JwtAuthGuard } from '@M/auth/guards/jwt-auth.guard'

@Controller ('auth')
export class AuthController {
	constructor (private authService: AuthService) {}
	
	@UseGuards (LocalAuthGuard)
	@Post ('login')
	async login (@User () user: Express.User) {
		return this.authService.login (user)
	}
	
	@UseGuards (JwtAuthGuard)
	@Get ('profile')
	getProfile (@User () user: Express.User) {
		return user
	}
}
