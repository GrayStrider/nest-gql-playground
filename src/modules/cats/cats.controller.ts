import { Body, Controller, Get, Param, Post, UseGuards, ParseIntPipe, Delete, Put } from '@nestjs/common'
import { CatsService } from '@M/cats/cats.service'
import { CatCreateDto } from '@M/cats/dto/cat.create.dto'
import { Cat } from '@M/cats/interfaces/cat.interface'
import { RolesGuard } from '@/common/guards/roles.guard'
import { Roles } from '@/common/decorators/roles.decorator'
import { CatUpdateDto } from '@M/cats/dto/cat.update.dto'

@UseGuards (RolesGuard)
@Controller ('cats')
export class CatsController {
	constructor (private readonly service: CatsService) {}
	
	@Post ()
	@Roles ('admin')
	async create (@Body () catCreateDto: CatCreateDto) {
		await this.service.create (catCreateDto)
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
		return this.service.findOneById (id)
	}
	
	
	@Put (':id')
	update (@Param ('id') id: number, @Body () catUpdateDto: CatUpdateDto) {
		return this.service.updateById (id, catUpdateDto)
	}
	
	@Delete (':id')
	remove (@Param ('id') id: string) {
		return `This action removes a #${id} cat`
	}
}
