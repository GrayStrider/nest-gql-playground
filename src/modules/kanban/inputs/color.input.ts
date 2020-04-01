import { InputType, Field } from '@nestjs/graphql'
import { IsNotEmpty, IsBoolean, IsHexColor } from 'class-validator'
import { FieldNullable, ValidString } from '@/common/decorators/validation'
import { nameLength, descriptionLength } from '@M/kanban/entity/Color'
import * as Board from '@M/kanban/entity/Board'


@InputType ()
export class NewColorInput {
	@Field ()
	@ValidString (Board.nameLength)
	boardName: string
	
	@Field ()
	@ValidString (nameLength)
	name: string
	
	@FieldNullable ()
	@ValidString (descriptionLength)
	description?: string
	
	@Field ()
	@IsNotEmpty ()
	@IsHexColor ()
	value: string
	
	@FieldNullable ()
	@IsBoolean ()
	default?: boolean
}
