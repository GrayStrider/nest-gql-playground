import { ConfigService } from '@M/config/config.service'
import { Injectable } from '@nestjs/common'

@Injectable ()
export class AppService {
	private readonly helloMessage: string
	
	constructor (configService: ConfigService) {
		this.helloMessage = configService.get ('HELLO_MESSAGE')
	}
	
	getHello (): string {
		return this.helloMessage
	}
}
