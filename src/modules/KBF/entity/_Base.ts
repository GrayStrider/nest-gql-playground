import { Field, ID, ObjectType } from '@nestjs/graphql'
import { BaseEntity, PrimaryGeneratedColumn } from 'typeorm'
import { EntityObject } from '@/common/decorators'


@ObjectType()
export class Base extends BaseEntity {
	@Field (returns => ID)
	@PrimaryGeneratedColumn ('uuid')
	id: string
}
