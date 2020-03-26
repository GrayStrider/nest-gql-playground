import { Entity, OneToMany, ManyToOne, BaseEntity, PrimaryColumn, Column } from 'typeorm'
import { Field, ObjectType } from '@nestjs/graphql'
import { Task } from '@M/KBF/entity/Task'
import { Board } from '@M/KBF/entity/Board'

@ObjectType ()
@Entity ()
export class Swimlane extends BaseEntity {
	@PrimaryColumn ()
	@Field ()
	name: string
	
	@Column ({ nullable: true })
	@Field ({ nullable: true })
	description: string
	
	
	@OneToMany (type => Task, task => task.swimlane)
	tasks: Task[]
	
	@ManyToOne (type => Board, board => board.swimlanes)
	board: Board
	
}

