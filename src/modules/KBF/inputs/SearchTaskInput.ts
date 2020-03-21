import { ArgsType, Field } from '@nestjs/graphql'
import { Max } from 'class-validator'

@ArgsType ()
export class SearchTaskInput {
	
	@Field ({ nullable: true })
	title: string
	
	@Field ({ nullable: true })
	description: string
	
	@Field ({ nullable: true })
	id: string
	
	@Field ({ nullable: true })
	completed: boolean
	
	@Field (returns => [String], { nullable: true })
	tag: string
	
}

