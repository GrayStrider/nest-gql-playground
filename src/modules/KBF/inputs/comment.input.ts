import { Field, InputType } from '@nestjs/graphql'
import { IsUUID } from 'class-validator'
import { ValidString } from '@/common/decorators/validation'
import { textLength } from '@M/KBF/entity/Comment'

@InputType ()
export class CommentInput {
	@Field ()
	@IsUUID ()
	taskID: string
	
	@Field ()
	@IsUUID ()
	userID: string
	
	@Field ()
	@ValidString (textLength)
	text: string
}
