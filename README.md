# Food Delivery App

[![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-State%20Management-593D88?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Axios](https://img.shields.io/badge/Axios-HTTP%20Client-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Mode-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A modern Expo Router food delivery app built with React Native, TypeScript, Redux Toolkit, and Axios.  
The project includes an authentication flow, a Redux-powered homepage, live recipe syncing from an API, and a product details screen inspired by the provided mobile UI design.

## Preview

<p align="center">
  <img src="./assets/images/Home.png" alt="Home screen" width="220" />
  <img src="./assets/images/Details.png" alt="Details screen" width="220" />
</p>

## Features

- `Login screen` with styled `TextInput` fields using `placeholder`, `onChangeText`, `secureTextEntry`, `maxLength`, `keyboardType`, and `autoFocus`.
- `Create account screen` with the same polished auth card design and navigation into the app.
- `Redux Toolkit store` for categories, menu items, selected filters, favorite state, order count, API status, and search text.
- `Axios API integration` that fetches featured pizza and seafood recipes from DummyJSON and merges them into local card data.
- `Homepage UI` with:
  - profile avatar
  - food delivery hero text
  - live search input
  - horizontal category cards
  - popular food cards
  - loading, synced, and fallback states
- `Food details screen` with price, size, crust, delivery time, ingredients, favorite toggle, and place-order action.
- `Expo Router navigation` between login, sign-up, home, and food details pages.
- `Type-safe selectors and hooks` for cleaner Redux usage.
- `Reusable components` for auth layouts, category cards, and food cards.

## State Management

This project uses `Redux Toolkit` as the main state management solution.

The store currently handles:

- `categories`
- `menu items`
- `selected category`
- `search query`
- `favorite items`
- `order count`
- `API loading and error state`

Main files:

- `store/index.ts`
- `store/hooks.ts`
- `store/menuSlice.ts`

## API Integration

The app uses `Axios` to fetch recipe data from:

- `https://dummyjson.com/recipes/search?q=pizza`
- `https://dummyjson.com/recipes/search?q=shrimp`

Fetched data is merged with local UI-friendly card data so the app keeps the designed layout while still demonstrating real HTTP requests and Redux async handling.

If the request fails, the app falls back to seeded local menu items and shows a friendly status message.

## Project Structure

```text
app/
  _layout.tsx
  index.tsx
  signup.tsx
  home.tsx
  food/
    [id].tsx

components/
  AuthButton.tsx
  AuthCard.tsx
  AuthDecoration.tsx
  CategoryCard.tsx
  CustomInput.tsx
  FoodCard.tsx

constants/
  menuAssets.ts
  menuData.ts

store/
  hooks.ts
  index.ts
  menuSlice.ts
```

## Tech Stack

- `Expo`
- `React Native`
- `Expo Router`
- `TypeScript`
- `Redux Toolkit`
- `React Redux`
- `Axios`
- `Expo Linear Gradient`
- `Expo Vector Icons`

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npx expo start
```

### 3. Run on a device or emulator

From the Expo terminal output you can open the app in:

- Android emulator
- iOS simulator
- Expo Go
- Web browser

## Available Scripts

```bash
npm run start
npm run android
npm run ios
npm run web
npm run lint
```

## Validation

The current project passes:

- `npm run lint`
- `npx tsc --noEmit`

## What This Project Demonstrates

- building a mobile UI from a design reference
- applying `Redux Toolkit` in a React Native app
- making HTTP requests with `Axios`
- organizing reusable components
- managing screen navigation with `Expo Router`
- connecting local UI design with live remote data

## Notes

- The auth flow is currently UI-focused and routes directly to the homepage.
- The menu screen is optimized for the provided pizza delivery concept.
- Local assets are used to preserve the exact visual style from the mockup.

## Author

Built as a food delivery practice project for mobile app development and Redux state management.
