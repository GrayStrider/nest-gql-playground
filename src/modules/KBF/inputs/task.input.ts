import { Field, InputType, ReturnTypeFuncValue } from '@nestjs/graphql'
import { MaxLength, IsOptional, IsNotEmpty, IsBoolean } from 'class-validator'
import { composeFieldDecorators } from '@qdev/utils-ts'

const ValidString = (length: number) => composeFieldDecorators (MaxLength (length), IsNotEmpty ())
const ValidString20 = ValidString (20)
const ValidString50 = ValidString (50)
const ValidString100 = ValidString (100)
const ValidString500 = ValidString (500)

const FieldNullable = (returns?: ReturnTypeFuncValue) => returns
	? Field (returns_ => returns, { nullable: true })
	: Field ({ nullable: true })

@InputType ()
export class TaskInput {
	@Field ()
	@ValidString50
	boardName: string
	
	@Field ()
	@ValidString100
	title: string
	
	@FieldNullable ()
	@IsOptional ()
	@ValidString500
	description?: string
	
	@Field (returns => [String], {
		nullable: true
	})
	@IsOptional ()
	@MaxLength (20, { each: true })
	@IsNotEmpty ()
	@IsNotEmpty ({ each: true })
	tags?: string[]
	
	@IsOptional ()
	@IsBoolean ()
	@FieldNullable ()
	completed?: boolean
	
	@FieldNullable ()
	@IsOptional ()
	@ValidString20
	colorName?: string
	
	@FieldNullable ()
	@IsOptional ()
	@ValidString20
	columnName?: string
	
	@FieldNullable ()
	@IsOptional ()
	@ValidString20
	swimlaneName?: string
	
}

