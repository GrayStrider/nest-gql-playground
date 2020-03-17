import { IsString, IsInt } from 'class-validator'

export class CatUpdateDto {
	@IsString ()
	readonly name: string
	
	@IsInt ()
	readonly age: number
}
