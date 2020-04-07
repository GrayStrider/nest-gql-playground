import { ConnectionArgs, OrderByInput } from 'nestjs-graphql-relay'
import { InputType, Field, ArgsType } from '@nestjs/graphql'
import { Recipe } from '@M/recipes/models/entity/recipe'
import { ValidString } from '@/common/decorators/validation'
import { IsString } from 'class-validator'

@InputType ()
export class RecipeWhereInput implements Partial<Recipe> {
	@Field (() => String, { nullable: true })
	readonly title?: Recipe['title']
}

@ArgsType ()
export class RecipesConnectionArgs extends ConnectionArgs {
	@Field (() => RecipeWhereInput, { nullable: true })
	readonly where?: RecipeWhereInput
	
	@Field (() => OrderByInput, { nullable: true })
	readonly orderBy?: OrderByInput
}


@InputType ()
export class AddRecipeInput implements Partial<Recipe> {
	@ValidString (20)
	@Field (returns => String)
	readonly title: string
	
	// @ValidString(20, 2, true) //TODO
	
	@IsString ({ each: true })
	@Field (returns => [String])
	readonly ingredients: string[]
}
