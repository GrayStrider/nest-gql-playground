import { Injectable } from '@nestjs/common'
import { times, find, append } from 'ramda'
import { chance } from '@qdev/utils-ts'
import v4 from 'uuid/v4'

@Injectable ()
export class UsersService {
	private readonly users: (Express.User & { password: string })[]
	
	constructor () {
		this.users = times ((id) => ({
			id: v4 (),
			name: chance.first (),
			password: chance.string (),
			roles: chance.pickset<Express.Role> (['admin', 'guest', 'user'])
		}), 3)
		
		this.users = append ({
			id: '1',
			name: 'Strider',
			password: '123',
			roles: ['admin']
		}, this.users)
	}
	
	async findOne (username: string) {
		return find (user => user.name === username, this.users)
	}
}

