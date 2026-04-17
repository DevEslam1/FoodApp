import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "@/src/presentation/state/hooks";
import { selectFavoriteItems } from "@/src/presentation/state/menuSlice";
import { addToCart } from "@/src/presentation/state/cartSlice";
import FoodCard from "@/src/presentation/components/FoodCard";
import FloatingCartButton from "@/src/presentation/components/FloatingCartButton";
import * as Haptics from "expo-haptics";
import { MenuItem } from "@/src/domain/entities/Menu";

export default function FavoritesScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const favoriteItems = useAppSelector(selectFavoriteItems);

  const handleAddToCart = (item: MenuItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    dispatch(addToCart({ menuItem: item, quantity: 1 }));
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons color="#231E19" name="chevron-back" size={24} />
          </Pressable>
          <Text style={styles.title}>My Favorites</Text>
          <View style={{ width: 44 }} /> 
        </View>

        {favoriteItems.length > 0 ? (
          <FlatList
            data={favoriteItems}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <FoodCard
                item={item}
                onPress={() =>
                  router.push({
                    pathname: "/food/[id]",
                    params: { id: item.id },
                  })
                }
                onAddToCart={() => handleAddToCart(item)}
              />
            )}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons color="#D4CEC4" name="heart-outline" size={80} />
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptyText}>
              Explore our menu and heart your top picks to see them here!
            </Text>
            <Pressable
              onPress={() => router.push("/home")}
              style={styles.emptyButton}
            >
              <Text style={styles.emptyButtonText}>Explore Menu</Text>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
      <FloatingCartButton />
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
    paddingVertical: 15,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#55493B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#231E19",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: "800",
    color: "#2A241F",
  },
  emptyText: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
    color: "#8C847B",
  },
  emptyButton: {
    marginTop: 30,
    borderRadius: 999,
    backgroundColor: "#F8CB4B",
    paddingHorizontal: 30,
    paddingVertical: 15,
    shadowColor: "#F8CB4B",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  emptyButtonText: {
    color: "#231E19",
    fontSize: 16,
    fontWeight: "800",
  },
});
