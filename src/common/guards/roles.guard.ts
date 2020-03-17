import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Role } from '@/common/roles.type'
import { intersection, isEmpty } from 'fp-ts/lib/Array'
import { eqString, Eq } from 'fp-ts/lib/Eq'
import { complement, all } from 'ramda'
import { pipe } from 'fp-ts/lib/pipeable'
import { flow } from 'fp-ts/lib/function'

const eqRole: Eq<Role> = eqString
export const hasRole = flow (intersection (eqRole), complement (isEmpty))

@Injectable ()
export class RolesGuard implements CanActivate {
	constructor (private readonly reflector: Reflector) {}
	
	canActivate (context: ExecutionContext): boolean {
		const roles = this.reflector.get<Role[]> ('roles', context.getHandler ())
		if (!roles) {
			return true
		}
		const { user } = context.switchToHttp ().getRequest ()
		
		
		return user && user.roles && hasRole (roles, user.roles)
	}
}

