import { Test, TestingModule } from '@nestjs/testing'
import { CatsController } from './cats.controller'
import { isSE } from '@qdev/utils-ts'
import { Request } from 'express'

describe ('Cats Controller', () => {
	let controller: CatsController
	const request = {
		url: 'https://lll'
	} as Request
	
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
		/**
		 * You wouldn't interact with the controller normally like this,
		 * so we have to insert the mock request manually in this case
		 */
    isSE(controller.findAll(request), ['cat'])
	})
})
