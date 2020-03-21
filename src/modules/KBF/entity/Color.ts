import { ObjectType, Field, ID } from '@nestjs/graphql'
import { Entity, OneToMany, Column, ManyToOne, BaseEntity, PrimaryGeneratedColumn } from 'typeorm'
import { Colors } from '@M/KBF/enums/Colors'
import { Task } from '@M/KBF/entity/Task'
import { Board } from '@M/KBF/entity/Board'


@ObjectType ()
@Entity ()
export class Color extends BaseEntity {
	
	@Field (returns => ID)
	@PrimaryGeneratedColumn ('uuid')
	id: string
	
	@Field (returns => [Task], { nullable: true })
	@OneToMany (type => Task, task => task.color)
	tasks: Task[]
	
	@Field ()
	@Column ({ length: 255 })
	name: string
	
	@Field ({ nullable: true })
	@Column ({ length: 5000, nullable: true })
	description?: string
	
	@Field (returns => Colors)
	@Column ({ type: 'enum', enum: Colors, default: Colors.WHITE })
	value: Colors
	
	@ManyToOne (type => Board, board => board.colors)
	board: Board
	
}

