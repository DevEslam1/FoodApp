import { MenuItem, ProductAddOn, ProductSize } from "./Menu";

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  selectedSize?: ProductSize;
  selectedAddOns?: ProductAddOn[];
}

export type OrderStatus = "preparing" | "on_the_way" | "delivered";
export type PaymentMethod = "cash" | "visa";

export interface Address {
  governorate: string;
  city: string;
  street: string;
  building: string;
  floor: string;
  apartment: string;
  latitude?: number;
  longitude?: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  address: Address;
  createdAt: string;
  estimatedMinutes: number;
  driverLocation?: {
    latitude: number;
    longitude: number;
  };
}
