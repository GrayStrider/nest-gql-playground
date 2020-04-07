import { Post, Req, isSE } from '@qdev/utils-ts'
import { setupTest } from '@e2e/utils/setup'
import gql from 'graphql-tag'
import { testBoardName } from '@e2e/utils/credentials'
import { Board } from '@M/kanban/entity/Board'
import { Task } from '@M/kanban/entity/Task'
import { Tag } from '@M/kanban/entity/Tag'

let post: Post
let req: Req

beforeAll (async () => {
	({ post, req } = await setupTest (true))
  await post<Board> (gql`mutation {
      addBoard(data: {
          name: "${testBoardName}"
      }) {id}
  }
	`)
})

test ('add task', async () => {
	expect.assertions (1)
  const [task, errors] = await post<Task>
  (gql`mutation {
      addTask(data: {
          boardName: "${testBoardName}"
          title: "todo"
          tagNames: ["home", "job", "family", "chores", "travel", "business"]

      }) {
          id
          tags {
              name
          }
      }
  }`)
	expect (task.id).toBeUUID ()
})

test ('tags', async () => {
	expect.assertions (1)
  const [tags, errors] = await post<Tag[]>
  (gql`query {
      tags(searchBy: {
          boardName: "${testBoardName}"
      }) {
		      id
		      pinned
		      tasks {
				      title
				      id
				      board {
						      id
				      }
		      }
		      board {
				      name
				      id
				      colors {
						      name
						      value
				      }
		      }

      }
  }`)
	expect (tags).toHaveLength(6)
	log(tags)

})

export function log(...args: any[]) {
	console.log(
		JSON.stringify(args, null, 2)
	)
	
}
