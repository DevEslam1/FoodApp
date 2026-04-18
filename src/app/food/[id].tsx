import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ingredientImageSources, menuVisualSources } from "@/constants/menuAssets";
import { useAppDispatch, useAppSelector } from "@/src/presentation/state/hooks";
import { selectSelectedItemById, toggleFavorite } from "@/src/presentation/state/menuSlice";
import { addToCart } from "@/src/presentation/state/cartSlice";
import { ProductAddOn, ProductSize } from "@/src/domain/entities/Menu";
import FloatingCartButton from "@/src/presentation/components/FloatingCartButton";

export default function FoodDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const item = useAppSelector((state) => (id ? selectSelectedItemById(state, id) : undefined));
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [selectedSize, setSelectedSize] = useState<ProductSize | undefined>(item?.availableSizes?.[0]);
  const [selectedAddOns, setSelectedAddOns] = useState<ProductAddOn[]>([]);

  const currentPrice = item 
    ? (item.price * (selectedSize?.priceMultiplier || 1)) + selectedAddOns.reduce((sum, ao) => sum + ao.price, 0) 
    : 0;

  if (!item) {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={["top"]} style={styles.safeArea}>
          <View style={styles.missingState}>
            <Text style={styles.missingTitle}>Food item not found</Text>
            <Pressable onPress={() => router.replace("/home")} style={styles.missingButton}>
              <Text style={styles.missingButtonText}>Back to home</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const imageSource = item.imageUrl ? { uri: item.imageUrl } : menuVisualSources[item.visualKey];

  const handleAddToCart = () => {
    if (!item) return;
    dispatch(addToCart({ 
      menuItem: item, 
      quantity, 
      selectedSize, 
      selectedAddOns 
    }));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topRow}>
            <Pressable onPress={() => router.back()} style={styles.iconButton}>
              <Ionicons color="#231E19" name="chevron-back" size={22} />
            </Pressable>

            <View style={styles.topRight}>

              {/* Favorite Button */}
              <Pressable
                onPress={() => {
                  dispatch(toggleFavorite(item.id));
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                style={[styles.iconButton, item.isFavorite && styles.favoriteButton]}
              >
                <Ionicons
                  color={item.isFavorite ? "#FFFFFF" : "#231E19"}
                  name={item.isFavorite ? "star" : "star-outline"}
                  size={20}
                />
              </Pressable>
            </View>
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

          {item.availableSizes && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Select Size</Text>
              <View style={styles.sizeRow}>
                {item.availableSizes.map((size) => (
                  <Pressable
                    key={size.label}
                    onPress={() => setSelectedSize(size)}
                    style={[
                      styles.sizeButton,
                      selectedSize?.label === size.label && styles.selectedSizeButton,
                    ]}
                  >
                    <Text
                      style={[
                        styles.sizeButtonText,
                        selectedSize?.label === size.label && styles.selectedSizeButtonText,
                      ]}
                    >
                      {size.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {item.availableAddOns && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Add-ons</Text>
              <View style={styles.addOnsRow}>
                {item.availableAddOns.map((addOn) => {
                  const isSelected = selectedAddOns.some((a) => a.id === addOn.id);
                  return (
                    <Pressable
                      key={addOn.id}
                      onPress={() => {
                        setSelectedAddOns((prev) =>
                          isSelected
                            ? prev.filter((a) => a.id !== addOn.id)
                            : [...prev, addOn],
                        );
                      }}
                      style={[styles.addOnButton, isSelected && styles.selectedAddOnButton]}
                    >
                      <Text
                        style={[
                          styles.addOnButtonText,
                          isSelected && styles.selectedAddOnButtonText,
                        ]}
                      >
                        {addOn.name} (+${addOn.price.toFixed(2)})
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

        </ScrollView>
      </SafeAreaView>

      <SafeAreaView edges={["bottom"]} style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.quantityRow}>
            <Pressable
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              style={styles.qtyButton}
            >
              <Ionicons name="remove" size={18} color="#3E3832" />
            </Pressable>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <Pressable
              onPress={() => setQuantity((q) => q + 1)}
              style={styles.qtyButton}
            >
              <Ionicons name="add" size={18} color="#3E3832" />
            </Pressable>
          </View>

          <Pressable
            onPress={handleAddToCart}
            style={[styles.orderButton, addedFeedback && styles.orderButtonSuccess]}
          >
            {addedFeedback ? (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                <Text style={[styles.orderButtonText, { color: "#FFFFFF", marginLeft: 8 }]}>
                  Added!
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.orderButtonText}>
                  Add to Cart — ${(currentPrice * quantity).toFixed(2)}
                </Text>
                <Ionicons color="#231E19" name="bag-add-outline" size={18} />
              </>
            )}
          </Pressable>
        </View>
      </SafeAreaView>

      <FloatingCartButton bottomOffset={180} />
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
  topRight: {
    flexDirection: "row",
    gap: 10,
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

  // Add to Cart Section
  addToCartSection: {
    marginTop: 30,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginBottom: 18,
  },
  qtyButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E4DFD7",
    shadowColor: "#55493B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  qtyValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#231E19",
    minWidth: 32,
    textAlign: "center",
  },
  orderButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: "#F8CB4B",
    paddingVertical: 18,
    gap: 8,
  },
  orderButtonSuccess: {
    backgroundColor: "#4CAF50",
  },
  orderButtonText: {
    color: "#231E19",
    fontSize: 17,
    fontWeight: "800",
  },
  footer: {
    backgroundColor: "#F6F4EF",
    borderTopWidth: 1,
    borderTopColor: "#E4DFD7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  footerContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
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
  sectionContainer: {
    marginTop: 24,
  },
  sizeRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
  },
  sizeButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E4DFD7",
  },
  selectedSizeButton: {
    backgroundColor: "#231E19",
    borderColor: "#231E19",
  },
  sizeButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6E665D",
  },
  selectedSizeButtonText: {
    color: "#FFFFFF",
  },
  addOnsRow: {
    flexDirection: "column",
    gap: 10,
    marginTop: 14,
  },
  addOnButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4DFD7",
  },
  selectedAddOnButton: {
    borderColor: "#F8CB4B",
    backgroundColor: "#FEF9EB",
  },
  addOnButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3E3832",
  },
  selectedAddOnButtonText: {
    color: "#231E19",
    fontWeight: "800",
  },
});
