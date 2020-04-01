import { Field, ID, ObjectType } from '@nestjs/graphql'
import { BaseEntity, PrimaryGeneratedColumn } from 'typeorm'

@ObjectType ()
export abstract class Base extends BaseEntity {
	@Field (returns => ID)
	@PrimaryGeneratedColumn ('uuid')
	id: string
}
