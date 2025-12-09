import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { useTheme, Chip, Divider, Card } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { useDesign } from "../../../contexts/designContext";
import { H2, Body, BodySmall } from "../../../components/atom/text";
import { Header } from "../../../components/shared/header";
import { useTabsUi } from "../../../contexts/tabContext";
import { Tag } from "lucide-react-native";
import { Button } from "../../../components/atom/button";
import { useCategoryStore } from "../../../hooks/useCategory";
import { useConfirm } from "../../../hooks/useOverlay";
import { useDelayedLoader } from "../../../hooks/useDelayedLoader";
import { InlineLoader } from "../../../components/shared/inlineLoader";
import { CategoryCard } from "../../../components/shared/CategoryCard";

type FilterKey = "all" | "active";

export default function CategoryPage() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { lockHidden, unlockHidden } = useTabsUi();
  const { categories, loading, error, removeCategory, loadCategories } =
    useCategoryStore();
  const { destructiveConfirm } = useConfirm();

  const [filter, setFilter] = useState<FilterKey>("all");

  const showListLoader = useDelayedLoader(loading.load, 300);

  useFocusEffect(
    React.useCallback(() => {
      lockHidden();
      void loadCategories();
      return () => {
        unlockHidden();
      };
    }, [lockHidden, unlockHidden, loadCategories])
  );

  const filtered = useMemo(
    () =>
      categories.filter((c) => {
        if (filter === "all") return true;
        if (filter === "active") return c.active;
        return true;
      }),
    [categories, filter]
  );

  const total = filtered.length;
  const activeCount = filtered.filter((c) => c.active).length;

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
  ];

  const emptyTitle: Record<FilterKey, string> = {
    all: "No categories yet",
    active: "No active categories",
  };

  const emptySubtitle: Record<FilterKey, string> = {
    all: "Create your first category to start grouping your spending.",
    active:
      "Turn on “Active” for categories you want to use when adding spending and reports.",
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    const ok = await destructiveConfirm({
      title: "Confirm Deletion",
      message: `Delete “${name}” category?`,
    });

    if (!ok) return;
    await removeCategory(id);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: tokens.spacing.lg,
          paddingVertical: tokens.spacing.lg,
          gap: tokens.spacing.lg,
          paddingBottom:
            tokens.spacing["3xl"] + insets.bottom + tokens.spacing.lg,
        }}
      >
        <Header title="Categories" subtitle="Organise how you track spending" />

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
                  borderColor: selected
                    ? colors.primary
                    : colors.outlineVariant,
                  backgroundColor: selected
                    ? colors.primaryContainer
                    : colors.surface,
                }}
                textStyle={{
                  fontFamily: selected
                    ? "Inter_600SemiBold"
                    : "Inter_400Regular",
                  fontSize: tokens.typography.sizes.xs,
                  color: selected
                    ? colors.onPrimaryContainer
                    : colors.onSurface,
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
            backgroundColor: colors.surface,
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
              <BodySmall muted>Categories (filtered)</BodySmall>
              <H2 weight="bold">{total}</H2>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <BodySmall muted>Active</BodySmall>
              <Body>{activeCount}</Body>
            </View>
          </Card.Content>
        </Card>

        <Divider />

        <View style={{ gap: tokens.spacing.md }}>
          {showListLoader ? (
            <InlineLoader label="Loading categories…" />
          ) : error ? (
            <BodySmall style={{ color: colors.error }}>{error}</BodySmall>
          ) : filtered.length === 0 ? (
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
                  <Tag size={24} color={colors.onSurfaceVariant} />
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
            filtered.map((item) => (
              <CategoryCard
                key={item.id}
                item={item}
                onDelete={handleDeleteCategory}
              />
            ))
          )}
        </View>
      </ScrollView>

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: tokens.spacing.lg,
          paddingBottom: insets.bottom + tokens.spacing.lg,
          paddingTop: tokens.spacing.sm,
          borderTopWidth: 0.5,
          borderTopColor: colors.outlineVariant,
          backgroundColor: colors.background,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: tokens.spacing.sm,
            justifyContent: "center",
            maxWidth: 360,
            width: "100%",
          }}
        >
          <Button
            variant="default"
            size="md"
            style={{ flex: 1 }}
            onPress={() => router.push("(modals)/addCategory")}
          >
            Add category
          </Button>
        </View>
      </View>
    </View>
  );
}
