import * as typeorm from 'typeorm'

declare module 'typeorm' {
	export function Entity(options?: typeorm.EntityOptions): ClassDecorator;
	export function Entity(name?: string, options?: typeorm.EntityOptions): ClassDecorator;
}
