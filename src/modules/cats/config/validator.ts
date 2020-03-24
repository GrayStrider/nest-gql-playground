import { ValidationPipeOptions } from '@nestjs/common'

export const validatorOptions: ValidationPipeOptions = {
	skipMissingProperties: false,
	forbidUnknownValues: true,
	skipNullProperties: false,
	skipUndefinedProperties: false,
}
