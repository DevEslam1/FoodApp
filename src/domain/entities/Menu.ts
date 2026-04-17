export type CategoryId = "pizza" | "seafood" | "drinks";
export type MenuVisualKey = "pizza1" | "pizza2" | "pizza3" | "drink";
export type IngredientVisualKey = "ham" | "tomato" | "garlic" | "cheese";

export interface MenuCategory {
  id: CategoryId;
  label: string;
  caption: string;
}

export interface ProductSize {
  label: string;
  priceMultiplier: number;
}

export interface ProductAddOn {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  categoryId: CategoryId;
  name: string;
  badge: string;
  summary: string;
  weightLabel: string;
  price: number;
  rating: number;
  reviewCount: number;
  deliveryMinutes: number;
  sizeLabel: string;
  crustLabel: string;
  description: string;
  ingredientNames: string[];
  ingredientKeys: IngredientVisualKey[];
  visualKey: MenuVisualKey;
  imageUrl?: string;
  isFavorite: boolean;
  availableSizes?: ProductSize[];
  availableAddOns?: ProductAddOn[];
}
