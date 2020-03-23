import { sig } from '@qdev/utils-ts'
import chalk from 'chalk'
import { elem } from 'fp-ts/lib/Array'
import { eqNumber } from 'fp-ts/lib/Eq'

const { red, green } = chalk
const good = [200, 201]
export const log = (status: string, url: string, method: string, startTime: number) =>
	`${elem(eqNumber)(Number (status), good) ? green (status) : red (status)}: ${method} ${url} ${Date.now () - startTime}ms`

