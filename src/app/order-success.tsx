import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "@/src/presentation/state/hooks";
import { clearLastOrder, selectLastOrder } from "@/src/presentation/state/cartSlice";

export default function OrderSuccessScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const order = useAppSelector(selectLastOrder);

  // ── Animations ────────────────────────────────────
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleBackToMenu = () => {
    dispatch(clearLastOrder());
    router.replace("/home" as any);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
        <View style={styles.container}>
          {/* Animated Checkmark */}
          <Animated.View
            style={[
              styles.checkCircle,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <View style={styles.checkInner}>
              <Ionicons name="checkmark" size={48} color="#FFFFFF" />
            </View>
          </Animated.View>

          {/* Animated Content */}
          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.title}>Order Placed!</Text>
            <Text style={styles.subtitle}>
              Your delicious food is being{"\n"}prepared with love.
            </Text>

            {/* Order Details Card */}
            {order && (
              <View style={styles.orderCard}>
                <View style={styles.orderRow}>
                  <Text style={styles.orderLabel}>Order ID</Text>
                  <Text style={styles.orderValue}>{order.id}</Text>
                </View>

                <View style={styles.orderDivider} />

                <View style={styles.orderRow}>
                  <Text style={styles.orderLabel}>Items</Text>
                  <Text style={styles.orderValue}>
                    {order.items.reduce((sum, ci) => sum + ci.quantity, 0)} items
                  </Text>
                </View>

                <View style={styles.orderDivider} />

                <View style={styles.orderRow}>
                  <Text style={styles.orderLabel}>Total Paid</Text>
                  <Text style={styles.orderTotalValue}>${order.total.toFixed(2)}</Text>
                </View>

                <View style={styles.orderDivider} />

                <View style={styles.deliveryRow}>
                  <View style={styles.deliveryIcon}>
                    <Ionicons name="bicycle-outline" size={18} color="#F07A43" />
                  </View>
                  <View>
                    <Text style={styles.deliveryLabel}>Estimated Delivery</Text>
                    <Text style={styles.deliveryValue}>
                      {order.estimatedMinutes} minutes
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Progress Steps */}
            <View style={styles.progressContainer}>
              <ProgressStep icon="restaurant-outline" label="Preparing" active />
              <View style={styles.progressLine} />
              <ProgressStep icon="bicycle-outline" label="On the way" active={false} />
              <View style={styles.progressLine} />
              <ProgressStep icon="home-outline" label="Delivered" active={false} />
            </View>
          </Animated.View>

          {/* Bottom Button */}
          <Animated.View style={{ opacity: fadeAnim }}>
            <Pressable onPress={handleBackToMenu} style={styles.menuButton}>
              <Text style={styles.menuButtonText}>Back to Menu</Text>
              <Ionicons name="arrow-forward" size={18} color="#231E19" />
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

function ProgressStep({ icon, label, active }: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active: boolean;
}) {
  return (
    <View style={styles.stepContainer}>
      <View style={[styles.stepCircle, active && styles.stepCircleActive]}>
        <Ionicons
          name={icon}
          size={18}
          color={active ? "#FFFFFF" : "#C2BCB3"}
        />
      </View>
      <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>
        {label}
      </Text>
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
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },

  // Checkmark
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E8F5E8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  checkInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
  },

  // Text
  textContainer: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#25211C",
    letterSpacing: -0.8,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: "#8C847B",
    textAlign: "center",
  },

  // Order Card
  orderCard: {
    marginTop: 28,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#55493B",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  orderLabel: {
    fontSize: 14,
    color: "#8C847B",
    fontWeight: "500",
  },
  orderValue: {
    fontSize: 14,
    color: "#3E3832",
    fontWeight: "700",
  },
  orderTotalValue: {
    fontSize: 18,
    color: "#F07A43",
    fontWeight: "900",
  },
  orderDivider: {
    height: 1,
    backgroundColor: "#F2EDE6",
    marginVertical: 4,
  },
  deliveryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    gap: 12,
  },
  deliveryIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FFF5EB",
    alignItems: "center",
    justifyContent: "center",
  },
  deliveryLabel: {
    fontSize: 12,
    color: "#8C847B",
    fontWeight: "500",
  },
  deliveryValue: {
    fontSize: 15,
    color: "#231E19",
    fontWeight: "800",
    marginTop: 2,
  },

  // Progress Steps
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 28,
    justifyContent: "center",
  },
  stepContainer: {
    alignItems: "center",
    gap: 6,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EDEBE6",
    alignItems: "center",
    justifyContent: "center",
  },
  stepCircleActive: {
    backgroundColor: "#F07A43",
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#C2BCB3",
  },
  stepLabelActive: {
    color: "#3E3832",
    fontWeight: "700",
  },
  progressLine: {
    width: 36,
    height: 2,
    backgroundColor: "#EDEBE6",
    marginHorizontal: 4,
    marginBottom: 18,
  },

  // Button
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 36,
    backgroundColor: "#F8CB4B",
    borderRadius: 999,
    paddingHorizontal: 28,
    paddingVertical: 16,
    gap: 8,
  },
  menuButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#231E19",
  },
});
