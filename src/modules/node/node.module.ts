import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RecipesService } from '@M/recipes/recipes.service'
import { NodeResolver } from '@M/node/node.resolver'
import { Recipe } from '@M/recipes/models/entity/recipe'

@Module ({
	imports: [TypeOrmModule.forFeature ([Recipe])],
	providers: [NodeResolver, RecipesService]
})
export class NodeModule {}
