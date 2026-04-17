import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { menuVisualSources } from "@/constants/menuAssets";
import { useAppDispatch, useAppSelector } from "@/src/presentation/state/hooks";
import {
  checkout,
  removeFromCart,
  selectCartItems,
  selectCartTotals,
  selectEstimatedDelivery,
  updateCartQuantity,
} from "@/src/presentation/state/cartSlice";
import type { CartItem } from "@/src/domain/entities/Cart";

function CartItemRow({ cartItem, onIncrement, onDecrement, onRemove }: {
  cartItem: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}) {
  const { menuItem, quantity, selectedSize, selectedAddOns } = cartItem;

  const unitPrice = (menuItem.price * (selectedSize?.priceMultiplier || 1)) + 
    (selectedAddOns?.reduce((sum, ao) => sum + ao.price, 0) || 0);
  const imageSource = menuItem.imageUrl
    ? { uri: menuItem.imageUrl }
    : menuVisualSources[menuItem.visualKey];

  return (
    <View style={styles.itemCard}>
      <Image source={imageSource} style={styles.itemImage} resizeMode="contain" />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>{menuItem.name}</Text>
        <Text style={styles.itemPrice}>${(unitPrice * quantity).toFixed(2)}</Text>
        <View style={styles.variationRow}>
          {selectedSize && (
            <Text style={styles.variationText}>Size: {selectedSize.label}</Text>
          )}
          {selectedAddOns && selectedAddOns.length > 0 && (
            <Text style={styles.variationText} numberOfLines={1}>
              {selectedAddOns.map(a => a.name).join(", ")}
            </Text>
          )}
        </View>
        <Text style={styles.itemUnit}>${unitPrice.toFixed(2)} each</Text>
      </View>
      <View style={styles.quantityControls}>
        <Pressable
          onPress={quantity === 1 ? onRemove : onDecrement}
          style={[styles.qtyButton, quantity === 1 && styles.qtyButtonDanger]}
        >
          <Ionicons
            name={quantity === 1 ? "trash-outline" : "remove"}
            size={16}
            color={quantity === 1 ? "#E55A4F" : "#3E3832"}
          />
        </Pressable>
        <Text style={styles.qtyText}>{quantity}</Text>
        <Pressable onPress={onIncrement} style={styles.qtyButton}>
          <Ionicons name="add" size={16} color="#3E3832" />
        </Pressable>
      </View>
    </View>
  );
}

export default function CartScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const totals = useAppSelector(selectCartTotals);
  const estimatedDelivery = useAppSelector(selectEstimatedDelivery);

  const handleCheckout = () => {
    router.push("/checkout" as any);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons color="#231E19" name="chevron-back" size={22} />
          </Pressable>
          <Text style={styles.headerTitle}>My Cart</Text>
          <View style={styles.backButton} />
        </View>

        {items.length === 0 ? (
          /* ── Empty State ─────────────────────────── */
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="bag-outline" size={64} color="#D4CEC4" />
            </View>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>
              Looks like you haven't added{"\n"}any delicious items yet.
            </Text>
            <Pressable onPress={() => router.replace("/home" as any)} style={styles.emptyButton}>
              <Text style={styles.emptyButtonText}>Browse Menu</Text>
              <Ionicons name="arrow-forward" size={16} color="#231E19" />
            </Pressable>
          </View>
        ) : (
          <>
            {/* ── Items List ──────────────────────── */}
            <ScrollView
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            >
              {items.map((cartItem: CartItem, index: number) => (
                <CartItemRow
                  key={`${cartItem.menuItem.id}-${index}`}
                  cartItem={cartItem}
                  onIncrement={() =>
                    dispatch(updateCartQuantity({
                      index,
                      quantity: cartItem.quantity + 1,
                    }))
                  }
                  onDecrement={() =>
                    dispatch(updateCartQuantity({
                      index,
                      quantity: cartItem.quantity - 1,
                    }))
                  }
                  onRemove={() => dispatch(removeFromCart(index))}
                />
              ))}

              {/* ── Order Summary ──────────────────── */}
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Order Summary</Text>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>${totals.subtotal.toFixed(2)}</Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Delivery Fee</Text>
                  <Text style={styles.summaryValue}>${totals.deliveryFee.toFixed(2)}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.summaryRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>${totals.total.toFixed(2)}</Text>
                </View>

                <View style={styles.deliveryRow}>
                  <Ionicons name="time-outline" size={14} color="#8C847B" />
                  <Text style={styles.deliveryText}>
                    Estimated delivery: {estimatedDelivery} min
                  </Text>
                </View>
              </View>
            </ScrollView>

            {/* ── Checkout Button ─────────────────── */}
            <View style={styles.checkoutBar}>
              <View style={styles.checkoutTotal}>
                <Text style={styles.checkoutTotalLabel}>Total</Text>
                <Text style={styles.checkoutTotalValue}>${totals.total.toFixed(2)}</Text>
              </View>
              <Pressable onPress={handleCheckout} style={styles.checkoutButton}>
                <Text style={styles.checkoutButtonText}>Checkout</Text>
                <Ionicons name="arrow-forward" size={18} color="#231E19" />
              </Pressable>
            </View>
          </>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F6F4EF",
  },
  safeArea: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D4CEC4",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#231E19",
  },

  // List
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  // Item Card
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 14,
    marginBottom: 14,
    shadowColor: "#55493B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  itemImage: {
    width: 72,
    height: 56,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 14,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#27221D",
  },
  itemPrice: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "800",
    color: "#F07A43",
  },
  itemUnit: {
    marginTop: 2,
    fontSize: 11,
    color: "#AAA49A",
    fontWeight: "500",
  },
  variationRow: {
    marginTop: 4,
  },
  variationText: {
    fontSize: 12,
    color: "#8C847B",
    fontWeight: "500",
  },

  // Quantity Controls
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#F6F4EF",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyButtonDanger: {
    backgroundColor: "#FFF0EE",
  },
  qtyText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#231E19",
    minWidth: 20,
    textAlign: "center",
  },

  // Summary
  summaryCard: {
    marginTop: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#55493B",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#231E19",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#8C847B",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 14,
    color: "#3E3832",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#EDE8E0",
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: "800",
    color: "#231E19",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#F07A43",
  },
  deliveryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    gap: 6,
  },
  deliveryText: {
    fontSize: 12,
    color: "#8C847B",
    fontWeight: "500",
  },

  // Checkout Bar
  checkoutBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 18,
    paddingBottom: 34,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: "#55493B",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
  checkoutTotal: {},
  checkoutTotalLabel: {
    fontSize: 12,
    color: "#8C847B",
    fontWeight: "500",
  },
  checkoutTotalValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#231E19",
    marginTop: 2,
  },
  checkoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8CB4B",
    borderRadius: 999,
    paddingHorizontal: 28,
    paddingVertical: 16,
    gap: 8,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#231E19",
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyIconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: "#55493B",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#25211C",
    letterSpacing: -0.5,
  },
  emptySubtitle: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    color: "#8C847B",
    textAlign: "center",
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    backgroundColor: "#F8CB4B",
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 8,
  },
  emptyButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#231E19",
  },
});
