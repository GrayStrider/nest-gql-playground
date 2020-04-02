import { Test } from '@nestjs/testing'
import { supertest, Post, Req, isSE, chance, shouldHaveErrorCode, shouldHaveFailedValidation, flattenGQLResponse } from '@qdev/utils-ts'
import gql from 'graphql-tag'
import { Board } from '@M/kanban/entity/Board'
import { Task } from '@M/kanban/entity/Task'
import { TaskInput } from '@M/kanban/inputs/task.input'
import { zipObj, without, all, head, pick } from 'ramda'
import { Color, defaultColors } from '@M/kanban/entity/Color'
import { NewColorInput } from '@M/kanban/inputs/color.input'
import { FindBoardInput } from '@M/kanban/inputs/board.input'
import { Comment } from '@M/kanban/entity/Comment'
import { ErrorCodes } from '@/common/errors'
import { defaultColumns } from '@M/kanban/entity/TColumn'
import { User } from '@M/kanban/entity/User'
import { UserInput } from '@M/kanban/inputs/user.input'
import { makeRedis } from '@M/redis/redis.provider'
import { AppModule } from '@M/app/app.module'
import { ASTNode } from 'graphql'
import http from 'http'

let post: Post
let req: Req
let sessionCookie: string[]
let server: http.Server

beforeAll (async () => {
	jest.setTimeout (20000)
	const moduleFixture = await Test.createTestingModule ({
		imports: [AppModule]
	}).compile ()
	const app = moduleFixture.createNestApplication ()
	await app.init ()
	server = app.getHttpServer ()
	;({ post, req } = supertest (server, sessionCookie))
	await makeRedis ().flushdb ()
})
const resourceShouldBeInaccessible = async (yes = true) => {
  const [, errors] = await post<Board[]>
  (gql`query {
      boards {
          id
      }
  }`)
	yes ? shouldHaveErrorCode (errors,
		ErrorCodes.UNATHORIZED)
		: isSE (errors, [])
}

const testBoardName = 'test board'
const testUser: UserInput = {
	name: 'Ivan',
	password: 'aG2_ddddddd',
	email: 'test@test.com',
	confirmPassword: 'aG2_ddddddd'
}
const credsOK = pick
(['email', 'password'], testUser)
const credsWrongPass = {
	...credsOK,
	password: 'aG2_ddddddd____'
}
const credsBadEmail = {
	...credsOK,
	email: 'foobar23948234@bad.com'
}

describe ('Auth', () => {
  it ('register admin user', async () => {
		expect.assertions (2)
    const [user, errors] = await post<User>
    (gql`mutation Register($testUser: UserInput!) {
        register(data: $testUser) {
            id
        }
    }`, { testUser })
		expect (user.id).toBeUUID ()
		await resourceShouldBeInaccessible ()
  })
  it ('log in', async () => {
		expect.assertions (3)
    const { body, header } = await req<User>
    (gql`mutation LoginWIthEmail ($data: LoginWithEmailInput!) {
        loginWithEmail(data: $data) {
            id
            name
        }
    }`, { data: credsOK })
		expect (body.data.loginWithEmail.id).toBeUUID ()
		expect (header['set-cookie'][0]).toBeString ()
		
		sessionCookie = header['set-cookie'][0]
		await resourceShouldBeInaccessible (true)
  })
  it ('log out', async () => {
		expect.assertions (2)
    const [ok] = await post<Boolean>
    (gql`mutation {
        logout
    }`)
		isSE (ok, true)
		await resourceShouldBeInaccessible ()
		sessionCookie = []
  })
  it ('password complexity', async () => {
		const invalidPasswords = [
			'', '@Na3', '                  ', 'aaaaaaaaaaaaaaa', '3_fFaaaa aaaa',
			'BBBBBBBBBBBB', '@@@@@@@@@@@@@',
			'33333333333333333', '_f4Faaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
		]
		expect.assertions
		(3 * invalidPasswords.length)
    for (const password of invalidPasswords) {
			const user = { ...testUser, password }
      const res = await post<User>
      (gql`mutation Register($testUser: UserInput!) {
          register(data: $testUser) {
              id
          }
      }`, { testUser: user })
			shouldHaveFailedValidation (res)
    }

  })
  it ('unique email', async () => {
		expect.assertions (1)
    const res = await post<User>
    (gql`mutation Register($testUser: UserInput!) {
        register(data: $testUser) {
            id
        }
    }`, { testUser })
		shouldHaveErrorCode (res[1],
			ErrorCodes.NOT_UNIQUE)

  })
  it ('confirm password', async () => {
		expect.assertions (2)
		const user: UserInput = {
			...testUser,
			password: '34tT_ssssssss',
			email: chance.email ()
		}
    const res = await post<User>
    (gql`mutation Register($testUser: UserInput!) {
        register(data: $testUser) {
            id
        }
    }`, { testUser: user })
		shouldHaveFailedValidation (res, 0)
  })
  it ('valid password', async () => {
		expect.assertions (2)
    const [user, ers] = await post<User>
    (gql`mutation LoginWIthEmail ($data: LoginWithEmailInput!) {
        loginWithEmail(data: $data) {
            id
            name
        }
    }`, { data: credsWrongPass })
		isSE (user, null)
		shouldHaveErrorCode
		(ers, ErrorCodes.UNATHORIZED)

  })
  it ('valid email', async () => {
		expect.assertions (2)
    const [user, ers] = await post<User>
    (gql`mutation LoginWIthEmail ($data: LoginWithEmailInput!) {
        loginWithEmail(data: $data) {
            id
            name
        }
    }`, { data: credsBadEmail })
		isSE (user, null)
		shouldHaveErrorCode
		(ers, ErrorCodes.UNATHORIZED)

  })
  it ('log in', async () => {
		expect.assertions (3)
    const { body, header } = await req<User>
    (gql`mutation LoginWIthEmail ($data: LoginWithEmailInput!) {
        loginWithEmail(data: $data) {
            id
            name
        }
    }`, { data: credsOK })
		expect (body.data.loginWithEmail.id).toBeUUID ()
		expect (header['set-cookie'][0]).toBeString ()
		sessionCookie = header['set-cookie']
		post = async (query: ASTNode, variables: any) =>
			req (query, variables)
				.set ('Cookie', sessionCookie)
				.then (res => flattenGQLResponse (res.body))
		await resourceShouldBeInaccessible (false)

  })
})

