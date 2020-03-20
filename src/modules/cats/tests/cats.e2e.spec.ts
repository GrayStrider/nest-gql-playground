import { Test } from '@nestjs/testing'
import supertest from 'supertest'
import { NestExpressApplication } from '@nestjs/platform-express'
import sleep from 'sleep-promise'
import { isSE } from '@qdev/utils-ts'
import { AppModule } from '@/app.module'
import { CatsModule } from '@M/cats/cats.module'
import { AuthMiddleware } from '@/common/middleware/auth.middleware'
import { CoreModule } from '@M/core/core.module'
import { INestApplication } from '@nestjs/common'


describe ('Cats', () => {
	let request: ReturnType<typeof supertest>
	let app: INestApplication
	beforeAll (async () => {
		const moduleFixture = await Test.createTestingModule ({
			imports: [CoreModule, CatsModule]
		}).compile ()
		app = await moduleFixture.createNestApplication ().init()
		request = supertest (app.getHttpServer ())
	})
	afterAll (async () => await app.close ())
	
	it ('should post cats', async () => {
		expect.assertions (2)

		const { status } = await request.post ('/cats')
			.send ({ cat: 'meow' })
		isSE (status, 201)
		
		const { text } = await request.get ('/cats')
		isSE (JSON.parse (text), { data: [{ cat: 'meow' }] })
	})
})
