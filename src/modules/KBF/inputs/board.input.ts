import { ArgsType, Field, Int } from '@nestjs/graphql'
import { IsNotEmpty, MaxLength, IsOptional } from 'class-validator'
import { ColumnInput } from '@M/KBF/inputs/column.input'

@ArgsType ()
export class FindBoardInput {
	@IsNotEmpty ()
	@MaxLength (50)
	@Field ()
	name: string
}

@ArgsType ()
export class AddBoardInput {
	@IsNotEmpty ()
	@MaxLength (50)
	@Field ()
	name: string
	
	@IsOptional ()
	@Field (returns => [ColumnInput], { nullable: true })
	columnsParams?: ColumnInput[]
	
	
	@IsNotEmpty ({ each: true })
	@MaxLength (20, { each: true })
	@IsOptional ()
	@Field (returns => [String], { nullable: true })
	swimlanesParams?: string[]
}
