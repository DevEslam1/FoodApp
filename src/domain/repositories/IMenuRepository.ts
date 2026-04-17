import { MenuItem } from "../entities/Menu";

export interface IMenuRepository {
  fetchPizzaRecipes(): Promise<MenuItem[]>;
  fetchSeafoodRecipes(): Promise<MenuItem[]>;
}
