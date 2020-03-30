import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { KBFModule } from '@M/KBF/KBF.module'
import { supertest, Post, Req, isSE, chance } from '@qdev/utils-ts'
import gql from 'graphql-tag'
import { Board } from '@M/KBF/entity/Board'
import { Task } from '@M/KBF/entity/Task'
import { TaskInput } from '@M/KBF/inputs/task.input'
import { zipObj, without, all, head } from 'ramda'
import { Color, defaultColors } from '@M/KBF/entity/Color'
import { NewColorInput } from '@M/KBF/inputs/color.input'
import { GraphQLError } from 'graphql'
import { FindBoardInput } from '@M/KBF/inputs/board.input'
import { Comment } from '@M/KBF/entity/Comment'
import { ErrorCodes2 } from '@/common/errors'
import { defaultColumns } from '@M/KBF/entity/TColumn'

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

export const shouldHaveFailedValidation = ([data, errors]: [any, GraphQLError[]], amount = 1) => {
	isSE (data, null)
	isSE (head (errors)?.extensions?.code, ErrorCodes2.VALIDATION_ERROR)
	if (amount)
		isSE (head (errors)
			?.extensions?.validationErrors.length, amount)
}

describe ('Board', () => {
  describe ('validation', () => {
    it ('FindBoardInput', async () => {
			expect.assertions (3)
      const res = await post<Board>
      (gql`query {
          board(name: "") {
              name
          }
      }`)
			shouldHaveFailedValidation (res)
    })
    it ('AddBoardInput', async () => {
			expect.assertions (3)
      const res = await post<Board>
      (gql`mutation {
          addBoard(data: {
              name: "",
              swimlaneNames: [""]
          }) {
              name
          }
      }`)
			shouldHaveFailedValidation (res, 2)
    })

  })

  it ('should post new', async () => {
		expect.assertions (1)
    const [board] = await post<Board>
    (gql`mutation {
        addBoard(data: {
            name: "${testBoardName}"
        }) {
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
		(zipObj (['name', 'order', 'taskLimit'])))
	 
		isSE (board.swimlanes[0].name, 'Default')
  })
})

describe ('Task', () => {
  describe ('validation', () => {
    it ('TaskInput', async () => {
			expect.assertions (3)
      const res = await post<Task>
      (gql`mutation {
          addTask(data: {
              boardName: "",
              title: "",
              description: "",
              tagNames: ["", ""],
              colorName: "",
              columnName: "",
              swimlaneName: ""
          }) {
              id
          }
      }`)
			shouldHaveFailedValidation (res, 7)

    })
    it ('TaskSearchInputByID', async () => {
			expect.assertions (3)
      const res = await post<Task>
      (gql`query {
          task(id: "123") {
              id
          }
      }`)
			shouldHaveFailedValidation (res)

    })
    it ('should handle not found', async () => {
			expect.assertions (2)
      const [task, errors] = await post<Task>
      (gql`query {
          task(id: "${chance.guid()}") {
              id
          }
      }`)
			isSE (task, null)
			isSE (head (errors)?.extensions?.code,
				ErrorCodes2.NOT_FOUND)
    })
  })
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
			tagNames: ['home', 'chores', 'work'],
			swimlaneName: 'Default',
			columnName: 'To-do',
			completed: true
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
            tags {
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
			'tags': [
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
  describe ('validation', () => {
    it ('NewColorInput', async () => {
			expect.assertions (3)
      const res = await post<Color>
      (gql`mutation {
          addColor(data: {
              name: "",
              value: "foobar",
              boardName: "",
              description: ""
          }) {
              name
          }
      }`)
			shouldHaveFailedValidation (res, 4)
    })
  })
  it ('should create new color', async () => {
		expect.assertions (1)
		const newColor: NewColorInput = {
			name: 'Black',
			value: '000',
			boardName: testBoardName,
			description: 'I am the Night',
			default: true
		}
		const exp = {
			'default': true,
			'description': 'I am the Night',
			'id': expect.toBeString (),
			'name': 'Black',
			'value': '000'
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
            value: "000"
        }) {
            id
        }
    }`)
		isSE (color, null)
		expect (head (errors)?.message).toBeString ()


  })


})

describe ('Comment', () => {
  describe ('validation', () => {
    it ('ID', async () => {
			expect.assertions (3)
      const res = await post<Comment>
      (gql`query {
          comment(id: "") {
              text
          }
      }`)
			shouldHaveFailedValidation (res)
    })
    it ('CommentInput', async () => {
			expect.assertions (3)
      const res = await post<Comment[]>
      (gql`query {
          comments(data: {
              taskID: "",
              userID: "",
              text: ""
          }) {
              text
          }
      }`)
			shouldHaveFailedValidation (res, 3)
    })
	  
    it ('should handle not found', async () => {
			expect.assertions (2)
      const [comment, errors] = await post<Comment>
      (gql`query {
          comment(id: "${chance.guid()}") {
              id
          }
      }`)
			isSE (comment, null)
			isSE (head (errors)?.extensions?.code,
				ErrorCodes2.NOT_FOUND)
    })
  })

})

describe ('User', () => {
	describe ('validation', () => {
	
	})
})
