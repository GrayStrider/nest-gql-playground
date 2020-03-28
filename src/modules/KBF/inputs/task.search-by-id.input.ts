import { ArgsType } from '@nestjs/graphql'
import { IsNotEmpty, IsUUID } from 'class-validator'
import { ValidatedFieldNullable } from '@/common/decorators/validation'

@ArgsType ()
export class TaskSearchInputByID {
	@ValidatedFieldNullable ()
	@IsUUID ()
	id: string
}

