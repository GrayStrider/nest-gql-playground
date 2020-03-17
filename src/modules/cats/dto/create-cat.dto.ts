import { IsInt, IsString, IsUUID } from 'class-validator'

export class CreateCatDto {
	id: number
	
	@IsString ()
	readonly name: string
	
	@IsInt ()
	readonly age: number
	
	@IsString ()
	readonly breed: string
}
