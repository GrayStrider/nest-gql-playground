import supertest from 'supertest'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/app.module'
import sleep from 'sleep-promise'
import { isSE } from '@qdev/utils-ts'
import { NestExpressApplication } from '@nestjs/platform-express'

describe ('app.module', () => {
	let app: NestExpressApplication
	
	beforeAll (async () => {
		const moduleFixture = await Test.createTestingModule ({
			imports: [AppModule]
		}).compile ()
		
		app = moduleFixture.createNestApplication ()
		await app.init ()
	})
	afterAll (async () => await app.close ())
	
	
	it ('/ hello', async () => {
		expect.assertions (2)
		const server = app.getHttpServer ()
		const { status, text } = await supertest (server).get ('/hello')
		expect (status).toBe (200)
		isSE (JSON.parse (text), { data: 'Hello World!' })
	})
	
	
})
