import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const notificationService = {
  async registerForNotifications() {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#F4A22A",
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return false;
    }
    return true;
  },

  async sendOrderConfirmedNotification(orderId: string) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🎉 Order Confirmed!",
        body: `Your order #${orderId.substring(0, 8)} is being prepared.`,
        data: { screen: "order-tracking" },
      },
      trigger: null, // Send immediately
    });
  },

  async sendOutForDeliveryNotification(orderId: string) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🏍️ Out for Delivery!",
        body: "Your order is on the way! The driver has picked up your food.",
        data: { screen: "order-tracking" },
      },
      trigger: null,
    });
  },

  async sendDriverNearbyNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📍 Driver is Nearby!",
        body: "Your driver is near your location! Get ready to receive your order.",
        data: { screen: "order-tracking" },
      },
      trigger: null,
    });
  },
};
