import { IsInt, Min, IsString, MaxLength, MinLength, Max } from 'class-validator'


export class Cat {
	id: number
	readonly name: string
	readonly age: number
	readonly breed: string
}
