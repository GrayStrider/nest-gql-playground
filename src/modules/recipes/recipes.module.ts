import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RecipesResolver } from '@M/recipes/recipes.resolver'
import { RecipesService } from '@M/recipes/recipes.service'
import { Recipe } from '@M/recipes/models/entity/recipe'

@Module({
  imports: [TypeOrmModule.forFeature([Recipe])],
  providers: [RecipesResolver, RecipesService]
})
export class RecipesModule {}
