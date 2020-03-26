import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { KBFModule } from '@M/KBF/KBF.module'
import { supertest, Post, Req, isSE } from '@qdev/utils-ts'
import gql from 'graphql-tag'
import { Task } from '@M/KBF/entity/Task'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm'
import { TaskResolver } from '@M/KBF/TaskResolver'
import { Label } from '@M/KBF/entity/Label'
import { DBModule } from '@M/db/db.module'

let app: INestApplication
let post: Post
let req: Req


describe ('KBF', () => {
	beforeAll (async () => {
		jest.setTimeout(9000)
		const moduleFixture = await Test.createTestingModule ({
				imports: [KBFModule],
		}).compile ()
		app = moduleFixture.createNestApplication ()
		await app.init ()
		;({ post, req } = supertest (app.getHttpServer ()))
	})
	afterAll (async () => await app.close ())
	
	it ('sanity', async () => {
		expect.assertions (1)
		const endpoint = '/graphql'
		const { body } = await req.post (endpoint)
			.send ({ query: 'foobar' })
		isSE (body.errors[0].extensions.code, 'GRAPHQL_PARSE_FAILED')
		
	})

  it ('Create', async () => {
		expect.assertions (1)
    const { data, errors } = await post <Task> (gql`mutation {
        addTask {
            id
        }
    }`)
	  isSE(data, 2)

  })
})
