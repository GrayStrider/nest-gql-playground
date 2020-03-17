import { Injectable } from '@nestjs/common'
import { Cat } from '@M/cats/interfaces/cat.interface'
import { Option } from 'fp-ts/lib/Option'
import { findFirst } from 'fp-ts/lib/Array'
import { Predicate } from 'fp-ts/lib/function'


const byId: (id: number) => Predicate<Cat> =
	(id: number) => ({ id: ID }) => ID === id

@Injectable ()
export class CatsService {
	private readonly cats: Cat[] = []
	
	create (cat: Cat) {
		this.cats.push (cat)
	}
	
	findAll (): Cat[] {
		return this.cats
	}
	
	findOneById (id: number): Option<Cat> {
		return findFirst<Cat> (byId (id)) (this.cats)
	}
	
}
