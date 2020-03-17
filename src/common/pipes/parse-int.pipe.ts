import { BadRequestException, PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common'

/**
 * Has built-in implementation
 */
@Injectable ()
export class ParseIntPipe_ implements PipeTransform<string> {
	async transform (value: string, metadata: ArgumentMetadata) {
		const val = parseInt (value, 10)
		if (isNaN (val)) {
			throw new BadRequestException ('Validation failed')
		}
		return val
	}
}
