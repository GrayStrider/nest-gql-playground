import { IsString, MaxLength, MinLength, Min, Max } from 'class-validator'

export class CatUpdateInput {
	@IsString ()
	@MaxLength (100)
	@MinLength (1)
	name: string
	
	@Min (0)
	@Max (30)
	age: number
}

export class CatCreateInput extends CatUpdateInput {
	
	@IsString ()
	@MaxLength (100)
	@MinLength (1)
	readonly breed: string
}

export class Cat extends CatCreateInput {
	@Min(1)
	readonly id: number
}
