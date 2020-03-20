import { Test } from '@nestjs/testing'
import { CatsController } from '@M/cats/cats.controller'
import { CatsService } from '@M/cats/cats.service'
import { Cat } from '@M/cats/interfaces/cat.interface'

describe ('CatsController', () => {
	let catsController: CatsController
	let catsService: CatsService
	
	beforeEach (async () => {
		const module = await Test.createTestingModule ({
			controllers: [CatsController],
			providers: [CatsService]
		}).compile ()
		
		catsService = module.get<CatsService> (CatsService)
		catsController = module.get<CatsController> (CatsController)
	})
	
	describe ('findAll', () => {
		it ('should return an array of cats', async () => {
			const result: Cat[] = [
				{
					id: 1,
					age: 2,
					breed: 'Bombay',
					name: 'Pixel'
				}
			]
			jest.spyOn (catsService, 'findAll').mockImplementation (() => result)
			
			expect (await catsController.findAll ()).toBe (result)
		})
	})
})
