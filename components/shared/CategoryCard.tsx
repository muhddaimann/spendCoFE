import React from "react";
import { View, Pressable } from "react-native";
import {
  useTheme,
  Card,
  Switch,
  ActivityIndicator,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useDesign } from "../../contexts/designContext";
import { Body, BodySmall } from "../atom/text";
import { useCategoryStore, CATEGORY_ICONS } from "../../hooks/useCategory";
import type { CategoryItem } from "../../hooks/useCategory";
import { useDelayedLoader } from "../../hooks/useDelayedLoader";
import { Tag } from "lucide-react-native";

type CategoryCardProps = {
  item: CategoryItem;
  onDelete: (id: string, name: string) => void;
};

const resolveIcon = (iconKey: string | undefined) => {
  const found = CATEGORY_ICONS.find((i) => i.key === iconKey);
  return found?.icon ?? Tag;
};

export function CategoryCard({ item, onDelete }: CategoryCardProps) {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const router = useRouter();

  const { loading, toggleActive } = useCategoryStore();

  const isUpdating = loading.update[item.id];
  const isRemoving = loading.remove[item.id];
  const itemIsLoading = isUpdating || isRemoving;

  const showLoader = useDelayedLoader(itemIsLoading, 300);

  const IconComp = resolveIcon(item.iconKey as any);

  return (
    <Card
      style={{
        borderRadius: tokens.radii.lg,
        borderWidth: 0.6,
        backgroundColor: colors.surface,
        borderColor: colors.outlineVariant,
        opacity: itemIsLoading ? 0.6 : 1,
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
          <IconComp size={20} color={colors.onSurface} />
        </View>

        <View style={{ flex: 1, gap: 2 }}>
          <Body weight="semibold">{item.name}</Body>
          {item.monthlyLimit ? (
            <BodySmall muted>
              Limit RM {item.monthlyLimit.toFixed(2)}
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
              value={item.active}
              onValueChange={(val) => toggleActive(item.id, val)}
              disabled={itemIsLoading}
              thumbColor={item.active ? colors.primary : colors.surface}
              trackColor={{
                false: colors.surfaceVariant,
                true: colors.primaryContainer,
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: tokens.spacing.sm,
              minHeight: 20,
              alignItems: "center",
            }}
          >
            {showLoader ? (
              <ActivityIndicator size={16} />
            ) : (
              <>
                <Pressable
                  hitSlop={8}
                  disabled={itemIsLoading}
                  onPress={() =>
                    router.push({
                      pathname: "(modals)/addCategory",
                      params: { id: item.id },
                    })
                  }
                >
                  <BodySmall weight="semibold" style={{ color: colors.primary }}>
                    Edit
                  </BodySmall>
                </Pressable>

                <Pressable
                  hitSlop={8}
                  disabled={itemIsLoading}
                  onPress={() => onDelete(item.id, item.name)}
                >
                  <BodySmall weight="semibold" style={{ color: colors.error }}>
                    Delete
                  </BodySmall>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}
