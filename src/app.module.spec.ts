import supertest from 'supertest'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/app.module'
import { isSE } from '@qdev/utils-ts'
import { INestApplication } from '@nestjs/common'

describe ('app.module', () => {
	let app: INestApplication
	let request: ReturnType<typeof supertest>
	beforeAll (async () => {
		const moduleFixture = await Test.createTestingModule ({
			imports: [AppModule]
		}).compile ()
		app = await moduleFixture.createNestApplication ().init()
		request = supertest (app.getHttpServer ())
	})
	afterAll (async () => await app.close ())
	
	
	it ('/ hello', async () => {
		expect.assertions (2)
		const server = app.getHttpServer ()
		const { status, text } = await request.get ('/hello')
		expect (status).toBe (200)
		isSE (JSON.parse (text), { data: 'Hello World!' })
	})
	
	
})
