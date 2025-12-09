import { create } from "zustand";
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
import {
  apiGetCategories,
  apiCreateCategory,
  apiUpdateCategory,
  apiDeleteCategory,
  type Category,
} from "../contexts/api/categories";

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

export type NewCategoryInput = {
  name: string;
  active: boolean;
  iconKey?: CategoryIconKey;
  monthlyLimit?: number;
};

const fromApi = (c: Category): CategoryItem => {
  const activeRaw = (c as any).active;
  const monthlyRaw = (c as any).monthly_limit;

  return {
    id: String(c.id),
    name: c.name,
    iconKey: (c.icon_key as CategoryIconKey) ?? DEFAULT_ICON_KEY,
    active: activeRaw === true || activeRaw === 1 || activeRaw === "1",
    monthlyLimit: monthlyRaw != null ? Number(monthlyRaw) : undefined,
  };
};

const toCreatePayload = (input: NewCategoryInput) => ({
  name: input.name,
  icon_key: input.iconKey ?? DEFAULT_ICON_KEY,
  monthly_limit: input.monthlyLimit ?? null,
});

const toUpdatePayload = (
  patch: Partial<Omit<CategoryItem, "id">>
): {
  name?: string;
  icon_key?: string;
  monthly_limit?: number | null;
  active?: boolean;
} => {
  const result: {
    name?: string;
    icon_key?: string;
    monthly_limit?: number | null;
    active?: boolean;
  } = {};

  if (patch.name !== undefined) result.name = patch.name;
  if (patch.iconKey !== undefined) result.icon_key = patch.iconKey;
  if (patch.monthlyLimit !== undefined)
    result.monthly_limit = patch.monthlyLimit ?? null;
  if (patch.active !== undefined) result.active = patch.active;

  return result;
};

type CategoryState = {
  categories: CategoryItem[];
  loading: {
    load: boolean;
    add: boolean;
    update: Record<string, boolean>;
    remove: Record<string, boolean>;
  };
  error: string | null;
  loadCategories: () => Promise<void>;
  addCategory: (input: NewCategoryInput) => Promise<CategoryItem>;
  updateCategory: (
    id: string,
    patch: Partial<Omit<CategoryItem, "id">>
  ) => Promise<CategoryItem>;
  toggleActive: (id: string, nextActive?: boolean) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
};

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  loading: {
    load: false,
    add: false,
    update: {},
    remove: {},
  },
  error: null,

  loadCategories: async () => {
    set((state) => ({
      loading: { ...state.loading, load: true },
      error: null,
    }));
    try {
      const res = await apiGetCategories();
      set((state) => ({
        categories: res.map(fromApi),
        loading: { ...state.loading, load: false },
      }));
    } catch (e: any) {
      set((state) => ({
        error: e?.message || "Failed to load categories",
        loading: { ...state.loading, load: false },
      }));
    }
  },

  addCategory: async (input) => {
    set((state) => ({
      loading: { ...state.loading, add: true },
      error: null,
    }));
    try {
      const created = await apiCreateCategory(toCreatePayload(input));
      const item = fromApi(created);
      set((state) => ({
        categories: [...state.categories, item],
        loading: { ...state.loading, add: false },
      }));
      return item;
    } catch (e: any) {
      const msg = e?.message || "Failed to create category";
      set((state) => ({
        error: msg,
        loading: { ...state.loading, add: false },
      }));
      throw new Error(msg);
    }
  },

  updateCategory: async (id, patch) => {
    set((state) => ({
      loading: {
        ...state.loading,
        update: { ...state.loading.update, [id]: true },
      },
      error: null,
    }));
    try {
      const updated = await apiUpdateCategory(
        Number(id),
        toUpdatePayload(patch)
      );
      const item = fromApi(updated);
      set((state) => ({
        categories: state.categories.map((c) => (c.id === id ? item : c)),
        loading: {
          ...state.loading,
          update: { ...state.loading.update, [id]: false },
        },
      }));
      return item;
    } catch (e: any) {
      const msg = e?.message || "Failed to update category";
      set((state) => ({
        error: msg,
        loading: {
          ...state.loading,
          update: { ...state.loading.update, [id]: false },
        },
      }));
      throw new Error(msg);
    }
  },

  toggleActive: async (id, nextActive) => {
    const current = get().categories.find((c) => c.id === id);
    if (!current) return;

    const target =
      typeof nextActive === "boolean" ? nextActive : !current.active;

    await get().updateCategory(id, { active: target });
  },

  removeCategory: async (id: string) => {
    set((state) => ({
      loading: {
        ...state.loading,
        remove: { ...state.loading.remove, [id]: true },
      },
      error: null,
    }));
    try {
      await apiDeleteCategory(Number(id));
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
        loading: {
          ...state.loading,
          remove: { ...state.loading.remove, [id]: false },
        },
      }));
    } catch (e: any) {
      const msg = e?.message || "Failed to delete category";
      set((state) => ({
        error: msg,
        loading: {
          ...state.loading,
          remove: { ...state.loading.remove, [id]: false },
        },
      }));
      throw new Error(msg);
    }
  },
}));
