import React from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { BodySmall } from "../atom/text";

export function InlineLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <ActivityIndicator size="small" />
      <BodySmall muted>{label}</BodySmall>
    </View>
  );
}
