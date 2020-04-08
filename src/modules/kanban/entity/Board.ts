import { OneToMany, Column, ManyToOne } from 'typeorm'
import { Field } from '@nestjs/graphql'
import { Swimlane } from '@M/kanban/entity/Swimlane'
import { TaskColor } from '@M/kanban/entity/TaskColor'
import { TColumn } from '@M/kanban/entity/TColumn'
import { Task } from '@M/kanban/entity/Task'
import { Base } from '@M/kanban/entity/_Base'
import { EntityObject } from '@/common/decorators/entity-object.decorator'
import { Tag } from '@M/kanban/entity/Tag'
import { User } from '@M/kanban/entity/User'

export const nameLength = 50

@EntityObject
export class Board extends Base {
	@Field ()
	@Column ({ length: nameLength })
	name: string
	
	@Field (returns => [TaskColor],
		{ nullable: true })
	@OneToMany (type => TaskColor,
		color => color.board,
		{ cascade: true, eager: true })
	colors: TaskColor[]
	
	@Field (returns => [TColumn],
		{ nullable: true })
	@OneToMany (type => TColumn,
		coll => coll.board,
		{ cascade: true, eager: true })
	columns: TColumn[] // TODO max per board
	
	@Field (returns => [Swimlane],
		{ nullable: true })
	@OneToMany (type => Swimlane,
		swimlane => swimlane.board,
		{ cascade: true, eager: true })
	swimlanes: Swimlane[]
	
	@Field (returns => [Task])
	@OneToMany (type => Task,
		task => task.board)
	tasks: Task[]
	
	
	@Field (returns => [Tag])
	@OneToMany (type => Tag,
		tags => tags.board)
	tags: Tag[]
	
	@Field (returns => User)
	@ManyToOne (type => User,
		user => user.boards, { nullable: false })
	owner: User
	
}
