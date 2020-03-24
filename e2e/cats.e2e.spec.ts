import { Test } from '@nestjs/testing'
import supertest from 'supertest'
import { isSE } from '@qdev/utils-ts'
import { CatsModule } from '@M/cats/cats.module'
import { INestApplication } from '@nestjs/common'
import { repeat } from 'ramda'
import { plainToClass } from 'class-transformer'
import { Cat, CatCreateInput, CatUpdateInput } from '@M/cats/interfaces/cat.interface'
import { validate, ValidationError } from 'class-validator'

let req: ReturnType<typeof supertest>
let agent: ReturnType<typeof supertest>
let app: INestApplication
const path = '/cats'
const cat: CatCreateInput = {
	age: 10,
	breed: 'husky',
	name: 'cat'
}
describe (path, () => {
	beforeAll (async () => {
		const moduleFixture = await Test.createTestingModule ({
			imports: [CatsModule]
		}).compile ()
		app = await moduleFixture.createNestApplication ()
		await app.init ()
		req = supertest (app.getHttpServer ())
		agent = supertest.agent (app.getHttpServer ())
	})
	afterAll (async () => await app.close ())
	
	describe ('C', () => {
		it ('add one POST', async () => {
			expect.assertions (5)
			const p = await req.post (path).send (cat)
			isSE (p.body, {})
			isSE (p.status, 201)
			isSE (p.text, '')
			const e = await req.post (path).send ({ 1: '' })
			isSE (e.body.message.length, 3)
			isSE (e.status, 400)
		})
		it ('should add batch', async () => {
			expect.assertions (4)
			const p = await req.post (path)
				.send (repeat (cat, 10))
			isSE (p.status, 201)
			isSE (p.body, {})
			
			const e = await req.post (path)
				.send ([[], { foo: 1 }, {}, '', 1, 2, '', {}])
			isSE (p.status, 201)
			
			const a = await req.get (path)
			isSE (a.body.length, 11)
			
		})
	})
	
	describe ('R', () => {
		it ('should get one', async () => {
			expect.assertions (3)
			const g = await req.get (`${path}/1`)
			isSE (g.status, 200)
			isSE (g.body, { ...cat, id: 1 })
			
			const e = await req.get (`${path}/899`)
			isSE (e.status, 404)
		})
		it ('should get all valid', async () => {
			expect.assertions (2)
			const a = await req.get (path)
			isSE (a.status, 200)
			const catsCls = a.body.map ((cat: Cat) => plainToClass
			(Cat, cat))
			const res = await Promise.allSettled<ValidationError>
			(catsCls.map (validate))
			isSE (res.reduce ((p, { value }: any) =>
				p.concat (value), [] as any).length, 0)
			
		})
	})
	
	describe ('U', () => {
		it ('should replace one PUT', async () => {
			expect.assertions (3)
			const cat2: CatUpdateInput = {
				...cat,
				name: 'cat2'
			}
			const p = await req.put (`${path}/1`).send (cat2)
			isSE (p.status, 200)
			isSE (p.body, {})
			
			const { body } = await req.get (`${path}/1`)
			isSE(body.name, 'cat2')
			
		})
		it ('should update one PATCH', async () => {
			expect.assertions (1)
			expect.assertions (3)
			const cat2: Partial<CatUpdateInput> = {
				name: 'cat2'
			}
			const p = await req.patch (`${path}/1`).send (cat2)
			isSE (p.status, 200)
			isSE (p.text, '')
			isSE (p.body, {})
			
		})
	})
	
	describe ('D', () => {
	
	})
	
})
