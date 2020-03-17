import { Body, Controller, Get, Param, Post, UseGuards, ParseIntPipe } from '@nestjs/common'
import { CatsService } from '@M/cats/cats.service'
import { CreateCatDto } from '@M/cats/dto/create-cat.dto'
import { Cat } from '@M/cats/interfaces/cat.interface'
import { RolesGuard } from '@/common/guards/roles.guard'
import { Roles } from '@/common/decorators/roles.decorator'

@UseGuards (RolesGuard)
@Controller ('cats')
export class CatsController {
	constructor (private readonly service: CatsService) {}
	
	@Post ()
	@Roles ('admin')
	async create (@Body () createCatDto: CreateCatDto) {
		await this.service.create (createCatDto)
	}
	
	@Get ()
	async findAll (): Promise<Cat[]> {
		return this.service.findAll ()
	}
	
	@Get (':id')
	findOne (
		@Param ('id', new ParseIntPipe ())
			id: number
	) {
		return this.service.findOneById(id)
	}
}
