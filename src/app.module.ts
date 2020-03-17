import { Module } from '@nestjs/common'
import { HelloController } from '@/hello/hello.controller'
import { HelloService } from '@/hello/hello.service'
import { HelloModule } from '@/hello/hello.module';

@Module ({
	imports: [HelloModule],
	controllers: [HelloController],
	providers: [HelloService]
})
export class AppModule {}
