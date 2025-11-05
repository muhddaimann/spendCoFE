import React from "react";
import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { useThemeToggle } from "../../../contexts/themeContext";
import { useDesign } from "../../../contexts/designContext";

export default function About() {
  const { colors } = useTheme();
  const { isDark, toggle } = useThemeToggle();
  const { tokens } = useDesign();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: tokens.spacing.lg,
        gap: tokens.spacing.md,
        backgroundColor: colors.background,
      }}
    >
      <Text
        style={{
          fontSize: 22,
          lineHeight: 28,
          fontWeight: "600",
          color: colors.primary,
        }}
      >
        Theme: {isDark ? "Dark" : "Light"}
      </Text>

      <Button mode="contained" onPress={toggle}>
        Toggle Theme
      </Button>
    </View>
  );
}
