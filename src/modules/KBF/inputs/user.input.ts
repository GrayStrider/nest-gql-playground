import { InputType, Field } from '@nestjs/graphql'
import { ValidString, FieldNullable, StrongPassword } from '@/common/decorators/validation'
import { nameLength } from '@M/KBF/entity/User'
import { MaxLength, MinLength, IsString } from 'class-validator'

@InputType()
export class UserInput {
	@Field()
	@ValidString(nameLength, 4)
	name: string
	
	@FieldNullable()
	@StrongPassword
	password?: string
	
	@FieldNullable()
	@StrongPassword
	confirmPassword?: string
	
}
