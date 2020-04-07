import { toGlobalId } from 'graphql-relay'
import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm'
import { ObjectType, Field, ID } from '@nestjs/graphql'
import { Node } from '@M/node/node'


@ObjectType ({ implements: Node })
@Entity ('recipes')
export class Recipe implements Node {
	@PrimaryGeneratedColumn ('uuid')
	id: string
	
	@Field ()
	@Column ()
	title: string
	
	@Field ({ nullable: true })
	@Column ({ nullable: true })
	description?: string
	
	@Field ()
	@CreateDateColumn ()
	creationDate: Date
	
	@Column('varchar', {array: true})
	@Field (() => [String])
	ingredients: string[]
	
	@Field (() => ID, { name: 'id' })
	get relayId (): string {
		return toGlobalId ('Recipe', this.id)
	}
}
