import React from "react";
import { Tabs } from "expo-router";
import { Home, Settings } from "lucide-react-native";
import { CustomTabBar } from "../../components/shared/navBar";
import { TabProvider } from "../../contexts/tabContext";

export default function TabsLayout() {
  return (
    <TabProvider>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen
          name="a"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Home color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="b"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size }) => (
              <Settings color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </TabProvider>
  );
}
