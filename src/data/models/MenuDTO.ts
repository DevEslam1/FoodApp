export interface DummyRecipeDTO {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  image: string;
  rating: number;
  reviewCount: number;
}

export interface DummyRecipeResponseDTO {
  recipes: DummyRecipeDTO[];
}
