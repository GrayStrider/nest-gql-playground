import { ReturnTypeFuncValue, Field, FieldOptions } from '@nestjs/graphql'
import { composeFieldDecorators } from '@qdev/utils-ts'
import { IsOptional, MaxLength, IsNotEmpty, Max, IsInt, Min, ArrayNotEmpty } from 'class-validator'


export const FieldNullable = (returns?: ReturnTypeFuncValue, options?: FieldOptions) => returns
	? composeFieldDecorators (
		Field (returns_ => returns, { nullable: true, ...options }),
		IsOptional ())
	: composeFieldDecorators (
		Field ({ nullable: true, ...options }),
		IsOptional ())

export const ValidString = (maxLength: number, each = false) => composeFieldDecorators (
	MaxLength (maxLength, { each }),
	IsNotEmpty ({ each }),
	each ? ArrayNotEmpty () : (target, propertyKey) => {}
)

export const ValidNumber = (max: number, min = 0) => composeFieldDecorators (
	IsInt (), Max (max), Min (min)
)
