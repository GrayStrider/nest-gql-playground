import { InputType, Field } from '@nestjs/graphql'
import { IsNotEmpty, IsBoolean, IsHexColor } from 'class-validator'
import { String50, String20, FieldNullable, String100 } from '@/common/decorators/validation'


@InputType ()
export class NewColorInput {
	@Field ()
	@String50
	boardName: string
	
	@Field ()
	@String20
	name: string
	
	@FieldNullable ()
	@String100
	description?: string
	
	@Field ()
	@IsNotEmpty ()
	@IsHexColor ()
	value: string
	
	@FieldNullable ()
	@IsBoolean ()
	default?: boolean
}
