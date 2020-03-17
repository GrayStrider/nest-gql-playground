import { Module } from '@nestjs/common'
import { HelloModule } from '@M/hello/hello.module'
import { HelloController } from '@M/hello/hello.controller'
import { HelloService } from '@M/hello/hello.service'
import { CatsModule } from '@M/cats/cats.module'
import { CoreModule } from '@/core/core.module'

@Module ({
	imports: [HelloModule, CoreModule, CatsModule],
	controllers: [HelloController],
	providers: [HelloService]
})
export class AppModule {}
