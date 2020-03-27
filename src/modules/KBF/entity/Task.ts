import { Field, ID, ObjectType } from '@nestjs/graphql'
import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, OneToOne, OneToMany } from 'typeorm'
import { Color } from '@M/KBF/entity/Color'
import { TColumn } from '@M/KBF/entity/TColumn'
import { Swimlane } from '@M/KBF/entity/Swimlane'
import { TaskNumber } from '@M/KBF/entity/TaskNumber'
import { User } from '@M/KBF/entity/User'
import { TDate } from '@M/KBF/entity/TDate'
import { Subtask } from '@M/KBF/entity/Subtask'
import { Label } from '@M/KBF/entity/Label'
import { Comment } from '@M/KBF/entity/Comment'
import { Board } from '@M/KBF/entity/Board'

@ObjectType ()
@Entity ()
export class Task extends BaseEntity {
	@Field (() => ID)
	@PrimaryGeneratedColumn ('uuid')
	id: string
	
	@Field (returns => Board)
	@ManyToOne (task => Board,
		board => board.tasks)
	board: Board
	
	@Field ()
	@Column ({ length: 255 })
	title: string
	
	@Field ({ nullable: true })
	@Column ({ length: 5000, nullable: true })
	description?: string
	
	@Field (returns => Color)
	@ManyToOne (type => Color, color => color.tasks, {
		eager: true
	})
	color?: Color
	
	@Field (returns => TColumn)
	@ManyToOne (type => TColumn, {
		eager: true
	})
	column: TColumn
	
	@Column ({ default: 0 })
	@Field ()
	totalSecondsSpent: number
	
	@Column ({ nullable: true })
	@Field ({ nullable: true })
	totalSecondsEstimate?: number
	
	@Column ({ nullable: true })
	@Field ({ nullable: true })
	pointsEstimate?: number
	
	@Field (returns => Swimlane)
	@ManyToOne (type => Swimlane, { nullable: true, eager: true })
	swimlane: Swimlane
	
	@Column ({ nullable: true })
	@Field ({ nullable: true })
	position: number
	
	@OneToOne (type => TaskNumber, { nullable: true, eager: true })
	@Field (returns => TaskNumber, { nullable: true })
	number: TaskNumber
	
	@Field (returns => User, { nullable: true })
	@ManyToMany (
		type => User,
			user => user.tasks,
		{ nullable: true, eager: true }
	)
	@JoinTable ()
	responsibleUser: User
	
	@ManyToMany (type => TDate, date => date.tasks, { nullable: true, eager: true })
	@Field (returns => [TDate], { nullable: true })
	dates?: TDate[]
	
	
	@OneToMany (type => Subtask,
		subtask => subtask.parent, {
			eager: true
		})
	@Field (returns => [Subtask], { nullable: true })
	subtasks?: Subtask[]
	
	@Field (returns => [Label])
	@ManyToMany (type => Label, label => label.tasks, {
		cascade: true,
		eager: true
	})
	@JoinTable ()
	labels: Label[]
	
	@ManyToMany (type => User,
		user => user.collaboratingAt)
	@Field (returns => [User])
	collaborators: User[]
	
	@Field (returns => Date)
	@CreateDateColumn ()
	createdAt: Date
	
	@Field (returns => Date)
	@UpdateDateColumn ( )
	updatedAt: Date
	
	@Field (returns => Comment, { nullable: true })
	@OneToMany (type => Comment, comm => comm.task)
	comments: Comment
	
}

