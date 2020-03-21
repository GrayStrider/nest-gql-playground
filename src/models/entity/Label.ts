import { PrimaryGeneratedColumn, Column, ManyToMany, Entity, BaseEntity } from 'typeorm'
import { Field, ObjectType, ID } from '@nestjs/graphql'
import { Task } from '@/models/entity/Task'

@ObjectType ()
@Entity ()
export class Label extends BaseEntity {
	
	@Field (returns => ID)
	@PrimaryGeneratedColumn ('uuid')
	id: string
	
	@Field ()
	@Column ()
	name: string
	
	@Field ()
	@Column ({ type: 'bool', default: false })
	pinned: boolean
	
	@Field (returns => [Task])
	@ManyToMany (type => Task, task => task.labels)
	tasks: Task[]
	
}

