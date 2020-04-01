import { Module } from '@nestjs/common'
import { AuthResolver } from '@M/auth/auth.resolver'

@Module ({
	imports: [AuthResolver]
})
export class AuthModule {}
