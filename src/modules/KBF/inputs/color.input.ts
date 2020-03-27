import { InputType, Field } from '@nestjs/graphql'

@InputType ()
export class NewColorInput {
	@Field ()
	boardName: string
	
	@Field ()
	name: string
	
	@Field ({ nullable: true })
	description?: string
	
	@Field ()
	value: string
	
	@Field ({ nullable: true })
	default?: boolean
}
