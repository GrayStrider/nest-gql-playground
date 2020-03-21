import { FactoryProvider, Module } from '@nestjs/common'
import { Connection } from 'typeorm'
import { sig } from '@qdev/utils-ts'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeormConfig } from '@config'

const makeConnection: FactoryProvider = {
	provide: '_PrepareDB',
	useFactory: async (connection: Connection) => {
		sig.warn ('resetting the DB')
		await connection.synchronize (true)
		// TODO Redis provider
		return connection
	},
	inject: [Connection]
}

@Module ({
	imports: [
		TypeOrmModule.forRoot (TypeormConfig)
	],
	providers: [makeConnection],
	controllers: [],
	exports: []
})
export class DBModule {}
