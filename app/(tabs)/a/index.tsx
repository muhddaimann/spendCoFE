import React from "react";
import { View } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";

export default function Home() {
  const { colors } = useTheme();
  const { tokens, density, setDensity } = useDesign();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: tokens.spacing.lg,
        gap: tokens.spacing.md,
      }}
    >
      <Text variant="titleLarge">Density: {density}</Text>

      <Button mode="outlined" onPress={() => setDensity("compact")}>
        Compact
      </Button>
      <Button mode="outlined" onPress={() => setDensity("comfortable")}>
        Comfortable
      </Button>
      <Button mode="outlined" onPress={() => setDensity("spacious")}>
        Spacious
      </Button>
    </View>
  );
}
