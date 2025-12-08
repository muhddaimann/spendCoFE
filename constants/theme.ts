import {
  MD3DarkTheme,
  MD3LightTheme,
  configureFonts,
  type MD3Theme,
} from "react-native-paper";

const make = (
  family: string,
  weight: "400" | "700",
  fontSize: number,
  lineHeight: number,
  letterSpacing = 0
) => ({
  fontFamily: family,
  fontWeight: weight,
  fontSize,
  lineHeight,
  letterSpacing,
});

const fontConfig = {
  displayLarge: make("Poppins_700Bold", "700", 57, 64),

  displayMedium: make("Poppins_700Bold", "700", 45, 52),

  displaySmall: make("Poppins_700Bold", "700", 36, 44),

  headlineLarge: make("Poppins_700Bold", "700", 32, 40),

  headlineMedium: make("Poppins_700Bold", "700", 28, 36),

  headlineSmall: make("Poppins_700Bold", "700", 24, 32),

  titleLarge: make("Poppins_700Bold", "700", 22, 28),

  titleMedium: make("Poppins_700Bold", "700", 16, 24, 0.1),

  titleSmall: make("Poppins_700Bold", "700", 14, 20, 0.1),

  labelLarge: make("Poppins_700Bold", "700", 14, 20, 0.1),

  labelMedium: make("Poppins_400Regular", "400", 12, 16, 0.5),

  labelSmall: make("Poppins_400Regular", "400", 11, 16, 0.5),

  bodyLarge: make("Poppins_400Regular", "400", 16, 24),

  bodyMedium: make("Poppins_400Regular", "400", 14, 20),

  bodySmall: make("Poppins_400Regular", "400", 12, 16),
};

const fonts = configureFonts({ config: fontConfig });

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 12,
  fonts,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#345995",
    onPrimary: "#F2F6FF",
    primaryContainer: "#C7D6F5",
    onPrimaryContainer: "#13294B",
    secondary: "#FFA24C",
    onSecondary: "#2A1400",
    secondaryContainer: "#FFE0BF",
    onSecondaryContainer: "#3A1E00",
    tertiary: "#2F9E62",
    onTertiary: "#FFFFFF",
    tertiaryContainer: "#CDEFD9",
    onTertiaryContainer: "#0F3D24",
    error: "#BA1A1A",
    onError: "#FFFFFF",
    errorContainer: "#FFDAD6",
    onErrorContainer: "#410002",
    background: "#F7F8FB",
    onBackground: "#1A1B1E",
    surface: "#FFFFFF",
    onSurface: "#1A1B1E",
    surfaceVariant: "#E7E7EE",
    onSurfaceVariant: "#494A57",
    outline: "#7A7B8A",
    outlineVariant: "#C9CADA",
    inverseSurface: "#2F3036",
    inverseOnSurface: "#F2F2F4",
    inversePrimary: "#B5C7F3",
    shadow: "#000000",
    scrim: "#000000",
    surfaceDisabled: "rgba(26,27,30,0.12)",
    onSurfaceDisabled: "rgba(26,27,30,0.38)",
    backdrop: "rgba(26,27,30,0.4)",
    elevation: { ...MD3LightTheme.colors.elevation },
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  roundness: 12,
  fonts,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#AFC4FF",
    onPrimary: "#0A1C3A",
    primaryContainer: "#1F3B78",
    onPrimaryContainer: "#D9E3FF",

    secondary: "#FFC38A",
    onSecondary: "#3A1E00",
    secondaryContainer: "#663A00",
    onSecondaryContainer: "#FFD7A8",

    tertiary: "#79D39B",
    onTertiary: "#0B2A18",
    tertiaryContainer: "#1A5A37",
    onTertiaryContainer: "#BDECCF",

    error: "#FFB4AB",
    onError: "#690005",
    errorContainer: "#93000A",
    onErrorContainer: "#FFDAD6",

    background: "#0A0B10",
    onBackground: "#E3E3E8",
    surface: "#111318",
    onSurface: "#E3E3E8",
    surfaceVariant: "#444654",
    onSurfaceVariant: "#C9CAD7",
    outline: "#9293A1",
    outlineVariant: "#444654",
    inverseSurface: "#E3E3E8",
    inverseOnSurface: "#202126",
    inversePrimary: "#345995",
    shadow: "#000000",
    scrim: "#000000",
    surfaceDisabled: "rgba(227,227,232,0.12)",
    onSurfaceDisabled: "rgba(227,227,232,0.38)",
    backdrop: "rgba(0,0,0,0.4)",
    elevation: { ...MD3DarkTheme.colors.elevation },
  },
};
