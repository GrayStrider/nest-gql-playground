import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform, Type } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import { isNonEmpty } from 'fp-ts/lib/Array'

@Injectable ()
/**
 * Has built-in implementation
 */
export class ValidationPipe_ implements PipeTransform<any> {
	async transform (value: any, { metatype }: ArgumentMetadata) {
		if (!metatype || !this.toValidate (metatype)) {
			return value
		}
		const object = plainToClass (metatype, value)
		const errors = await validate (object)
		if (isNonEmpty(errors)) {
			throw new BadRequestException (errors)
		}
		return value
	}
	
	private toValidate (metatype: Type<any>): boolean {
		const types = [String, Boolean, Number, Array, Object]
		return !types.find (type => metatype === type)
	}
}
