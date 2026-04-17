import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  minHeight?: number;
  onBackPress?: () => void;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export default function AuthCard({
  title,
  subtitle,
  minHeight = 580,
  onBackPress,
  footer,
  children,
}: AuthCardProps) {
  return (
    <View style={[styles.card, { minHeight }]}>
      <View style={styles.cornerAccent} pointerEvents="none">
        <LinearGradient
          colors={["#F8CB60", "#F0A22B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cornerShape}
        />
        <View style={styles.cornerHighlight} />
      </View>

      {onBackPress ? (
        <Pressable onPress={onBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#948C81" />
        </Pressable>
      ) : null}

      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <View style={styles.body}>{children}</View>

      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 390,
    alignSelf: "center",
    overflow: "hidden",
    borderRadius: 36,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 28,
    shadowColor: "#4E4330",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 12,
  },
  cornerAccent: {
    position: "absolute",
    top: -8,
    right: -10,
    width: 118,
    height: 82,
  },
  cornerShape: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 28,
    borderTopLeftRadius: 20,
    transform: [{ rotate: "-18deg" }],
  },
  cornerHighlight: {
    position: "absolute",
    top: 10,
    right: 8,
    width: 84,
    height: 58,
    borderRadius: 28,
    backgroundColor: "rgba(255, 242, 214, 0.48)",
    transform: [{ rotate: "-18deg" }],
  },
  backButton: {
    width: 40,
    height: 40,
    marginLeft: -8,
    marginBottom: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    marginTop: 6,
    marginBottom: 30,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#1F1A17",
    letterSpacing: -0.8,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
    color: "#90867B",
  },
  body: {
    flex: 1,
  },
  footer: {
    marginTop: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});
