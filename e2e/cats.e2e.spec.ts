import { Test } from '@nestjs/testing'
import supertest from 'supertest'
import { isSE } from '@qdev/utils-ts'
import { CatsModule } from '@M/cats/cats.module'
import { INestApplication } from '@nestjs/common'
import { CatCreateInput } from '@M/cats/inputs/cat.create.input'

let request: ReturnType<typeof supertest>
let agent: ReturnType<typeof supertest>
let app: INestApplication
const path = '/cats'
const cat: CatCreateInput = {
	age: 10,
	breed: '123',
	name: 'cat'
}
describe (path, () => {
	beforeAll (async () => {
		const moduleFixture = await Test.createTestingModule ({
			imports: [CatsModule]
		}).compile ()
		app = await moduleFixture.createNestApplication ().init ()
		request = supertest (app.getHttpServer ())
		agent = supertest.agent (app.getHttpServer ())
	})
	afterAll (async () => await app.close ())
	
	describe ('C', () => {
		it ('add one POST', async () => {
			expect.assertions (3)

			const p = await request.post (path).send (cat)
			isSE (p.status, 201)
			isSE (p.body, {})
			isSE (p.text, '')
			
		})
		
		it ('should replace one PUT', async () => {
			expect.assertions (1)
			
			
		})
	})
	
	describe ('R', () => {
		it ('should get one by id', async () => {
			expect.assertions(2)
		  const g = await request.get(`${path}/1`)
			isSE (g.status, 200)
			isSE(g.body, {...cat, id: 1})
		})
	})
	
	describe ('U', () => {
	
	})
	
	describe ('D', () => {
	
	})
	
})
