import { Resolver, Query } from '@nestjs/graphql'
import { Tag } from '@M/KBF/entity/Tag'

@Resolver ()
export class TagResolver {
	@Query (returns => [Tag])
	async tags (): Promise<Tag[]> {
		return Tag.find ()
	}
}
