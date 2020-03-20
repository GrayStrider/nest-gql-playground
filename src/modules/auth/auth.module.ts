import { Module } from '@nestjs/common'
import { UsersModule } from '@M/users/users.module'
import { AuthService } from '@M/auth/auth.service'
import { LocalStrategy } from '@M/auth/local.strategy'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from '@M/auth/auth.controller'

@Module ({
	imports: [UsersModule, PassportModule],
	providers: [AuthService, LocalStrategy],
	controllers: [AuthController],
	exports: [AuthService]
})
export class AuthModule {}
