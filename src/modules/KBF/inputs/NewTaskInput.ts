import { ArgsType, Field, InputType } from '@nestjs/graphql'
import { Priority } from '@M/KBF/entity/Priority'
import { Task } from '@M/KBF/entity/Task'
import { MaxLength, IsOptional } from 'class-validator'

@InputType()
export class NewTaskInput {
	
	@Field ()
	title: string
	
	@MaxLength(500)
	@IsOptional()
	@Field ({ nullable: true })
	description?: string

	@Field (returns => [String], { defaultValue: [] })
	tags?: string[]

	// TODO check for dupes
	@Field (returns => Priority, { defaultValue: Priority.NONE })
	priority?: Priority
	
}

