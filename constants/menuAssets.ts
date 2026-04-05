import { ImageSourcePropType } from "react-native";

export const profileImageSource = require("../assets/images/profile.png");

export const categoryIconSources = {
  pizza: require("../assets/images/pizza-icon.png"),
  seafood: require("../assets/images/shrimp-icon.png"),
  drinks: require("../assets/images/soda-icon.png"),
} as const satisfies Record<string, ImageSourcePropType>;

export const menuVisualSources = {
  pizza1: require("../assets/images/pizza1.png"),
  pizza2: require("../assets/images/pizza2.png"),
  pizza3: require("../assets/images/pizza3.png"),
  drink: require("../assets/images/soda-icon.png"),
} as const satisfies Record<string, ImageSourcePropType>;

export const ingredientImageSources = {
  ham: require("../assets/images/ham.png"),
  tomato: require("../assets/images/tomato.png"),
  garlic: require("../assets/images/garlic.png"),
  cheese: require("../assets/images/cheese.png"),
} as const satisfies Record<string, ImageSourcePropType>;
