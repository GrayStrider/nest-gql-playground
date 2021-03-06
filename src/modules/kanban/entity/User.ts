import { ManyToMany, OneToMany, Column } from 'typeorm'
import { Field } from '@nestjs/graphql'
import { Task } from '@M/kanban/entity/Task'
import { Subtask } from '@M/kanban/entity/Subtask'
import { TaskComment } from '@M/kanban/entity/TaskComment'
import { Base } from '@M/kanban/entity/_Base'
import { EntityObject } from '@/common/decorators/entity-object.decorator'
import { Board } from '@M/kanban/entity/Board'

export const nameLength = 50

@EntityObject
export class User extends Base {
	@Field ()
	@Column ({ length: nameLength })
	name: string
	
	@Column ({ nullable: true, select: false })
		// Could have logged on via other service
	password?: string
	
	@Column ({ unique: true, select: false })
	@Field ()
	email: string
	
	
	@Field(returns => [Board])
	@OneToMany(type => Board,
		board => board.owner)
	boards: Board[]
	
	@Field (returns => [Task])
	@OneToMany (type => Task,
		task => task.responsible)
	responsibleForTasks: Task[]
	
	@Field(returns => [Task])
	@ManyToMany (type => Task,
			task => task.collaborators)
	collaboratingAtTasks: Task[]
	
	@Field(returns => [Subtask])
	@OneToMany (type => Subtask,
		subtask => subtask.responsible)
	responsibleForSubtasks: Task[]
	
	@Field (returns => [Subtask])
	@ManyToMany (type => Subtask,
		subtask => subtask.collaborators)
	collaboratingAtSubtasks: Subtask[]
	
	@Field (returns => [TaskComment])
	@OneToMany (type => TaskComment,
		comment => comment.user)
	comments: TaskComment[]
}
