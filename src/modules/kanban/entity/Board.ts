import { OneToMany, Column } from 'typeorm'
import { Field } from '@nestjs/graphql'
import { Swimlane } from '@M/kanban/entity/Swimlane'
import { Color } from '@M/kanban/entity/Color'
import { TColumn } from '@M/kanban/entity/TColumn'
import { Task } from '@M/kanban/entity/Task'
import { Base } from '@M/kanban/entity/_Base'
import { EntityObject } from '@/common/decorators/entity-object.decorator'
import { Tag } from '@M/kanban/entity/Tag'

export const nameLength = 50

@EntityObject
export class Board extends Base {
	@Field ()
	@Column ({ length: nameLength })
	name: string
	
	@Field (returns => [Color],
		{ nullable: true })
	@OneToMany (type => Color,
		color => color.board,
		{ cascade: true, eager: true })
	colors: Color[]
	
	@Field (returns => [TColumn],
		{ nullable: true })
	@OneToMany (type => TColumn,
		coll => coll.board,
		{ cascade: true, eager: true })
	columns: TColumn[]
	
	@Field (returns => [Swimlane],
		{ nullable: true })
	@OneToMany (type => Swimlane,
		swimlane => swimlane.board,
		{ cascade: true, eager: true })
	swimlanes: Swimlane[]
	
	@OneToMany (type => Task,
		task => task.board)
	tasks: Task[]
	
	@OneToMany (type => Tag,
		tags => tags.board)
	tags: Tag[]
	
}

