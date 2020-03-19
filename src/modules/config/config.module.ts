import { DynamicModule, Module } from '@nestjs/common'
import { ConfigService } from './config.service'
import { Tokens } from '@/common/constants'

export interface ConfigModuleOptions {
	folder: string;
}

@Module ({})
export class ConfigModule {
	static register (options: ConfigModuleOptions): DynamicModule {
		return {
			module: ConfigModule,
			providers: [
				{
					provide: Tokens.CONFIG_OPTIONS,
					useValue: options
				},
				ConfigService
			],
			exports: [ConfigService]
		}
	}
}
