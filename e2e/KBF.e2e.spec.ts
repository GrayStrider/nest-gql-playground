import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { KBFModule } from '@M/KBF/KBF.module'
import { supertest, Post, Req, isSE } from '@qdev/utils-ts'
import gql from 'graphql-tag'
import { Board } from '@M/KBF/entity/Board'
import { defaultColors, defaultColumns } from '@M/KBF/resolvers/board.resolver'
import { Task } from '@M/KBF/entity/Task'
import { TaskInput } from '@M/KBF/inputs/task.input'
import { zipObj, without, all, head } from 'ramda'
import { Color } from '@M/KBF/entity/Color'
import { NewColorInput } from '@M/KBF/inputs/color.input'
import { ErrorCodes } from '@M/KBF/resolvers/task.resolver'
import { ApolloError } from 'apollo-server-errors'
import { GraphQLError } from 'graphql'

let app: INestApplication
let post: Post
let req: Req
const testBoardName = 'test board'

beforeAll (async () => {
	jest.setTimeout (20000)
	const moduleFixture = await Test.createTestingModule ({
		imports: [KBFModule]
	}).compile ()
	app = moduleFixture.createNestApplication ()
	await app.init ()
	;({ post, req } = supertest (app.getHttpServer ()))
})

export const shouldHaveFailedValidation = ([data, errors]: [any, GraphQLError[]]) => {
	isSE (data, null)
	isSE (head(errors)?.extensions?.code, ErrorCodes.VALIDATION_ERROR)
}

describe ('Board', () => {

  it ('should post new', async () => {
		expect.assertions (1)
    const [board] = await post<Board>
    (gql`mutation {
        addBoard(name: "${testBoardName}") {
            name
        }
    }`)
		isSE (board.name, testBoardName)
  })

  it ('should be created', async () => {
		expect.assertions (1)
    const [board] = await post<Board[]>
    (gql`query {
        boards {
            name
        }
    }`)
		isSE (board[0].name, testBoardName)
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
	
	describe ('validation', () => {
		it ('FindInput', async () => {
			expect.assertions(2)
			const res = await post <Board>
			(gql`query {
					board(name: "") {
							name
					}
			}`)
			shouldHaveFailedValidation(res)
		})
	})
})

describe ('Task', () => {
  it ('should add task min', async () => {
		expect.assertions (1)
		const minTask: TaskInput = {
			boardName: testBoardName,
			title: 'min task'
		}

    const [task] = await post<Task>
    (gql`mutation newTask ($data: TaskInput!) {
        addTask(data: $data) {
            title
        }
    }`, { data: minTask })
		isSE (task.title, minTask.title)


  })

  it ('should create task max', async () => {
		expect.assertions (1)
		const taskMax: TaskInput = {
			title: 'max',
			description: 'MAX',
			colorName: 'Orange',
			boardName: testBoardName,
			tags: ['home', 'chores', 'work'],
			swimlaneName: 'Default',
			columnName: 'To-do'
		}
    const [task] = await post<Task>
    (gql`mutation newTask ($data: TaskInput!) {
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
    }`, { data: taskMax })
		const exp = {
			'board': {
				'name': 'test board'
			},
			'color': {
				'name': 'Orange'
			},
			'column': {
				'name': 'To-do'
			},
			'description': 'MAX',
			'id': expect.toBeString (),
			'labels': [
				{
					'name': 'home'
				},
				{
					'name': 'chores'
				},
				{
					'name': 'work'
				}
			],
			'swimlane': {
				'name': 'Default'
			},
			'title': 'max'
		}
		expect (task).toMatchObject (exp)


  })
})

describe ('Color', () => {
  it ('should create new color', async () => {
		expect.assertions (1)
		const newColor: NewColorInput = {
			name: 'Black',
			value: '000000',
			boardName: testBoardName,
			description: 'I am the Night',
			default: true
		}
		const exp = {
			'default': true,
			'description': 'I am the Night',
			'id': expect.toBeString (),
			'name': 'Black',
			'value': '000000'
		}
    const [color] = await post<Color>
    (gql`mutation addColor($data: NewColorInput!) {
        addColor(data: $data) {
            id
            name
            description
            value
            default
        }
    }`, { data: newColor })
		expect (color).toMatchObject (exp)


  })
  it ('should reset default from the rest of the colors', async () => {
		expect.assertions (2)
    const [{ colors }] = await post<Board>
    (gql`query {
        board(name: "${testBoardName}") {
            colors {
                name
                default
            }
        }
    }`)
		const newColor = colors.find (c => c.name === 'Black')
		isSE (newColor?.default, true)
		const rest = without ([newColor]) (colors)
		isSE (all (c => !c?.default, rest), true)


  })
  it ('should prevent dupes', async () => {
		expect.assertions (2)
    const [color, errors] = await post<Color>
    (gql`mutation {
        addColor(data: {
            name: "Black",
            boardName: "${testBoardName}",
            value: "1234"
        }) {
            id
        }
    }`)
		isSE (color, null)
		expect (head (errors)?.message).toBeString ()


  })
})
