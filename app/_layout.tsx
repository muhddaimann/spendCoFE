import React from "react";
import { View } from "react-native";
import { Stack, SplashScreen } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "react-native-paper";
import { ThemeProvider } from "../contexts/themeContext";
import { DesignProvider } from "../contexts/designContext";
import {
  useFonts,
  ComicNeue_400Regular,
  ComicNeue_700Bold,
} from "@expo-google-fonts/comic-neue";

SplashScreen.preventAutoHideAsync();

function AppShell() {
  const { dark, colors } = useTheme();
  return (
    <>
      <StatusBar style={dark ? "light" : "dark"} />
      <SafeAreaView
        edges={["top"]}
        style={{ backgroundColor: colors.background }}
      />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    ComicNeue_400Regular,
    ComicNeue_700Bold,
  });

  const onLayoutRootView = React.useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <ThemeProvider>
          <DesignProvider>
            <AppShell />
          </DesignProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
