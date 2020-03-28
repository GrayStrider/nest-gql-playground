import { InputType, Field } from '@nestjs/graphql'
import { IsNotEmpty, IsBoolean, IsHexColor } from 'class-validator'
import { String50, String20, ValidatedFieldNullable, String100 } from '@/common/decorators/validation'


@InputType ()
export class NewColorInput {
	@Field ()
	@String50
	boardName: string
	
	@Field ()
	@String20
	name: string
	
	@ValidatedFieldNullable ()
	@String100
	description?: string
	
	@Field ()
	@IsNotEmpty ()
	@IsHexColor ()
	value: string
	
	@ValidatedFieldNullable ()
	@IsBoolean ()
	default?: boolean
}
