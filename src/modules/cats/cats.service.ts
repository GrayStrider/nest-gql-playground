import { Injectable, NotFoundException, Scope } from '@nestjs/common'
import { Cat } from '@M/cats/interfaces/cat.interface'
import { isNone } from 'fp-ts/lib/Option'
import { findFirst, findIndex } from 'fp-ts/lib/Array'
import { CatUpdateInput } from '@M/cats/inputs/cat.update.input'
import { CatCreateInput } from '@M/cats/inputs/cat.create.input'
import { mergeDeepLeft } from 'ramda'


const byId = (id: number) =>
	({ id: ID }: Cat) => ID === id


/**
 * SINGLETON
 * A single instance of the provider is shared across the entire application. The instance lifetime is tied
 * directly to the application lifecycle. Once the application has bootstrapped, all singleton providers have been
 * instantiated. Singleton scope is used by default.
 *
 * REQUEST
 * A new instance of the provider is created exclusively for each incoming request. The instance is garbage-collected
 * after the request has completed processing.
 *
 * TRANSIENT
 * Transient providers are not shared across consumers. Each consumer that injects a transient provider will
 * receive a new, dedicated instance.
 */
@Injectable ({ scope: Scope.DEFAULT })
export class CatsService {
	private readonly cats: Cat[] = []
	
	async create (cat: CatCreateInput) {
		this.cats.push (mergeDeepLeft (
			cat,
			{
				id: this.cats.length === 0
					? 1
					: this.cats.length + 1
			}
		))
	}
	
	findOneById (id: number) {
		const cat = findFirst ((cat: Cat) => cat.id === id) (this.cats)
		if (isNone (cat)) throw  new NotFoundException ('cat not found')
		return cat.value
	}
	
	// findAll (): Cat[] {
	// 	if (isEmpty (this.cats)) throw new NotFoundException ('no cats found')
	// 	return this.cats
	// }
	
	replace (id: number, catUpdateDto: CatUpdateInput) {
		const index = this.lookup (id)
		const cat = this.cats[index]
		this.cats[index] = mergeDeepLeft (cat, catUpdateDto)
	}
	
	update (id: number, catUpdateDto: Partial<CatUpdateInput>) {
		const index = this.lookup (id)
		const cat = this.cats[index]
		this.cats[index] = mergeDeepLeft (cat, catUpdateDto)
	}
	
	private lookup (id: number) {
		const index = findIndex (byId (id)) (this.cats)
		if (isNone (index)) throw  new NotFoundException ('cat not found')
		return index.value
	}
	
	
	// deleteById (id: number) {
	// 	const cat = findFirst (byId (id)) (this.cats)
	// 	if (isNone (cat)) throw  new NotFoundException ('cat not found')
	// 	// delete logic here
	// 	return true
	// }
	
}
