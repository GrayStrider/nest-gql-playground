import { Module } from '@nestjs/common'
import { connection } from '@M/connection/connection.provider'
import { Tokens } from '@/common/constants'

@Module ({
	providers: [
		{
			provide: Tokens.CONNECTION,
			useValue: connection
		}
	]
})
export class ConnectionModule {}

