import { ObjectType } from '@nestjs/graphql'
import { Entity, BaseEntity, PrimaryGeneratedColumn } from 'typeorm'

@ObjectType ()
@Entity ()
export class Base extends BaseEntity {
	@PrimaryGeneratedColumn ('uuid')
	id: string
}
