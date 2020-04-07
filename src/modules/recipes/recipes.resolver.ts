import { Resolver, Query, Args, ObjectType, Field, Mutation } from '@nestjs/graphql'
import * as Relay from 'graphql-relay'
import { PageInfo, Aggregate } from 'nestjs-graphql-relay'
import { RecipesService } from '@M/recipes/recipes.service'
import { RecipesConnectionArgs, AddRecipeInput } from '@M/recipes/dto/recipes.input'
import { Recipe } from '@M/recipes/models/entity/recipe'
import { times } from 'ramda'
import { chance } from '@qdev/utils-ts'

@ObjectType ({ isAbstract: true })
abstract class RecipesEdge implements Relay.Edge<Recipe> {
	@Field (() => Recipe)
	readonly node!: Recipe
	
	@Field (returns => String)
	readonly cursor!: Relay.ConnectionCursor
}

@ObjectType ()
export class RecipesConnection implements Relay.Connection<Recipe> {
	@Field ()
	readonly pageInfo!: PageInfo
	
	@Field (() => [RecipesEdge])
	readonly edges!: Array<Relay.Edge<Recipe>>
	
	@Field (() => Aggregate)
	readonly aggregate: Aggregate
}

@Resolver ('Recipes')
export class RecipesResolver {
	private ingridients = ['carrot', 'cabbage', 'potatoes']
	
	constructor (private readonly recipesService: RecipesService) {}
	
	@Query (() => RecipesConnection)
	recipes (
		@Args () { where, orderBy, ...args }: RecipesConnectionArgs
	): Promise<RecipesConnection> {
		return this.recipesService.find (where, undefined, args)
	}
	
	@Mutation (returns => Recipe)
	async addRecipe (@Args ('data') data: AddRecipeInput) {
		return this.recipesService.add (data)
	}
	
	@Mutation (returns => [Recipe])
	async mockRecipies (@Args ('amount') amount: number)
		: Promise<Array<Recipe>> {
		const recipies = times (i =>
			this.recipesService.add ({
				title: i + ') ' + chance.sentence ({ words: 2 }),
				ingredients: chance.pickset (this.ingridients)
			}), amount)
		
		return Promise.all (recipies)
	}
	
	
}
