import { MaxLength, Min, Max, IsNotEmpty, IsOptional } from 'class-validator'

export class CatUpdateInput {
	@MaxLength (100)
	@IsNotEmpty ()
	name: string
	
	@Min (0)
	@Max (30)
	age: number
}


export class CatPatchInput {
	@MaxLength (100)
	@IsNotEmpty ()
	@IsOptional ()
	name?: string
	
	@Min (0)
	@Max (30)
	@IsOptional ()
	age?: number
}

export class CatCreateInput extends CatUpdateInput {
	@MaxLength (100)
	@IsNotEmpty ()
	readonly breed: string
}

export class Cat extends CatCreateInput {
	@Min (1)
	readonly id: number
}
