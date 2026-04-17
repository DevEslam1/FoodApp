import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { manageCartUseCase } from "../../dependencies";
import { Address, CartItem, Order, PaymentMethod } from "../../domain/entities/Cart";
import { MenuItem, ProductAddOn, ProductSize } from "../../domain/entities/Menu";
import type { RootState } from "./index";

interface CartState {
  items: CartItem[];
  orders: Order[];
  lastOrder: Order | null;
}

const initialState: CartState = {
  items: [],
  orders: [],
  lastOrder: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(
      state,
      action: PayloadAction<{
        menuItem: MenuItem;
        quantity?: number;
        selectedSize?: ProductSize;
        selectedAddOns?: ProductAddOn[];
      }>
    ) {
      state.items = manageCartUseCase.addItem(
        state.items,
        action.payload.menuItem,
        action.payload.quantity ?? 1,
        action.payload.selectedSize,
        action.payload.selectedAddOns
      );
    },

    removeFromCart(state, action: PayloadAction<number>) {
      state.items = manageCartUseCase.removeItem(state.items, action.payload);
    },

    updateCartQuantity(state, action: PayloadAction<{ index: number; quantity: number }>) {
      state.items = manageCartUseCase.updateQuantity(
        state.items,
        action.payload.index,
        action.payload.quantity
      );
    },

    checkout(
      state,
      action: PayloadAction<{ address: Address; paymentMethod: PaymentMethod }>,
    ) {
      if (state.items.length === 0) return;
      const order = manageCartUseCase.createOrder(
        state.items,
        action.payload.address,
        action.payload.paymentMethod,
      );
      state.orders.unshift(order);
      state.lastOrder = order;
      state.items = [];
    },

    clearCart(state) {
      state.items = [];
    },

    clearLastOrder(state) {
      state.lastOrder = null;
    },
  },
});

// ── Selectors ──────────────────────────────────────────────────────

const selectCartState = (state: RootState) => state.cart;

export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartItemCount = createSelector([selectCartState], (cart) =>
  manageCartUseCase.getItemCount(cart.items),
);

export const selectCartTotals = createSelector([selectCartState], (cart) =>
  manageCartUseCase.calculateTotal(cart.items),
);

export const selectEstimatedDelivery = createSelector([selectCartState], (cart) =>
  manageCartUseCase.getEstimatedDelivery(cart.items),
);

export const selectOrders = (state: RootState) => state.cart.orders;
export const selectLastOrder = (state: RootState) => state.cart.lastOrder;

export const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  checkout,
  clearCart,
  clearLastOrder,
} = cartSlice.actions;

export default cartSlice.reducer;
