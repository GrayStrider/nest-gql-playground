import { Column, ManyToMany } from 'typeorm'
import { Field } from '@nestjs/graphql'
import { Task } from '@M/KBF/entity/Task'
import { Base } from '@M/KBF/entity/_Base'
import { EntityObject } from '@/common/decorators'

export const nameLength = 20
export const descriptionLength = 100

@EntityObject
export class Tag extends Base {
	@Column ({ length: nameLength })
	@Field ()
	name: string
	
	@Column ({
		length: descriptionLength,
		nullable: true
	})
	@Field ({ nullable: true })
	description?: string
	
	@Field ()
	@Column ({ type: 'bool', default: false })
	pinned: boolean
	
	@ManyToMany (type => Task, task => task.tags)
	tasks: Task[]
}

