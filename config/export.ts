import { isNil } from 'ramda'
import { get } from 'config'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { CustomLogger } from '@M/db/utils/logger'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ValidationPipeOptions } from '@nestjs/common'

process.env.ALLOW_CONFIG_MUTATIONS = 'true'

if (isNil (process.env.NODE_ENV)) throw new Error ('process.env is undefined, aborting')
const { NODE_ENV } = process.env

const PORT: string = get ('PORT')
const HOST: string = get ('HOST')
const POSTGRES_URL: string = process.env.POSTGRES_URL ?? get ('postgres.url')
const POSTRGRES_PORT = Number (process.env.POSTGRES_PORT ?? get ('postgres.port'))
const POSTRGRES_PASSWORD: string = process.env.POSTRGRES_PASSWORD ?? get ('postgres.password')
const POSTRGRES_USERNAME: string = process.env.POSTRGRES_USERNAME ?? get ('postgres.username')
const POSTRGRES_DATABASE: string = process.env.POSTRGRES_DATABASE ?? get ('postgres.database')
const GQL_URL = `http://${HOST}:${PORT}/${process.env.endpoint ?? 'graphql'}`
const SERVER_URL = `http://${HOST}:${PORT}`
const APOLLO_ENGINE_API_KEY: string = process.env.ENGINE_API_KEY ?? get ('apollo.engine')
const JWT_SECRET: string = get('JWT.secret')

export const validatorOptions: ValidationPipeOptions = {
	skipMissingProperties: false,
	forbidUnknownValues: true,
	skipNullProperties: false,
	skipUndefinedProperties: false,
}


const TypeormConfig: TypeOrmModuleOptions = {
	name: 'default',
	type: 'postgres',
	host: POSTGRES_URL,
	port: POSTRGRES_PORT,
	username: POSTRGRES_USERNAME,
	password: POSTRGRES_PASSWORD,
	database: POSTRGRES_DATABASE,
	logger: 'advanced-console',
	logging: ['query', 'error'],
	entities: ['src/**/entity/**/!(*.spec.*|*.test.*)'],
	retryAttempts: 5
}

export {
	TypeormConfig,
	NODE_ENV,
	PORT,
	HOST,
	POSTGRES_URL,
	POSTRGRES_PORT,
	POSTRGRES_PASSWORD,
	POSTRGRES_USERNAME,
	POSTRGRES_DATABASE,
	GQL_URL,
	SERVER_URL,
	APOLLO_ENGINE_API_KEY,
	JWT_SECRET
}
