import { useCallback, useMemo, useState } from "react";
import {
  UtensilsCrossed,
  Coffee,
  TrainFront,
  ShoppingBag,
  Home,
  Lightbulb,
  Music2,
  Gamepad2,
  Plane,
  CreditCard,
  PiggyBank,
} from "lucide-react-native";

export type CategoryIconKey =
  | "food"
  | "coffee"
  | "transport"
  | "shopping"
  | "home"
  | "bills"
  | "entertainment"
  | "games"
  | "travel"
  | "card"
  | "savings";

export const CATEGORY_ICONS: {
  key: CategoryIconKey;
  icon: React.ComponentType<{ size?: number; color?: string }>;
}[] = [
  { key: "food", icon: UtensilsCrossed },
  { key: "coffee", icon: Coffee },
  { key: "transport", icon: TrainFront },
  { key: "shopping", icon: ShoppingBag },
  { key: "home", icon: Home },
  { key: "bills", icon: Lightbulb },
  { key: "entertainment", icon: Music2 },
  { key: "games", icon: Gamepad2 },
  { key: "travel", icon: Plane },
  { key: "card", icon: CreditCard },
  { key: "savings", icon: PiggyBank },
];

export const DEFAULT_ICON_KEY: CategoryIconKey = "food";

export type CategoryItem = {
  id: string;
  name: string;
  iconKey: CategoryIconKey;
  active: boolean;
  monthlyLimit?: number;
};

const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: "1",
    name: "Food & drinks",
    iconKey: "food",
    active: true,
    monthlyLimit: 400,
  },
  {
    id: "2",
    name: "Transport",
    iconKey: "transport",
    active: true,
    monthlyLimit: 200,
  },
  {
    id: "3",
    name: "Subscriptions",
    iconKey: "entertainment",
    active: true,
    monthlyLimit: 80,
  },
  {
    id: "4",
    name: "Fun",
    iconKey: "games",
    active: false,
  },
];

export type NewCategoryInput = {
  name: string;
  active: boolean;
  iconKey?: CategoryIconKey;
  monthlyLimit?: number;
};

export function useCategory() {
  const [categories, setCategories] =
    useState<CategoryItem[]>(INITIAL_CATEGORIES);

  const totalCount = categories.length;
  const activeCount = useMemo(
    () => categories.filter((c) => c.active).length,
    [categories]
  );

  const toggleActive = useCallback((id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  }, []);

  const addCategory = useCallback((input: NewCategoryInput) => {
    setCategories((prev) => {
      const nextId = prev.length
        ? String(Number(prev[prev.length - 1].id) + 1)
        : "1";

      return [
        ...prev,
        {
          id: nextId,
          name: input.name,
          iconKey: input.iconKey ?? DEFAULT_ICON_KEY,
          active: input.active,
          monthlyLimit: input.monthlyLimit,
        },
      ];
    });
  }, []);

  const updateCategory = useCallback(
    (id: string, patch: Partial<Omit<CategoryItem, "id">>) => {
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
      );
    },
    []
  );

  const removeCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const resetCategories = useCallback(() => {
    setCategories(INITIAL_CATEGORIES);
  }, []);

  return {
    categories,
    totalCount,
    activeCount,
    toggleActive,
    addCategory,
    updateCategory,
    removeCategory,
    resetCategories,
  };
}
