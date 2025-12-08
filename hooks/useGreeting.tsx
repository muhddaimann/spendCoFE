import { useMemo } from "react";

export type RangeKey = "today" | "week" | "month";

export function useGreeting() {
  const now = useMemo(() => new Date(), []);
  const hour = now.getHours();

  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const day = now.getDate();
  const monthShort = now.toLocaleDateString(undefined, { month: "short" });
  const year = now.getFullYear();

  const weekEnd = new Date(now);
  weekEnd.setDate(now.getDate() + 6);
  const weekEndDay = weekEnd.getDate();
  const weekEndMonthShort = weekEnd.toLocaleDateString(undefined, {
    month: "short",
  });

  const todayLabel = `${monthShort} ${day}`;
  const weekLabel = `${monthShort} ${day}–${weekEndMonthShort} ${weekEndDay}`;
  const monthLabel = `${monthShort} ${year}`;

  const getDisplayLabel = (range: RangeKey) => {
    if (range === "today") return `Today · ${todayLabel}`;
    if (range === "week") return `This week · ${weekLabel}`;
    return `This month · ${monthLabel}`;
  };

  return {
    greeting,
    todayLabel,
    weekLabel,
    monthLabel,
    getDisplayLabel,
  };
}
