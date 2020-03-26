import { Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, BaseEntity, PrimaryColumn } from 'typeorm'
import { ObjectType, Field, ID } from '@nestjs/graphql'
import { Board } from '@M/KBF/entity/Board'
import { Task } from '@M/KBF/entity/Task'


@Entity ()
@ObjectType ()
export class TColumn extends BaseEntity {
	@Field()
	@PrimaryColumn()
	name: string
	
	@ManyToOne (type => Board, board => board.columns)
	board: Board
	
	@Field (returns => Task, { nullable: true })
	@OneToMany (type => Task, task => task.column)
	tasks: Task[]
	
}

