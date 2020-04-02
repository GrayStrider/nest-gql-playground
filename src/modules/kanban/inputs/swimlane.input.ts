import { InputType, Field } from '@nestjs/graphql'
import { FieldNullable, ValidString, ValidNumber } from '@/common/decorators/validation'
import { nameLength, descriptionLength } from '@M/kanban/entity/Swimlane'
import * as Board from '@M/kanban/entity/Board'
import { maxOrder } from '@M/kanban/entity/TColumn'
import { SearchByIDInput } from '@M/kanban/inputs/common/search-by-id.input'


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
	
	@FieldNullable ()
	@ValidNumber (maxOrder)
	order?: number
}

@InputType()
export class FindSwimlaneInput extends SearchByIDInput {
	@Field()
	@ValidString(Board.nameLength)
	boardName: string
	
	@FieldNullable ()
	@ValidString (nameLength)
	name?: string
	
	@FieldNullable ()
	@ValidString (descriptionLength)
	description?: string
}
