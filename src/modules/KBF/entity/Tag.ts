import { Column, ManyToMany, PrimaryColumn } from 'typeorm'
import { Field } from '@nestjs/graphql'
import { Task } from '@M/KBF/entity/Task'
import { Base } from '@M/KBF/entity/_Base'
import { EntityObject } from '@/common/decorators'


@EntityObject
export class Tag extends Base {
	@Column ()
	@Field ()
	name: string
	
	@Field ()
	@Column ({ type: 'bool', default: false })
	pinned: boolean
	
	@ManyToMany (type => Task, task => task.tags)
	tasks: Task[]
}

