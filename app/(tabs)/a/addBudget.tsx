import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { useTheme, TextInput, Divider } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useDesign } from "../../../contexts/designContext";
import { H2, BodySmall } from "../../../components/atom/text";
import { Button } from "../../../components/atom/button";
import { useOverlay } from "../../../hooks/useOverlay";
import { useTabsUi } from "../../../contexts/tabContext";
import { useFocusEffect } from "expo-router";
import { Header } from "../../../components/shared/header";

type CategoryKey = "food" | "transport" | "bills" | "other";

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: "food", label: "Food" },
  { key: "transport", label: "Transport" },
  { key: "bills", label: "Bills" },
  { key: "other", label: "Other" },
];

type Mode = "add" | "edit";

type BudgetFormProps = {
  mode?: Mode;
  initialName?: string;
  initialAmount?: string;
  initialCategory?: CategoryKey;
  initialNote?: string;
};

export default function AddBudget({
  mode = "add",
  initialName = "",
  initialAmount = "",
  initialCategory = "food",
  initialNote = "",
}: BudgetFormProps) {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { toast } = useOverlay();
  const { lockHidden, unlockHidden } = useTabsUi();

  useFocusEffect(
    React.useCallback(() => {
      lockHidden();
      return () => {
        unlockHidden();
      };
    }, [lockHidden, unlockHidden])
  );

  const [name, setName] = useState(initialName);
  const [amount, setAmount] = useState(initialAmount);
  const [category, setCategory] = useState<CategoryKey>(initialCategory);
  const [note, setNote] = useState(initialNote);
  const [saving, setSaving] = useState(false);

  const isValid = useMemo(() => {
    const num = parseFloat(amount.replace(",", "."));
    return name.trim().length > 0 && !Number.isNaN(num) && num > 0;
  }, [amount, name]);

  const handleSave = async () => {
    if (!isValid || saving) return;

    const num = parseFloat(amount.replace(",", "."));
    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        limit: num,
        category,
        note: note.trim() || undefined,
      };

      toast({
        message: mode === "add" ? "Budget saved" : "Budget updated",
        variant: "success",
      });

      router.back();
    } catch (e: any) {
      toast({
        message: e?.message || "Failed to save budget",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: tokens.spacing.lg,
          paddingTop: tokens.spacing.lg,
          paddingBottom: insets.bottom + tokens.spacing.xl * 4,
          gap: tokens.spacing.lg,
        }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <Header
          title="Budget"
          subtitle={mode === "add" ? "Create a new budget" : "Edit budget"}
        />
        <View
          style={{
            gap: tokens.spacing.sm,
            padding: tokens.spacing.md,
            borderRadius: tokens.radii.lg,
            borderWidth: 0.8,
            borderColor: colors.outlineVariant,
            backgroundColor: colors.surface,
          }}
        >
          <BodySmall muted>Budget name</BodySmall>
          <TextInput
            mode="outlined"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Food & drinks, Transport"
          />
        </View>

        <View
          style={{
            gap: tokens.spacing.sm,
            padding: tokens.spacing.md,
            borderRadius: tokens.radii.lg,
            borderWidth: 0.8,
            borderColor: colors.outlineVariant,
            backgroundColor: colors.surface,
          }}
        >
          <BodySmall muted>Monthly limit (RM)</BodySmall>
          <TextInput
            mode="outlined"
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="decimal-pad"
          />
        </View>

        <View
          style={{
            gap: tokens.spacing.sm,
            padding: tokens.spacing.md,
            borderRadius: tokens.radii.lg,
            borderWidth: 0.8,
            borderColor: colors.outlineVariant,
            backgroundColor: colors.surface,
          }}
        >
          <BodySmall muted>Category</BodySmall>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: tokens.spacing.sm,
            }}
          >
            {CATEGORIES.map((c) => {
              const selected = c.key === category;
              const bg = selected ? colors.surfaceVariant : "transparent";
              const fg = selected ? colors.onSurface : colors.onSurfaceVariant;

              return (
                <View
                  key={c.key}
                  style={{
                    borderRadius: tokens.radii.pill,
                    borderWidth: 0.8,
                    borderColor: selected
                      ? colors.primary
                      : colors.outlineVariant,
                    backgroundColor: bg,
                    paddingHorizontal: tokens.spacing.md,
                    paddingVertical: tokens.spacing.xs,
                  }}
                >
                  <BodySmall
                    weight={selected ? "semibold" : "reg"}
                    style={{
                      fontSize: tokens.typography.sizes.xs,
                      color: fg,
                    }}
                    onPress={() => setCategory(c.key)}
                  >
                    {c.label}
                  </BodySmall>
                </View>
              );
            })}
          </View>
        </View>

        <View
          style={{
            gap: tokens.spacing.sm,
            padding: tokens.spacing.md,
            borderRadius: tokens.radii.lg,
            borderWidth: 0.8,
            borderColor: colors.outlineVariant,
            backgroundColor: colors.surface,
          }}
        >
          <BodySmall muted>Note (optional)</BodySmall>
          <TextInput
            mode="outlined"
            value={note}
            onChangeText={setNote}
            placeholder="Add a short note"
            multiline
          />
        </View>

        <Divider />
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
            {saving
              ? mode === "add"
                ? "Saving budget..."
                : "Updating budget..."
              : mode === "add"
              ? "Save budget"
              : "Update budget"}
          </Button>
        </View>
      </View>
    </View>
  );
}
