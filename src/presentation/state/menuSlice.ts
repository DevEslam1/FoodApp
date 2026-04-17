import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchFeaturedMenuUseCase } from "../../dependencies";
import { MenuItem, MenuCategory, CategoryId } from "../../domain/entities/Menu";
import { menuCategories, seedMenuItems } from "@/constants/menuData";
import type { RootState } from "./index";

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

export const fetchFeaturedMenu = createAsyncThunk(
  "menu/fetchFeaturedMenu",
  async () => {
    return await fetchFeaturedMenuUseCase.execute();
  }
);

const initialState: MenuState = {
  categories: menuCategories as any,
  items: seedMenuItems as any,
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

        const fetchedItems = [...action.payload.pizza, ...action.payload.seafood];
        
        fetchedItems.forEach((fetchedItem) => {
           const index = state.items.findIndex(i => i.id === fetchedItem.id || i.name === fetchedItem.name);
           if (index !== -1) {
             state.items[index] = { ...state.items[index], ...fetchedItem };
           } else {
             state.items.push(fetchedItem);
           }
        });
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
      if (!query) return true;
      return (
        item.name.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        (item.ingredientNames && item.ingredientNames.some((ingredient) => ingredient.toLowerCase().includes(query)))
      );
    });
});

export const selectSelectedItemById = (state: RootState, id: string) =>
  state.menu.items.find((item) => item.id === id);

export const selectFavoriteItems = createSelector([selectMenuState], (menuState) =>
  menuState.items.filter((item) => item.isFavorite)
);

export const {
  placeOrder,
  setSearchQuery,
  setSelectedCategory,
  toggleFavorite,
} = menuSlice.actions;

export default menuSlice.reducer;
