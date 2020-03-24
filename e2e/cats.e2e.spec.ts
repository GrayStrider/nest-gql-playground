import { Test } from '@nestjs/testing'
import supertest from 'supertest'
import { isSE } from '@qdev/utils-ts'
import { CatsModule } from '@M/cats/cats.module'
import { INestApplication } from '@nestjs/common'
import { CatCreateInput } from '@M/cats/inputs/cat.create.input'
import { CatUpdateInput } from '@M/cats/inputs/cat.update.input'

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
	})
	
	describe ('R', () => {
		it ('GET', async () => {
			expect.assertions (2)
			const g = await request.get (`${path}/1`)
			isSE (g.status, 200)
			isSE (g.body, { ...cat, id: 1 })
		})
	})
	
	describe ('U', () => {
		it ('should replace one PUT', async () => {
			expect.assertions (3)
			const cat2: CatUpdateInput = {
				...cat,
				name: 'cat2'
			}
			const p = await request.put (`${path}/1`).send(cat2)
			isSE (p.status, 200)
			isSE (p.text, '')
			isSE (p.body, {})
			
		})
		it ('should update one PATCH', async () => {
			expect.assertions(1)
			expect.assertions (3)
			const cat2: Partial<CatUpdateInput> = {
				name: 'cat2'
			}
			const p = await request.patch (`${path}/1`).send(cat2)
			isSE (p.status, 200)
			isSE (p.text, '')
			isSE (p.body, {})
		 
		})
	})
	
	describe ('D', () => {
	
	})
	
})
