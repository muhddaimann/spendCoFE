import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import {
  useTheme,
  Chip,
  Divider,
  Card,
  ProgressBar,
  Switch,
} from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { H2, Body, BodySmall } from "../../../components/atom/text";
import { Header } from "../../../components/shared/header";
import { Wallet } from "lucide-react-native";
import { useTabsUi } from "../../../contexts/tabContext";
import { useFocusEffect } from "expo-router";

type BudgetItem = {
  id: string;
  name: string;
  limit: number;
  spent: number;
};

const DUMMY_BUDGETS: BudgetItem[] = [
  {
    id: "1",
    name: "Food & drinks",
    limit: 400,
    spent: 120.5,
  },
  {
    id: "2",
    name: "Transport",
    limit: 200,
    spent: 60.2,
  },
  {
    id: "3",
    name: "Subscriptions",
    limit: 80,
    spent: 45.9,
  },
  {
    id: "4",
    name: "Fun",
    limit: 300,
    spent: 0,
  },
];

type FilterKey = "all" | "month" | "week" | "today";

export default function BudgetPage() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { lockHidden, unlockHidden } = useTabsUi();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [showEmpty, setShowEmpty] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      lockHidden();
      return () => {
        unlockHidden();
      };
    }, [lockHidden, unlockHidden])
  );

  const filtered = useMemo(() => {
    if (showEmpty) return [];
    // later you can actually filter by date; for now just return all
    return DUMMY_BUDGETS;
  }, [filter, showEmpty]);

  const totalLimit = useMemo(
    () => filtered.reduce((sum, b) => sum + b.limit, 0),
    [filtered]
  );

  const totalSpent = useMemo(
    () => filtered.reduce((sum, b) => sum + b.spent, 0),
    [filtered]
  );

  const totalRemaining = Math.max(totalLimit - totalSpent, 0);
  const overallProgress = totalLimit > 0 ? totalSpent / totalLimit : 0;

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "today", label: "Today" },
    { key: "week", label: "This week" },
    { key: "month", label: "This month" },
  ];

  const emptyTitle: Record<FilterKey, string> = {
    all: "No budgets yet",
    today: "No budgets for today",
    week: "No budgets for this week",
    month: "No budgets for this month",
  };

  const emptySubtitle: Record<FilterKey, string> = {
    all: "Create a simple monthly budget and your categories will appear here.",
    today:
      "No budget activity for today yet. When you start spending, progress will show here.",
    week: "No budget usage this week. Track a few expenses to see how it moves.",
    month:
      "No budgets set for this month yet. Add one to start planning your spending.",
  };

  const burgerRightSlot = (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <BodySmall muted>Empty</BodySmall>
      <Switch
        value={showEmpty}
        onValueChange={setShowEmpty}
        thumbColor={colors.primary}
        trackColor={{
          false: colors.surfaceVariant,
          true: colors.primaryContainer,
        }}
      />
    </View>
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
        title="Budget"
        subtitle="Plan where your money goes"
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
            gap: tokens.spacing.sm,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <View style={{ gap: 2 }}>
              <BodySmall muted>Total budget (filtered)</BodySmall>
              <H2 weight="bold">RM {totalLimit.toFixed(2)}</H2>
            </View>

            <View style={{ alignItems: "flex-end", gap: 2 }}>
              <BodySmall muted>Remaining</BodySmall>
              <Body weight="semibold">RM {totalRemaining.toFixed(2)}</Body>
            </View>
          </View>

          <ProgressBar
            progress={overallProgress}
            color={colors.primary}
            style={{
              height: 6,
              borderRadius: 999,
              backgroundColor: colors.surfaceVariant,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <BodySmall muted>Spent: RM {totalSpent.toFixed(2)}</BodySmall>
            <BodySmall muted>
              {totalLimit > 0
                ? `${Math.round(overallProgress * 100)}% used`
                : "No budget set"}
            </BodySmall>
          </View>
        </Card.Content>
      </Card>

      <Divider />

      <View style={{ gap: tokens.spacing.md }}>
        {filtered.length === 0 ? (
          <Card
            style={{
              borderRadius: tokens.radii["2xl"],
              backgroundColor: colors.surface,
              borderWidth: 0.7,
              borderColor: colors.outlineVariant,
            }}
          >
            <Card.Content
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: tokens.spacing.xl,
                gap: tokens.spacing.md,
              }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.surfaceVariant,
                }}
              >
                <Wallet size={24} color={colors.onSurfaceVariant} />
              </View>

              <H2
                weight="bold"
                style={{ textAlign: "center", color: colors.onSurface }}
              >
                {emptyTitle[filter]}
              </H2>

              <BodySmall
                muted
                align="center"
                style={{
                  maxWidth: 260,
                  color: colors.onSurfaceVariant,
                }}
              >
                {emptySubtitle[filter]}
              </BodySmall>
            </Card.Content>
          </Card>
        ) : (
          filtered.map((item) => {
            const remaining = Math.max(item.limit - item.spent, 0);
            const progress = item.limit > 0 ? item.spent / item.limit : 0;

            return (
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
                    gap: tokens.spacing.sm,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ flex: 1, gap: 2 }}>
                      <Body weight="semibold">{item.name}</Body>
                      <BodySmall muted>
                        RM {item.spent.toFixed(2)} of RM {item.limit.toFixed(2)}
                      </BodySmall>
                    </View>
                    <BodySmall
                      weight="semibold"
                      style={{ color: colors.onSurfaceVariant }}
                    >
                      RM {remaining.toFixed(2)} left
                    </BodySmall>
                  </View>

                  <ProgressBar
                    progress={progress}
                    color={colors.primary}
                    style={{
                      height: 5,
                      borderRadius: 999,
                      backgroundColor: colors.surfaceVariant,
                    }}
                  />
                </Card.Content>
              </Card>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}
