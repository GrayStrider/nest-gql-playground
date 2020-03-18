import { Module, ValueProvider, FactoryProvider, Injectable } from '@nestjs/common'
import { connection } from '@M/connection/connection.provider'
import { Tokens } from '@/common/constants'
import { NODE_ENV } from '@config'
import sleep from 'sleep-promise'

@Injectable()
class OptionsProvider {}

const AsyncConnectionFactory: FactoryProvider = {
	provide: Tokens.ASYNC_CONNECTION,
	useFactory: async (options: OptionsProvider) => {
		const {data} = await sleep (100) ({ data: 'foobar' })
		return data
	},
	inject: [OptionsProvider]
}

/**
 * useValue vs useFactory
 *
 * useFactory takes a factory function that is expected to return the value
 * and also can have dependencies
 * (require instances of other providers passed as parameter)
 *
 * - Angular
 */
const ConnectionProvider: ValueProvider = {
	provide: Tokens.CONNECTION,
	useValue: NODE_ENV === 'production'
		? connection.prod
		: connection.dev
}


@Module ({
	providers: [ConnectionProvider],
	exports: [/*ConnectionProvider*/Tokens.CONNECTION] // either one is valid
})
export class ConnectionModule {}

