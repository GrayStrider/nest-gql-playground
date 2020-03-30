import { InputType, Field } from '@nestjs/graphql'
import { FieldNullable, ValidString } from '@/common/decorators/validation'
import { nameLength, descriptionLength } from '@M/KBF/entity/Swimlane'
import * as Board from '@M/KBF/entity/Board'


@InputType ()
export class SwimlaneInput {
	@Field ()
	@ValidString(Board.nameLength)
	boardName: string
	
	@Field ()
	@ValidString (nameLength)
	name: string
	
	@FieldNullable ()
	@ValidString (descriptionLength)
	description?: string
}
