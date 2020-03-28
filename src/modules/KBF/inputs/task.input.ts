import { Field, InputType } from '@nestjs/graphql'
import { MaxLength, IsNotEmpty, IsBoolean, ArrayNotEmpty } from 'class-validator'
import { ValidatedFieldNullable, String500, String100, String50, String20 } from '@/common/decorators/validation'

@InputType ()
export class TaskInput {
	@Field ()
	@String50
	boardName: string
	
	@Field ()
	@String100
	title: string
	
	@ValidatedFieldNullable ()
	@String500
	description?: string
	
	@ValidatedFieldNullable ([String])
	@ArrayNotEmpty()
	@MaxLength (20, { each: true })
	@IsNotEmpty ({ each: true })
	tags?: string[]
	
	@ValidatedFieldNullable ()
	@IsBoolean ()
	completed?: boolean
	
	@ValidatedFieldNullable ()
	@String20
	colorName?: string
	
	@ValidatedFieldNullable ()
	@String20
	columnName?: string
	
	@ValidatedFieldNullable ()
	@String20
	swimlaneName?: string
}

