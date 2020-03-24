import { Injectable, NotFoundException, Scope, BadRequestException } from '@nestjs/common'
import { Cat } from '@M/cats/interfaces/cat.interface'
import { isNone } from 'fp-ts/lib/Option'
import { findFirst, findIndex, isEmpty, isNonEmpty } from 'fp-ts/lib/Array'
import { CatUpdateInput } from '@M/cats/inputs/cat.update.input'
import { CatCreateInput } from '@M/cats/inputs/cat.create.input'
import { mergeDeepLeft } from 'ramda'
import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { AnyClass } from 'tsdef'
import { validatorOptions } from '@M/cats/config/validator'

const byId = (id: number) =>
	({ id: ID }: Cat) => ID === id

const valClass = async (obj: object, cls: AnyClass) => {
	const err = await validate (plainToClass (cls, obj), validatorOptions)
	if (isNonEmpty (err)) throw new BadRequestException (err)
}

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
	
	async create (cat: CatCreateInput | CatCreateInput[]) {
		const add = (cat: CatCreateInput) =>
			this.cats.push (mergeDeepLeft (
				cat,
				{
					id: isEmpty (this.cats)
						? 1
						: this.cats.length + 1
				}
			))
		if (Array.isArray (cat)) for (const c of cat) {
			await valClass (c, CatCreateInput)
			add (c)
		}
		else {
			await valClass (cat, CatCreateInput)
			add (cat)
		}
	}
	
	one (id: number) {
		const cat = findFirst ((cat: Cat) => cat.id === id) (this.cats)
		if (isNone (cat)) throw  new NotFoundException ('cat not found')
		return cat.value
	}
	
	all () {
		return this.cats
	}
	
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
