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
export class DBModule implements OnModuleDestroy {
	constructor (private connection: Connection) {}
	
	async onModuleDestroy () {
		const sync = this.connection.synchronize (true)
		await spinner (sync, 'Resetting DB..', 'DB reset.')
	}
}

