import { InputType, Field } from '@nestjs/graphql'
import { ValidString } from '@/common/decorators/validation'
import { nameLength } from '@M/KBF/entity/User'

@InputType()
export class UserInput {
	@Field()
	@ValidString(nameLength)
	name: string
	
	
}
