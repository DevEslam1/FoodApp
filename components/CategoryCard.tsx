import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { categoryIconSources } from "@/constants/menuAssets";
import type { MenuCategory } from "@/constants/menuData";

interface CategoryCardProps {
  category: MenuCategory;
  active: boolean;
  onPress: () => void;
}

export default function CategoryCard({
  category,
  active,
  onPress,
}: CategoryCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, active ? styles.cardActive : styles.cardIdle]}
    >
      <Image source={categoryIconSources[category.id]} style={styles.icon} resizeMode="contain" />
      <Text style={[styles.label, active && styles.labelActive]}>{category.label}</Text>
      <View style={[styles.circle, active ? styles.circleActive : styles.circleIdle]}>
        <Ionicons
          color={active ? "#1F1A17" : "#FFFFFF"}
          name="arrow-forward"
          size={16}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 102,
    minHeight: 166,
    marginRight: 18,
    borderRadius: 28,
    paddingHorizontal: 14,
    paddingTop: 18,
    paddingBottom: 14,
    justifyContent: "space-between",
    shadowColor: "#55493B",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 5,
  },
  cardActive: {
    backgroundColor: "#F8CB4B",
  },
  cardIdle: {
    backgroundColor: "#FFFFFF",
  },
  icon: {
    width: 54,
    height: 54,
    alignSelf: "center",
  },
  label: {
    fontSize: 17,
    fontWeight: "700",
    color: "#3E3832",
    textAlign: "center",
  },
  labelActive: {
    color: "#2A241F",
  },
  circle: {
    width: 30,
    height: 30,
    alignSelf: "center",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  circleActive: {
    backgroundColor: "#FFFFFF",
  },
  circleIdle: {
    backgroundColor: "#F06B62",
  },
});
