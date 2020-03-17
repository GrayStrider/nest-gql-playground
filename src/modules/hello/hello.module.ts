import { Module } from '@nestjs/common';
import { HelloController } from '@M/hello/hello.controller'
import { HelloService } from '@M/hello/hello.service'

@Module({
	controllers: [HelloController],
	providers: [HelloService]
})
export class HelloModule {}
