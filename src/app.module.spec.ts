import supertest from 'supertest'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/app.module'
import { INestApplication } from '@nestjs/common'
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
	afterAll (async () => {
		await sleep (500)
	})
	
	it ('/ (GET)', async () => {
		expect.assertions (2)
		const server = app.getHttpServer ()
		const { status, text } = await supertest (server).get ('/')
		expect (status).toBe (200)
		isSE(JSON.parse(text), {data: 'Hello World!'})
	})
})
