import React from "react";
import { View, Pressable, StyleProp, ViewStyle } from "react-native";
import { useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useDesign } from "../../contexts/designContext";
import { Body, BodySmall } from "../atom/text";

type HeaderProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightSlot?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Header({
  title,
  subtitle,
  showBack = true,
  onBackPress,
  rightSlot,
  style,
}: HeaderProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const { tokens } = useDesign();

  const handleBack = () => {
    if (onBackPress) onBackPress();
    else router.back();
  };

  const CIRCLE = tokens.spacing["2xl"];

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: tokens.spacing.md,
        },
        style,
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: tokens.spacing.sm,
          flex: 1,
        }}
      >
        {showBack && (
          <Pressable
            onPress={handleBack}
            hitSlop={tokens.spacing.xs}
            style={{
              width: CIRCLE,
              height: CIRCLE,
              borderRadius: CIRCLE / 2,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.outlineVariant,
            }}
          >
            <ChevronLeft size={tokens.sizes.icon.xl} color={colors.onSurface} />
          </Pressable>
        )}

        <View style={{ flex: 1 }}>
          <Body
            weight="semibold"
            color={colors.onSurface}
            numberOfLines={1}
            style={{ fontSize: tokens.typography.sizes.lg }}
          >
            {title}
          </Body>
          {subtitle ? (
            <BodySmall
              muted
              numberOfLines={1}
              style={{ marginTop: tokens.spacing["xxs"] }}
            >
              {subtitle}
            </BodySmall>
          ) : null}
        </View>
      </View>

      {rightSlot ? (
        <View
          style={{
            marginLeft: tokens.spacing.sm,
          }}
        >
          {rightSlot}
        </View>
      ) : null}
    </View>
  );
}
