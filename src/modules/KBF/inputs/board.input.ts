import { ArgsType, Field, Int } from '@nestjs/graphql'
import { IsNotEmpty, MaxLength, IsOptional } from 'class-validator'

@ArgsType ()
export class BoardInput {
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
	@Field (returns => [[String, Int, Int]], { nullable: true })
	columnsParams?: [string, number][]
	
	
	@IsNotEmpty ({ each: true })
	@MaxLength (20, { each: true })
	@IsOptional ()
	@Field (returns => [String], { nullable: true })
	swimlanesParams?: string[]
}
