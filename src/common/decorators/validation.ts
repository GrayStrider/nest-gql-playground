import { ReturnTypeFuncValue, Field } from '@nestjs/graphql'
import { composeFieldDecorators } from '@qdev/utils-ts'
import { IsOptional, MaxLength, IsNotEmpty } from 'class-validator'

const ValidString = (length: number) => composeFieldDecorators (MaxLength (length), IsNotEmpty ())
export const ValidString20 = ValidString (20)
export const ValidString50 = ValidString (50)
export const ValidString100 = ValidString (100)
export const ValidString500 = ValidString (500)
export const FieldNullable = (returns?: ReturnTypeFuncValue) => returns
	? composeFieldDecorators (Field (returns_ => returns, { nullable: true }), IsOptional ())
	: composeFieldDecorators (Field ({ nullable: true }), IsOptional ())
