import { IsString, IsInt, MaxLength, MinLength, Min, Max } from 'class-validator'

export class CatUpdateInput {
	@IsString ()
	@MaxLength (100)
	@MinLength (1)
	readonly name: string
	
	@Min (0)
	@Max (30)
	readonly age: number
}
