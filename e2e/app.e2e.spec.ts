import { Post, Req, isSE, chance, shouldHaveErrorCode, shouldHaveFailedValidation, flattenGQLResponse, sig } from '@qdev/utils-ts'
import gql from 'graphql-tag'
import { Board } from '@M/kanban/entity/Board'
import { Task } from '@M/kanban/entity/Task'
import { TaskInput } from '@M/kanban/inputs/task.input'
import { zipObj, without, all, head } from 'ramda'
import { TaskColor, defaultColors } from '@M/kanban/entity/TaskColor'
import { NewColorInput } from '@M/kanban/inputs/color.input'
import { FindBoardInput } from '@M/kanban/inputs/board.input'
import { TaskComment } from '@M/kanban/entity/TaskComment'
import { ErrorCodes } from '@/common/errors'
import { defaultColumns } from '@M/kanban/entity/TColumn'
import { User } from '@M/kanban/entity/User'
import { UserInput } from '@M/kanban/inputs/user.input'
import { ASTNode } from 'graphql'
import { Swimlane } from '@M/kanban/entity/Swimlane'
import { setupTest } from '@e2e/utils/setup'
import { credsOK, testUser, testBoardName } from '@e2e/utils/credentials'

let post: Post
let req: Req
let sessionCookie: string[]


beforeAll (async () => {
	({ post, req } = await setupTest ())
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
	  console.log(body)
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
  const fragmentFullBoard = gql`
      fragment res on Board {
          id
          name
          swimlanes {
              name
              description
          }
          taskColors {
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
  test ('AddBoardInput', async () => {
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
  test ('FindBoardInput', async () => {
		expect.assertions (3)
    const res = await post<Board>
    (gql`query {
        board(name: "") {
            name
        }
    }`)
		shouldHaveFailedValidation (res)
  })
  test ('board/min', async () => {
		expect.assertions (4)
    const [board] = await post<Board>
    (gql`mutation {
        addBoard(data: {
            name: "${testBoardName}"
        }) {...res}
    }
    ${fragmentFullBoard}
		`)
		sig.info (board)
		isSE (board.taskColors, defaultColors.map
		(zipObj (['name', 'value', 'default'])))
		isSE (board.columns, defaultColumns.map
		(zipObj (['name', 'order', 'taskLimit'])))
		isSE (head (board.swimlanes)?.name, 'Default')
    const [board2] = await post<Board>
    (gql`query {
        board(name: "${testBoardName}"){
            ...res
        }
    }
		${fragmentFullBoard}`)
		isSE (board, board2)

  })
  test ('board/max', async () => {
		expect.assertions (2)
    const [board, errors] = await post<Board>
    (gql`mutation {
        addBoard(data: {
            name: "${testBoardName + '-max'}"
            columnsParams: [
                {
                    name: "TODO",
                    taskLimit: 5,
                    order: 0,
                }
            ]
            swimlaneNames: [
                "default",
                "project B"
            ]
        }) {...res}
    }
		${fragmentFullBoard}`)
		sig.info (board)
		expect (board.id).toBeUUID ()
    const [board2] = await post<Board>
    (gql`query {
        board(name: "${testBoardName + '-max'}")
        {...res}
    }
		${fragmentFullBoard}`)
		isSE (board, board2)

  })
  test ('swimlane', async () => {
		expect.assertions (3)
    const [swim] = await post<Swimlane>
    (gql`mutation {
        addSwimlane(data: {
            name: "new swimlane"
            description: "tasks here"
            boardName: "${testBoardName}"
        }) {
            id
            name
        }
    }`)
    const [board] = await post<Board>
    (gql`query {
        board(name: "${testBoardName}") {
            swimlanes {
                name
            }
        }
    }`)
		console.log (board.swimlanes)
		isSE (board.swimlanes[1]!.name,
			swim.name
		)
    const [swim2] = await post<Swimlane>
    (gql`query {
        swimlane(data: {
            boardName: "${testBoardName}"
            name: "new swimlane"
        }) {
            id
        }
    }`)
		isSE (swim2.id, swim.id)

    const [swls] = await post<Swimlane[]>
    (gql`query {
        swimlanes(data: {
            boardName: "${testBoardName}"
        }) {
            name
        }
    }`)
		expect (swls).toHaveLength (2)
  })
  test ('complex search query', async () => {
		expect.assertions (1)
    const [lanes] = await post<Array<Swimlane>>
    (gql`query {
        swimlanes(data: {
            boardName: "${testBoardName}"
            name: "w swi"
        }) {
            name
        }
    }`)
		expect (lanes).toHaveLength (1)


  })
})

describe ('Task', () => {
  describe ('validation', () => {
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
  it ('should add task min', async () => {
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
describe.skip ('TaskColor', () => {
  describe.skip ('validation', () => {
    it.skip ('NewColorInput', async () => {
			expect.assertions (3)
      const res = await post<TaskColor>
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
    const [color] = await post<TaskColor>
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
    const [{ taskColors }] = await post<Board>
    (gql`query {
        board(name: "${testBoardName}") {
            taskColors {
                name
                default
            }
        }
    }`)
		const newColor = taskColors.find (c => c.name === 'Black')
		isSE (newColor?.default, true)
		const rest = without ([newColor]) (taskColors)
		isSE (all (c => !c?.default, rest), true)


  })
  it.skip ('should prevent dupes', async () => {
		expect.assertions (2)
    const [color, errors] = await post<TaskColor>
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
describe.skip ('TaskComment', () => {
  describe.skip ('validation', () => {
    it.skip ('ID', async () => {
			expect.assertions (3)
      const res = await post<TaskComment>
      (gql`query {
          comment(id: "") {
              text
          }
      }`)
			shouldHaveFailedValidation (res)
    })
    it.skip ('CommentInput', async () => {
			expect.assertions (3)
      const res = await post<TaskComment[]>
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
      const [comment, errors] = await post<TaskComment>
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

