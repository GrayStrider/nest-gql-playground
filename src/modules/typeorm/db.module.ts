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
		await spinner (this.connection.synchronize (true),
			'Resetting DB..',
			'DB reset.'
		)
		
	}
	
	async onModuleDestroy () {
		await spinner (this.connection.close (),
			'Closing DB connection..',
			'DB connection closed.'
		)
	}
}

