import React, { useMemo, useState } from "react";
import { ScrollView, View, Pressable } from "react-native";
import { useTheme, Chip, Divider, Card } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { H2, Body, BodySmall } from "../../../components/atom/text";
import { Header } from "../../../components/shared/header";
import { Menu } from "lucide-react-native";

type SpendingItem = {
  id: string;
  date: string;
  title: string;
  category: string;
  amount: number;
  wallet: string;
};

const DUMMY_SPENDINGS: SpendingItem[] = [
  {
    id: "1",
    date: "2025-12-04",
    title: "Breakfast nasi lemak",
    category: "Food",
    amount: 6.5,
    wallet: "Cash",
  },
  {
    id: "2",
    date: "2025-12-04",
    title: "MRT ride",
    category: "Transport",
    amount: 4.2,
    wallet: "Touch 'n Go",
  },
  {
    id: "3",
    date: "2025-12-03",
    title: "GrabFood dinner",
    category: "Food",
    amount: 26.9,
    wallet: "Debit card",
  },
  {
    id: "4",
    date: "2025-12-02",
    title: "Spotify",
    category: "Subscription",
    amount: 15.9,
    wallet: "Credit card",
  },
];

type FilterKey = "all" | "month" | "week";

export default function SpendingPage() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const [filter, setFilter] = useState<FilterKey>("all");

  const filtered = useMemo(() => {
    return DUMMY_SPENDINGS;
  }, [filter]);

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, SpendingItem[]>>((acc, item) => {
      if (!acc[item.date]) acc[item.date] = [];
      acc[item.date].push(item);
      return acc;
    }, {});
  }, [filtered]);

  const total = useMemo(
    () => filtered.reduce((sum, s) => sum + s.amount, 0),
    [filtered]
  );

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "month", label: "This month" },
    { key: "week", label: "This week" },
  ];

  const burgerRightSlot = (
    <Pressable
      hitSlop={tokens.spacing.xs}
      onPress={() => {
        // open sheet / menu later
      }}
      style={{
        width: tokens.spacing["2xl"],
        height: tokens.spacing["2xl"],
        borderRadius: tokens.spacing["2xl"] / 2,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.outlineVariant,
      }}
    >
      <Menu size={tokens.sizes.icon.lg} color={colors.onSurface} />
    </Pressable>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingHorizontal: tokens.spacing.lg,
        paddingVertical: tokens.spacing.lg,
        gap: tokens.spacing.lg,
      }}
    >
      <Header
        title="Spending"
        subtitle="Track your spending"
        rightSlot={burgerRightSlot}
      />

      <View
        style={{
          flexDirection: "row",
          gap: tokens.spacing.sm,
        }}
      >
        {filters.map((f) => {
          const selected = f.key === filter;
          return (
            <Chip
              key={f.key}
              mode={selected ? "flat" : "outlined"}
              selected={selected}
              onPress={() => setFilter(f.key)}
              style={{
                borderRadius: tokens.radii.pill,
                borderColor: selected ? colors.primary : colors.outlineVariant,
                backgroundColor: selected
                  ? colors.primaryContainer
                  : colors.surface,
              }}
              textStyle={{
                fontFamily: selected ? "Inter_600SemiBold" : "Inter_400Regular",
                fontSize: tokens.typography.sizes.xs,
                color: selected ? colors.onPrimaryContainer : colors.onSurface,
              }}
            >
              {f.label}
            </Chip>
          );
        })}
      </View>

      <Card
        style={{
          borderRadius: tokens.radii.lg,
          borderWidth: 0.7,
          borderColor: colors.outlineVariant,
        }}
      >
        <Card.Content
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ gap: 2 }}>
            <BodySmall muted>Total spent (filtered)</BodySmall>
            <H2 weight="bold">RM {total.toFixed(2)}</H2>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <BodySmall muted>Transactions</BodySmall>
            <Body>{filtered.length}</Body>
          </View>
        </Card.Content>
      </Card>

      <Divider />

      <View style={{ gap: tokens.spacing.md }}>
        {Object.entries(grouped).map(([date, items]) => (
          <View key={date} style={{ gap: tokens.spacing.xs }}>
            <BodySmall muted>{date}</BodySmall>
            {items.map((item) => (
              <Card
                key={item.id}
                style={{
                  borderRadius: tokens.radii.lg,
                  borderWidth: 0.6,
                  borderColor: colors.outlineVariant,
                }}
              >
                <Card.Content
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flex: 1, gap: 2 }}>
                    <Body weight="semibold">{item.title}</Body>
                    <BodySmall muted>
                      {item.category} · {item.wallet}
                    </BodySmall>
                  </View>
                  <Body
                    weight="semibold"
                    style={{
                      color: colors.error,
                      marginLeft: tokens.spacing.lg,
                    }}
                  >
                    - RM {item.amount.toFixed(2)}
                  </Body>
                </Card.Content>
              </Card>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
