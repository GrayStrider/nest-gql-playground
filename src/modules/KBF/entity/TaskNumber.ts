import { ObjectType, Field, ID } from '@nestjs/graphql'
import { Entity, OneToOne, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm'
import { Task } from '@M/KBF/entity/Task'

@ObjectType ()
@Entity ()
export class TaskNumber extends BaseEntity {
	@Field (returns => ID)
	@PrimaryGeneratedColumn ('uuid')
	id: string
	
	@Field ()
	@Column ({ type: 'int' })
	value: number
	
	@Field ()
	@Column ()
	prefix?: string
	
	@OneToOne (type => Task)
	task: Task
	
}

