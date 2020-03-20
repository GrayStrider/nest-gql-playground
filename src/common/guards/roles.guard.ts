import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { intersection, isNonEmpty } from 'fp-ts/lib/Array'
import { eqString, Eq } from 'fp-ts/lib/Eq'
import { flow } from 'fp-ts/lib/function'
import { sig } from '@qdev/utils-ts'
import { CatsController } from '@M/cats/cats.controller'

export const eqRole: Eq<Express.Role> = eqString
export const hasRole = flow (intersection (eqRole), isNonEmpty)

@Injectable ()
export class RolesGuard implements CanActivate {
	constructor (private readonly reflector: Reflector) {}
	
	/**
	 * @param context
	 * ExecutionContext extends ArgumentsHost, providing additional details about the current execution process.
	 *
	 */
	canActivate (context: ExecutionContext): boolean {
		/**
		 * @see CatsController
		 * https://docs.nestjs.com/fundamentals/execution-context
		 */
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

