import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { menuVisualSources } from "@/constants/menuAssets";
import { MenuItem } from "@/src/domain/entities/Menu";

interface FoodCardProps {
  item: MenuItem;
  onPress: () => void;
  onAddToCart?: () => void;
}

const getImageSource = (item: MenuItem): ImageSourcePropType | { uri: string } =>
  item.imageUrl ? { uri: item.imageUrl } : menuVisualSources[item.visualKey];

export default function FoodCard({ item, onPress, onAddToCart }: FoodCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.badgeRow}>
          <Ionicons color="#F3BF3E" name="sparkles" size={14} />
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>

        {item.isFavorite ? (
          <View style={styles.favoritePill}>
            <Ionicons color="#FFFFFF" name="heart" size={12} />
          </View>
        ) : null}
      </View>

      <View style={styles.contentRow}>
        <View style={styles.copyColumn}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.weight}>{item.weightLabel}</Text>
          <Text numberOfLines={2} style={styles.summary}>
            {item.summary}
          </Text>
        </View>

        <Image source={getImageSource(item)} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.footer}>
        <Pressable
          onPress={onAddToCart}
          style={({ pressed }) => [
            styles.addButton,
            pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] },
          ]}
        >
          <Ionicons color="#231E19" name="add" size={22} />
        </Pressable>

        <View style={styles.ratingRow}>
          <Ionicons color="#2A2825" name="star" size={14} />
          <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    paddingTop: 18,
    shadowColor: "#55493B",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  badgeText: {
    marginLeft: 6,
    color: "#3C352E",
    fontSize: 13,
    fontWeight: "700",
  },
  favoritePill: {
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: "#F06B62",
    alignItems: "center",
    justifyContent: "center",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: 18,
  },
  copyColumn: {
    flex: 1,
    paddingRight: 12,
  },
  name: {
    fontSize: 21,
    fontWeight: "800",
    color: "#27221D",
  },
  weight: {
    marginTop: 5,
    fontSize: 13,
    fontWeight: "500",
    color: "#AAA49A",
  },
  summary: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    color: "#8A8379",
  },
  image: {
    width: 144,
    height: 102,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FBF8F2",
  },
  addButton: {
    width: 86,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8CB4B",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  rating: {
    marginLeft: 5,
    color: "#28231F",
    fontSize: 14,
    fontWeight: "700",
  },
});
