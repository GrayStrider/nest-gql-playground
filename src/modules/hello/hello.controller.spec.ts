import { Test, TestingModule } from '@nestjs/testing'
import { HelloService } from '@M/hello/hello.service'
import { HelloController } from '@M/hello/hello.controller'
import { HelloModule } from '@M/hello/hello.module'
import { isSE } from '@qdev/utils-ts'

describe ('appController', () => {
	let app: TestingModule
	
	beforeAll (async () => {
		app = await Test.createTestingModule ({
			imports: [HelloModule]
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
