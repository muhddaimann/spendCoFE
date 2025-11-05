import React from "react";
import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { useThemeToggle } from "../../../contexts/themeContext";

export default function About() {
  const { colors } = useTheme();
  const { isDark, toggle } = useThemeToggle();

  return (
    <View
      style={{
        flex: 1,
        padding: 24,
        justifyContent: "center",
        gap: 16,
        backgroundColor: colors.background,
      }}
    >
      <Text variant="titleLarge" style={{ color: colors.primary }}>
        Theme: {isDark ? "Dark" : "Light"}
      </Text>
      <Button mode="contained" onPress={toggle}>
        Toggle Theme
      </Button>
    </View>
  );
}
