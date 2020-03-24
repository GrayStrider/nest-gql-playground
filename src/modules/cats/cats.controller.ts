import { Body, Controller, Get, Param, Post, UseGuards, ParseIntPipe, Put, Patch, UsePipes, ValidationPipe } from '@nestjs/common'
import { CatsService } from '@M/cats/cats.service'
import { RolesGuard } from '@/common/guards/roles.guard'
import { Roles } from '@/common/decorators/roles.decorator'
import { CatCreateInput } from '@M/cats/inputs/cat.create.input'
import { CatUpdateInput } from '@M/cats/inputs/cat.update.input'

const Id = Param ('id', new ParseIntPipe)

@UseGuards (RolesGuard)
@Controller ('cats')
/**
 * 'user' as default role, but we can override it for each specific method
 * @see RolesGuard
 */
@Roles ('user')
export class CatsController {
	constructor (private readonly svc: CatsService) {}
	
	@Post ()
	@Roles ('admin')
	async create (@Body () catCreateDto: CatCreateInput | CatCreateInput[]) {
		await this.svc.create (catCreateDto)
	}
	
	
	@Get ()
	async all () {
		return this.svc.all ()
	}
	
	@Get (':id')
	one (@Id id: number) {
		return this.svc.one (id)
	}
	
	
	@Put (':id')
	async replace (@Id id: number,
	               @Body () catUpdateDto: CatUpdateInput) {
		await this.svc.replace (id, catUpdateDto)
	}
	
	@Patch (':id')
	async update (@Id id: number,
	              @Body () catUpdateDto: Partial<CatUpdateInput>) {
		await this.svc.update (id, catUpdateDto)
	}
	
	// @Delete (':id')
	// remove (@Param ('id') id: string) {
	// 	return `This action removes a #${id} cat`
	// }
}
