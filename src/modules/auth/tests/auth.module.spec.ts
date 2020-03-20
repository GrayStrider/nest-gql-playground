import { Test } from '@nestjs/testing'
import { AuthModule } from '@M/auth/auth.module'
import supertest from 'supertest'
import { isSE } from '@qdev/utils-ts'
import { INestApplication } from '@nestjs/common'

describe ('auth module', () => {
	let app: INestApplication
	let request: ReturnType<typeof supertest>
	beforeAll (async () => {
		const moduleFixture = await Test.createTestingModule ({
			imports: [AuthModule]
		}).compile ()
		app = await moduleFixture.createNestApplication ().init()
		request = supertest (app.getHttpServer ())
	})
	afterAll (async () => await app.close ())
	
	it ('should log in', async () => {
		expect.assertions (3)
		const { status, text, body: { access_token } } = await request
			.post ('/auth/login')
			.send ({ username: 'Strider', password: '123' })
		isSE (status, 201)
		expect (access_token).toBeString()
		expect (access_token).not.toBeEmpty()
		
	})
})

