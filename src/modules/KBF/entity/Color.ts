import { ObjectType, Field } from '@nestjs/graphql'
import { Entity, OneToMany, Column, ManyToOne, BaseEntity, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { Task } from '@M/KBF/entity/Task'
import { Board } from '@M/KBF/entity/Board'


@ObjectType ()
@Unique (['name', 'board'])
@Entity ()
export class Color extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn ('uuid')
	id: string
	
	@Field ()
	@Column ()
	name: string
	
	@OneToMany (type => Task, task => task.color)
	tasks: Task[]
	
	@Field ({ nullable: true })
	@Column ({ length: 5000, nullable: true })
	description?: string
	
	@Field ()
	@Column ()
	value: string
	
	@Field ()
	@Column ({ default: false })
	default: boolean
	
	@ManyToOne (type => Board, board => board.colors)
	board: Board
	
}

