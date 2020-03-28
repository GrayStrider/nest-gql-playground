import { ArgsType, Field, Int, InputType } from '@nestjs/graphql'
import { IsNotEmpty, MaxLength, IsOptional, ArrayNotEmpty } from 'class-validator'
import { ColumnInput } from '@M/KBF/inputs/column.input'

@ArgsType ()
export class FindBoardInput {
	@IsNotEmpty ()
	@MaxLength (50)
	@Field ()
	name: string
}

@InputType ()
export class AddBoardInput {
	@IsNotEmpty ()
	@MaxLength (50)
	@Field ()
	name: string
	
	@IsOptional ()
	@Field (returns => [ColumnInput], { nullable: true })
	columnsParams?: ColumnInput[]
	
	
	@ArrayNotEmpty()
	@IsNotEmpty ({ each: true })
	@MaxLength (20, { each: true })
	@IsOptional ()
	@Field (returns => [String], { nullable: true })
	swimlaneNames?: string[]
}
