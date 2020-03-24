import { IsInt, IsString, IsUUID, MaxLength, MinLength, Min, Max } from 'class-validator'


/**
 * DTO (data transfer object) is used to
 * transfer some data between processes.
 *
 * Similar to type-graphql _input_ class.
 */
export class CatCreateInput {
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
