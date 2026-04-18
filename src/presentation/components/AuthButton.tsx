import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle, ActivityIndicator } from "react-native";

interface AuthButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function AuthButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  style,
}: AuthButtonProps) {
  const isButtonDisabled = disabled || loading;

  return (
    <Pressable
      disabled={isButtonDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        style,
        pressed && !isButtonDisabled ? styles.buttonPressed : undefined,
      ]}
    >
      <LinearGradient
        colors={isButtonDisabled ? ["#E5D7BF", "#D8C3A3"] : ["#FFD05A", "#F5A129"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.button}
      >
        <Text style={styles.label}>{label}</Text>
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 26,
    shadowColor: "#F5A129",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.24,
    shadowRadius: 16,
    elevation: 7,
  },
  buttonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  label: {
    marginRight: 10,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
});
