import supertest from 'supertest'
import { Test } from '@nestjs/testing'
import { AppModule } from '@M/app/app.module'
import { isSE } from '@qdev/utils-ts'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter'
import { TimeoutInterceptor } from '@/common/interceptors/timeout.interceptor'
import { makeRedis } from '@M/redis/redis.provider'

describe ('app.module', () => {
	let app: INestApplication
	let request: ReturnType<typeof supertest>
	let agent: ReturnType<typeof supertest>
	let redis: ReturnType<typeof makeRedis>
	beforeAll (async () => {
		const moduleFixture = await Test.createTestingModule ({
			imports: [AppModule]
		}).compile ()
		app = moduleFixture.createNestApplication ()
		app = await app.init ()
		request = supertest (app.getHttpServer ())
		agent = supertest.agent (app.getHttpServer ())
		redis = makeRedis ()
		await redis.flushdb()
		
	})
	afterAll (async () => {
		await app.close ()
	})
	let cookie: any
	describe ('auth', () => {
		it ('should log in', async () => {
			expect.assertions (1)
			const { header, status } = await request
				.post ('/auth/login')
				.send ({ username: 'Strider', password: '123' })
			isSE (status, 201)
		})
		
		it ('redis should have session', async () => {
			expect.assertions(1)
			const keys = await redis.keys ('*')
			expect (keys).toHaveLength(1)
		})
		
	})
	
})

