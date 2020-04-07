import { Test, TestingModule } from "@nestjs/testing";
import { RecipesService } from "src/modules/recipes/recipes.service";
import { createMockRepository } from "example/src/testing/entity";
import { Recipe } from "@M/recipes/models/entity/recipe";
import { NodeResolver } from "src/modules/node/node.resolver";

describe("NodeResolver", () => {
  let resolver: NodeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NodeResolver, RecipesService, createMockRepository(Recipe)]
    }).compile();

    resolver = module.get<NodeResolver>(NodeResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
