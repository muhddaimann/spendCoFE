import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useDesign } from "../../contexts/designContext";
import { BodySmall } from "../atom/text";
import { Plus, LogOut } from "lucide-react-native";
import { useAuth } from "../../contexts/authContext";

type PillButtonProps = {
  onPress?: () => void;
  children: React.ReactNode;
  backgroundColor: string;
  disabled?: boolean;
  horizontalPadding?: number;
  top?: number;
  bottom?: number;
  shadow?: boolean;
  borderColor?: string;
};

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signOut, loading } = useAuth();
  const activeRoute = state.routes[state.index];
  const isHome = activeRoute.name === "a";

  const PillButton = ({
    onPress,
    children,
    backgroundColor,
    disabled,
    horizontalPadding = tokens.spacing.lg,
    top = tokens.spacing.lg,
    bottom = tokens.spacing.lg,
    shadow = true,
    borderColor,
  }: PillButtonProps) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={{
        borderRadius: tokens.radii.pill,
        backgroundColor,
        paddingHorizontal: horizontalPadding,
        paddingTop: top,
        paddingBottom: bottom,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 0.8,
        borderColor: borderColor ?? colors.outlineVariant,
        ...(shadow && {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.16,
          shadowRadius: 6,
          elevation: 6,
        }),
      }}
    >
      {children}
    </TouchableOpacity>
  );

  const handleTabPress = (
    route: (typeof state.routes)[number],
    index: number
  ) => {
    const isFocused = state.index === index;

    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  const handleActionPress = async () => {
    if (isHome) {
      router.push("/addSpending");
      return;
    }
    if (!loading) {
      await signOut();
    }
  };

  const ActionIcon = isHome ? Plus : LogOut;
  const actionBg = isHome ? colors.primary : colors.error;
  const actionBorder = isHome ? colors.primaryContainer : colors.errorContainer;
  const actionIconColor = isHome ? colors.onPrimary : colors.onError;

  return (
    <View
      style={{
        position: "absolute",
        bottom: insets.bottom + tokens.spacing.sm,
        left: tokens.spacing.lg,
        right: tokens.spacing.lg,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <PillButton
        backgroundColor={colors.surface}
        borderColor={colors.outlineVariant}
        onPress={undefined}
        horizontalPadding={tokens.spacing.lg}
        top={tokens.spacing.sm}
        bottom={tokens.spacing.xs}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "stretch",
            gap: tokens.spacing.lg,
          }}
        >
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;
            const Icon = options.tabBarIcon as React.ComponentType<{
              color: string;
              size: number;
            }>;

            const rawLabel =
              options.tabBarLabel ??
              options.title ??
              (route.name === "a" ? "Home" : "Settings");

            const label =
              typeof rawLabel === "string"
                ? rawLabel
                : route.name === "a"
                ? "Home"
                : "Settings";

            const iconColor = isFocused
              ? colors.primary
              : colors.onSurfaceVariant;
            const textColor = iconColor;
            const underlineColor = isFocused ? colors.primary : "transparent";

            return (
              <TouchableOpacity
                key={route.key}
                activeOpacity={0.85}
                onPress={() => handleTabPress(route, index)}
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: tokens.spacing.sm,
                  paddingVertical: tokens.spacing.xs,
                  minWidth: 80,
                }}
              >
                {Icon && <Icon color={iconColor} size={28} />}
                <BodySmall
                  weight={isFocused ? "semibold" : "reg"}
                  style={{
                    marginTop: tokens.spacing.xxs,
                    fontSize: tokens.typography.sizes.md,
                    color: textColor,
                  }}
                >
                  {label}
                </BodySmall>
                <View
                  style={{
                    marginTop: tokens.spacing.xxs,
                    height: 4,
                    borderRadius: 999,
                    alignSelf: "stretch",
                    backgroundColor: underlineColor,
                  }}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </PillButton>

      <PillButton
        onPress={handleActionPress}
        disabled={!isHome && loading}
        backgroundColor={actionBg}
        borderColor={actionBorder}
      >
        <ActionIcon size={tokens.sizes.icon.xl} color={actionIconColor} />
      </PillButton>
    </View>
  );
}
