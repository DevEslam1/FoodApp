export type CategoryId = "pizza" | "seafood" | "drinks";
export type MenuVisualKey = "pizza1" | "pizza2" | "pizza3" | "drink";
export type IngredientVisualKey = "ham" | "tomato" | "garlic" | "cheese";

export interface MenuCategory {
  id: CategoryId;
  label: string;
  caption: string;
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
}

export interface DummyRecipe {
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

export interface DummyRecipeResponse {
  recipes: DummyRecipe[];
}

export const menuCategories: MenuCategory[] = [
  {
    id: "pizza",
    label: "Pizza",
    caption: "top picks for cheesy cravings",
  },
  {
    id: "seafood",
    label: "Seafood",
    caption: "fresh and quick ocean bites",
  },
  {
    id: "drinks",
    label: "Soft Drinks",
    caption: "cold drinks for every combo",
  },
];

export const seedMenuItems: MenuItem[] = [
  {
    id: "primavera-pizza",
    categoryId: "pizza",
    name: "Primavera Pizza",
    badge: "top of the week",
    summary: "Balanced herbs, sweet tomato, and creamy cheese.",
    weightLabel: "Weight 540 g",
    price: 5.99,
    rating: 5.0,
    reviewCount: 118,
    deliveryMinutes: 30,
    sizeLabel: 'Medium 14"',
    crustLabel: "Thin Crust",
    description:
      "A light signature pizza with a crisp base and fresh toppings made for fast delivery.",
    ingredientNames: ["Smoked Ham", "Tomato Sauce", "Fresh Garlic"],
    ingredientKeys: ["ham", "tomato", "garlic"],
    visualKey: "pizza1",
    isFavorite: true,
  },
  {
    id: "margherita-pizza",
    categoryId: "pizza",
    name: "Margherita Pizza",
    badge: "chef recommendation",
    summary: "Classic Italian slice with basil and mozzarella.",
    weightLabel: "Weight 510 g",
    price: 6.49,
    rating: 4.8,
    reviewCount: 94,
    deliveryMinutes: 24,
    sizeLabel: 'Medium 12"',
    crustLabel: "Classic Crust",
    description:
      "Fresh cheese, tomato, and herbs layered on a warm crust for a clean classic finish.",
    ingredientNames: ["Fresh Cheese", "Tomato Sauce", "Garden Herbs"],
    ingredientKeys: ["cheese", "tomato", "garlic"],
    visualKey: "pizza2",
    isFavorite: false,
  },
  {
    id: "shrimp-pasta",
    categoryId: "seafood",
    name: "Shrimp Pasta",
    badge: "fresh catch",
    summary: "Creamy pasta with garlic shrimp and fast prep.",
    weightLabel: "Weight 430 g",
    price: 7.2,
    rating: 4.7,
    reviewCount: 61,
    deliveryMinutes: 22,
    sizeLabel: "Large Bowl",
    crustLabel: "Creamy Sauce",
    description:
      "A rich seafood bowl with soft pasta, garlic aroma, and a smooth house sauce.",
    ingredientNames: ["Shrimp", "Garlic Butter", "Tomato Herbs"],
    ingredientKeys: ["ham", "garlic", "tomato"],
    visualKey: "pizza3",
    imageUrl: "https://cdn.dummyjson.com/recipe-images/10.webp",
    isFavorite: false,
  },
  {
    id: "citrus-cola",
    categoryId: "drinks",
    name: "Citrus Cola",
    badge: "cold and fizzy",
    summary: "Chilled sparkling drink with lemon finish.",
    weightLabel: "Bottle 330 ml",
    price: 2.25,
    rating: 4.5,
    reviewCount: 44,
    deliveryMinutes: 10,
    sizeLabel: "330 ml",
    crustLabel: "Served Cold",
    description:
      "A bright soft drink served ice cold to pair with pizza, seafood, or any quick meal.",
    ingredientNames: ["Sparkling Water", "Citrus Flavor", "Fresh Ice"],
    ingredientKeys: ["tomato", "garlic", "cheese"],
    visualKey: "drink",
    isFavorite: false,
  },
];

export const FEATURED_PIZZA_API_URL = "https://dummyjson.com/recipes/search?q=pizza";
export const FEATURED_SEAFOOD_API_URL = "https://dummyjson.com/recipes/search?q=shrimp";
