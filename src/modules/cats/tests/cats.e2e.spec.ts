import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CatsModule } from '@M/cats/cats.module'
import { CoreModule } from '@M/core/core.module'
import { CatsService } from '@M/cats/cats.service'


describe ('Cats', () => {
	const catsService = { findAll: () => ['test'] }
	
	let app: INestApplication
	
	beforeAll (async () => {
		const module = await Test.createTestingModule ({
				imports: [CatsModule, CoreModule]
			})
			.overrideProvider (CatsService)
			.useValue (catsService)
			.compile ()
		
		app = module.createNestApplication ()
		await app.init ()
	})
	
	it (`/GET cats`, () => {
		return request (app.getHttpServer ())
			.get ('/cats')
			.expect (200)
			.expect ({
				data: catsService.findAll ()
			})
	})
	
	afterAll (async () => {
		await app.close ()
	})
})
