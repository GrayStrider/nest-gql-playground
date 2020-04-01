import { InputType, Field } from '@nestjs/graphql'
import { ValidString, StrongPassword } from '@/common/decorators/validation'
import { nameLength } from '@M/KBF/entity/User'
import { IsEmail } from 'class-validator'

@InputType()
export class LoginWithEmailInput {
	@Field()
	@IsEmail()
	email: string
	
	@Field ()
	@StrongPassword
	password: string
}

@InputType ()
export class UserInput extends LoginWithEmailInput {
	@Field ()
	@ValidString (nameLength, 4)
	name: string
	
	@Field ()
	confirmPassword: string
	
}

