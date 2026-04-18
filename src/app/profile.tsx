import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "@/src/presentation/state/hooks";
import { signOutAction, selectAuthStatus } from "@/src/presentation/state/userSlice";
import { profileImageSource } from "@/constants/menuAssets";

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { profile, loading } = useAppSelector(selectAuthStatus);

  const handleSignOut = () => {
    void dispatch(signOutAction());
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#26221D" />
          </Pressable>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.avatarContainer}>
            <Image source={profileImageSource} style={styles.avatar} />
            <Text style={styles.userName}>{profile?.name || "Guest User"}</Text>
            <Text style={styles.userEmail}>
              {profile?.email === "anonymous" ? "Guest Mode" : (profile?.email || "user@email.com")}
            </Text>
          </View>

          <View style={styles.menuList}>
            {profile?.email !== "anonymous" && (
              <>
                <ProfileMenuItem 
                  icon="person-outline" 
                  label="Edit Profile" 
                  onPress={() => {}} 
                />
                <ProfileMenuItem 
                  icon="location-outline" 
                  label="Saved Addresses" 
                  onPress={() => {}} 
                />
                <ProfileMenuItem 
                  icon="card-outline" 
                  label="Payment Methods" 
                  onPress={() => {}} 
                />
                <View style={styles.divider} />
              </>
            )}
            
            <ProfileMenuItem 
              icon="log-out-outline" 
              label={profile?.email === "anonymous" ? "Exit Guest Mode" : "Sign Out"} 
              onPress={handleSignOut}
              destructive
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

function ProfileMenuItem({ 
  icon, 
  label, 
  onPress, 
  destructive = false 
}: { 
  icon: any, 
  label: string, 
  onPress: () => void,
  destructive?: boolean
}) {
  return (
    <Pressable 
      onPress={onPress} 
      style={({ pressed }) => [
        styles.menuItem,
        pressed && styles.menuItemPressed
      ]}
    >
      <View style={[styles.menuIcon, destructive && styles.menuIconDestructive]}>
        <Ionicons name={icon} size={22} color={destructive ? "#F06B62" : "#55504B"} />
      </View>
      <Text style={[styles.menuLabel, destructive && styles.menuLabelDestructive]}>
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={18} color="#CFC8BE" />
    </Pressable>
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
    paddingHorizontal: 16,
    height: 56,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#26221D",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  userName: {
    fontSize: 24,
    fontWeight: "900",
    color: "#26221D",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#8E857A",
    fontWeight: "500",
  },
  menuList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: 8,
    shadowColor: "#55493B",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuItemPressed: {
    backgroundColor: "#F9F8F6",
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F9F8F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuIconDestructive: {
    backgroundColor: "#FFF5F4",
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#26221D",
  },
  menuLabelDestructive: {
    color: "#F06B62",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0EBE4",
    marginHorizontal: 16,
    marginVertical: 8,
  },
});
