import { sig } from '@qdev/utils-ts'
import chalk from 'chalk'

const { red, green } = chalk

export const log = (status: number, url: string, method: string, startTime: number) =>
	`${status === 200 ? green (status) : red (status)}: ${method} ${url} ${Date.now () - startTime}ms`

