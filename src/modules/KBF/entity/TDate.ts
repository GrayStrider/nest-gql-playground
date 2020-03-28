import { ObjectType, Field, ID } from '@nestjs/graphql'
import { Entity, ManyToOne, Column, ManyToMany, BaseEntity, PrimaryGeneratedColumn } from 'typeorm'
import { TColumn } from '@M/KBF/entity/TColumn'
import { Task } from '@M/KBF/entity/Task'
import { Base } from '@M/KBF/entity/_Base'

@ObjectType ()
@Entity ()
export class TDate extends Base {
	@Field (returns => [Task],
		{ nullable: true })
	@ManyToMany (type => Task,
			task => task.dates, {
		nullable: true
	})
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
