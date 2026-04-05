import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef, useState } from "react";
import {
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface CustomInputProps extends TextInputProps {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  rightElement?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

const CustomInput = forwardRef<TextInput, CustomInputProps>(
  function CustomInput(
    {
      label,
      iconName,
      rightElement,
      containerStyle,
      labelStyle,
      style,
      placeholder,
      value,
      maxLength,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) {
    const [isFocused, setIsFocused] = useState(true);
    const isFilled =
      typeof value === "string"
        ? value.length > 0
        : Boolean(props.defaultValue);
    const isActive = isFocused || isFilled;

    return (
      <View
        style={[
          styles.container,
          // On Android, avoid toggling elevation/border as it causes layout
          // re-measurement which dismisses the keyboard when switching inputs.
          Platform.OS === "android"
            ? isActive
              ? styles.containerActiveAndroid
              : styles.containerIdleAndroid
            : isActive
              ? styles.containerActive
              : styles.containerIdle,
          containerStyle,
        ]}
      >
        <Text
          style={[styles.label, isActive && styles.labelActive, labelStyle]}
        >
          {label.toUpperCase()}
        </Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name={iconName}
            size={18}
            color={isActive ? "#2B2521" : "#B8B0A7"}
            style={styles.icon}
          />

          <TextInput
            {...props}
            ref={ref}
            value={value}
            maxLength={maxLength}
            style={[styles.input, style]}
            placeholder={placeholder ?? label}
            placeholderTextColor="#B9B2AA"
            selectionColor="#F4A22A"
            onFocus={(event) => {
              setIsFocused(true);
              onFocus?.(event);
            }}
            onBlur={(event) => {
              setIsFocused(false);
              onBlur?.(event);
            }}
          />

          {rightElement ? (
            <View style={styles.rightElement}>{rightElement}</View>
          ) : null}
        </View>

        {typeof maxLength === "number" && typeof value === "string" ? (
          <Text style={styles.counter}>
            {value.length}/{maxLength}
          </Text>
        ) : null}
      </View>
    );
  },
);

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  // iOS: full style swap (no keyboard issue)
  containerIdle: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEE8DE",
    backgroundColor: "rgba(255, 255, 255, 0.18)",
  },
  containerActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#564C3F",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
  },
  // Android: keep layout-stable properties identical; only change background
  containerIdleAndroid: {
    // Same border but as transparent so layout size stays identical
    borderBottomWidth: 1,
    borderBottomColor: "#EEE8DE",
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    // Fixed elevation so no layout re-measurement on focus
    elevation: 0,
  },
  containerActiveAndroid: {
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
    backgroundColor: "#FFFFFF",
    elevation: 0, // avoid elevation toggling — it causes keyboard dismiss
  },
  label: {
    marginBottom: 10,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: "#C7BEB4",
  },
  labelActive: {
    color: "#D3A64A",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 15,
    fontWeight: "600",
    color: "#231E1A",
  },
  rightElement: {
    marginLeft: 12,
  },
  counter: {
    marginTop: 10,
    alignSelf: "flex-end",
    fontSize: 11,
    fontWeight: "600",
    color: "#C4B9AB",
  },
});
