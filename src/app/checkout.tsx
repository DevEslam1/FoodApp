import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, Layout, FadeIn } from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

import CustomInput from "@/src/presentation/components/CustomInput";
import { checkout, selectCartTotals } from "@/src/presentation/state/cartSlice";
import { selectUserProfile } from "@/src/presentation/state/userSlice";
import { Address, PaymentMethod } from "@/src/domain/entities/Cart";
import { SavedAddress, SavedCard } from "@/src/domain/entities/User";

export default function CheckoutScreen() {
  const dispatch = useDispatch();
  const totals = useSelector(selectCartTotals);
  const user = useSelector(selectUserProfile);

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#F4A22A" />
      </View>
    );
  }

  // Address State
  const [address, setAddress] = useState<Address>({
    governorate: "",
    city: "",
    street: "",
    building: "",
    floor: "",
    apartment: "",
    latitude: undefined,
    longitude: undefined,
  });

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const handleSelectSavedAddress = (saved: SavedAddress) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedAddressId(saved.id);
    setAddress({
      governorate: saved.governorate,
      city: saved.city,
      street: saved.street,
      building: saved.building,
      floor: saved.floor,
      apartment: saved.apartment,
      latitude: undefined,
      longitude: undefined,
    });
  };

  const handleDetectLocation = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const geocodeList = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocodeList.length > 0) {
        const place = geocodeList[0];
        setAddress({
          ...address,
          governorate: place.region || "",
          city: place.city || place.subregion || "",
          street: place.street || place.name || "",
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        setSelectedAddressId(null);
      }
    } catch (error) {
      alert("Could not detect location. Please try again.");
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleSelectSavedCard = (card: SavedCard) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCardId(card.id);
    setPaymentMethod("visa");
    setCardDetails({
      number: `**** **** **** ${card.lastFour}`,
      expiry: card.expiry,
      cvv: "123", // Mock CVV
    });
  };

  const handlePlaceOrder = () => {
    // Basic validation
    if (!address.governorate || !address.city || !address.street || !address.building) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      alert("Please fill in the required delivery address fields.");
      return;
    }

    if (paymentMethod === "visa" && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      alert("Please fill in your credit card details.");
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    dispatch(checkout({ address, paymentMethod }));
    router.replace("/order-success");
  };

  const renderPaymentMethod = (id: PaymentMethod, label: string, icon: keyof typeof Ionicons.glyphMap) => {
    const isSelected = paymentMethod === id;
    return (
      <TouchableOpacity
        style={[styles.paymentBtn, isSelected && styles.paymentBtnActive]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setPaymentMethod(id);
        }}
      >
        <Ionicons name={icon} size={24} color={isSelected ? "#FFFFFF" : "#6A6A6A"} />
        <Text style={[styles.paymentBtnText, isSelected && styles.paymentBtnTextActive]}>
          {label}
        </Text>
        <View style={[styles.radio, isSelected && styles.radioActive]}>
          {isSelected && <View style={styles.radioInner} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#2B2521" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Section: Delivery Address */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Delivery Address (Egypt)</Text>
              <TouchableOpacity style={styles.detectBtn} onPress={handleDetectLocation}>
                {isLoadingLocation ? (
                  <ActivityIndicator size="small" color="#F4A22A" style={{ marginRight: 4 }} />
                ) : (
                  <Ionicons name="location" size={16} color="#F4A22A" />
                )}
                <Text style={styles.detectBtnText}>Detect Location</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.savedItemsScroll}
              contentContainerStyle={styles.savedItemsContent}
            >
              {user.savedAddresses.map((addr) => (
                <TouchableOpacity
                  key={addr.id}
                  onPress={() => handleSelectSavedAddress(addr)}
                  style={[
                    styles.addressChip,
                    selectedAddressId === addr.id && styles.activeChip
                  ]}
                >
                  <Ionicons 
                    name={addr.label === "Home" ? "home" : "business"} 
                    size={16} 
                    color={selectedAddressId === addr.id ? "#FFFFFF" : "#6A6A6A"} 
                  />
                  <Text style={[
                    styles.chipText,
                    selectedAddressId === addr.id && styles.activeChipText
                  ]}>
                    {addr.label}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.addressChip}>
                <Ionicons name="add" size={16} color="#6A6A6A" />
                <Text style={styles.chipText}>New</Text>
              </TouchableOpacity>
            </ScrollView>

            {address.latitude && address.longitude && (
              <Animated.View entering={FadeIn} style={styles.mapPreviewContainer}>
                <MapView
                  style={styles.mapPreview}
                  initialRegion={{
                    latitude: address.latitude,
                    longitude: address.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                >
                  <Marker
                    coordinate={{
                      latitude: address.latitude,
                      longitude: address.longitude,
                    }}
                    draggable
                    onDragEnd={async (e) => {
                       const newCoords = e.nativeEvent.coordinate;
                       const geocodeList = await Location.reverseGeocodeAsync(newCoords);
                       if (geocodeList.length > 0) {
                          const place = geocodeList[0];
                          setAddress({
                            ...address,
                            street: place.street || place.name || address.street,
                            latitude: newCoords.latitude,
                            longitude: newCoords.longitude,
                          });
                       }
                    }}
                  />
                </MapView>
                <View style={styles.mapOverlayHint}>
                  <Text style={styles.mapHintText}>Drag pin to fine-tune</Text>
                </View>
              </Animated.View>
            )}
            
            <View style={styles.row}>
              <View style={{ flex: 1.2, marginRight: 10 }}>
                <CustomInput
                  label="Governorate"
                  iconName="location"
                  placeholder="e.g. Cairo"
                  value={address.governorate}
                  onChangeText={(t) => setAddress({ ...address, governorate: t })}
                />
              </View>
              <View style={{ flex: 1 }}>
                <CustomInput
                  label="City/Area"
                  iconName="map"
                  placeholder="e.g. Maadi"
                  value={address.city}
                  onChangeText={(t) => setAddress({ ...address, city: t })}
                />
              </View>
            </View>

            <CustomInput
              label="Street Name"
              iconName="navigate"
              placeholder="e.g. 9 El-Nasr St"
              value={address.street}
              onChangeText={(t) => setAddress({ ...address, street: t })}
            />

            <View style={styles.row}>
              <View style={styles.flexItem}>
                <CustomInput
                  label="Building"
                  iconName="business"
                  placeholder="No."
                  value={address.building}
                  onChangeText={(t) => setAddress({ ...address, building: t })}
                />
              </View>
              <View style={styles.flexItem}>
                <CustomInput
                  label="Floor"
                  iconName="layers"
                  placeholder="e.g. 2nd"
                  value={address.floor}
                  onChangeText={(t) => setAddress({ ...address, floor: t })}
                />
              </View>
              <View style={styles.flexItem}>
                <CustomInput
                  label="Apartment"
                  iconName="home"
                  placeholder="e.g. 4"
                  value={address.apartment}
                  onChangeText={(t) => setAddress({ ...address, apartment: t })}
                />
              </View>
            </View>
          </Animated.View>

          {/* Section: Payment Method */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            
            <View style={styles.paymentContainer}>
              {renderPaymentMethod("cash", "Cash on Delivery", "cash-outline")}
              {renderPaymentMethod("visa", "Credit Card / Visa", "card-outline")}
            </View>

            {paymentMethod === "visa" && (
              <View style={styles.savedCardsContainer}>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false} 
                  contentContainerStyle={styles.savedCardsContent}
                >
                  {user.savedCards.map((card) => (
                    <TouchableOpacity
                      key={card.id}
                      onPress={() => handleSelectSavedCard(card)}
                      style={[
                        styles.visaCard,
                        selectedCardId === card.id && styles.activeVisaCard
                      ]}
                    >
                      <View style={styles.visaCardHeader}>
                        <Ionicons 
                          name={card.type === "visa" ? "card" : "logo-bitcoin"} // Using card icon for mastercard too for simplicity
                          size={24} 
                          color={selectedCardId === card.id ? "#FFFFFF" : "#2B2521"} 
                        />
                        <Text style={[
                          styles.visaType,
                          selectedCardId === card.id && styles.activeVisaCardText
                        ]}>
                          {card.type.toUpperCase()}
                        </Text>
                      </View>
                      <Text style={[
                        styles.visaNumber,
                        selectedCardId === card.id && styles.activeVisaCardText
                      ]}>
                        •••• {card.lastFour}
                      </Text>
                      <View style={styles.visaCardFooter}>
                        <Text style={[
                          styles.visaExpiry,
                          selectedCardId === card.id && styles.activeVisaCardText
                        ]}>
                          EXP {card.expiry}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {paymentMethod === "visa" && (
              <Animated.View layout={Layout.springify()} entering={FadeInDown} style={styles.cardForm}>
                <CustomInput
                  label="Card Number"
                  iconName="card"
                  placeholder="0000 0000 0000 0000"
                  keyboardType="numeric"
                  maxLength={16}
                  value={cardDetails.number}
                  onChangeText={(t) => setCardDetails({ ...cardDetails, number: t })}
                />
                <View style={styles.row}>
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <CustomInput
                      label="Expiry Date"
                      iconName="calendar"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={cardDetails.expiry}
                      onChangeText={(t) => setCardDetails({ ...cardDetails, expiry: t })}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <CustomInput
                      label="CVV"
                      iconName="lock-closed"
                      placeholder="•••"
                      keyboardType="numeric"
                      maxLength={3}
                      secureTextEntry
                      value={cardDetails.cvv}
                      onChangeText={(t) => setCardDetails({ ...cardDetails, cvv: t })}
                    />
                  </View>
                </View>
              </Animated.View>
            )}
          </Animated.View>

          {/* Section: Summary */}
          <Animated.View entering={FadeInDown.delay(300)} style={styles.summarySection}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${totals.subtotal}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>${totals.deliveryFee}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${totals.total}</Text>
            </View>
          </Animated.View>

          <View style={{ height: 40 }} />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.placeOrderBtn} onPress={handlePlaceOrder}>
            <Text style={styles.placeOrderText}>Confirm & Place Order</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6F4EF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2B2521",
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#B7AC9D",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  detectBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDF5E6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
  },
  detectBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#F4A22A",
    marginLeft: 4,
  },
  row: {
    flexDirection: "row",
  },
  flexItem: {
    flex: 1,
    marginRight: 8,
  },
  paymentContainer: {
    gap: 12,
  },
  paymentBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#EEE8DE",
  },
  paymentBtnActive: {
    backgroundColor: "#F4A22A",
    borderColor: "#F4A22A",
  },
  paymentBtnText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "600",
    color: "#2B2521",
  },
  paymentBtnTextActive: {
    color: "#FFF",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#EEE8DE",
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: {
    borderColor: "#FFF",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFF",
  },
  mapPreviewContainer: {
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    height: 120,
    borderWidth: 1,
    borderColor: "#EEE8DE",
  },
  mapPreview: {
    ...StyleSheet.absoluteFillObject,
  },
  mapOverlayHint: {
    position: "absolute",
    bottom: 8,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 99,
  },
  mapHintText: {
    fontSize: 10,
    color: "#FFF",
    fontWeight: "600",
  },
  cardForm: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EEE8DE",
    borderStyle: "dashed",
  },
  summarySection: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#564C3F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#8E8276",
    fontWeight: "600",
  },
  summaryValue: {
    fontSize: 14,
    color: "#2B2521",
    fontWeight: "700",
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1EBE1",
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2B2521",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#F4A22A",
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 10 : 20,
    backgroundColor: "#F6F4EF",
  },
  placeOrderBtn: {
    backgroundColor: "#2B2521",
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  placeOrderText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  savedItemsScroll: {
    marginBottom: 16,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  savedItemsContent: {
    gap: 12,
    paddingRight: 40,
  },
  addressChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: "#EEE8DE",
  },
  activeChip: {
    backgroundColor: "#2B2521",
    borderColor: "#2B2521",
  },
  chipText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#6A6A6A",
  },
  activeChipText: {
    color: "#FFF",
  },
  savedCardsContainer: {
    marginTop: 16,
  },
  savedCardsContent: {
    gap: 12,
    paddingRight: 20,
  },
  visaCard: {
    width: 160,
    height: 100,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 12,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#EEE8DE",
  },
  activeVisaCard: {
    backgroundColor: "#2B2521",
    borderColor: "#2B2521",
  },
  visaCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  visaType: {
    fontSize: 10,
    fontWeight: "800",
    color: "#8E8276",
  },
  visaNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#27221D",
  },
  visaCardFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  visaExpiry: {
    fontSize: 10,
    fontWeight: "600",
    color: "#8E8276",
  },
  activeVisaCardText: {
    color: "#FFF",
  },
});
