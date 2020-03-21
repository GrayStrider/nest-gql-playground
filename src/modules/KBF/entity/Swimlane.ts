import { Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, BaseEntity } from 'typeorm'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Task } from '@M/KBF/entity/Task'
import { Board } from '@M/KBF/entity/Board'

@ObjectType ()
@Entity ()
export class Swimlane extends BaseEntity {
	
	@Field (returns => ID)
	@PrimaryGeneratedColumn ('uuid')
	id: string
	
	@Field (returns => [Task])
	@OneToMany (type => Task, task => task.swimlane)
	tasks: Task[]
	
	@Field (returns => Board)
	@ManyToOne (type => Board, board => board.swimlanes)
	board: Board
	
}
