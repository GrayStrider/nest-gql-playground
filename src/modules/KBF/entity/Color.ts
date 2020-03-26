import { ObjectType, Field } from '@nestjs/graphql'
import { Entity, OneToMany, Column, ManyToOne, BaseEntity, PrimaryColumn } from 'typeorm'
import { Task } from '@M/KBF/entity/Task'
import { Board } from '@M/KBF/entity/Board'


@ObjectType ()
@Entity ()
export class Color extends BaseEntity {
	@Field ()
	@PrimaryColumn()
	name: string
	
	@OneToMany (type => Task, task => task.color)
	tasks: Task[]

	@Field ({ nullable: true })
	@Column ({ length: 5000, nullable: true })
	description?: string
	
	@Field ()
	@Column ()
	value: string
	
	@ManyToOne (type => Board, board => board.colors)
	board: Board
	
}

