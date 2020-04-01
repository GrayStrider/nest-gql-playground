import { Field } from '@nestjs/graphql'
import { ManyToOne, Column, ManyToMany } from 'typeorm'
import { TColumn } from '@M/KBF/entity/TColumn'
import { Task } from '@M/KBF/entity/Task'
import { Base } from '@M/KBF/entity/_Base'
import { EntityObject } from '@/common/decorators/entity-object.decorator'


@EntityObject
export class TDate extends Base {
	@Field (returns => [Task])
	@ManyToMany (type => Task,
		task => task.dates)
	tasks: Task[]
	
	@Field (returns => TColumn)
	@ManyToOne (type => TColumn)
	targetColumn: TColumn
	
	@Column ({ default: 'active' })
	@Field ()
	status: 'active'
	
	@Column ({ default: 'dueDate' })
	@Field ()
	dateType: 'dueDate'
	
	@Column ({ type: 'date', nullable: true })
	@Field (returns => Date, { nullable: true })
	dueTimestamp?: Date
	
	@Column ({ type: 'date', nullable: true })
	@Field (returns => Date, { nullable: true })
	dueTimestampLocal?: string
	
}
