import { CartItem, Order, Address, PaymentMethod } from "../entities/Cart";
import { MenuItem, ProductAddOn, ProductSize } from "../entities/Menu";

const DELIVERY_FEE = 2.99;

export class ManageCartUseCase {
  addItem(
    cart: CartItem[],
    menuItem: MenuItem,
    quantity: number = 1,
    selectedSize?: ProductSize,
    selectedAddOns?: ProductAddOn[]
  ): CartItem[] {
    const existingIndex = cart.findIndex((ci) => 
      ci.menuItem.id === menuItem.id && 
      ci.selectedSize?.label === selectedSize?.label &&
      this.areAddOnsEqual(ci.selectedAddOns, selectedAddOns)
    );

    if (existingIndex !== -1) {
      return cart.map((ci, idx) =>
        idx === existingIndex
          ? { ...ci, quantity: ci.quantity + quantity }
          : ci
      );
    }

    return [...cart, { menuItem, quantity, selectedSize, selectedAddOns }];
  }

  private areAddOnsEqual(a?: ProductAddOn[], b?: ProductAddOn[]): boolean {
    if (!a && !b) return true;
    if (!a || !b) return false;
    if (a.length !== b.length) return false;
    
    const namesA = a.map(ao => ao.id).sort();
    const namesB = b.map(ao => ao.id).sort();
    
    return namesA.every((val, index) => val === namesB[index]);
  }

  removeItem(cart: CartItem[], index: number): CartItem[] {
    return cart.filter((_, idx) => idx !== index);
  }

  updateQuantity(cart: CartItem[], index: number, quantity: number): CartItem[] {
    if (quantity <= 0) {
      return this.removeItem(cart, index);
    }

    return cart.map((ci, idx) =>
      idx === index ? { ...ci, quantity } : ci
    );
  }

  getItemPrice(cartItem: CartItem): number {
    let price = cartItem.menuItem.price;
    
    if (cartItem.selectedSize) {
      price *= cartItem.selectedSize.priceMultiplier;
    }
    
    if (cartItem.selectedAddOns) {
      const addOnsTotal = cartItem.selectedAddOns.reduce((sum, ao) => sum + ao.price, 0);
      price += addOnsTotal;
    }
    
    return price;
  }

  calculateSubtotal(cart: CartItem[]): number {
    return cart.reduce((sum, ci) => sum + this.getItemPrice(ci) * ci.quantity, 0);
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

  createOrder(cart: CartItem[], address: Address, paymentMethod: PaymentMethod): Order {
    const { subtotal, deliveryFee, total } = this.calculateTotal(cart);
    const estimatedMinutes = this.getEstimatedDelivery(cart);

    return {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      items: [...cart],
      subtotal,
      deliveryFee,
      total,
      status: "preparing",
      paymentMethod,
      address,
      createdAt: new Date().toISOString(),
      estimatedMinutes,
    };
  }
}
