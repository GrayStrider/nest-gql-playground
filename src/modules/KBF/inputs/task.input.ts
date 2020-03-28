import { Field, InputType } from '@nestjs/graphql'
import { MaxLength, IsNotEmpty, IsBoolean } from 'class-validator'
import { FieldNullable, ValidString500, ValidString100, ValidString50, ValidString20 } from '@/common/decorators/validation'

@InputType ()
export class TaskInput {
	@Field ()
	@ValidString50
	boardName: string
	
	@Field ()
	@ValidString100
	title: string
	
	@FieldNullable ()
	@ValidString500
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
	@ValidString20
	colorName?: string
	
	@FieldNullable ()
	@ValidString20
	columnName?: string
	
	@FieldNullable ()
	@ValidString20
	swimlaneName?: string
	
}

