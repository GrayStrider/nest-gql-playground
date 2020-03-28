import { InputType, Field } from '@nestjs/graphql'
import { String20, FieldNullable, Number500, String50 } from '@/common/decorators/validation'

@InputType ()
export class ColumnInput {
	@Field ()
	@String20
	name: string
	
	@FieldNullable ()
	@Number500
	order?: number
	
	@FieldNullable ()
	@Number500
	taskLimit?: number
}

@InputType ()
export class AddColumnInput extends ColumnInput {
	@Field ()
	@String50
	boardName: string
}
