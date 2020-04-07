import { Column, ManyToMany, Unique } from 'typeorm'
import { Field } from '@nestjs/graphql'
import { Task } from '@M/kanban/entity/Task'
import { EntityObject } from '@/common/decorators/entity-object.decorator'
import { boardMember } from '@M/kanban/entity/_BoardMember'

export const nameLength = 20
export const descriptionLength = 100

@EntityObject
@Unique (['name', 'board'])
export class Tag extends boardMember ('tags') {
	
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

