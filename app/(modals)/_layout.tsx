import React from "react";
import { Stack } from "expo-router";

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: "transparentModal",
        headerShown: false,
        animation: "slide_from_bottom",
        contentStyle: { backgroundColor: "transparent" },
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="signIn"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="signUp"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="forgot"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
