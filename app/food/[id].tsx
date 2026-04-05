import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ingredientImageSources, menuVisualSources } from "@/constants/menuAssets";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { placeOrder, selectSelectedItemById, toggleFavorite } from "@/store/menuSlice";

export default function FoodDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const item = useAppSelector((state) => (id ? selectSelectedItemById(state, id) : undefined));
  const ordersCount = useAppSelector((state) => state.menu.ordersCount);

  if (!item) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.missingState}>
          <Text style={styles.missingTitle}>Food item not found</Text>
          <Pressable onPress={() => router.replace("/home")} style={styles.missingButton}>
            <Text style={styles.missingButtonText}>Back to home</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const imageSource = item.imageUrl ? { uri: item.imageUrl } : menuVisualSources[item.visualKey];

  const handleOrder = () => {
    dispatch(placeOrder());
    Alert.alert("Order placed", `${item.name} added to your orders. Total orders: ${ordersCount + 1}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <Pressable onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons color="#231E19" name="chevron-back" size={22} />
          </Pressable>

          <Pressable
            onPress={() => dispatch(toggleFavorite(item.id))}
            style={[styles.iconButton, item.isFavorite && styles.favoriteButton]}
          >
            <Ionicons
              color={item.isFavorite ? "#FFFFFF" : "#231E19"}
              name={item.isFavorite ? "star" : "star-outline"}
              size={20}
            />
          </Pressable>
        </View>

        <View style={styles.heroRow}>
          <View style={styles.copyBlock}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            <Text style={styles.reviewText}>
              {item.rating.toFixed(1)} rating from {item.reviewCount} reviews
            </Text>

            <View style={styles.metricGroup}>
              <Text style={styles.metricLabel}>Size</Text>
              <Text style={styles.metricValue}>{item.sizeLabel}</Text>
            </View>

            <View style={styles.metricGroup}>
              <Text style={styles.metricLabel}>Crust</Text>
              <Text style={styles.metricValue}>{item.crustLabel}</Text>
            </View>

            <View style={styles.metricGroup}>
              <Text style={styles.metricLabel}>Delivery in</Text>
              <Text style={styles.metricValue}>{item.deliveryMinutes} min</Text>
            </View>
          </View>

          <View style={styles.imageWrap}>
            <Image source={imageSource} style={styles.heroImage} resizeMode="contain" />
          </View>
        </View>

        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>{item.description}</Text>
        </View>

        <Text style={styles.sectionTitle}>Ingredients</Text>

        <View style={styles.ingredientRow}>
          {item.ingredientNames.map((ingredient, index) => (
            <View key={`${ingredient}-${index}`} style={styles.ingredientCard}>
              <Image
                source={ingredientImageSources[item.ingredientKeys[index]]}
                style={styles.ingredientImage}
                resizeMode="contain"
              />
              <Text numberOfLines={2} style={styles.ingredientLabel}>
                {ingredient}
              </Text>
            </View>
          ))}
        </View>

        <Pressable onPress={handleOrder} style={styles.orderButton}>
          <Text style={styles.orderButtonText}>Place an order</Text>
          <Ionicons color="#231E19" name="chevron-forward" size={18} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6F4EF",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D4CEC4",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteButton: {
    borderColor: "#F8CB4B",
    backgroundColor: "#F8CB4B",
  },
  heroRow: {
    marginTop: 34,
  },
  copyBlock: {
    maxWidth: "58%",
  },
  name: {
    fontSize: 46,
    lineHeight: 48,
    fontWeight: "900",
    color: "#25211C",
    letterSpacing: -1.1,
  },
  price: {
    marginTop: 16,
    fontSize: 28,
    fontWeight: "800",
    color: "#F07A43",
  },
  reviewText: {
    marginTop: 8,
    fontSize: 13,
    color: "#8E867D",
  },
  metricGroup: {
    marginTop: 18,
  },
  metricLabel: {
    fontSize: 14,
    color: "#C2BCB3",
    fontWeight: "500",
  },
  metricValue: {
    marginTop: 4,
    fontSize: 17,
    color: "#241F1B",
    fontWeight: "800",
  },
  imageWrap: {
    alignItems: "flex-end",
    marginTop: -12,
  },
  heroImage: {
    width: 260,
    height: 200,
    alignSelf: "flex-end",
  },
  descriptionCard: {
    marginTop: 20,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    padding: 18,
    shadowColor: "#55493B",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6E665D",
  },
  sectionTitle: {
    marginTop: 28,
    fontSize: 18,
    fontWeight: "800",
    color: "#231E19",
  },
  ingredientRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ingredientCard: {
    width: "31%",
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#55493B",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  ingredientImage: {
    width: 58,
    height: 44,
  },
  ingredientLabel: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 17,
    color: "#615A52",
    fontWeight: "600",
  },
  orderButton: {
    marginTop: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: "#F8CB4B",
    paddingVertical: 18,
  },
  orderButtonText: {
    marginRight: 8,
    color: "#231E19",
    fontSize: 17,
    fontWeight: "800",
  },
  missingState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  missingTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#25211C",
  },
  missingButton: {
    marginTop: 18,
    borderRadius: 999,
    backgroundColor: "#F8CB4B",
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  missingButtonText: {
    color: "#231E19",
    fontSize: 14,
    fontWeight: "800",
  },
});
