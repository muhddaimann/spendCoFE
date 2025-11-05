import * as React from "react";
import { View } from "react-native";
import { Tabs } from "expo-router";
import { useTheme } from "react-native-paper";
import { Home, Info } from "lucide-react-native";

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.onSurfaceVariant,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.outlineVariant,
            borderTopWidth: 0.5,
          },
          tabBarLabelStyle: { fontWeight: "600" },
        }}
      >
        <Tabs.Screen
          name="a"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="b"
          options={{
            title: "About",
            tabBarIcon: ({ color, size }) => <Info color={color} size={size} />,
          }}
        />
      </Tabs>
    </View>
  );
}
