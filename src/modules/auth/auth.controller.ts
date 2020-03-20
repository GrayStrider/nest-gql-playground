import { Controller, UseGuards, Post, Request } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { LocalAuthGuard } from '@M/auth/local-auth.guard'
import { User } from '@/common/decorators/user.decorator'

@Controller ('auth')
export class AuthController {
	@UseGuards (LocalAuthGuard)
	@Post ('login')
	async login (@User () user: Express.User) {
		return user
	}
}
