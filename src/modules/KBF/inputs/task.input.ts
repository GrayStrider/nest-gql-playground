import { Field, InputType } from '@nestjs/graphql'
import { MaxLength, IsNotEmpty, IsBoolean, ArrayNotEmpty, Max, Min, IsUUID, IsDateString } from 'class-validator'
import { FieldNullable, ValidString, ValidNumber } from '@/common/decorators/validation'
import * as Tag from '@M/KBF/entity/Tag'
import * as Board from '@M/KBF/entity/Board'
import * as Task from '@M/KBF/entity/Task'
import { Year, maxOrderTasksInColumn } from '@M/KBF/entity/Task'
import * as Color from '@M/KBF/entity/Color'
import * as Swimlane from '@M/KBF/entity/Swimlane'
import * as Column from '@M/KBF/entity/TColumn'
import { SubbtaskInput } from '@M/KBF/inputs/subbtask.input'

@InputType()
export class TaskSearchInput {
	@FieldNullable([String])
	@ValidString (Board.nameLength, 1, true)
	boardNames?: string[]
}

@InputType ()
export class TaskInput {
	@Field ()
	@ValidString (Board.nameLength)
	boardName: string
	
	@FieldNullable ()
	@ValidString (Swimlane.nameLength)
	swimlaneName?: string
	
	@FieldNullable ()
	@ValidString (Column.nameLength)
	columnName?: string
	
	@FieldNullable ()
	@IsBoolean ()
	completed?: boolean
	
	@Field ()
	@ValidString (Task.titleLength)
	title: string
	
	@FieldNullable ()
	@ValidString (Task.descriptionLength)
	description?: string
	
	@FieldNullable ()
	@ValidString (Color.nameLength)
	colorName?: string
	
	@FieldNullable ([String])
	@ArrayNotEmpty ()
	@MaxLength (Tag.nameLength, { each: true })
	@IsNotEmpty ({ each: true })
	tagNames?: string[]
	
	@FieldNullable ()
	@ValidNumber (maxOrderTasksInColumn)
	position?: number
	
	@FieldNullable ()
	@IsUUID ()
	responsibleUserID?: string
	
	@FieldNullable ([String])
	@IsUUID (undefined, { each: true })
	collaboratorsIDs?: string[]
	
	@FieldNullable ([SubbtaskInput])
	subtasks?: SubbtaskInput[]
	
	@FieldNullable ([Date])
	@ArrayNotEmpty ()
	@IsNotEmpty ({ each: true })
	@IsDateString ({ each: true })
	dates?: Date[]
	
	@FieldNullable ()
	@Max (24 * 60 * 60, {
		message: 'Cannot add more than 24h at a time'
	})
	@Min (0)
	totalSecondsSpent?: number
	
	@FieldNullable ()
	@ValidNumber (Year)
	totalSecondsEstimate?: number
}

