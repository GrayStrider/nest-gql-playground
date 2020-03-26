import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { KBFModule } from '@M/KBF/KBF.module'
import { supertest, Post, Req, isSE } from '@qdev/utils-ts'
import gql from 'graphql-tag'
import { Board } from '@M/KBF/entity/Board'
import { defaultColors } from '@M/KBF/resolvers/BoardResolver'

let app: INestApplication
let post: Post
let req: Req


describe ('KBF', () => {
	beforeAll (async () => {
		jest.setTimeout (9000)
		const moduleFixture = await Test.createTestingModule ({
			imports: [KBFModule]
		}).compile ()
		app = moduleFixture.createNestApplication ()
		await app.init ()
		;({ post, req } = supertest (app.getHttpServer ()))
	})
	
	it ('sanity', async () => {
		expect.assertions (1)
		const endpoint = '/graphql'
		const { body } = await req.post (endpoint)
			.send ({ query: 'foobar' })
		isSE (body.errors[0].extensions.code, 'GRAPHQL_PARSE_FAILED')
		
	})

  describe ('Board', () => {
		let name: string
    it ('should create new', async () => {
			expect.assertions (1)
      const { data, errors } = await post<Board>
      (gql`mutation {
          addBoard(name: "test board") {
              name
          }
      }`)
			isSE (data.name, 'test board')
    })

    it ('should be created', async () => {
			expect.assertions (1)
      const { data, errors } = await post<Board[]>
      (gql`query {
          boards {
              name
          }
      }`)
			name = data[0].name
			isSE (name, 'test board')
    })

    it ('should have default data', async () => {
			expect.assertions (1)
      const { data, errors } = await post<Board>
      (gql`query {
          board (name: "${name}") {
              colors {
                  name
                  value
              }
              columns {
                  name
              }
          }
      }`)
			isSE (data.colors, defaultColors.map
			(([name, value]) => ({ name, value })))
    })
  })

})
