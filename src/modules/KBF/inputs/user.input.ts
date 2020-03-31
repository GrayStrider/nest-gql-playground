import { InputType, Field } from '@nestjs/graphql'
import { ValidString, StrongPassword } from '@/common/decorators/validation'
import { nameLength } from '@M/KBF/entity/User'

@InputType ()
export class UserInput {
	@Field ()
	@ValidString (nameLength, 4)
	name: string
	
	@Field ()
	@StrongPassword
	password: string
	
	@Field ()
	confirmPassword: string
	
}
