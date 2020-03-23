import { Module, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { Connection } from 'typeorm'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeormConfig } from '@config'
import { spinner } from '@qdev/utils-ts'


@Module ({
	imports: [
		TypeOrmModule.forRoot (TypeormConfig)
	]
})
export class DBModule implements OnModuleInit, OnModuleDestroy {
	constructor (private connection: Connection) {}
	
	async onModuleInit () {
		const sync = this.connection.synchronize (true)
		await spinner (sync, 'Resetting DB..', 'DB reset.')
		
	}
	
	async onModuleDestroy () {
		const close = this.connection.close ()
		await spinner (close, 'Closing DB connection..', 'DB connection closed.')
	}
}

