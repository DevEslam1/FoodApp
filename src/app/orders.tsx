import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppSelector } from "@/src/presentation/state/hooks";
import { selectOrders } from "@/src/presentation/state/cartSlice";
import type { Order, OrderStatus } from "@/src/domain/entities/Cart";

// ── Circular Progress Ring ─────────────────────────────────────────
function OrderProgressRing({ status }: { status: OrderStatus }) {
  const spinAnim = useRef(new Animated.Value(0)).current;

  const isActive = status !== "delivered";

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1400,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    }
  }, [isActive, spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (status === "delivered") {
    return (
      <View style={ringStyles.deliveredCircle}>
        <Ionicons name="checkmark" size={22} color="#FFFFFF" />
      </View>
    );
  }

  return (
    <View style={ringStyles.container}>
      <Animated.View
        style={[ringStyles.ring, { transform: [{ rotate: spin }] }]}
      />
      <View style={ringStyles.iconOverlay}>
        {status === "preparing" ? (
          <Ionicons name="restaurant-outline" size={18} color="#F4A22A" />
        ) : (
          <Ionicons name="bicycle-outline" size={18} color="#F4A22A" />
        )}
      </View>
    </View>
  );
}

const ringStyles = StyleSheet.create({
  container: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "transparent",
    borderTopColor: "#F4A22A",
    borderRightColor: "#F4A22A",
    position: "absolute",
  },
  iconOverlay: {
    alignItems: "center",
    justifyContent: "center",
  },
  deliveredCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
  },
});

// ── Status Label Badge ────────────────────────────────────────────
function StatusBadge({ status }: { status: OrderStatus }) {
  const config: Record<OrderStatus, { label: string; bg: string; color: string }> = {
    preparing: { label: "Preparing", bg: "#FFF3E0", color: "#E67E22" },
    on_the_way: { label: "On the Way", bg: "#E3F2FD", color: "#2196F3" },
    delivered: { label: "Delivered", bg: "#E8F5E9", color: "#4CAF50" },
  };
  const c = config[status];
  return (
    <View style={[badgeStyles.badge, { backgroundColor: c.bg }]}>
      <Text style={[badgeStyles.text, { color: c.color }]}>{c.label}</Text>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  text: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});

// ── Order Card ────────────────────────────────────────────────────
function OrderCard({
  order,
  onPress,
}: {
  order: Order;
  onPress: () => void;
}) {
  const itemsPreview = order.items
    .slice(0, 3)
    .map((ci) => ci.menuItem.name)
    .join(", ");
  const moreCount = order.items.length - 3;
  const dateStr = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        cardStyles.card,
        pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 },
      ]}
    >
      <View style={cardStyles.topRow}>
        <OrderProgressRing status={order.status} />
        <View style={cardStyles.info}>
          <View style={cardStyles.titleRow}>
            <Text style={cardStyles.orderId}>
              Order #{order.id.slice(0, 6).toUpperCase()}
            </Text>
            <StatusBadge status={order.status} />
          </View>
          <Text style={cardStyles.dateText}>{dateStr}</Text>
        </View>
      </View>

      <View style={cardStyles.divider} />

      <View style={cardStyles.itemsRow}>
        <Ionicons name="fast-food-outline" size={14} color="#A49B90" />
        <Text style={cardStyles.itemsText} numberOfLines={1}>
          {itemsPreview}
          {moreCount > 0 ? ` + ${moreCount} more` : ""}
        </Text>
      </View>

      <View style={cardStyles.bottomRow}>
        <View style={cardStyles.totalWrap}>
          <Text style={cardStyles.totalLabel}>Total</Text>
          <Text style={cardStyles.totalValue}>${order.total.toFixed(2)}</Text>
        </View>

        <View style={cardStyles.metaWrap}>
          <Ionicons name="time-outline" size={13} color="#AAA49A" />
          <Text style={cardStyles.metaText}>
            {order.estimatedMinutes} min
          </Text>
        </View>

        <View style={cardStyles.arrowWrap}>
          <Ionicons name="chevron-forward" size={16} color="#C4BDB4" />
        </View>
      </View>
    </Pressable>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#55493B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 5,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  orderId: {
    fontSize: 15,
    fontWeight: "800",
    color: "#2A241F",
    letterSpacing: 0.2,
  },
  dateText: {
    marginTop: 4,
    fontSize: 12,
    color: "#A49B90",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1ECE4",
    marginVertical: 14,
  },
  itemsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  itemsText: {
    flex: 1,
    fontSize: 13,
    color: "#6E665D",
    fontWeight: "500",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  totalWrap: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 11,
    color: "#AAA49A",
    fontWeight: "500",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#F07A43",
    marginTop: 1,
  },
  metaWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginRight: 12,
  },
  metaText: {
    fontSize: 12,
    color: "#AAA49A",
    fontWeight: "500",
  },
  arrowWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F6F4EF",
    alignItems: "center",
    justifyContent: "center",
  },
});

// ── Main Orders Screen ─────────────────────────────────────────────
export default function OrdersScreen() {
  const router = useRouter();
  const orders = useAppSelector(selectOrders);

  const activeOrders = orders.filter((o) => o.status !== "delivered");
  const pastOrders = orders.filter((o) => o.status === "delivered");

  const handleOrderPress = (order: Order) => {
    if (order.status !== "delivered") {
      router.push("/order-tracking" as any);
    }
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons color="#231E19" name="chevron-back" size={22} />
          </Pressable>
          <Text style={styles.headerTitle}>My Orders</Text>
          <View style={styles.backButton} />
        </View>

        {orders.length === 0 ? (
          /* ── Empty State ─────────────────── */
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="receipt-outline" size={64} color="#D4CEC4" />
            </View>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySubtitle}>
              {"Your order history will\nappear here."}
            </Text>
            <Pressable
              onPress={() => router.replace("/home" as any)}
              style={styles.emptyButton}
            >
              <Text style={styles.emptyButtonText}>Browse Menu</Text>
              <Ionicons name="arrow-forward" size={16} color="#231E19" />
            </Pressable>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Active Orders Section */}
            {activeOrders.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionDot} />
                  <Text style={styles.sectionTitle}>Active Orders</Text>
                  <Text style={styles.sectionCount}>
                    {activeOrders.length}
                  </Text>
                </View>
                {activeOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onPress={() => handleOrderPress(order)}
                  />
                ))}
              </>
            )}

            {/* Past Orders Section */}
            {pastOrders.length > 0 && (
              <>
                <View
                  style={[
                    styles.sectionHeader,
                    activeOrders.length > 0 && { marginTop: 24 },
                  ]}
                >
                  <View
                    style={[styles.sectionDot, { backgroundColor: "#4CAF50" }]}
                  />
                  <Text style={styles.sectionTitle}>Past Orders</Text>
                  <Text style={styles.sectionCount}>{pastOrders.length}</Text>
                </View>
                {pastOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onPress={() => handleOrderPress(order)}
                  />
                ))}
              </>
            )}
          </ScrollView>
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
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F4A22A",
  },
  sectionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: "#2A241F",
  },
  sectionCount: {
    fontSize: 13,
    fontWeight: "700",
    color: "#AAA49A",
    backgroundColor: "#F1ECE4",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    overflow: "hidden",
  },
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
