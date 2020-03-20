import { Module } from '@nestjs/common'
import { AuthService } from '@M/auth/auth.service'
import { LocalStrategy } from '@M/auth/strategies/local.strategy'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from '@M/auth/auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { JWT_SECRET } from '@config'
import { JwtStrategy } from '@M/auth/strategies/jwt.strategy'
import { UsersService } from '@M/users/users.service'
import { AuthJwtService } from '@M/auth/auth-jwt.service'

@Module ({
	imports: [
		PassportModule.register ({
			defaultStrategy: 'jwt',
			session: true
		}),
		JwtModule.register ({
			secret: JWT_SECRET,
			signOptions: { expiresIn: '1 day' }
		})
	],
	providers: [AuthService, AuthJwtService, UsersService, LocalStrategy, JwtStrategy],
	controllers: [AuthController],
	exports: [AuthService]
})
export class AuthModule {}

