import { Module } from '@nestjs/common'
import { UsersModule } from '@M/users/users.module'
import { AuthService } from '@M/auth/auth.service'

@Module({
	imports: [UsersModule],
	providers: [AuthService],
	exports: [AuthService]
})
export class AuthModule {


}
