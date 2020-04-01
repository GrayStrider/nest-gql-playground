import { InputType, Field } from '@nestjs/graphql'
import { FieldNullable, ValidString } from '@/common/decorators/validation'
import { IsUUID, IsBoolean, ArrayNotEmpty } from 'class-validator'
import { nameLength, descriptionLength } from '@M/KBF/entity/Tag'
import * as Board from '@M/KBF/entity/Board'

@InputType ()
export class TagInput {
	@Field ()
	@ValidString (Board.nameLength)
	boardName: string
	
	@FieldNullable ([String])
	@ArrayNotEmpty ()
	@IsUUID (undefined, { each: true })
	tasksIDs: string[]
	
	@Field ()
	@ValidString (nameLength)
	name: string
	
	@FieldNullable ()
	@ValidString (descriptionLength)
	description?: string
	
	@FieldNullable ()
	@IsBoolean ()
	pinned: boolean
}
