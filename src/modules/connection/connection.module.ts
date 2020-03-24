import { Module, ValueProvider, FactoryProvider, Injectable, Scope } from '@nestjs/common'
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
	inject: [OptionsProvider],
	scope: Scope.DEFAULT // Injection scopes
}

export const connection = {
	dev: 'Implementation',
	prod: 'Another'
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

