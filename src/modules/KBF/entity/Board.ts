import { OneToMany, Column } from 'typeorm'
import { Field } from '@nestjs/graphql'
import { Swimlane } from '@M/KBF/entity/Swimlane'
import { Color } from '@M/KBF/entity/Color'
import { TColumn } from '@M/KBF/entity/TColumn'
import { Task } from '@M/KBF/entity/Task'
import { Base } from '@M/KBF/entity/_Base'
import { EntityObject } from '@/common/decorators'

@EntityObject
export class Board extends Base {
	@Field ()
	@Column ({ unique: true })
	name: string
	
	@Field (returns => [Color])
	@OneToMany (type => Color,
		color => color.board,
		{ cascade: true, eager: true }
	)
	colors: Color[]
	
	@Field (returns => [TColumn])
	@OneToMany (type => TColumn,
		coll => coll.board,
		{ cascade: true, eager: true }
	)
	columns: TColumn[]
	
	@Field (returns => [Swimlane])
	@OneToMany (type => Swimlane,
		swimlane => swimlane.board,
		{ cascade: true, eager: true }
	)
	swimlanes: Swimlane[]
	
	@Field (returns => [Task])
	@OneToMany (type => Task,
		task => task.board
	)
	tasks: Task[]
	
}

