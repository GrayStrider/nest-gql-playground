import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { ObjectType, Field, ID } from '@nestjs/graphql'
import { Swimlane } from '@/models/entity/Swimlane'
import { Color } from '@/models/entity/Color'
import { TColumn } from '@/models/entity/TColumn'

@ObjectType ()
@Entity ()
export class Board {
	
	@PrimaryGeneratedColumn ('uuid')
	@Field (returns => ID)
	id: string
	
	@Column ({ length: 255 })
	@Field ()
	name: string
	
	@OneToMany (type => TColumn, coll => coll.board)
	columns: TColumn[]
	
	@OneToMany (type => Color, color => color.board)
	colors: Color[]
	
	@OneToMany (type => Swimlane,
		swimlane => swimlane.board)
	swimlanes: Swimlane[]
	
}

