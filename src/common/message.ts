import chalk from 'chalk'

const { red, green } = chalk
const good = [200, 201]
export const formattedMessage = (status: string, url: string, method: string, startTime: number) =>
	`${good.includes (Number (status)) ? green (status) : red (status)}: ${method} ${url} ${Date.now () - startTime}ms`
