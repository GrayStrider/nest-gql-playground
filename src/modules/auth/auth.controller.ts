import { Controller, UseGuards, Post } from '@nestjs/common'
import { LocalAuthGuard } from '@M/auth/local-auth.guard'
import { User } from '@/common/decorators/user.decorator'
import { AuthService } from '@M/auth/auth.service'

@Controller ('auth')
export class AuthController {
	constructor (private authService: AuthService) {}
	
	@UseGuards (LocalAuthGuard)
	@Post ('login')
	async login (@User () user: Express.User) {
		return this.authService.login (user)
	}
}
