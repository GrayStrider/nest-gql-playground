import { InputType, Field } from '@nestjs/graphql'
import { IsNotEmpty, MaxLength, IsOptional, Max } from 'class-validator'
import { String20, FieldNullable, Number500 } from '@/common/decorators/validation'

@InputType ()
export class ColumnInput {
	@Field ()
	@String20
	name: string
	
	@FieldNullable ()
	@Number500
	order?: number
	
	@FieldNullable()
	@Number500
	taskLimit?: number
}

@InputType ()
export class AddColumnInput extends ColumnInput {
	@IsNotEmpty ()
	@MaxLength (50)
	@Field ()
	boardName: string
}
