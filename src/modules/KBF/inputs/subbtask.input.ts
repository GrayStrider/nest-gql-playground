import { InputType, Field } from '@nestjs/graphql'
import { ValidString, FieldNullable } from '@/common/decorators/validation'
import { contentLength } from '@M/KBF/entity/Subtask'
import { IsBoolean, IsDateString, IsUUID, ArrayNotEmpty } from 'class-validator'

@InputType ()
export class SubbtaskInput {
	@Field ()
	@IsUUID ()
	parentTaskID: string
	
	@Field (returns => [String])
	@IsUUID ('all', { each: true })
	@ArrayNotEmpty()
	responsibleUsersIDs: string[]
	
	@Field ()
	@ValidString (contentLength)
	content: string
	
	@Field ()
	@IsBoolean ()
	finished: boolean
	
	@FieldNullable (Date)
	@IsDateString ()
	dueDateTimestamp?: string
}
