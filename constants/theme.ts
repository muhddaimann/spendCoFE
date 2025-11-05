// constants/theme.ts
import { MD3DarkTheme, MD3LightTheme, type MD3Theme } from "react-native-paper";

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 12,
  colors: {
    ...MD3LightTheme.colors,

    // Core brand
    primary: "#5B5F97",
    onPrimary: "#FFFFFF",
    primaryContainer: "#C7C9E9",
    onPrimaryContainer: "#1C1E47",

    secondary: "#A14F66",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#E1B5C1",
    onSecondaryContainer: "#3F1F29",

    // Tertiary
    tertiary: "#2E7D88",
    onTertiary: "#FFFFFF",
    tertiaryContainer: "#A7DDE3",
    onTertiaryContainer: "#08363B",

    // Error
    error: "#BA1A1A",
    onError: "#FFFFFF",
    errorContainer: "#FFDAD6",
    onErrorContainer: "#410002",

    // Surfaces
    background: "#FFFFFF",
    onBackground: "#1A1B1E",
    surface: "#FFFFFF",
    onSurface: "#1A1B1E",
    surfaceVariant: "#E7E7EE",
    onSurfaceVariant: "#494A57",

    // Outlines
    outline: "#7A7B8A",
    outlineVariant: "#C9CADA",

    // Inverse
    inverseSurface: "#2F3036",
    inverseOnSurface: "#F2F2F4",
    inversePrimary: "#C7C9E9",

    // Misc
    shadow: "#000000",
    scrim: "#000000",
    surfaceDisabled: "rgba(26,27,30,0.12)",
    onSurfaceDisabled: "rgba(26,27,30,0.38)",
    backdrop: "rgba(26,27,30,0.4)",

    // Required MD3 elevation
    elevation: {
      ...MD3LightTheme.colors.elevation,
    },
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  roundness: 12,
  colors: {
    ...MD3DarkTheme.colors,

    // Core brand
    primary: "#C7C9E9",
    onPrimary: "#1C1E47",
    primaryContainer: "#383B6D",
    onPrimaryContainer: "#C7C9E9",

    secondary: "#E1B5C1",
    onSecondary: "#3F1F29",
    secondaryContainer: "#5A2E3B",
    onSecondaryContainer: "#F5D9E1",

    // Tertiary
    tertiary: "#8ED2D8",
    onTertiary: "#08363B",
    tertiaryContainer: "#274F54",
    onTertiaryContainer: "#A7DDE3",

    // Error
    error: "#FFB4AB",
    onError: "#690005",
    errorContainer: "#93000A",
    onErrorContainer: "#FFDAD6",

    // Surfaces
    background: "#0B0B0F",
    onBackground: "#E3E3E8",
    surface: "#111115",
    onSurface: "#E3E3E8",
    surfaceVariant: "#444654",
    onSurfaceVariant: "#C9CAD7",

    // Outlines
    outline: "#9293A1",
    outlineVariant: "#444654",

    // Inverse
    inverseSurface: "#E3E3E8",
    inverseOnSurface: "#202126",
    inversePrimary: "#5B5F97",

    // Misc
    shadow: "#000000",
    scrim: "#000000",
    surfaceDisabled: "rgba(227,227,232,0.12)",
    onSurfaceDisabled: "rgba(227,227,232,0.38)",
    backdrop: "rgba(0,0,0,0.4)",

    // Required MD3 elevation
    elevation: {
      ...MD3DarkTheme.colors.elevation,
    },
  },
};
