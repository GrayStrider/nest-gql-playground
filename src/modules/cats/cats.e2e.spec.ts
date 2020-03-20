import { Test } from '@nestjs/testing'
import supertest from 'supertest'
import { isSE } from '@qdev/utils-ts'
import { CatsModule } from '@M/cats/cats.module'
import { CoreModule } from '@M/core/core.module'
import { INestApplication } from '@nestjs/common'


describe ('Cats', () => {
	let request: ReturnType<typeof supertest>
	let agent: ReturnType<typeof supertest>
	let app: INestApplication
	beforeAll (async () => {
		const moduleFixture = await Test.createTestingModule ({
			imports: [CoreModule, CatsModule]
		}).compile ()
		app = await moduleFixture.createNestApplication ().init()
		request = supertest (app.getHttpServer ())
		agent = supertest.agent(app.getHttpServer())
	})
	afterAll (async () => await app.close ())
	
	it ('should post cats', async () => {
		expect.assertions (2)

		const { status } = await request.post ('/cats')
			.send ({ cat: 'meow' })
		isSE (status, 201)
		
		const { body } = await request.get ('/cats')
		isSE (body, [{ cat: 'meow' }])
	})
})
