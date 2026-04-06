import { useState, useCallback, useEffect, useMemo } from "react";

type PlanType = "biblical" | "chronological";

function getStorageKey(plan: PlanType) {
  return `reading-progress-${plan}`;
}

function loadCompleted(plan: PlanType): Set<number> {
  try {
    const raw = localStorage.getItem(getStorageKey(plan));
    return raw ? new Set(JSON.parse(raw) as number[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveCompleted(plan: PlanType, days: Set<number>) {
  localStorage.setItem(getStorageKey(plan), JSON.stringify([...days]));
}

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function computeStreak(completedDays: Set<number>, today: number): number {
  let streak = 0;
  let day = today;
  while (day > 0 && completedDays.has(day)) {
    streak++;
    day--;
  }
  return streak;
}

export function useAnnualReadingProgress(planType: PlanType) {
  const [completedDays, setCompletedDays] = useState<Set<number>>(() =>
    loadCompleted(planType)
  );

  useEffect(() => {
    setCompletedDays(loadCompleted(planType));
  }, [planType]);

  useEffect(() => {
    saveCompleted(planType, completedDays);
  }, [planType, completedDays]);

  const toggleDay = useCallback((day: number) => {
    setCompletedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) {
        next.delete(day);
      } else {
        next.add(day);
      }
      return next;
    });
  }, []);

  const todayDayNumber = useMemo(() => getDayOfYear(), []);

  const percentage = useMemo(
    () => Math.round((completedDays.size / 365) * 100),
    [completedDays]
  );

  const streak = useMemo(
    () => computeStreak(completedDays, todayDayNumber),
    [completedDays, todayDayNumber]
  );

  return { completedDays, toggleDay, percentage, streak, todayDayNumber };
}
