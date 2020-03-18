import { Module } from '@nestjs/common'
import { connection } from '@M/connection/connection.provider'
import { Tokens } from '@/common/constants'
import { NODE_ENV } from '@config'

const ConnectionProvider = {
	provide: Tokens.CONNECTION,
	useValue: NODE_ENV === 'production'
		? connection.prod
		: connection.dev
}

@Module ({
	providers: [ConnectionProvider]
})
export class ConnectionModule {}

