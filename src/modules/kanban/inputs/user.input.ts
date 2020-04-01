import { InputType, Field } from '@nestjs/graphql'
import { ValidString, StrongPassword } from '@/common/decorators/validation'
import { nameLength } from '@M/kanban/entity/User'
import { IsEmail } from 'class-validator'

@InputType()
export class RegisterWIthEmailInput {
	@Field()
	@IsEmail()
	email: string
	
	@Field ()
	@StrongPassword
	password: string
}

@InputType ()
export class UserInput extends RegisterWIthEmailInput {
	@Field ()
	@ValidString (nameLength, 4)
	name: string
	
	@Field ()
	confirmPassword: string
	
}

@InputType()
export class LoginWithEmailInput implements RegisterWIthEmailInput {
	@Field()
	@IsEmail()
	email: string
	
	@Field ()
	@ValidString(100)
	password: string
}
