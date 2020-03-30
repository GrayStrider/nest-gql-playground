import { Resolver, Query, Args } from '@nestjs/graphql'
import { Tag } from '@M/KBF/entity/Tag'
import { TagInput } from '@M/KBF/inputs/tag.input'

@Resolver ()
export class TagResolver {
	@Query (returns => [Tag])
	async tags (@Args ('searchBy', { nullable: true })
		            {}: TagInput): Promise<Tag[]> {
		return Tag.find ()
	}
}
