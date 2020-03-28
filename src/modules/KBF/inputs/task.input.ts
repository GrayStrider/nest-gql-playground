import { Field, InputType, ReturnTypeFuncValue } from '@nestjs/graphql'
import { MaxLength, IsOptional, IsNotEmpty, IsBoolean } from 'class-validator'
import { composeFieldDecorators } from '@qdev/utils-ts'

const ValidString = (length: number) => composeFieldDecorators (MaxLength (length), IsNotEmpty ())
const ValidString20 = ValidString (20)
const ValidString50 = ValidString (50)
const ValidString100 = ValidString (100)
const ValidString500 = ValidString (500)

const FieldNullable = (returns?: ReturnTypeFuncValue) => returns
	? composeFieldDecorators(Field (returns_ => returns, { nullable: true }), IsOptional())
	: composeFieldDecorators(Field ( { nullable: true }), IsOptional())

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

