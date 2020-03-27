import { Entity, OneToMany, BaseEntity, PrimaryColumn, Unique, PrimaryGeneratedColumn, Column } from 'typeorm'
import { ObjectType, Field } from '@nestjs/graphql'
import { Swimlane } from '@M/KBF/entity/Swimlane'
import { Color } from '@M/KBF/entity/Color'
import { TColumn } from '@M/KBF/entity/TColumn'
import { Task } from '@M/KBF/entity/Task'

@ObjectType ()
@Entity ()
export class Board extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string
	
	@Column ({ unique: true })
	@Field ()
	name: string
	
	@Field (returns => [Task])
	@OneToMany (type => Task,
		task => task.board)
	tasks: Task[]
	
	@Field (returns => [TColumn])
	@OneToMany (type => TColumn, coll => coll.board, {
		cascade: true, eager: true
	})
	columns: TColumn[]
	
	@Field (returns => [Color])
	@OneToMany (type => Color, color => color.board, {
		cascade: true, eager: true
	})
	colors: Color[]
	
	@Field (returns => [Swimlane])
	@OneToMany (type => Swimlane, swimlane => swimlane.board, {
		cascade: true, eager: true
	})
	swimlanes: Swimlane[]
	
}

