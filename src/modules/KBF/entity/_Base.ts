import { ObjectType, Field, ID } from '@nestjs/graphql'
import { Entity, BaseEntity, PrimaryGeneratedColumn } from 'typeorm'

@ObjectType ()
@Entity ()
export class Base extends BaseEntity {
	@Field (returns => ID)
	@PrimaryGeneratedColumn ('uuid')
	id: string
}
