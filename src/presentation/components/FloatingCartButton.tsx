import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, { FadeInRight, FadeOutRight } from "react-native-reanimated";
import { useAppSelector } from "@/src/presentation/state/hooks";
import { selectCartItemCount } from "@/src/presentation/state/cartSlice";

interface Props {
  bottomOffset?: number;
}

export default function FloatingCartButton({ bottomOffset = 30 }: Props) {
  const router = useRouter();
  const cartCount = useAppSelector(selectCartItemCount);

  if (cartCount === 0) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeInRight.springify()}
      exiting={FadeOutRight}
      style={[styles.fabContainer, { bottom: bottomOffset }]}
    >
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push("/cart" as any);
        }}
        style={({ pressed }) => [
          styles.fab,
          pressed && { transform: [{ scale: 0.9 }] },
        ]}
      >
        <Ionicons name="bag-handle" size={28} color="#231E19" />
        <View style={styles.fabBadge}>
          <Text style={styles.fabBadgeText}>{cartCount}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    bottom: 30,
    right: 20,
    zIndex: 100,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F8CB4B",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2B2118",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  fabBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#F06B62",
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "#F8CB4B",
  },
  fabBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
});
