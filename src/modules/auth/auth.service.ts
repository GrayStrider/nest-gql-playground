import { Injectable } from '@nestjs/common'
import { UsersService } from '@M/users/users.service'

@Injectable ()
export class AuthService {
	constructor (private usersService: UsersService) {}
}
