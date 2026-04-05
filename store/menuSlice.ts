import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

import {
  FEATURED_PIZZA_API_URL,
  FEATURED_SEAFOOD_API_URL,
  menuCategories,
  seedMenuItems,
  type CategoryId,
  type DummyRecipe,
  type DummyRecipeResponse,
  type IngredientVisualKey,
  type MenuCategory,
  type MenuItem,
} from "@/constants/menuData";
import type { RootState } from "@/store";

interface MenuState {
  categories: MenuCategory[];
  items: MenuItem[];
  selectedCategoryId: CategoryId;
  searchQuery: string;
  ordersCount: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  errorMessage: string | null;
  syncMessage: string | null;
}

const ingredientPool: IngredientVisualKey[] = ["ham", "tomato", "garlic", "cheese"];

const pickIngredientKey = (name: string, index: number): IngredientVisualKey => {
  const normalized = name.toLowerCase();

  if (
    normalized.includes("shrimp") ||
    normalized.includes("pepperoni") ||
    normalized.includes("ham") ||
    normalized.includes("chicken")
  ) {
    return "ham";
  }

  if (
    normalized.includes("tomato") ||
    normalized.includes("sauce") ||
    normalized.includes("basil")
  ) {
    return "tomato";
  }

  if (
    normalized.includes("garlic") ||
    normalized.includes("olive") ||
    normalized.includes("herb")
  ) {
    return "garlic";
  }

  if (
    normalized.includes("cheese") ||
    normalized.includes("mozzarella") ||
    normalized.includes("cream")
  ) {
    return "cheese";
  }

  return ingredientPool[index % ingredientPool.length];
};

const mergeRecipeIntoItem = (item: MenuItem, recipe: DummyRecipe, useRemoteImage = false): MenuItem => {
  const ingredientNames = recipe.ingredients.slice(0, 3);

  return {
    ...item,
    summary: `${recipe.cuisine} ${recipe.difficulty.toLowerCase()} special.`,
    rating: Number(recipe.rating.toFixed(1)),
    reviewCount: recipe.reviewCount,
    deliveryMinutes: recipe.prepTimeMinutes + recipe.cookTimeMinutes,
    sizeLabel:
      item.categoryId === "drinks"
        ? item.sizeLabel
        : recipe.servings >= 4
          ? 'Medium 14"'
          : 'Medium 12"',
    description: recipe.instructions[0] ?? item.description,
    ingredientNames,
    ingredientKeys: ingredientNames.map((ingredient, index) => pickIngredientKey(ingredient, index)),
    imageUrl: useRemoteImage ? recipe.image : item.imageUrl,
  };
};

export const fetchFeaturedMenu = createAsyncThunk(
  "menu/fetchFeaturedMenu",
  async () => {
    const [pizzaResponse, seafoodResponse] = await Promise.all([
      axios.get<DummyRecipeResponse>(FEATURED_PIZZA_API_URL, { timeout: 8000 }),
      axios.get<DummyRecipeResponse>(FEATURED_SEAFOOD_API_URL, { timeout: 8000 }),
    ]);

    return {
      pizzaRecipes: pizzaResponse.data.recipes,
      seafoodRecipe: seafoodResponse.data.recipes[0] ?? null,
    };
  }
);

const initialState: MenuState = {
  categories: menuCategories,
  items: seedMenuItems,
  selectedCategoryId: "pizza",
  searchQuery: "",
  ordersCount: 0,
  status: "idle",
  errorMessage: null,
  syncMessage: null,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setSelectedCategory(state, action: PayloadAction<CategoryId>) {
      state.selectedCategoryId = action.payload;
      state.searchQuery = "";
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    toggleFavorite(state, action: PayloadAction<string>) {
      const item = state.items.find((menuItem) => menuItem.id === action.payload);

      if (item) {
        item.isFavorite = !item.isFavorite;
      }
    },
    placeOrder(state) {
      state.ordersCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeaturedMenu.pending, (state) => {
        state.status = "loading";
        state.errorMessage = null;
        state.syncMessage = null;
      })
      .addCase(fetchFeaturedMenu.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.errorMessage = null;
        state.syncMessage = "Featured cards synced from API.";

        const pizzaTargets = ["primavera-pizza", "margherita-pizza"];

        pizzaTargets.forEach((id, index) => {
          const recipe = action.payload.pizzaRecipes[index];
          const item = state.items.find((menuItem) => menuItem.id === id);

          if (item && recipe) {
            Object.assign(item, mergeRecipeIntoItem(item, recipe));
          }
        });

        const seafoodItem = state.items.find((menuItem) => menuItem.id === "shrimp-pasta");

        if (seafoodItem && action.payload.seafoodRecipe) {
          Object.assign(
            seafoodItem,
            mergeRecipeIntoItem(seafoodItem, action.payload.seafoodRecipe, true)
          );
        }
      })
      .addCase(fetchFeaturedMenu.rejected, (state) => {
        state.status = "failed";
        state.errorMessage = "Live recipes unavailable. Showing the local menu.";
        state.syncMessage = null;
      });
  },
});

const selectMenuState = (state: RootState) => state.menu;

export const selectCategories = (state: RootState) => state.menu.categories;

export const selectVisibleItems = createSelector([selectMenuState], (menuState) => {
  const query = menuState.searchQuery.trim().toLowerCase();

  return menuState.items
    .filter((item) => item.categoryId === menuState.selectedCategoryId)
    .filter((item) => {
      if (!query) {
        return true;
      }

      return (
        item.name.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.ingredientNames.some((ingredient) => ingredient.toLowerCase().includes(query))
      );
    });
});

export const selectSelectedItemById = (state: RootState, id: string) =>
  state.menu.items.find((item) => item.id === id);

export const {
  placeOrder,
  setSearchQuery,
  setSelectedCategory,
  toggleFavorite,
} = menuSlice.actions;

export default menuSlice.reducer;
