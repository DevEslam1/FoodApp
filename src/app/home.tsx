import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CategoryCard from "@/src/presentation/components/CategoryCard";
import FoodCard from "@/src/presentation/components/FoodCard";
import { profileImageSource } from "@/constants/menuAssets";
import { useAppDispatch, useAppSelector } from "@/src/presentation/state/hooks";
import {
  fetchFeaturedMenu,
  selectCategories,
  selectVisibleItems,
  setSearchQuery,
  setSelectedCategory,
} from "@/src/presentation/state/menuSlice";
import { selectCartItemCount } from "@/src/presentation/state/cartSlice";
import { MenuItem, MenuCategory } from "@/src/domain/entities/Menu";

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const visibleItems = useAppSelector(selectVisibleItems);
  const selectedCategoryId = useAppSelector(
    (state) => state.menu.selectedCategoryId,
  );
  const searchQuery = useAppSelector((state) => state.menu.searchQuery);
  const cartCount = useAppSelector(selectCartItemCount);
  const status = useAppSelector((state) => state.menu.status);
  const errorMessage = useAppSelector((state) => state.menu.errorMessage);
  const syncMessage = useAppSelector((state) => state.menu.syncMessage);

  useEffect(() => {
    if (status === "idle") {
      void dispatch(fetchFeaturedMenu());
    }
  }, [dispatch, status]);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "none"}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <Image source={profileImageSource} style={styles.avatar} />

            <Pressable onPress={() => router.push("/cart" as any)} style={styles.menuWrapper}>
              <Ionicons color="#55504B" name="bag-outline" size={26} />
              {cartCount > 0 && (
                <View style={styles.orderBadge}>
                  <Text style={styles.orderBadgeText}>{cartCount}</Text>
                </View>
              )}
            </Pressable>
          </View>

          <View style={styles.titleGroup}>
            <Text style={styles.eyebrow}>Food</Text>
            <Text style={styles.title}>Delivery</Text>
          </View>

          <View style={styles.searchBox}>
            <Ionicons color="#4C4741" name="search-outline" size={20} />
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(text) => dispatch(setSearchQuery(text))}
              placeholder="Search..."
              placeholderTextColor="#B5AEA5"
              returnKeyType="search"
              style={styles.searchInput}
              value={searchQuery}
            />
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <Text style={styles.sectionCaption}>
              {
                categories.find(
                  (category: MenuCategory) => category.id === selectedCategoryId,
                )?.caption
              }
            </Text>
          </View>

          <ScrollView
            horizontal
            contentContainerStyle={styles.horizontalListContent}
            keyboardShouldPersistTaps="handled"
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalList}
          >
            {categories.map((category: MenuCategory) => (
              <CategoryCard
                key={category.id}
                active={category.id === selectedCategoryId}
                category={category}
                onPress={() => dispatch(setSelectedCategory(category.id))}
              />
            ))}
          </ScrollView>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular</Text>
            {status === "loading" ? (
              <View style={styles.statusRow}>
                <ActivityIndicator color="#F0A42E" size="small" />
                <Text style={styles.statusInline}>
                  Loading live specials...
                </Text>
              </View>
            ) : errorMessage ? (
              <Text style={styles.statusText}>{errorMessage}</Text>
            ) : syncMessage ? (
              <Text style={styles.statusText}>{syncMessage}</Text>
            ) : null}
          </View>

          {visibleItems.length > 0 ? (
            visibleItems.map((item: MenuItem) => (
              <FoodCard
                key={item.id}
                item={item}
                onPress={() =>
                  router.push({
                    pathname: "/food/[id]",
                    params: { id: item.id },
                  })
                }
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptyText}>
                Try another search or switch category to load more cards.
              </Text>
              <Pressable
                onPress={() => {
                  dispatch(setSearchQuery(""));
                  dispatch(setSelectedCategory("pizza"));
                }}
                style={styles.emptyButton}
              >
                <Text style={styles.emptyButtonText}>Reset filters</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
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
  keyboard: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  menuWrapper: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  orderBadge: {
    position: "absolute",
    right: -2,
    top: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 999,
    backgroundColor: "#F06B62",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  orderBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  titleGroup: {
    marginTop: 26,
  },
  eyebrow: {
    fontSize: 24,
    color: "#7F786F",
    fontWeight: "500",
  },
  title: {
    marginTop: 4,
    fontSize: 50,
    lineHeight: 54,
    color: "#26221D",
    fontWeight: "900",
    letterSpacing: -1.1,
  },
  searchBox: {
    marginTop: 26,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#CFC8BE",
    paddingBottom: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#28231F",
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#231E19",
  },
  sectionCaption: {
    marginTop: 5,
    fontSize: 12,
    color: "#8C847B",
    fontWeight: "500",
  },
  horizontalList: {
    marginLeft: -20,
    marginRight: -20,
  },
  horizontalListContent: {
    paddingHorizontal: 20,
    paddingVertical: 15, // extra room for shadows
  },
  statusRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  statusInline: {
    marginLeft: 8,
    fontSize: 12,
    color: "#93897E",
    fontWeight: "500",
  },
  statusText: {
    marginTop: 6,
    fontSize: 12,
    color: "#93897E",
    fontWeight: "500",
  },
  emptyState: {
    marginTop: 8,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    padding: 24,
    shadowColor: "#55493B",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2A241F",
  },
  emptyText: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    color: "#8C847B",
  },
  emptyButton: {
    marginTop: 18,
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: "#F8CB4B",
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  emptyButtonText: {
    color: "#231E19",
    fontSize: 13,
    fontWeight: "800",
  },
});
