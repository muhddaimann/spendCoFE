import { useCallback, useState } from "react";

export type SpendingInput = {
  amount: number;
  title: string;
  categoryId: string;
  wallet?: string;
  note?: string;
};

export function useSpending() {
  const [saving, setSaving] = useState(false);

  const createSpending = useCallback(async (input: SpendingInput) => {
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      console.log("Spending created (stub):", input);
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    saving,
    createSpending,
  };
}
