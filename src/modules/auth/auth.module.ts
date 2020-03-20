import { Module } from '@nestjs/common'
import { UsersModule } from '@M/users/users.module'
import { AuthService } from '@M/auth/auth.service'
import { LocalStrategy } from '@M/auth/local.strategy'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from '@M/auth/auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { JWT_SECRET } from '@config'

@Module ({
	imports: [
		UsersModule,
		PassportModule,
		JwtModule.register({
			secret: JWT_SECRET,
			signOptions: { expiresIn: '60s' },
		})
	],
	providers: [AuthService, LocalStrategy],
	controllers: [AuthController],
	exports: [AuthService]
})
export class AuthModule {}
