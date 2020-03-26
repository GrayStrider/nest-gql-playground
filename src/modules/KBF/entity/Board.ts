import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity, PrimaryColumn } from 'typeorm'
import { ObjectType, Field, ID } from '@nestjs/graphql'
import { Swimlane } from '@M/KBF/entity/Swimlane'
import { Color } from '@M/KBF/entity/Color'
import { TColumn } from '@M/KBF/entity/TColumn'

@ObjectType ()
@Entity ()
export class Board extends BaseEntity {
	@PrimaryColumn()
	@Field ()
	name: string
	
	@Field (returns => [TColumn])
	@OneToMany (type => TColumn, coll => coll.board, {
		cascade: true, eager: true
	})
	columns: TColumn[]
	
	@Field(returns => [Color])
	@OneToMany (type => Color, color => color.board, {
		cascade: true, eager: true
	})
	colors: Color[]
	
	@Field(returns => [Swimlane])
	@OneToMany (type => Swimlane, swimlane => swimlane.board, {
		cascade: true, eager: true
	})
	swimlanes: Swimlane[]
	
}

