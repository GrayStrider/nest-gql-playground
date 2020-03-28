import { Field, ArgsType } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator'

@ArgsType ()
export class TaskSearchInputByID {
	@IsOptional()
	@IsNotEmpty()
	@IsUUID()
	@Field ({ nullable: true })
	id: string
}

