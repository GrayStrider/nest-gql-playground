import { ArgsType, Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, MaxLength, ArrayNotEmpty } from 'class-validator'
import { ColumnInput } from '@M/KBF/inputs/column.input'
import { FieldNullable, ValidString } from '@/common/decorators/validation'
import { nameLength } from '@M/KBF/entity/Board'
import { nameLength as SnameLength } from '@M/KBF/entity/Swimlane'

@ArgsType ()
export class FindBoardInput {
	@Field ()
	@ValidString (nameLength)
	name: string
}

@InputType ()
export class AddBoardInput {
	@Field ()
	@ValidString (nameLength)
	name: string
	
	@FieldNullable ([ColumnInput])
	columnsParams?: ColumnInput[]
	
	@FieldNullable ([String])
	@ArrayNotEmpty ()
	@IsNotEmpty ({ each: true })
	@MaxLength (SnameLength, { each: true })
	swimlaneNames?: string[]
}
