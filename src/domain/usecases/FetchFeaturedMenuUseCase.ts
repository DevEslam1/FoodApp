import { MenuItem } from "../entities/Menu";
import { IMenuRepository } from "../repositories/IMenuRepository";

export class FetchFeaturedMenuUseCase {
  private repository: IMenuRepository;

  constructor(repository: IMenuRepository) {
    this.repository = repository;
  }

  async execute(): Promise<{ pizza: MenuItem[]; seafood: MenuItem[] }> {
    const [pizza, seafood] = await Promise.all([
      this.repository.fetchPizzaRecipes(),
      this.repository.fetchSeafoodRecipes(),
    ]);

    return { pizza, seafood };
  }
}
