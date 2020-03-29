import { ReturnTypeFuncValue, Field } from '@nestjs/graphql'
import { composeFieldDecorators } from '@qdev/utils-ts'
import { IsOptional, MaxLength, IsNotEmpty, Max, IsInt } from 'class-validator'


export const FieldNullable = (returns?: ReturnTypeFuncValue) => returns
	? composeFieldDecorators (Field (returns_ => returns, { nullable: true }), IsOptional ())
	: composeFieldDecorators (Field ({ nullable: true }), IsOptional ())

const ValidString = (maxLength: number) => composeFieldDecorators (
	MaxLength (maxLength), IsNotEmpty ()
)

export const String20 = ValidString (20)
export const String50 = ValidString (50)
export const String100 = ValidString (100)
export const String5K = ValidString (5000)

const ValidNumber = (max: number) => composeFieldDecorators (
	IsInt (), Max (max)
)
export const Number500 = ValidNumber (500)
