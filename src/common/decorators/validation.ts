import { ReturnTypeFuncValue, Field, FieldOptions } from '@nestjs/graphql'
import { composeFieldDecorators, FieldDecorator } from '@qdev/utils-ts'
import { IsOptional, MaxLength, IsNotEmpty, Max, IsInt, Min, ArrayNotEmpty, MinLength, Matches, IsString } from 'class-validator'


export const FieldNullable = (returns?: ReturnTypeFuncValue, options?: FieldOptions) => returns
	? composeFieldDecorators (
		Field (returns_ => returns, { nullable: true, ...options }),
		IsOptional ())
	: composeFieldDecorators (
		Field ({ nullable: true, ...options }),
		IsOptional ())

export const ValidString = (maxLength: number, minLength = 1, each = false) => composeFieldDecorators (
	MaxLength (maxLength, { each }),
	MinLength (minLength),
	IsNotEmpty ({ each }),
	each ? ArrayNotEmpty () : (target, propertyKey) => {}
)

export const ValidNumber = (max: number, min = 0) => composeFieldDecorators (
	IsInt (), Max (max), Min (min)
)

export const StrongPassword = composeFieldDecorators (
	IsString(),
	MinLength (8),
	MaxLength (30),

	Matches(/[a-z]/, {
		message: 'Should contain at least one lower-case letter'
	}) as FieldDecorator,
	Matches(/\d/, {
		message: 'Should contain at least one number'
	}) as FieldDecorator,
	Matches(/[A-Z]/, {
		message: `Should contain at least one upper-case letter`
	}) as FieldDecorator,
	Matches(/[-!@#$%^&*\/\\_`:{}+=~]/, {
		message: `Should contain at least one special character: -!@#$%^&*\/\\_\`:{}+=~`
	}) as FieldDecorator,
	Matches(/^[a-zA-Z\d-!@#$%^&*\/\\_`:{}+=~]+$/, {
		message: 'Only alphanumetic characters and special symbols (-!@#$%^&*\/\\_\`:{}+=~) are allowed'
	}) as FieldDecorator,
)
