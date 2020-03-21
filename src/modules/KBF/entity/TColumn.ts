import { Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, BaseEntity } from 'typeorm'
import { ObjectType, Field, ID } from '@nestjs/graphql'
import { Board } from '@M/KBF/entity/Board'
import { Task } from '@M/KBF/entity/Task'


@Entity ()
@ObjectType ()
export class TColumn extends BaseEntity {
	
	@Field (returns => ID)
	@PrimaryGeneratedColumn ('uuid')
	id: string
	
	@Field (returns => Board)
	@ManyToOne (type => Board, board => board.columns)
	board: Board
	
	@Field (returns => Task, { nullable: true })
	@OneToMany (type => Task, task => task.column)
	tasks: Task[]
	
}
