import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";
import { lightTheme, darkTheme } from "../constants/theme";

type Ctx = { isDark: boolean; toggle: () => void };

const ThemeCtx = createContext<Ctx>({ isDark: false, toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const value = useMemo<Ctx>(
    () => ({
      isDark,
      toggle: () => {},
    }),
    [isDark]
  );

  return (
    <ThemeCtx.Provider value={value}>
      <PaperProvider theme={isDark ? darkTheme : lightTheme}>
        {children}
      </PaperProvider>
    </ThemeCtx.Provider>
  );
}

export const useThemeToggle = () => useContext(ThemeCtx);
