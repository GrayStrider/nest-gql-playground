import { Module } from '@nestjs/common'
import { HelloModule } from '@M/hello/hello.module'
import { HelloController } from '@M/hello/hello.controller'
import { HelloService } from '@M/hello/hello.service'

@Module ({
	imports: [HelloModule],
	controllers: [HelloController],
	providers: [HelloService]
})
export class AppModule {}
