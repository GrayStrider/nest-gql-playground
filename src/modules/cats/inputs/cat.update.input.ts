import { IsString, IsInt } from 'class-validator'

export class CatUpdateInput {
	@IsString ()
	readonly name: string
	
	@IsInt ()
	readonly age: number
}