describe ('Create/Read', () => {
  test ('board/min', async () => {
		expect.assertions (4)
	  const fullBoardRes = gql`
	  fragment res on Board {
        id
        name
        swimlanes {
            name
            description
        }
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
	  }`
    const [board] = await post<Board>
    (gql`mutation {
        addBoard(data: {
            name: "${testBoardName}"
        }) {...res}
    }
    ${fullBoardRes}
    `)
	  isSE (board.colors, defaultColors.map
	  (zipObj (['name', 'value', 'default'])))
	  isSE (board.columns, defaultColumns.map
	  (zipObj (['name', 'order', 'taskLimit'])))
	  isSE (board.swimlanes[0].name, 'Default')
	  const [board2] = await post <Board>
	  (gql`query {
			  board(name: "${testBoardName}"){
					  ...res
			  }
	  }
	  ${fullBoardRes}`)
	  isSE(board, board2)
	  
  })
})

describe.skip ('Board', () => {
  describe.skip ('validation', () => {
    it.skip ('FindBoardInput', async () => {
			expect.assertions (3)
      const res = await post<Board>
      (gql`query {
          board(name: "") {
              name
          }
      }`)
			shouldHaveFailedValidation (res)
    })
    it.skip ('AddBoardInput', async () => {
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

  it.skip ('should have default data', async () => {
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
describe.skip ('Task', () => {
  describe.skip ('validation', () => {
    it.skip ('TaskInput', async () => {
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
    it.skip ('TaskSearchInputByID', async () => {
			expect.assertions (3)
      const res = await post<Task>
      (gql`query {
          task(id: "123") {
              id
          }
      }`)
			shouldHaveFailedValidation (res)

    })
    it.skip ('should handle not found', async () => {
			expect.assertions (2)
      const [task, errors] = await post<Task>
      (gql`query {
          task(id: "${chance.guid()}") {
              id
          }
      }`)
			isSE (task, null)
			isSE (head (errors)?.extensions?.code,
				ErrorCodes.NOT_FOUND)
    })
  })
  it.skip ('should add task min', async () => {
		expect.assertions (1)
		const minTask: TaskInput = {
			boardName: testBoardName,
			title: 'min task'
		}

    const [task, errors] = await post<Task>
    (gql`mutation newTask ($data: TaskInput!) {
        addTask(data: $data) {
            title
        }
    }`, { data: minTask })
		isSE (task.title, minTask.title)

  })

  it.skip ('should create task max', async () => {
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
describe.skip ('Color', () => {
  describe.skip ('validation', () => {
    it.skip ('NewColorInput', async () => {
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
  it.skip ('should create new color', async () => {
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
  it.skip ('should reset default from the rest of the colors', async () => {
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
  it.skip ('should prevent dupes', async () => {
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
describe.skip ('Comment', () => {
  describe.skip ('validation', () => {
    it.skip ('ID', async () => {
			expect.assertions (3)
      const res = await post<Comment>
      (gql`query {
          comment(id: "") {
              text
          }
      }`)
			shouldHaveFailedValidation (res)
    })
    it.skip ('CommentInput', async () => {
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

    it.skip ('should handle not found', async () => {
			expect.assertions (2)
      const [comment, errors] = await post<Comment>
      (gql`query {
          comment(id: "${chance.guid()}") {
              id
          }
      }`)
			isSE (comment, null)
			isSE (head (errors)?.extensions?.code,
				ErrorCodes.NOT_FOUND)
    })
  })

})

