import { Injectable, NotFoundException } from '@nestjs/common'
import { Cat } from '@M/cats/interfaces/cat.interface'
import { isNone } from 'fp-ts/lib/Option'
import { findFirst, isEmpty } from 'fp-ts/lib/Array'
import { CatUpdateInput } from '@M/cats/inputs/cat.update.input'


const byId = (id: number) =>
	({ id: ID }: Cat) => ID === id


@Injectable ()
export class CatsService {
	private readonly cats: Cat[] = []
	
	async create (cat: Cat): Promise<void> {
		this.cats.push (cat)
	}
	
	findAll (): Cat[] {
		if (isEmpty (this.cats)) throw new NotFoundException ('no cats found')
		return this.cats
	}
	
	findOneById (id: number) {
		const cat = findFirst ((cat: Cat) => cat.id === id) (this.cats)
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
