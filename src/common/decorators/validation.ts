import { ReturnTypeFuncValue, Field } from '@nestjs/graphql'
import { composeFieldDecorators } from '@qdev/utils-ts'
import { IsOptional, MaxLength, IsNotEmpty, Matches, Max } from 'class-validator'

export const IsHexString = Matches (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
	{
		message: '$property should be a HEX color string (#FFFFFF)'
	})

const ValidString = (length: number) => composeFieldDecorators (MaxLength (length), IsNotEmpty ())
export const String20 = ValidString (20)
export const String50 = ValidString (50)
export const String100 = ValidString (100)
export const String500 = ValidString (500)
export const FieldNullable = (returns?: ReturnTypeFuncValue) => returns
	? composeFieldDecorators (Field (returns_ => returns, { nullable: true }), IsOptional ())
	: composeFieldDecorators (Field ({ nullable: true }), IsOptional ())

export const Number500 = Max (500)
