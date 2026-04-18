import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";

import { store } from "@/src/presentation/state";
import { notificationService } from "@/src/data/services/notificationService";
import { auth, db } from "@/src/data/services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { setAuthenticated, setProfile, setLoading } from "@/src/presentation/state/userSlice";
import { UserProfile } from "@/src/domain/entities/User";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // 1. Setup Notifications
    notificationService.registerForNotifications();
    const notificationSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const screen = response.notification.request.content.data?.screen;
        if (screen) {
          router.navigate(`/${screen}` as any);
        }
      }
    );

    // 2. Setup Firebase Auth Listener
    store.dispatch(setLoading(true));
    const authSubscription = onAuthStateChanged(auth, (user) => {
      if (user) {
        store.dispatch(setAuthenticated(true));
        
        // Listen to User Profile in Firestore
        const unsubscribeProfile = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
          if (docSnap.exists()) {
            store.dispatch(setProfile(docSnap.data() as UserProfile));
          } else if (user.isAnonymous) {
            // Provide a default profile for Guest users
            const guestProfile: UserProfile = {
              id: user.uid,
              name: "Guest User",
              email: "anonymous",
              savedAddresses: [],
              savedCards: [],
            };
            store.dispatch(setProfile(guestProfile));
          } else {
            console.warn("User authenticated but no profile found in Firestore.");
            store.dispatch(setLoading(false));
          }
        });

        return () => unsubscribeProfile();
      } else {
        store.dispatch(setAuthenticated(false));
        store.dispatch(setProfile(null));
        store.dispatch(setLoading(false));
      }
    });

    return () => {
      notificationSubscription.remove();
      authSubscription();
    };
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
        <Stack.Screen name="profile" />
      </Stack>
    </Provider>
  );
}
