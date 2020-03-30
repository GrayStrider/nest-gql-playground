import { InputType, Field } from '@nestjs/graphql'
import { FieldNullable, ValidString } from '@/common/decorators/validation'
import { IsUUID, IsBoolean } from 'class-validator'
import { nameLength, descriptionLength } from '@M/KBF/entity/Tag'

@InputType ()
export class TagInput {
	@FieldNullable ([String])
	@IsUUID ('all', { each: true })
	tasksIDs: string[]
	
	@Field ()
	@ValidString (nameLength)
	name: string
	
	@FieldNullable ()
	@ValidString (descriptionLength)
	description?: string
	
	@Field ()
	@IsBoolean ()
	pinned: boolean
}
