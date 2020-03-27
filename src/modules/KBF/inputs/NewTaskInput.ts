import { Field, InputType } from '@nestjs/graphql'
import { MaxLength, IsOptional } from 'class-validator'

@InputType ()
export class NewTaskInput {
	@Field ()
	boardName: string
	
	@Field ()
	title: string
	
	@MaxLength (500)
	@IsOptional ()
	@Field ({ nullable: true })
	description?: string
	
	@Field (returns => [String], {
		nullable: true
	})
	tags?: string[]
	
	@Field ({ nullable: true })
	colorName?: string
	
	@Field ({ nullable: true })
	columnName?: string
	
	@Field ({ nullable: true })
	swimlaneName?: string
	
}

