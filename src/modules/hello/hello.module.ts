import { Module } from '@nestjs/common';
import { HelloController } from '@M/hello/hello.controller'
import { HelloService } from '@M/hello/hello.service'
import { CatsModule } from '@M/cats/cats.module'

@Module({
	imports: [CatsModule],
	controllers: [HelloController],
	providers: [HelloService]
})
export class HelloModule {}
