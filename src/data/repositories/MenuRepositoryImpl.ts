import { MenuItem, IngredientVisualKey } from "../../domain/entities/Menu";
import { IMenuRepository } from "../../domain/repositories/IMenuRepository";
import { MenuRemoteDataSource } from "../datasources/MenuRemoteDataSource";
import { DummyRecipeDTO } from "../models/MenuDTO";

export class MenuRepositoryImpl implements IMenuRepository {
  private remoteDataSource: MenuRemoteDataSource;
  private ingredientPool: IngredientVisualKey[] = ["ham", "tomato", "garlic", "cheese"];

  constructor(remoteDataSource: MenuRemoteDataSource) {
    this.remoteDataSource = remoteDataSource;
  }

  async fetchPizzaRecipes(): Promise<MenuItem[]> {
    const response = await this.remoteDataSource.getPizzaRecipes();
    return response.recipes.map((recipe, index) => this.mapToEntity(recipe, index, "pizza"));
  }

  async fetchSeafoodRecipes(): Promise<MenuItem[]> {
    const response = await this.remoteDataSource.getSeafoodRecipes();
    return response.recipes.map((recipe, index) => this.mapToEntity(recipe, index, "seafood"));
  }

  private mapToEntity(recipe: DummyRecipeDTO, index: number, categoryId: any): MenuItem {
    const ingredientNames = recipe.ingredients.slice(0, 3);
    
    return {
      id: recipe.id.toString(), // Simplified mapping
      categoryId,
      name: recipe.name,
      badge: "featured",
      summary: `${recipe.cuisine} ${recipe.difficulty.toLowerCase()} special.`,
      weightLabel: `Weight ${recipe.servings * 100} g`,
      price: 5.99, // Static for now as API doesn't provide it
      rating: Number(recipe.rating.toFixed(1)),
      reviewCount: recipe.reviewCount,
      deliveryMinutes: recipe.prepTimeMinutes + recipe.cookTimeMinutes,
      sizeLabel: recipe.servings >= 4 ? 'Medium 14"' : 'Medium 12"',
      crustLabel: "Thin Crust",
      description: recipe.instructions[0] ?? "",
      ingredientNames,
      ingredientKeys: ingredientNames.map((name, idx) => this.pickIngredientKey(name, idx)),
      visualKey: "pizza1", // Placeholder
      imageUrl: recipe.image,
      isFavorite: false,
    };
  }

  private pickIngredientKey(name: string, index: number): IngredientVisualKey {
    const normalized = name.toLowerCase();
    if (normalized.includes("shrimp") || normalized.includes("pepperoni") || normalized.includes("ham")) return "ham";
    if (normalized.includes("tomato") || normalized.includes("sauce")) return "tomato";
    if (normalized.includes("garlic") || normalized.includes("olive")) return "garlic";
    if (normalized.includes("cheese") || normalized.includes("mozzarella")) return "cheese";
    return this.ingredientPool[index % this.ingredientPool.length];
  }
}
