import { ClassType, Field, Int, ObjectType } from 'type-graphql'
import { AnyConstructor } from 'tsdef'

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
