import React from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export function FullScreenLoader() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
