import { Field, ID, ObjectType } from '@nestjs/graphql'
import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, OneToOne, OneToMany } from 'typeorm'
import { Color } from '@/models/entity/Color'
import { TColumn } from '@/models/entity/TColumn'
import { Swimlane } from '@/models/entity/Swimlane'
import { TaskNumber } from '@/models/entity/TaskNumber'
import { User } from '@/models/entity/User'
import { TDate } from '@/models/entity/TDate'
import { Subtask } from '@/models/entity/Subtask'
import { Label } from '@/models/entity/Label'
import { Comment } from '@/models/entity/Comment'


@ObjectType ()
@Entity ()
export class Task extends BaseEntity {
	
	@Field (() => ID)
	@PrimaryGeneratedColumn ('uuid')
	id: string
	
	@Field ()
	@Column ({ length: 255 })
	title: string
	
	@Field ()
	@Column ({ length: 5000, nullable: true })
	description: string
	
	@Field (returns => Color)
	@ManyToOne (type => Color, color => color.tasks)
	color: Color
	
	@Field (returns => TColumn)
	@ManyToOne (type => TColumn)
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
	@ManyToOne (type => Swimlane, { nullable: true })
	swimlane: Swimlane
	
	@Column ({ nullable: true })
	@Field ({ nullable: true })
	position: number
	
	@OneToOne (type => TaskNumber, { nullable: true })
	@Field (returns => TaskNumber, { nullable: true })
	number: TaskNumber
	
	@Field (returns => User, { nullable: true })
	@ManyToMany (
		type => User, user => user.tasks, { nullable: true }
	)
	@JoinTable ()
	responsibleUser: User
	
	@ManyToMany (type => TDate, date => date.tasks, { nullable: true })
	@Field (returns => [TDate], { nullable: true })
	dates?: TDate[]
	
	
	@OneToMany (type => Subtask,
		subtask => subtask.parent)
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
	@UpdateDateColumn ()
	updatedAt: Date
	
	@Field (returns => Comment, { nullable: true })
	@OneToMany (type => Comment, comm => comm.task)
	comments: Comment
	
}

