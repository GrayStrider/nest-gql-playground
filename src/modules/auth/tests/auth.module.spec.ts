import { NestExpressApplication } from '@nestjs/platform-express'
import { Test } from '@nestjs/testing'
import sleep from 'sleep-promise'
import { AuthModule } from '@M/auth/auth.module'
import supertest from 'supertest'
import { isSE } from '@qdev/utils-ts'

describe ('auth module', () => {
	let app: NestExpressApplication
	let request: ReturnType<typeof supertest>
	
	beforeAll (async () => {
		const moduleFixture = await Test.createTestingModule ({
			imports: [AuthModule]
		}).compile ()
		
		app = moduleFixture.createNestApplication ()
		await app.init ()
		request = supertest (app.getHttpServer ())
	})
	afterAll (async () => {
		await app.close ()
		await sleep (500)
	})
	
	it ('should log in', async () => {
		expect.assertions (2)
		const { status, text, body } = await request
			.post ('/auth/login')
			.send ({ username: 'Strider', password: '123' })
		isSE (status, 201)
		isSE (body, {
			id: '1',
			name: 'Strider',
			roles: ['admin']
		})
		
	})
})
