import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from './config.service'
import { Tokens } from '@/common/constants'

jest.mock ('dotenv')
jest.mock ('fs')

describe ('ConfigService', () => {
	let service: ConfigService
	
	beforeEach (async () => {
		const module: TestingModule = await Test.createTestingModule ({
			providers: [
				ConfigService,
				{
					provide: Tokens.CONFIG_OPTIONS,
					useValue: {
						folder: 'config'
					}
				}
			]
		}).compile ()
		
		service = module.get<ConfigService> (ConfigService)
	})
	
	it ('should be defined', () => {
		expect (service).toBeDefined ()
	})
})
