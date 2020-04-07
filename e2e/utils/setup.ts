import { Test } from '@nestjs/testing'
import { AppModule } from '@M/app/app.module'
import { makeRedis } from '@M/redis/redis.provider'
import { supertest } from '@qdev/utils-ts'
import { Reflector } from '@nestjs/core'
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard'

export async function setupTest
(disableAuth = false) {
	
	jest.setTimeout (20000)
	let module = await Test.createTestingModule ({
		imports: [AppModule]
	}).compile ()
	let app = module
		.createNestApplication ()
	if (!disableAuth) app = app
		.useGlobalGuards (new GqlAuthGuard (new Reflector ()))
	await app.init ()
	await makeRedis ().flushdb ()
	return supertest (app.getHttpServer ())
}
