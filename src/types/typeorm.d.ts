import * as typeorm from 'typeorm'
import { ColumnOptions } from 'typeorm'
import { SimpleColumnType, SpatialColumnType, WithLengthColumnType, WithWidthColumnType, WithPrecisionColumnType } from 'typeorm/driver/types/ColumnTypes'
import { ColumnCommonOptions } from 'typeorm/decorator/options/ColumnCommonOptions'
import { SpatialColumnOptions } from 'typeorm/decorator/options/SpatialColumnOptions'
import { ColumnWithLengthOptions } from 'typeorm/decorator/options/ColumnWithLengthOptions'
import { ColumnWithWidthOptions } from 'typeorm/decorator/options/ColumnWithWidthOptions'
import { ColumnNumericOptions } from 'typeorm/decorator/options/ColumnNumericOptions'
import { ColumnEnumOptions } from 'typeorm/decorator/options/ColumnEnumOptions'
import { ColumnHstoreOptions } from 'typeorm/decorator/options/ColumnHstoreOptions'
import { ColumnEmbeddedOptions } from 'typeorm/decorator/options/ColumnEmbeddedOptions'

declare module 'typeorm' {
	export function Entity(options?: typeorm.EntityOptions): ClassDecorator;
	export function Entity(name?: string, options?: typeorm.EntityOptions): ClassDecorator;
	export function Column(): PropertyDecorator
	/**
	 * Column decorator is used to mark a specific class property as a table column.
	 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
	 */
	export function Column(options: ColumnOptions): PropertyDecorator
	/**
	 * Column decorator is used to mark a specific class property as a table column.
	 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
	 */
	export function Column(type: SimpleColumnType, options?: ColumnCommonOptions): PropertyDecorator
	/**
	 * Column decorator is used to mark a specific class property as a table column.
	 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
	 */
	export function Column(type: SpatialColumnType, options?: ColumnCommonOptions & SpatialColumnOptions): PropertyDecorator
	/**
	 * Column decorator is used to mark a specific class property as a table column.
	 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
	 */
	export function Column(type: WithLengthColumnType, options?: ColumnCommonOptions & ColumnWithLengthOptions): PropertyDecorator
	/**
	 * Column decorator is used to mark a specific class property as a table column.
	 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
	 */
	export function Column(type: WithWidthColumnType, options?: ColumnCommonOptions & ColumnWithWidthOptions): PropertyDecorator
	/**
	 * Column decorator is used to mark a specific class property as a table column.
	 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
	 */
	export function Column(type: WithPrecisionColumnType, options?: ColumnCommonOptions & ColumnNumericOptions): PropertyDecorator
	/**
	 * Column decorator is used to mark a specific class property as a table column.
	 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
	 */
	export function Column(type: "enum", options?: ColumnCommonOptions & ColumnEnumOptions): PropertyDecorator
	/**
	 * Column decorator is used to mark a specific class property as a table column.
	 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
	 */
	export function Column(type: "simple-enum", options?: ColumnCommonOptions & ColumnEnumOptions): PropertyDecorator
	/**
	 * Column decorator is used to mark a specific class property as a table column.
	 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
	 */
	export function Column(type: "set", options?: ColumnCommonOptions & ColumnEnumOptions): PropertyDecorator
	/**
	 * Column decorator is used to mark a specific class property as a table column.
	 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
	 */
	export function Column(type: "hstore", options?: ColumnCommonOptions & ColumnHstoreOptions): PropertyDecorator
	/**
	 * Column decorator is used to mark a specific class property as a table column.
	 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
	 *
	 * Property in entity can be marked as Embedded, and on persist all columns from the embedded are mapped to the
	 * single table of the entity where Embedded is used. And on hydration all columns which supposed to be in the
	 * embedded will be mapped to it from the single table.
	 */
	export function Column(type: (type?: any) => Function, options?: ColumnEmbeddedOptions): PropertyDecorator
}
