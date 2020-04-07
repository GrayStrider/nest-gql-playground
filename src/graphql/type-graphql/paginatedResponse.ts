import { AnyConstructor } from 'tsdef'
import { ObjectType, Field, Int } from '@nestjs/graphql'
import { ClassType } from 'class-transformer/ClassTransformer'

function PaginatedResponse<TItem> (itemClass: ClassType<TItem>) {
	
	@ObjectType (`Paginated${itemClass.name}Response`, { isAbstract: true })
	abstract class PaginatedResponseClass {
		
		@Field (type => [itemClass])
		items: TItem[]
		
		@Field (type => Int)
		total: number
		
		@Field ()
		hasMore: boolean
		
	}
	
	return PaginatedResponseClass as AnyConstructor
	
}
