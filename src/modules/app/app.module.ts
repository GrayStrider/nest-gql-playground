import { Module } from '@nestjs/common'
import { KanbanModule } from '@M/kanban/kanban.module'

@Module ({
	imports: [KanbanModule]
})
export class AppModule {}
