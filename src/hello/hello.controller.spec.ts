import { Test, TestingModule } from '@nestjs/testing'
import { HelloService } from '@/hello/hello.service'
import { HelloController } from '@/hello/hello.controller'

describe ('appController', () => {
	let app: TestingModule
	
	beforeAll (async () => {
		app = await Test.createTestingModule ({
			controllers: [HelloController],
			providers: [HelloService]
		}).compile ()
	})
	
	describe ('getHello', () => {
		it ('should return "Hello World!"', () => {
			expect.assertions (1)
			const appController = app.get<HelloController> (HelloController)
			expect (appController.getHello ())
				.toBe ('Hello World!')
		})
	})
})
