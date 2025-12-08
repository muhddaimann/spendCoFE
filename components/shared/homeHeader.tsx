import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { useTheme } from "react-native-paper";
import { Bell, Menu } from "lucide-react-native";
import { useDesign } from "../../contexts/designContext";
import { H1, BodySmall } from "../atom/text";
import { useGreeting, RangeKey } from "../../hooks/useGreeting";

type HomeHeaderProps = {
  name: string;
  onRangeChange?: (range: RangeKey) => void;
};

export function HomeHeader({ name, onRangeChange }: HomeHeaderProps) {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { greeting, getDisplayLabel } = useGreeting();
  const [range, setRange] = useState<RangeKey>("today");

  const handleToggle = () => {
    const next: RangeKey =
      range === "today" ? "week" : range === "week" ? "month" : "today";
    setRange(next);
    onRangeChange?.(next);
  };

  return (
    <View style={{ gap: tokens.spacing.sm }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: tokens.spacing.md,
        }}
      >
        <View style={{ flex: 1, gap: tokens.spacing["xxs"] }}>
          <H1 weight="bold">SpendCo</H1>
          <BodySmall muted>
            {greeting}, {name}
          </BodySmall>
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: tokens.spacing.xs,
          }}
        >
          <Pressable
            hitSlop={tokens.spacing.xs}
            style={{
              width: tokens.spacing["2xl"],
              height: tokens.spacing["2xl"],
              borderRadius: tokens.spacing["2xl"] / 2,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.surface,
            }}
            onPress={() => {}}
          >
            <Bell size={tokens.sizes.icon.md} color={colors.onSurface} />
          </Pressable>

          <Pressable
            hitSlop={tokens.spacing.xs}
            style={{
              width: tokens.spacing["2xl"],
              height: tokens.spacing["2xl"],
              borderRadius: tokens.spacing["2xl"] / 2,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.surface,
            }}
            onPress={() => {}}
          >
            <Menu size={tokens.sizes.icon.md} color={colors.onSurface} />
          </Pressable>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <BodySmall muted>Track your spending</BodySmall>

        <Pressable
          onPress={handleToggle}
          hitSlop={tokens.spacing.xs}
          style={{
            paddingHorizontal: tokens.spacing.sm,
            paddingVertical: tokens.spacing["xxs"],
            borderRadius: 999,
            backgroundColor: colors.surfaceVariant,
          }}
        >
          <BodySmall
            weight="semibold"
            style={{ color: colors.onSurfaceVariant }}
          >
            {getDisplayLabel(range)}
          </BodySmall>
        </Pressable>
      </View>
    </View>
  );
}