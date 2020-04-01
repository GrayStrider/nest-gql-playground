import { InputType, Field } from '@nestjs/graphql'
import { ValidString, FieldNullable } from '@/common/decorators/validation'
import { contentLength } from '@M/kanban/entity/Subtask'
import { IsBoolean, IsDateString, IsUUID, ArrayNotEmpty } from 'class-validator'

@InputType ()
export class SubbtaskInput {
	@Field ()
	@IsUUID ()
	parentTaskID: string
	
	@Field (returns => [String])
	@IsUUID (undefined, { each: true })
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
