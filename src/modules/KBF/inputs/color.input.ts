import { InputType, Field } from '@nestjs/graphql'
import { IsNotEmpty, MaxLength, IsOptional, IsBoolean, IsHexColor } from 'class-validator'


@InputType ()
export class NewColorInput {
	@IsNotEmpty ()
	@MaxLength (50)
	@Field ()
	boardName: string
	
	@IsNotEmpty ()
	@MaxLength (20)
	@Field ()
	name: string
	
	@IsOptional()
	@IsNotEmpty ()
	@MaxLength (100)
	@Field ({ nullable: true })
	description?: string
	
	@IsNotEmpty()
	@IsHexColor()
	@Field ()
	value: string
	
	@IsOptional()
	@IsBoolean()
	@Field ({ nullable: true })
	default?: boolean
}
