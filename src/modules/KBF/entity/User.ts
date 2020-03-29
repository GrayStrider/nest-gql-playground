import { ManyToMany, OneToMany, Column } from 'typeorm'
import { Field } from '@nestjs/graphql'
import { Task } from '@M/KBF/entity/Task'
import { Subtask } from '@M/KBF/entity/Subtask'
import { Comment } from '@M/KBF/entity/Comment'
import { Base } from '@M/KBF/entity/_Base'
import { EntityObject } from '@/common/decorators'


@EntityObject
export class User extends Base {
	@Column ()
	@Field ()
	name: string
	
	@Column ({ nullable: true })
	@Field ({ nullable: true })
	// Could have logged on via other service
	password?: string
	
	@Field (returns => [Comment])
	@OneToMany (type => Comment, comm => comm.author)
	comments: Comment[]
	
	@Field (returns => [Task])
	@ManyToMany (type => Task)
	tasks: Task[]
	
	@Field (returns => [Subtask])
	@ManyToMany (type => Subtask)
	subtasks: Subtask[]
	
	@ManyToMany (type => Task, task => task.collaborators)
	collaboratingAt: Task[]
}
