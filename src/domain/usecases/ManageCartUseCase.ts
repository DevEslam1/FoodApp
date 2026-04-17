import { CartItem, Order } from "../entities/Cart";
import { MenuItem } from "../entities/Menu";

const DELIVERY_FEE = 2.99;

export class ManageCartUseCase {
  addItem(cart: CartItem[], menuItem: MenuItem, quantity: number = 1): CartItem[] {
    const existing = cart.find((ci) => ci.menuItem.id === menuItem.id);

    if (existing) {
      return cart.map((ci) =>
        ci.menuItem.id === menuItem.id
          ? { ...ci, quantity: ci.quantity + quantity }
          : ci
      );
    }

    return [...cart, { menuItem, quantity }];
  }

  removeItem(cart: CartItem[], menuItemId: string): CartItem[] {
    return cart.filter((ci) => ci.menuItem.id !== menuItemId);
  }

  updateQuantity(cart: CartItem[], menuItemId: string, quantity: number): CartItem[] {
    if (quantity <= 0) {
      return this.removeItem(cart, menuItemId);
    }

    return cart.map((ci) =>
      ci.menuItem.id === menuItemId ? { ...ci, quantity } : ci
    );
  }

  calculateSubtotal(cart: CartItem[]): number {
    return cart.reduce((sum, ci) => sum + ci.menuItem.price * ci.quantity, 0);
  }

  calculateTotal(cart: CartItem[]): {
    subtotal: number;
    deliveryFee: number;
    total: number;
  } {
    const subtotal = this.calculateSubtotal(cart);
    const deliveryFee = cart.length > 0 ? DELIVERY_FEE : 0;
    return {
      subtotal: Number(subtotal.toFixed(2)),
      deliveryFee,
      total: Number((subtotal + deliveryFee).toFixed(2)),
    };
  }

  getItemCount(cart: CartItem[]): number {
    return cart.reduce((count, ci) => count + ci.quantity, 0);
  }

  getEstimatedDelivery(cart: CartItem[]): number {
    if (cart.length === 0) return 0;
    return Math.max(...cart.map((ci) => ci.menuItem.deliveryMinutes));
  }

  createOrder(cart: CartItem[]): Order {
    const { subtotal, deliveryFee, total } = this.calculateTotal(cart);
    const estimatedMinutes = this.getEstimatedDelivery(cart);

    return {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      items: [...cart],
      subtotal,
      deliveryFee,
      total,
      status: "preparing",
      createdAt: new Date().toISOString(),
      estimatedMinutes,
    };
  }
}
