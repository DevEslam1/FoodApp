import { PropsWithChildren, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { IconSymbol } from "./icon-symbol";

export function Collapsible({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setIsOpen((value) => !value)}
        style={styles.heading}
      >
        <IconSymbol
          color="#6A6F76"
          name="chevron.right"
          size={18}
          style={{ transform: [{ rotate: isOpen ? "90deg" : "0deg" }] }}
          weight="medium"
        />

        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>

      {isOpen ? <View style={styles.content}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2933",
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});
