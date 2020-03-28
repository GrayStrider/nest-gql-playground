import { ArgsType } from '@nestjs/graphql'
import { IsNotEmpty, IsUUID } from 'class-validator'
import { FieldNullable } from '@/common/decorators/validation'

@ArgsType ()
export class SearchByIDInput {
	@FieldNullable ()
	@IsUUID ()
	id: string
}

