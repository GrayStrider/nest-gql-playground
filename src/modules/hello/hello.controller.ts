import { Controller, Get } from '@nestjs/common'
import { HelloService } from '@M/hello/hello.service'
import { CatsService } from '@M/cats/cats.service'
import { User } from '@/common/decorators/user.decorator'

@Controller ('hello')
export class HelloController {
	constructor (
		private readonly helloService: HelloService,
	) {}
	
	
	@Get ()
	getHello (): string {
		return this.helloService.getHello ()
	}
	
	customDecorator (@User ('id') id: string){
	
	}
}
