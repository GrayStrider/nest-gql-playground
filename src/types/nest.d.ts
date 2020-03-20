import { Type } from '@nestjs/common/interfaces/type.interface'
import { MiddlewareConfigProxy } from '@nestjs/common/interfaces/middleware/middleware-config-proxy.interface'

declare module '@nestjs/common/interfaces/middleware/middleware-config-proxy.interface' {
	export interface MiddlewareConsumer {
		/**
		 * @param  middleware middleware class/function or array of classes/functions
		 * to be attached to the passed routes.
		 *
		 * @returns {MiddlewareConfigProxy}
		 */
		apply (...middleware: (Type<any> | Function)[]): MiddlewareConfigProxy;
		apply (middleware: (Type<any> | Function)[]): MiddlewareConfigProxy;
	}
}
