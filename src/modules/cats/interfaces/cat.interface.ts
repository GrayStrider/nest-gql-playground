import { IsString, MaxLength, MinLength, Min, Max, IsInt } from 'class-validator'

export class Cat {
	@Min(1)
	id: number
	
	@IsString ()
	@MaxLength (100)
	@MinLength (1)
	readonly name: string
	
	@Min (0)
	@Max (30)
	readonly age: number
	
	@IsString ()
	@MaxLength (100)
	@MinLength (1)
	readonly breed: string
}
