import { MenuRemoteDataSource } from "./data/datasources/MenuRemoteDataSource";
import { MenuRepositoryImpl } from "./data/repositories/MenuRepositoryImpl";
import { FetchFeaturedMenuUseCase } from "./domain/usecases/FetchFeaturedMenuUseCase";
import { ManageCartUseCase } from "./domain/usecases/ManageCartUseCase";

// Data Sources
const menuRemoteDataSource = new MenuRemoteDataSource();

// Repositories
export const menuRepository = new MenuRepositoryImpl(menuRemoteDataSource);

// Use Cases
export const fetchFeaturedMenuUseCase = new FetchFeaturedMenuUseCase(menuRepository);
export const manageCartUseCase = new ManageCartUseCase();
