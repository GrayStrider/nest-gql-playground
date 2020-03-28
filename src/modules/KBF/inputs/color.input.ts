import { InputType, Field } from '@nestjs/graphql'
import { IsNotEmpty, MaxLength, IsOptional, IsBoolean, IsHexColor, Matches } from 'class-validator'

const HEXColorRegexp = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/

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
	@Matches(HEXColorRegexp, {
		message: '$property should be a HEX color string (#FFFFFF)'
	})
	@Field ()
	value: string
	
	@IsOptional()
	@IsBoolean()
	@Field ({ nullable: true })
	default?: boolean
}
