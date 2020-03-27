import { Column, ManyToMany, Entity, BaseEntity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Field, ObjectType } from '@nestjs/graphql'
import { Task } from '@M/KBF/entity/Task'

export const PrimaryUniqueColumn = (...args: Parameters<typeof PrimaryColumn>) => PrimaryColumn
({ unique: true, ...args })

@ObjectType ()
@Entity ()
export class Label extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string
	
	@Column ()
	@Field ()
	name: string
	
	@Field ()
	@Column ({ type: 'bool', default: false })
	pinned: boolean
	
	@ManyToMany (type => Task, task => task.labels)
	tasks: Task[]
}

