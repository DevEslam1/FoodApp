import { Address } from "./Cart";

export interface SavedCard {
  id: string;
  type: "visa" | "mastercard";
  lastFour: string;
  expiry: string;
  cardholder: string;
}

export interface SavedAddress extends Address {
  id: string;
  label: string; // "Home", "Work", etc.
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  savedAddresses: SavedAddress[];
  savedCards: SavedCard[];
}
