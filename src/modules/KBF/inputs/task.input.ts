import { Field, InputType } from '@nestjs/graphql'
import { MaxLength, IsOptional, MinLength, IsNotEmpty } from 'class-validator'

@InputType ()
export class TaskInput {
	@IsNotEmpty()
	@MaxLength(50)
	@Field ()
	boardName: string
	
	@IsNotEmpty()
	@MaxLength(100)
	@Field ()
	title: string
	
	@MaxLength (500)
	@IsOptional ()
	@Field ({ nullable: true })
	description?: string
	
	@IsOptional()
	@Field (returns => [String], {
		nullable: true
	})
	tags?: string[]
	
	@IsOptional()
	@Field ({ nullable: true })
	colorName?: string
	
	@IsOptional()
	@Field ({ nullable: true })
	columnName?: string
	
	@IsOptional()
	@Field ({ nullable: true })
	swimlaneName?: string
	
}

