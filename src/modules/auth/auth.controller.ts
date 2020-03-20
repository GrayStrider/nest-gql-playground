import { Controller, UseGuards, Post, Request } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { LocalAuthGuard } from '@M/auth/local-auth.guard'

@Controller ('auth')
export class AuthController {
	@UseGuards (LocalAuthGuard)
	@Post ('login')
	async login (@Request () req: Express.Request) {
		return req.user
	}
}
