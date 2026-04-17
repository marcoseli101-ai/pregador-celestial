import { useState, useCallback, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  const [completedDays, setCompletedDays] = useState<Set<number>>(() =>
    loadCompleted(planType)
  );

  // Carrega do Supabase quando autenticado
  useEffect(() => {
    let cancelled = false;
    setCompletedDays(loadCompleted(planType));
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("reading_progress")
        .select("day_number")
        .eq("user_id", user.id)
        .eq("plan_type", planType);
      if (!cancelled && data) {
        const remote = new Set(data.map((r: any) => r.day_number as number));
        // Mesclar com local (envia locais que faltam)
        const local = loadCompleted(planType);
        const toUpload = [...local].filter((d) => !remote.has(d));
        if (toUpload.length) {
          await supabase.from("reading_progress").insert(
            toUpload.map((d) => ({ user_id: user.id, plan_type: planType, day_number: d }))
          );
          toUpload.forEach((d) => remote.add(d));
        }
        setCompletedDays(remote);
      }
    })();
    return () => { cancelled = true; };
  }, [planType, user]);

  useEffect(() => {
    saveCompleted(planType, completedDays);
  }, [planType, completedDays]);

  const toggleDay = useCallback((day: number) => {
    setCompletedDays((prev) => {
      const next = new Set(prev);
      const wasCompleted = next.has(day);
      if (wasCompleted) {
        next.delete(day);
        if (user) {
          supabase.from("reading_progress")
            .delete()
            .eq("user_id", user.id)
            .eq("plan_type", planType)
            .eq("day_number", day)
            .then(() => {});
        }
      } else {
        next.add(day);
        if (user) {
          supabase.from("reading_progress")
            .insert({ user_id: user.id, plan_type: planType, day_number: day })
            .then(() => {});
        }
      }
      return next;
    });
  }, [user, planType]);

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
