import { IsInt, IsString, IsUUID } from 'class-validator'


/**
 * DTO (data transfer object) is used to
 * transfer some data between processes.
 *
 * Similar to type-graphql _input_ class.
 */
export class CreateCatDto {
	id: number
	
	@IsString ()
	readonly name: string
	
	@IsInt ()
	readonly age: number
	
	@IsString ()
	readonly breed: string
}
