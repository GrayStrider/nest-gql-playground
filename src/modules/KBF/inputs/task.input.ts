import { Field, InputType } from '@nestjs/graphql'
import { MaxLength, IsNotEmpty, IsBoolean } from 'class-validator'
import { FieldNullable, String500, String100, String50, String20 } from '@/common/decorators/validation'

@InputType ()
export class TaskInput {
	@Field ()
	@String50
	boardName: string
	
	@Field ()
	@String100
	title: string
	
	@FieldNullable ()
	@String500
	description?: string
	
	@FieldNullable ([String])
	@MaxLength (20, { each: true })
	@IsNotEmpty ()
	@IsNotEmpty ({ each: true })
	tags?: string[]
	
	@FieldNullable ()
	@IsBoolean ()
	completed?: boolean
	
	@FieldNullable ()
	@String20
	colorName?: string
	
	@FieldNullable ()
	@String20
	columnName?: string
	
	@FieldNullable ()
	@String20
	swimlaneName?: string
	
}

