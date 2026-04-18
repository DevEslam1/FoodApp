import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";

import { store } from "@/src/presentation/state";
import { notificationService } from "@/src/data/services/notificationService";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    notificationService.registerForNotifications();

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const screen = response.notification.request.content.data?.screen;
        if (screen) {
          router.navigate(`/${screen}` as any);
        }
      }
    );

    return () => subscription.remove();
  }, [router]);
  return (
    <Provider store={store}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#F6F4EF" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="home" />
        <Stack.Screen name="food/[id]" />
        <Stack.Screen name="cart" />
        <Stack.Screen name="checkout" />
        <Stack.Screen name="order-success" />
        <Stack.Screen name="orders" />
        <Stack.Screen name="order-tracking" />
      </Stack>
    </Provider>
  );
}
