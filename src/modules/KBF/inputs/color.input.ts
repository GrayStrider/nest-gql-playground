import { InputType, Field } from '@nestjs/graphql'
import { IsNotEmpty, IsBoolean, IsHexColor } from 'class-validator'
import { ValidString50, ValidString20, FieldNullable, ValidString100 } from '@/common/decorators/validation'


@InputType ()
export class NewColorInput {
	@Field ()
	@ValidString50
	boardName: string
	
	@Field ()
	@ValidString20
	name: string
	
	@FieldNullable ()
	@ValidString100
	description?: string
	
	@Field ()
	@IsNotEmpty ()
	@IsHexColor ()
	value: string
	
	@FieldNullable ()
	@IsBoolean ()
	default?: boolean
}
