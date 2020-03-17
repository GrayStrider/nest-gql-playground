import { Test } from '@nestjs/testing'
import supertest from 'supertest'
import { NestExpressApplication } from '@nestjs/platform-express'
import sleep from 'sleep-promise'
import { isSE } from '@qdev/utils-ts'
import { AppModule } from '@/app.module'


describe ('Cats', () => {
	let request: ReturnType<typeof supertest>
	let app: NestExpressApplication
	beforeAll (async () => {
		const moduleFixture = await Test.createTestingModule ({
			imports: [AppModule]
		}).compile ()
		
		app = moduleFixture.createNestApplication ()
		await app.init ()
		
	})
	afterAll (async () => {
		await app.close ()
		await sleep (500)
	})
	
	it ('should post cats', async () => {
		expect.assertions (2)
		const server = app.getHttpServer ()
		const { status } = await supertest (server).post ('/cats')
			.set ({ user: 'Ivan' })
			.send ({ cat: 'meow' })
		
		isSE (status, 201)
		
		const { text } = await supertest (server).get ('/cats')
		isSE (JSON.parse (text), {data: [{ cat: 'meow' }]})
	})
})
