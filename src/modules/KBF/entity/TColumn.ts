import { Entity, OneToMany, ManyToOne, BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { ObjectType, Field } from '@nestjs/graphql'
import { Board } from '@M/KBF/entity/Board'
import { Task } from '@M/KBF/entity/Task'


@Entity ()
@ObjectType ()
export class TColumn extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string
	
	@Column ()
	@Field ()
	name: string
	
	@Field ()
	@Column ({ default: 0 })
	order: number
	
	@Field ()
	@Column ({ default: 0 })
	taskLimit: number
	
	@OneToMany (type => Task, task => task.column)
	tasks: Task[]
	
	@ManyToOne (type => Board, board => board.columns)
	board: Board
	
}
