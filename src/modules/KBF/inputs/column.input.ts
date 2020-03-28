import { InputType, Field } from '@nestjs/graphql'
import { IsNotEmpty, MaxLength, IsOptional, Max } from 'class-validator'

@InputType ()
export class ColumnInput {
	@Field ()
	@IsNotEmpty ()
	@MaxLength (20)
	name: string
	
	@Field ()
	@IsOptional ()
	@Max (500)
	order?: number
	
	@Field ()
	@IsOptional ()
	@Max (500)
	taskLimit?: number
}

@InputType ()
export class AddColumnInput extends ColumnInput {
	@IsNotEmpty ()
	@MaxLength (50)
	@Field ()
	boardName: string
}
