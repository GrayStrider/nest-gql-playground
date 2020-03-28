import { PrimaryGeneratedColumn, ManyToMany, OneToMany, Entity, BaseEntity, Column } from 'typeorm'
import { Field, ObjectType, ID } from '@nestjs/graphql'
import { Task } from '@M/KBF/entity/Task'
import { Subtask } from '@M/KBF/entity/Subtask'
import { Comment } from '@M/KBF/entity/Comment'
import { Base } from '@M/KBF/entity/_Base'


@ObjectType ()
@Entity ()
export class User extends Base {
	@Column()
	@Field()
	name: string
	
	@Field (returns => [Task])
	@ManyToMany (type => Task)
	tasks: Task[]
	
	@Field (returns => [Subtask])
	@ManyToMany (type => Subtask)
	subtasks: Subtask[]
	
	@Field (returns => [Task])
	@ManyToMany (type => Task, task => task.collaborators)
	collaboratingAt: Task[]
	
	@Field (returns => [Comment])
	@OneToMany (type => Comment, comm => comm.author)
	comments: Comment[]
	
}
