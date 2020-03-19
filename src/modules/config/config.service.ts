import { Inject, Injectable } from '@nestjs/common'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { ConfigOptions, EnvConfig } from './interfaces'
import { Tokens } from '@/common/constants'

@Injectable ()
export class ConfigService {
	private readonly envConfig: EnvConfig
	
	constructor (@Inject (Tokens.CONFIG_OPTIONS) options: ConfigOptions) {
		const filePath = `${process.env.NODE_ENV || 'development'}.env`
		const envFile = path.resolve (__dirname, '../../', options.folder, filePath)
		this.envConfig = dotenv.parse (fs.readFileSync (envFile))
	}
	
	get (key: string): string {
		return this.envConfig[key]
	}
}
