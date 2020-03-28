import { ReturnTypeFuncValue, Field } from '@nestjs/graphql'
import { composeFieldDecorators } from '@qdev/utils-ts'
import { IsOptional, MaxLength, IsNotEmpty, Max } from 'class-validator'
import { Column } from 'typeorm'


export const ValidatedFieldNullable = (returns?: ReturnTypeFuncValue) => returns
	? composeFieldDecorators (Field (returns_ => returns, { nullable: true }), IsOptional ())
	: composeFieldDecorators (Field ({ nullable: true }), IsOptional ())

export const ColumnFieldNullable = (returns?: ReturnTypeFuncValue) => returns
	? composeFieldDecorators (Field (returns_ => returns, { nullable: true }), Column ({ nullable: true }))
	: composeFieldDecorators (Field ({ nullable: true }), Column ({ nullable: true }))

export const ColumnField =
	composeFieldDecorators (Field (), Column ())


const ValidString = (maxLength: number) => composeFieldDecorators (MaxLength (maxLength), IsNotEmpty ())

export const String20 = ValidString (20)
export const String50 = ValidString (50)
export const String100 = ValidString (100)
export const String5K = ValidString (5000)

export const Number500 = Max (500)
