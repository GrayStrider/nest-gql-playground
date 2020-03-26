import { Column, ManyToMany, Entity, BaseEntity, PrimaryColumn } from 'typeorm'
import { Field, ObjectType } from '@nestjs/graphql'
import { Task } from '@M/KBF/entity/Task'

@ObjectType ()
@Entity ()
export class Label extends BaseEntity {
	@Field ()
	@PrimaryColumn ()
	name: string
	
	@Field ()
	@Column ({ type: 'bool', default: false })
	pinned: boolean
	
	@ManyToMany (type => Task, task => task.labels)
	tasks: Task[]
}

