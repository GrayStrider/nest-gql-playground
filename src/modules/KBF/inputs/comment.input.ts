import { Field, InputType } from '@nestjs/graphql'
import { CreateDateColumn } from 'typeorm'
import { IsUUID } from 'class-validator'
import { String5K } from '@/common/decorators/validation'

@InputType()
export class CommentInput {
	@Field ()
	@IsUUID ()
	taskID: string
	
	@Field ()
	@IsUUID ()
	authorID: string
	
	@Field ()
	@String5K
	text: string
}
