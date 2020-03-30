import { ReturnTypeFuncValue, Field } from '@nestjs/graphql'
import { composeFieldDecorators } from '@qdev/utils-ts'
import { IsOptional, MaxLength, IsNotEmpty, Max, IsInt, Min } from 'class-validator'


export const FieldNullable = (returns?: ReturnTypeFuncValue) => returns
	? composeFieldDecorators (
		Field (returns_ => returns, { nullable: true }),
		IsOptional ())
	: composeFieldDecorators (
		Field ({ nullable: true }),
		IsOptional ())

export const ValidString = (maxLength: number) => composeFieldDecorators (
	MaxLength (maxLength), IsNotEmpty ()
)

export const ValidNumber = (max: number, min = 0) => composeFieldDecorators (
	IsInt (), Max (max), Min (min)
)
