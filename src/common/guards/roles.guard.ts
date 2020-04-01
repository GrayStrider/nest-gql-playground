import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { intersection, isNonEmpty } from 'fp-ts/lib/Array'
import { eqString, Eq } from 'fp-ts/lib/Eq'
import { flow } from 'fp-ts/lib/function'

export const eqRole: Eq<Express.Role> = eqString
export const hasRole = flow (intersection (eqRole), isNonEmpty)

@Injectable ()
export class RolesGuard implements CanActivate {
	constructor (private readonly reflector: Reflector) {}

	canActivate (context: ExecutionContext): boolean {
		// use SetMetadata or custom decorators to set metadata
		const roles = this.reflector.getAllAndOverride/*getAllAndMerge*/<Express.Role[]> ('roles', [
			context.getHandler (),
			context.getClass ()
		])
		
		if (!roles) {
			return true
		}
		const { user } = context.switchToHttp ().getRequest ()
		
		
		return user && user.roles && hasRole (roles, user.roles)
	}
}

