import { Test, TestingModule } from "@nestjs/testing";
import { createMockRepository } from "example/src/testing/entity";
import { RecipesService } from "src/modules/recipes/recipes.service";
import { Recipe } from "@M/recipes/models/entity/recipe";

describe("RecipesService", () => {
  let service: RecipesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecipesService, createMockRepository(Recipe)]
    }).compile();

    service = module.get<RecipesService>(RecipesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
