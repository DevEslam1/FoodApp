import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

export default function AuthDecoration() {
  return (
    <View style={styles.container} pointerEvents="none">
      <LinearGradient
        colors={["#F7F2E8", "#F2ECE2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.topGlow} />
      <View style={styles.bottomShadow} />
      <LinearGradient
        colors={["#FFD15D", "#F7B33A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.7 }}
        style={styles.bottomBand}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  topGlow: {
    position: "absolute",
    top: -height * 0.06,
    right: -width * 0.16,
    width: width * 0.48,
    height: width * 0.48,
    borderRadius: width * 0.24,
    backgroundColor: "rgba(255, 205, 91, 0.16)",
  },
  bottomShadow: {
    position: "absolute",
    right: -width * 0.14,
    bottom: -height * 0.18,
    width: width * 0.84,
    height: height * 0.32,
    borderRadius: width * 0.42,
    backgroundColor: "rgba(242, 160, 42, 0.32)",
  },
  bottomBand: {
    position: "absolute",
    left: -width * 0.16,
    right: -width * 0.08,
    bottom: -height * 0.11,
    height: height * 0.24,
    borderTopLeftRadius: width * 0.2,
    borderTopRightRadius: width * 0.16,
    transform: [{ rotate: "-8deg" }],
  },
});
