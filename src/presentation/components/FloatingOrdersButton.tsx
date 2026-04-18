import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text, View } from "react-native";
import AnimatedRN, { FadeInRight, FadeOutRight } from "react-native-reanimated";
import { useAppSelector } from "@/src/presentation/state/hooks";
import { selectOrders } from "@/src/presentation/state/cartSlice";

export default function FloatingOrdersButton() {
  const router = useRouter();
  const orders = useAppSelector(selectOrders);
  const activeOrders = orders.filter((o) => o.status !== "delivered");
  const spinAnim = useRef(new Animated.Value(0)).current;

  const hasActive = activeOrders.length > 0;

  useEffect(() => {
    if (hasActive) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      spinAnim.setValue(0);
    }
  }, [hasActive, spinAnim]);

  if (orders.length === 0) return null;

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <AnimatedRN.View
      entering={FadeInRight.springify()}
      exiting={FadeOutRight}
      style={styles.container}
    >
      <Pressable
        onPress={() => router.push("/orders" as any)}
        style={({ pressed }) => [
          styles.fab,
          pressed && { transform: [{ scale: 0.9 }] },
        ]}
      >
        {/* Spinning ring behind the icon when orders are active */}
        {hasActive && (
          <Animated.View
            style={[styles.spinRing, { transform: [{ rotate: spin }] }]}
          />
        )}
        <Ionicons name="receipt" size={26} color="#FFFFFF" />

        {/* Active count badge */}
        {hasActive && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{activeOrders.length}</Text>
          </View>
        )}
      </Pressable>
    </AnimatedRN.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 100,
    right: 20,
    zIndex: 100,
  },
  fab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#2B2521",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },
  spinRing: {
    position: "absolute",
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2.5,
    borderColor: "transparent",
    borderTopColor: "#F4A22A",
    borderRightColor: "#F4A22A",
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "#F06B62",
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "#2B2521",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
});
