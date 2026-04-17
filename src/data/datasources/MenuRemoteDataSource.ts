import axios from "axios";
import { DummyRecipeResponseDTO } from "../models/MenuDTO";

const FEATURED_PIZZA_API_URL = "https://dummyjson.com/recipes/search?q=pizza";
const FEATURED_SEAFOOD_API_URL = "https://dummyjson.com/recipes/search?q=shrimp";

export class MenuRemoteDataSource {
  async getPizzaRecipes(): Promise<DummyRecipeResponseDTO> {
    const response = await axios.get<DummyRecipeResponseDTO>(FEATURED_PIZZA_API_URL, { timeout: 8000 });
    return response.data;
  }

  async getSeafoodRecipes(): Promise<DummyRecipeResponseDTO> {
    const response = await axios.get<DummyRecipeResponseDTO>(FEATURED_SEAFOOD_API_URL, { timeout: 8000 });
    return response.data;
  }
}
