import { ManyToMany, OneToMany, Column } from 'typeorm'
import { Field } from '@nestjs/graphql'
import { Task } from '@M/KBF/entity/Task'
import { Subtask } from '@M/KBF/entity/Subtask'
import { Comment } from '@M/KBF/entity/Comment'
import { Base } from '@M/KBF/entity/_Base'
import { EntityObject } from '@/common/decorators'

export const nameLength = 50

@EntityObject
export class User extends Base {
	@Field ()
	@Column ({ length: nameLength })
	name: string
	
	@Column ({ nullable: true })
		// Could have logged on via other service
	password?: string
	
	@Column ({ unique: true })
	@Field ()
	email: string
	
	@Field (returns => [Comment])
	@OneToMany (type => Comment, comm => comm.user)
	comments: Comment[]
	
	@Field (returns => [Task])
	@ManyToMany (type => Task,
		task => task.user)
	tasks: Task[]
	
	@Field (returns => [Subtask])
	@ManyToMany (type => Subtask,
		subtask => subtask.user)
	subtasks: Subtask[]
	
	@ManyToMany (type => Task, task => task.collaborators)
	collaboratingAt: Task[]
}
