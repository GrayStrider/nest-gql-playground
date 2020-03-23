import { Injectable, NotFoundException } from '@nestjs/common'
import { Cat } from '@M/cats/interfaces/cat.interface'
import { isNone } from 'fp-ts/lib/Option'
import { findFirst,  } from 'fp-ts/lib/Array'
import { Predicate } from 'fp-ts/lib/function'
import { CatUpdateInput } from '@M/cats/inputs/cat.update.input'


const byId: (id: number) => Predicate<Cat> =
	(id: number) => ({ id: ID }) => ID === id


@Injectable ()
export class CatsService {
	private readonly cats: Cat[] = []
	
	async create (cat: Cat): Promise<void> {
		this.cats.push (cat)
	}
	
	findAll (): Cat[] {
		return this.cats
	}
	
	findOneById (id: number) {
		const cat = findFirst (byId (id)) (this.cats)
		if (isNone (cat)) throw  new NotFoundException ('cat not found')
		return cat.value
	}
	
	updateById (id: number, catUpdateDto: CatUpdateInput) {
		const cat = findFirst (byId (id)) (this.cats)
		if (isNone (cat)) throw  new NotFoundException ('cat not found')
		// update logic here
		return true
	}
	
	deleteById (id: number) {
		const cat = findFirst (byId (id)) (this.cats)
		if (isNone (cat)) throw  new NotFoundException ('cat not found')
		// delete logic here
		return true
	}
	
}
