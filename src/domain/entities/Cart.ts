import { MenuItem } from "./Menu";

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export type OrderStatus = "preparing" | "on_the_way" | "delivered";

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedMinutes: number;
}
