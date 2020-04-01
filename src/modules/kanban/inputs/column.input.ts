import { InputType, Field } from '@nestjs/graphql'
import { FieldNullable, ValidString, ValidNumber } from '@/common/decorators/validation'
import { nameLength, maxOrder, taskLimit } from '@M/kanban/entity/TColumn'
import * as Board from '@M/kanban/entity/Board'
import { IsUUID } from 'class-validator'

@InputType ()
export class ColumnInput {
	@Field ()
	@ValidString (nameLength)
	name: string
	
	@FieldNullable ([String])
	@IsUUID (undefined, { each: true })
	tasksIDs?: string[]
	
	@FieldNullable ()
	@ValidNumber (maxOrder)
	order?: number
	
	@FieldNullable ()
	@ValidNumber (taskLimit)
	taskLimit?: number
}

@InputType ()
export class AddColumnInput extends ColumnInput {
	@Field ()
	@ValidString (Board.nameLength)
	boardName: string
}
