import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, View, Pressable } from "react-native";
import { useTheme, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Tag } from "lucide-react-native";
import { useDesign } from "../../../contexts/designContext";
import { BodySmall, Body, H2 } from "../../../components/atom/text";
import { Button } from "../../../components/atom/button";
import { useOverlay } from "../../../hooks/useOverlay";
import { useTabsUi } from "../../../contexts/tabContext";
import { Header } from "../../../components/shared/header";
import { useSpending } from "../../../hooks/useSpending";
import {
  useCategoryStore,
  CATEGORY_ICONS,
  type CategoryIconKey,
} from "../../../hooks/useCategory";

export default function AddSpending() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { toast } = useOverlay();
  const { lockHidden, unlockHidden } = useTabsUi();
  const { saving, createSpending } = useSpending();
  const { categories, loading, loadCategories } = useCategoryStore();
  const [amountRaw, setAmountRaw] = useState("");
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      lockHidden();
      void loadCategories();
      return () => {
        unlockHidden();
      };
    }, [lockHidden, unlockHidden, loadCategories])
  );

  const activeCategories = useMemo(
    () => categories.filter((c) => c.active),
    [categories]
  );

  useEffect(() => {
    if (!categoryId && activeCategories.length === 1) {
      setCategoryId(activeCategories[0].id);
    }
  }, [activeCategories, categoryId]);

  const formattedAmount = useMemo(() => {
    const digits = amountRaw.replace(/\D/g, "");
    if (!digits) return "";
    if (digits.length === 1) return `0.0${digits}`;
    if (digits.length === 2) return `0.${digits}`;
    const intRaw = digits.slice(0, -2);
    const decPart = digits.slice(-2);
    const intPart = intRaw.replace(/^0+/, "") || "0";
    return `${intPart}.${decPart}`;
  }, [amountRaw]);

  const amountValue = useMemo(
    () => (formattedAmount ? parseFloat(formattedAmount) : NaN),
    [formattedAmount]
  );

  const selectedCategory = useMemo(
    () => activeCategories.find((c) => c.id === categoryId) ?? null,
    [activeCategories, categoryId]
  );

  const isValid = useMemo(() => {
    return (
      title.trim().length > 0 &&
      !Number.isNaN(amountValue) &&
      amountValue > 0 &&
      !!categoryId
    );
  }, [title, amountValue, categoryId]);

  const handleSave = async () => {
    if (!isValid || saving || !categoryId) return;

    try {
      await createSpending({
        amount: amountValue,
        title: title.trim(),
        categoryId,
      });

      toast({
        message: "Spending saved",
        variant: "success",
      });

      router.back();
    } catch (e: any) {
      toast({
        message: e?.message || "Failed to save spending",
        variant: "error",
      });
    }
  };

  const handleCreateCategory = () => {
    router.push("(modals)/addCategory");
  };

  const resolveIcon = (iconKey: CategoryIconKey | undefined) => {
    const found = CATEGORY_ICONS.find((i) => i.key === iconKey);
    return found?.icon ?? Tag;
  };

  const PreviewIcon = resolveIcon(
    selectedCategory?.iconKey as CategoryIconKey | undefined
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: tokens.spacing.lg,
          paddingTop: tokens.spacing.lg,
          paddingBottom: insets.bottom + tokens.spacing["3xl"],
          gap: tokens.spacing.lg,
        }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <Header title="New spending" subtitle="Log it in a few taps" />

        <View
          style={{
            padding: tokens.spacing.md,
            borderRadius: tokens.radii["2xl"],
            borderWidth: 0.8,
            borderColor: colors.outlineVariant,
            backgroundColor: colors.surface,
            gap: tokens.spacing.md,
          }}
        >
          <View style={{ gap: tokens.spacing.xs }}>
            <BodySmall muted>Amount (RM)</BodySmall>
            <TextInput
              mode="outlined"
              value={formattedAmount}
              onChangeText={(t) => {
                const digits = t.replace(/\D/g, "");
                setAmountRaw(digits);
              }}
              placeholder="0.00"
              keyboardType="numeric"
              autoFocus
              style={{
                fontSize: tokens.typography.sizes["2xl"],
                paddingVertical: tokens.spacing.sm,
              }}
            />
          </View>

          <View style={{ gap: tokens.spacing.xs }}>
            <BodySmall muted>What was this for?</BodySmall>
            <TextInput
              mode="outlined"
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Lunch, e-hailing, phone bill"
            />
          </View>

          <View style={{ gap: tokens.spacing.xs }}>
            <BodySmall muted>Category</BodySmall>

            {loading.load ? (
              <BodySmall muted>Loading categories…</BodySmall>
            ) : activeCategories.length === 0 ? (
              <Button
                variant="outline"
                size="sm"
                rounded="pill"
                onPress={handleCreateCategory}
                style={{ alignSelf: "flex-start" }}
              >
                Create your first category
              </Button>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: tokens.spacing.sm,
                }}
              >
                {activeCategories.map((c) => {
                  const selected = c.id === categoryId;
                  const bg = selected ? colors.primaryContainer : "transparent";
                  const fg = selected
                    ? colors.onPrimaryContainer
                    : colors.onSurfaceVariant;
                  const IconComp = resolveIcon(c.iconKey as CategoryIconKey);

                  return (
                    <Pressable
                      key={c.id}
                      onPress={() => setCategoryId(c.id)}
                      style={{
                        borderRadius: tokens.radii.pill,
                        borderWidth: 0.8,
                        borderColor: selected
                          ? colors.primary
                          : colors.outlineVariant,
                        backgroundColor: bg,
                        paddingHorizontal: tokens.spacing.md,
                        paddingVertical: tokens.spacing.xs,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: tokens.spacing.xs,
                      }}
                    >
                      <IconComp size={14} color={fg} />
                      <BodySmall
                        weight={selected ? "semibold" : "reg"}
                        style={{
                          fontSize: tokens.typography.sizes.xs,
                          color: fg,
                        }}
                      >
                        {c.name}
                      </BodySmall>
                    </Pressable>
                  );
                })}

                <Pressable
                  onPress={handleCreateCategory}
                  style={{
                    borderRadius: tokens.radii.pill,
                    borderWidth: 0.8,
                    borderColor: colors.outlineVariant,
                    backgroundColor: "transparent",
                    paddingHorizontal: tokens.spacing.md,
                    paddingVertical: tokens.spacing.xs,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: tokens.spacing.xs,
                  }}
                >
                  <BodySmall
                    weight="semibold"
                    style={{
                      fontSize: tokens.typography.sizes.xs,
                      color: colors.primary,
                    }}
                  >
                    + New category
                  </BodySmall>
                </Pressable>
              </View>
            )}
          </View>
        </View>

        <View
          style={{
            gap: tokens.spacing.sm,
            paddingHorizontal: tokens.spacing.xs,
          }}
        >
          <BodySmall muted>Preview</BodySmall>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: tokens.spacing.md,
            }}
          >
            <View style={{ flexShrink: 1, gap: 4 }}>
              <Body
                numberOfLines={1}
                style={{
                  color: colors.onSurface,
                }}
              >
                {title.trim().length > 0 ? title.trim() : "What was this for?"}
              </Body>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: tokens.spacing.xs,
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.surface,
                    borderWidth: 0.7,
                    borderColor: colors.outlineVariant,
                  }}
                >
                  <PreviewIcon size={12} color={colors.onSurfaceVariant} />
                </View>
                <BodySmall
                  muted
                  numberOfLines={1}
                  style={{ color: colors.onSurfaceVariant }}
                >
                  {selectedCategory?.name ?? "No category yet"}
                </BodySmall>
              </View>
            </View>

            <H2
              weight="bold"
              style={{
                color: colors.error,
                fontSize: tokens.typography.sizes["2xl"],
                textAlign: "right",
              }}
            >
              {formattedAmount ? `- RM ${formattedAmount}` : "- RM 0.00"}
            </H2>
          </View>
        </View>
      </ScrollView>

      <View
        pointerEvents="box-none"
        style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}
      >
        <View
          style={{
            paddingHorizontal: tokens.spacing.lg,
            paddingTop: tokens.spacing.sm,
            paddingBottom: insets.bottom + tokens.spacing.lg,
            backgroundColor: colors.background,
            borderTopWidth: 0.5,
            borderTopColor: colors.outlineVariant,
          }}
        >
          <Button
            onPress={handleSave}
            variant="default"
            rounded="sm"
            fullWidth
            disabled={!isValid || saving}
          >
            {saving ? "Saving..." : "Save spending"}
          </Button>
        </View>
      </View>
    </View>
  );
}
