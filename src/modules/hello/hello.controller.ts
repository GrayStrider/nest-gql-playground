import { Controller, Get } from '@nestjs/common'
import { HelloService } from '@M/hello/hello.service'

@Controller ('hello')
export class HelloController {
	constructor (private readonly helloService: HelloService) {}
	
	@Get ()
	getHello (): string {
		return this.helloService.getHello ()
	}
}
