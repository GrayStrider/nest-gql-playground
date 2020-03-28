import { ArgsType, Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, MaxLength, IsOptional, ArrayNotEmpty } from 'class-validator'
import { ColumnInput } from '@M/KBF/inputs/column.input'
import { String50, ValidatedFieldNullable } from '@/common/decorators/validation'

@ArgsType ()
export class FindBoardInput {
	@Field ()
	@String50
	name: string
}

@InputType ()
export class AddBoardInput {
	@Field ()
	@String50
	name: string
	
	@ValidatedFieldNullable ([ColumnInput])
	columnsParams?: ColumnInput[]
	
	@ValidatedFieldNullable([String])
	@ArrayNotEmpty ()
	@IsNotEmpty ({ each: true })
	@MaxLength (20, { each: true })
	swimlaneNames?: string[]
}
