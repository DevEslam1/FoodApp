import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { SlideInDown } from "react-native-reanimated";
import { useAppSelector, useAppDispatch } from "@/src/presentation/state/hooks";
import { selectLastOrder, updateOrderStatus, updateDriverLocation } from "@/src/presentation/state/cartSlice";
import { notificationService } from "@/src/data/services/notificationService";


// Mock Restaurant Location
const RESTAURANT_COORD = { latitude: 30.0444, longitude: 31.2357 };

export default function OrderTrackingScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const order = useAppSelector(selectLastOrder);
  const mapRef = useRef<MapView>(null);

  // States
  const [driverCoord, setDriverCoord] = useState(RESTAURANT_COORD);
  const [hasNotifiedDelivery, setHasNotifiedDelivery] = useState(false);
  const [hasNotifiedNearby, setHasNotifiedNearby] = useState(false);

  // Destination from order
  const destination = order?.address?.latitude && order?.address?.longitude
    ? { latitude: order.address.latitude, longitude: order.address.longitude }
    : { latitude: 30.05, longitude: 31.24 }; // Fallback

  useEffect(() => {
    if (!order) return;

    // Center map on path
    mapRef.current?.fitToCoordinates([RESTAURANT_COORD, destination], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      animated: true,
    });

    // SIMULATION: Move driver and change status
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.05; // 5% each tick
      if (progress > 1) {
        clearInterval(interval);
        dispatch(updateOrderStatus({ orderId: order.id, status: "delivered" }));
        return;
      }

      // Calculate intermediate point
      const newLat = RESTAURANT_COORD.latitude + (destination.latitude - RESTAURANT_COORD.latitude) * progress;
      const newLng = RESTAURANT_COORD.longitude + (destination.longitude - RESTAURANT_COORD.longitude) * progress;
      
      const newDriverLoc = { latitude: newLat, longitude: newLng };
      setDriverCoord(newDriverLoc);
      dispatch(updateDriverLocation({ orderId: order.id, ...newDriverLoc }));

      // Notifications Triggers
      if (progress >= 0.2 && progress < 0.3 && !hasNotifiedDelivery) {
        setHasNotifiedDelivery(true);
        dispatch(updateOrderStatus({ orderId: order.id, status: "on_the_way" }));
        notificationService.sendOutForDeliveryNotification(order.id);
      }

      if (progress >= 0.8 && progress < 0.9 && !hasNotifiedNearby) {
        setHasNotifiedNearby(true);
        notificationService.sendDriverNearbyNotification();
      }

    }, 2000); // Trigger every 2s for demo

    return () => clearInterval(interval);
  }, [order?.id, destination, dispatch, hasNotifiedDelivery, hasNotifiedNearby, order?.status]);

  if (!order) {
    return (
      <View style={styles.center}>
        <Text>Order not found</Text>
      </View>
    );
  }

  const getStatusText = () => {
    switch(order.status) {
      case "preparing": return "Preparing your food...";
      case "on_the_way": return "Driver is on the way!";
      case "delivered": return "Delivered!";
      default: return "Processing...";
    }
  };

  return (
    <View style={styles.root}>
      {/* Map Section */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            ...RESTAURANT_COORD,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          {/* Restaurant Marker */}
          <Marker coordinate={RESTAURANT_COORD}>
            <View style={styles.iconMarker}>
              <Text style={{ fontSize: 20 }}>🍕</Text>
            </View>
          </Marker>

          {/* Destination Marker */}
          <Marker coordinate={destination}>
            <View style={styles.iconMarkerDest}>
              <Ionicons name="location" size={20} color="#FFF" />
            </View>
          </Marker>

          {/* Driver Marker */}
          <Marker coordinate={driverCoord}>
            <View style={styles.driverMarker}>
              <Text style={{ fontSize: 24 }}>🛵</Text>
            </View>
          </Marker>

          {/* Route Line */}
          <Polyline
            coordinates={[RESTAURANT_COORD, destination]}
            strokeColor="#F4A22A"
            strokeWidth={4}
            lineDashPattern={[10, 10]}
          />
        </MapView>
        
        {/* Top Back Button Overlay */}
        <SafeAreaView edges={["top"]} style={styles.overlayHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#2B2521" />
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      {/* Bottom Sheet Card */}
      <Animated.View entering={SlideInDown.delay(200)} style={styles.bottomCard}>
        <View style={styles.handleBar} />
        
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.estimatedLbl}>Estimated Arrival</Text>
            <Text style={styles.estimatedValue}>{order.estimatedMinutes} Mins</Text>
          </View>
          <View style={styles.orderIdBadge}>
            <Text style={styles.orderIdText}>Order #{order.id.slice(0, 5)}</Text>
          </View>
        </View>

        <View style={styles.statusBox}>
           <Text style={styles.statusText}>{getStatusText()}</Text>
           <View style={styles.progressRow}>
             <View style={[styles.progressLine, order.status === "preparing" || order.status === "on_the_way" || order.status === "delivered" ? styles.progressActive : null]} />
             <View style={[styles.progressLine, order.status === "on_the_way" || order.status === "delivered" ? styles.progressActive : null]} />
             <View style={[styles.progressLine, order.status === "delivered" ? styles.progressActive : null]} />
           </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.driverSection}>
          <View style={styles.driverInfo}>
            <View style={styles.driverAvatar}>
              <Ionicons name="person" size={24} color="#8E8276" />
            </View>
            <View>
              <Text style={styles.driverName}>Ahmed Hassan</Text>
              <Text style={styles.driverVehicle}>Honda • EGY 123</Text>
            </View>
          </View>
          <View style={styles.driverActions}>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="call" size={20} color="#2B2521" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtnPrimary}>
              <Ionicons name="chatbubble" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFF" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  mapContainer: { flex: 0.65 },
  overlayHeader: {
    position: "absolute",
    top: 0,
    left: 20,
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
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 10,
  },
  iconMarker: {
    backgroundColor: "#FFF",
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#F4A22A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  iconMarkerDest: {
    backgroundColor: "#2B2521",
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  driverMarker: {
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  bottomCard: {
    flex: 0.35,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    marginTop: -30,
    paddingHorizontal: 24,
    paddingTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 20,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: "#E2DCD3",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  estimatedLbl: {
    fontSize: 13,
    color: "#8E8276",
    fontWeight: "600",
  },
  estimatedValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#2B2521",
    marginTop: 2,
  },
  orderIdBadge: {
    backgroundColor: "#F6F4EF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  orderIdText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#F4A22A",
  },
  statusBox: {
    marginBottom: 20,
  },
  statusText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#2B2521",
    marginBottom: 10,
  },
  progressRow: {
    flexDirection: "row",
    gap: 8,
  },
  progressLine: {
    flex: 1,
    height: 4,
    backgroundColor: "#F1EBE1",
    borderRadius: 2,
  },
  progressActive: {
    backgroundColor: "#F4A22A",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1EBE1",
    marginBottom: 20,
  },
  driverSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  driverInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F6F4EF",
    alignItems: "center",
    justifyContent: "center",
  },
  driverName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2B2521",
  },
  driverVehicle: {
    fontSize: 12,
    color: "#8E8276",
    fontWeight: "500",
    marginTop: 2,
  },
  driverActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F6F4EF",
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnPrimary: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F4A22A",
    alignItems: "center",
    justifyContent: "center",
  },
});
