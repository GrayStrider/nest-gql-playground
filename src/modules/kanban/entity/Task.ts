import { Field, ObjectType } from '@nestjs/graphql'
import { Column, CreateDateColumn, JoinTable, ManyToMany, UpdateDateColumn, ManyToOne, OneToOne, OneToMany, JoinColumn, Check } from 'typeorm'
import { TaskColor } from '@M/kanban/entity/TaskColor'
import { TColumn } from '@M/kanban/entity/TColumn'
import { Swimlane } from '@M/kanban/entity/Swimlane'
import { TaskNumber } from '@M/kanban/entity/TaskNumber'
import { User } from '@M/kanban/entity/User'
import { TDate } from '@M/kanban/entity/TDate'
import { Subtask } from '@M/kanban/entity/Subtask'
import { Tag } from '@M/kanban/entity/Tag'
import { TaskComment } from '@M/kanban/entity/TaskComment'
import { Board } from '@M/kanban/entity/Board'
import { Base } from '@M/kanban/entity/_Base'
import { EntityObject } from '@/common/decorators/entity-object.decorator'

export const titleLength = 100
export const descriptionLength = 5000
export const maxOrderTasksInColumn = 5000

export const Year = 365 * 24 * 60 * 60


@ObjectType()
export class Board_Task extends Base {
	board: Board
	
	@Field (returns => TColumn)
	@ManyToOne (type => TColumn,
		column => column.tasks,
		{ eager: true, cascade: ['update'] })
	column: TColumn
	
	@Field (returns => Swimlane)
	@ManyToOne (type => Swimlane,
		swimlane => swimlane.tasks,
		{ eager: true })
	swimlane: Swimlane
	
	@Field ()
	@Column ({ type: 'bool', default: false })
	completed: boolean
	
	@Field ()
	@Column ({ length: titleLength })
	title: string
	
	@Field ({ nullable: true })
	@Column ({
		length: descriptionLength,
		nullable: true
	})
	description?: string
	
	@Field (returns => TaskColor)
	@ManyToOne (type => TaskColor, color => color.tasks,
		{ eager: true })
	color: TaskColor
	
	@Field (returns => [Tag])
	@ManyToMany (type => Tag, label => label.tasks, {
		cascade: true,
		eager: true
	})
	@JoinTable ()
	tags: Tag[]
	
	@Field (returns => [Subtask],
		{ nullable: true })
	@OneToMany (type => Subtask,
		subtask => subtask.parent,
		{ eager: true })
	subtasks: Subtask[]
	
	@Column ({ type: 'int', default: 0 })
	@Field ()
	totalSecondsSpent: number
	
	@Column ({ type: 'int', default: 0 })
	@Field ()
	totalSecondsEstimate: number
	
	@Field ()
	@Column ({ type: 'int', default: 0 })
	position: number
	
	@Field (returns => TaskNumber,
		{ nullable: true })
	@OneToOne (type => TaskNumber,
		number => number.task,
		{ nullable: true, eager: true })
	@JoinColumn ()
	number?: TaskNumber
	
	@Field (returns => User,
		{ nullable: true })
	@ManyToMany (
		type => User,
		user => user.tasks,
		{ nullable: true, eager: true })
	@JoinTable ()
	user: User // TODO responsibleUser
	
	@Field (returns => [TDate],
		{ nullable: true })
	@ManyToMany (type => TDate,
		date => date.tasks,
		{ nullable: true, eager: true })
	@JoinTable ()
	dates?: TDate[]
	
	@Field (returns => [User])
	@ManyToMany (type => User,
		user => user.collaboratingAt,
		{ eager: true })
	@JoinTable ()
	collaborators: User[]
	
	@Field (returns => Date)
	@CreateDateColumn ()
	createdAt: Date
	
	@Field (returns => Date)
	@UpdateDateColumn ()
	updatedAt: Date
	
	@Field (returns => TaskComment)
	@OneToMany (type => TaskComment, comment => comment.task)
	comments: TaskComment[]
}

@EntityObject
@Check (`"totalSecondsSpent" < ${Year * 5}`)
@Check (`"totalSecondsSpent" >= 0`)
@Check (`"totalSecondsEstimate" < ${Year}`)
@Check (`"totalSecondsEstimate" >= 0`)
@Check (`"position" < ${maxOrderTasksInColumn}`)
@Check (`"position" >= 0`)
export class Task extends Board_Task {
	@Field (returns => Board)
	@ManyToOne (task => Board,
		board => board.tasks,
		{ eager: true })
	board: Board
}
