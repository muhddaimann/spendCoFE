import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  View,
  TextInput as RNInput,
  InteractionManager,
  Pressable,
} from "react-native";
import { useTheme, TextInput, Switch, Divider, Card } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDesign } from "../../contexts/designContext";
import { Button } from "../../components/atom/button";
import { useFocusEffect, useRouter } from "expo-router";
import { Body, BodySmall } from "../../components/atom/text";
import { useToast } from "../../hooks/useOverlay";
import { Header } from "../../components/shared/header";
import {
  CATEGORY_ICONS,
  CategoryIconKey,
  DEFAULT_ICON_KEY,
} from "../../hooks/useCategory";
import { Tag } from "lucide-react-native";

export default function AddCategory() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const toast = useToast();

  const [name, setName] = useState("");
  const [active, setActive] = useState(true);
  const [limit, setLimit] = useState("");
  const [iconKey, setIconKey] = useState<CategoryIconKey>(DEFAULT_ICON_KEY);
  const [fieldErr, setFieldErr] = useState<{ name?: string; limit?: string }>(
    {}
  );

  const nameRef = useRef<RNInput>(null);
  const limitRef = useRef<RNInput>(null);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      requestAnimationFrame(() => nameRef.current?.focus());
    });
    return () => task.cancel();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setName("");
        setActive(true);
        setLimit("");
        setIconKey(DEFAULT_ICON_KEY);
        setFieldErr({});
      };
    }, [])
  );

  const isValid = name.trim().length > 0;

  const onSubmit = () => {
    const n = name.trim();
    const nextErr: typeof fieldErr = {};
    if (!n) nextErr.name = "Required";

    if (limit.trim()) {
      const parsed = Number(limit.replace(/,/g, ""));
      if (Number.isNaN(parsed) || parsed < 0) {
        nextErr.limit = "Enter a valid amount";
      }
    }

    setFieldErr(nextErr);
    if (Object.keys(nextErr).length) {
      if (!n) {
        nameRef.current?.focus();
      } else if (nextErr.limit) {
        limitRef.current?.focus();
      }
      return;
    }

    const payload = {
      name: n,
      active,
      iconKey,
      defaultMonthlyLimit: limit.trim()
        ? Number(limit.replace(/,/g, ""))
        : undefined,
    };

    console.log("New category:", payload);
    toast("Category saved");
    router.back();
  };

  const resolveIcon = (key: CategoryIconKey) => {
    const found = CATEGORY_ICONS.find((i) => i.key === key);
    return found?.icon ?? Tag;
  };

  const IconPreview = resolveIcon(iconKey);
  const displayName = name.trim() || "New category";
  const displayLimit = limit.trim()
    ? Number(limit.replace(/,/g, ""))
    : undefined;

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: tokens.spacing.lg,
          paddingTop: tokens.spacing.lg,
          paddingBottom: insets.bottom + tokens.spacing.xl * 4,
          gap: tokens.spacing.lg,
        }}
        bounces={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <Header
          title="New category"
          subtitle="Keep your spending organised with simple labels"
        />

        <View style={{ gap: tokens.spacing.lg }}>
          <View style={{ gap: tokens.spacing.md }}>
            <TextInput
              mode="outlined"
              label="Category name"
              value={name}
              onChangeText={(t) => {
                setName(t);
                if (fieldErr.name)
                  setFieldErr((e) => ({ ...e, name: undefined }));
              }}
              autoCapitalize="sentences"
              returnKeyType="next"
              onSubmitEditing={() => limitRef.current?.focus()}
              error={!!fieldErr.name}
              ref={nameRef}
            />
            {fieldErr.name ? (
              <BodySmall
                style={{
                  color: colors.error,
                  marginTop: -8,
                  fontSize: tokens.typography.sizes.xs,
                }}
              >
                {fieldErr.name}
              </BodySmall>
            ) : null}

            <TextInput
              mode="outlined"
              label="Default monthly limit (optional)"
              value={limit}
              onChangeText={(t) => {
                setLimit(t);
                if (fieldErr.limit)
                  setFieldErr((e) => ({ ...e, limit: undefined }));
              }}
              keyboardType="numeric"
              returnKeyType="done"
              ref={limitRef}
              error={!!fieldErr.limit}
            />
            {fieldErr.limit ? (
              <BodySmall
                style={{
                  color: colors.error,
                  marginTop: -8,
                  fontSize: tokens.typography.sizes.xs,
                }}
              >
                {fieldErr.limit}
              </BodySmall>
            ) : null}
          </View>

          <Divider />

          <View style={{ gap: tokens.spacing.sm }}>
            <BodySmall muted>Icon</BodySmall>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: tokens.spacing.sm,
                paddingVertical: tokens.spacing.xs,
              }}
            >
              {CATEGORY_ICONS.map((item) => {
                const selected = item.key === iconKey;
                const IconComp = item.icon;
                return (
                  <Pressable
                    key={item.key}
                    onPress={() => setIconKey(item.key)}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: selected
                        ? colors.primaryContainer
                        : colors.surface,
                      borderWidth: 1,
                      borderColor: selected
                        ? colors.primary
                        : colors.outlineVariant,
                    }}
                  >
                    <IconComp
                      size={20}
                      color={
                        selected ? colors.onPrimaryContainer : colors.onSurface
                      }
                    />
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: tokens.spacing.sm,
            }}
          >
            <View style={{ flex: 1, marginRight: tokens.spacing.sm }}>
              <Body weight="semibold">Active</Body>
              <BodySmall muted>
                Active categories will appear when adding spending and in budget
                reports.
              </BodySmall>
            </View>
            <Switch
              value={active}
              onValueChange={setActive}
              thumbColor={active ? colors.primary : colors.surface}
              trackColor={{
                false: colors.surfaceVariant,
                true: colors.primaryContainer,
              }}
            />
          </View>

          <Divider />

          <View style={{ gap: tokens.spacing.sm }}>
            <BodySmall muted>Preview</BodySmall>

            <Card
              style={{
                borderRadius: tokens.radii.lg,
                borderWidth: 0.6,
                borderColor: colors.outlineVariant,
                backgroundColor: colors.surface,
              }}
            >
              <Card.Content
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: tokens.spacing.md,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.surfaceVariant,
                  }}
                >
                  <IconPreview size={20} color={colors.onSurface} />
                </View>

                <View style={{ flex: 1, gap: 2 }}>
                  <Body weight="semibold">{displayName}</Body>
                  {displayLimit !== undefined ? (
                    <BodySmall muted>
                      Limit RM {displayLimit.toFixed(2)}
                    </BodySmall>
                  ) : (
                    <BodySmall muted>Default category</BodySmall>
                  )}
                </View>

                <View
                  style={{
                    alignItems: "flex-end",
                    gap: tokens.spacing.xs,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: tokens.spacing.xs,
                    }}
                  >
                    <BodySmall muted>Active</BodySmall>
                    <Switch
                      value={active}
                      disabled
                      thumbColor={active ? colors.primary : colors.surface}
                      trackColor={{
                        false: colors.surfaceVariant,
                        true: colors.primaryContainer,
                      }}
                    />
                  </View>
                </View>
              </Card.Content>
            </Card>
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
          <View
            style={{
              flexDirection: "row",
              gap: tokens.spacing.sm,
              justifyContent: "center",
              maxWidth: 360,
              width: "100%",
              alignSelf: "center",
            }}
          >
            <Button
              onPress={onSubmit}
              variant="default"
              disabled={!isValid}
              size="md"
              style={{ flex: 1 }}
            >
              Save category
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}
