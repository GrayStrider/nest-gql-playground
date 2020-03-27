import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { KBFModule } from '@M/KBF/KBF.module'
import { supertest, Post, Req, isSE } from '@qdev/utils-ts'
import gql from 'graphql-tag'
import { Board } from '@M/KBF/entity/Board'
import { defaultColors, defaultColumns } from '@M/KBF/resolvers/BoardResolver'
import { Task } from '@M/KBF/entity/Task'
import { NewTaskInput } from '@M/KBF/inputs/NewTaskInput'
import { zipObj } from 'ramda'

let app: INestApplication
let post: Post
let req: Req
let testBoardName: string

describe ('KBF', () => {
	beforeAll (async () => {
		jest.setTimeout (10000)
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

    it ('should create new', async () => {
			expect.assertions (1)
      const [board] = await post<Board>
      (gql`mutation {
          addBoard(name: "test board") {
              name
          }
      }`)
			isSE (board.name, 'test board')
    })

    it ('should be created', async () => {
			expect.assertions (1)
      const [board] = await post<Board[]>
      (gql`query {
          boards {
              name
          }
      }`)
			testBoardName = board[0].name
			isSE (testBoardName, 'test board')
    })

    it ('should have default data', async () => {
			expect.assertions (3)
      const [board] = await post<Board>
      (gql`query {
          board (name: "${testBoardName}") {
              colors {
                  name
                  value
                  default
              }
              columns {
                  name
                  order
                  taskLimit
              }
              swimlanes {
                  name
              }
          }
      }`)
			
			isSE (board.colors, defaultColors.map
			(zipObj (['name', 'value', 'default'])))
			
			isSE (board.columns, defaultColumns.map
			(([name, taskLimit], index) =>
				({ name, order: index, taskLimit })))
			isSE (board.swimlanes[0].name, 'Default')
    })
  })

  describe ('task', () => {
    it ('should add task min', async () => {
			expect.assertions (1)
			const minTask: NewTaskInput = {
				boardName: testBoardName,
				title: 'min task'
			}

      const [task] = await post<Task>
      (gql`mutation newTask ($data: NewTaskInput!) {
          addTask(data: $data) {
              title
          }
      }`, { data: minTask })
			isSE (task.title, minTask.title)


    })
		
		it ('should create task max', async () => {
			expect.assertions (1)
			const taskMax: NewTaskInput = {
				title: 'max',
				description: 'MAX',
				colorName: 'Orange',
				boardName: testBoardName,
				tags: ['home', 'chores', 'work'],
				swimlaneName: 'Default',
				columnName: 'To-do'
			}
			const [task] = await post <Task>
			(gql`mutation newTask ($data: NewTaskInput!) {
					addTask(data: $data) {
							board {
									name
							}
							color {
									name
							}
							column {
									name
							}
							description
							id
							labels {
									name
							}
							swimlane {
									name
							}
							title
					}
			}`, {data: taskMax})
			const exp = {
				"board": {
					"name": "test board"
				},
				"color": {
					"name": "Orange"
				},
				"column": {
					"name": "To-do"
				},
				"description": "MAX",
				"id": expect.toBeString(),
				"labels": [
					{
						"name": "home"
					},
					{
						"name": "chores"
					},
					{
						"name": "work"
					}
				],
				"swimlane": {
					"name": "Default"
				},
				"title": "max"
			}
			expect (task).toMatchObject(exp)
			
			
		})
  })

})
