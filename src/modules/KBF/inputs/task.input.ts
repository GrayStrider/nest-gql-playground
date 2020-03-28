import { Field, InputType } from '@nestjs/graphql'
import { MaxLength, IsOptional, IsNotEmpty } from 'class-validator'

@InputType ()
export class TaskInput {
	@IsNotEmpty ()
	@MaxLength (50)
	@Field ()
	boardName: string
	
	@IsNotEmpty ()
	@MaxLength (100)
	@Field ()
	title: string
	
	@MaxLength (500)
	@IsNotEmpty ()
	@IsOptional ()
	@Field ({ nullable: true })
	description?: string
	
	@IsOptional ()
	@MaxLength (20, { each: true })
	@IsNotEmpty ({ each: true })
	@Field (returns => [String], {
		nullable: true
	})
	tags?: string[]
	
	@IsOptional ()
	@IsNotEmpty ()
	@MaxLength (20)
	@Field ({ nullable: true })
	colorName?: string
	
	@IsOptional ()
	@MaxLength (20)
	@IsNotEmpty()
	@Field ({ nullable: true })
	columnName?: string
	
	@IsOptional ()
	@MaxLength (20)
	@IsNotEmpty()
	@Field ({ nullable: true })
	swimlaneName?: string
	
}

