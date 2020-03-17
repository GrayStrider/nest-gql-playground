import { Controller, Get } from '@nestjs/common'
import { HelloService } from '@M/hello/hello.service'
import { CatsService } from '@M/cats/cats.service'

@Controller ('hello')
export class HelloController {
	constructor (
		private readonly helloService: HelloService,
		private readonly catsService: CatsService
	) {}
	
	
	@Get ()
	getHello (): string {
		return this.helloService.getHello ()
	}
	
	
	getExported () {
		return this.catsService.findAll ()
	}
}
