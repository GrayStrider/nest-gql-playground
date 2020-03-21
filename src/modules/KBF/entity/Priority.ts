import { registerEnumType } from '@nestjs/graphql'

export enum Priority {
	HIGH = 'HIGH',
	MEDIUM = 'MEDIUM',
	LOW = 'LOW',
	NONE = 'NONE'
}

registerEnumType (Priority, {
	name: 'Priority'
})
