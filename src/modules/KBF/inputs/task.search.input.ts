import { ArgsType, Field } from '@nestjs/graphql'
import { Max, IsNotEmpty, MaxLength, IsOptional, IsBoolean } from 'class-validator'

@ArgsType ()
export class TaskSearchInput {
	@IsOptional()
	@IsNotEmpty()
	@MaxLength(100)
	@Field ({ nullable: true })
	title: string
	
	@IsOptional()
	@IsNotEmpty()
	@MaxLength(500)
	@Field ({ nullable: true })
	description: string
	
	@IsOptional()
	@IsNotEmpty()
	@MaxLength(100)
	@Field ({ nullable: true })
	id: string
	
	@IsOptional()
	@IsBoolean()
	@Field ({ nullable: true })
	completed: boolean
	
	@IsNotEmpty ({ each: true })
	@MaxLength (20, { each: true })
	@IsOptional ()
	@Field (returns => [String], { nullable: true })
	tag: string[]
	
}

