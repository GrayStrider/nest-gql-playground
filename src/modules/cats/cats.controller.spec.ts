import { Test, TestingModule } from '@nestjs/testing'
import { CatsController } from './cats.controller'
import { isSE } from '@qdev/utils-ts'

describe ('Cats Controller', () => {
	let controller: CatsController
	
	beforeEach (async () => {
		const module: TestingModule = await Test.createTestingModule ({
			controllers: [CatsController]
		}).compile ()
		
		controller = module.get<CatsController> (CatsController)
	})
	
	it ('should be defined', () => {
		expect (controller).toBeDefined ()
	})
	
	it ('should return cats', async () => {
		expect.assertions (1)
    isSE(controller.findAll(), ['cat'])
	})
})
