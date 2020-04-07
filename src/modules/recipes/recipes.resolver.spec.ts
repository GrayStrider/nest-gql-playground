import { Test, TestingModule } from "@nestjs/testing";
import { createMockRepository } from "example/src/testing/entity";
import { RecipesResolver } from "src/modules/recipes/recipes.resolver";
import { RecipesService } from "src/modules/recipes/recipes.service";
import { Recipe } from "@M/recipes/models/entity/recipe";

describe("RecipesResolver", () => {
  let resolver: RecipesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecipesResolver, RecipesService, createMockRepository(Recipe)]
    }).compile();

    resolver = module.get<RecipesResolver>(RecipesResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
