import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DailyDevotional {
  id: string;
  data: string;
  titulo: string;
  versiculo_base: string;
  conteudo: string;
  created_at: string;
}

function getTodayBrasilia(): string {
  const now = new Date();
  const brasiliaOffset = -3 * 60;
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const brasiliaMs = utcMs + brasiliaOffset * 60000;
  return new Date(brasiliaMs).toISOString().split("T")[0];
}

export function useDailyDevotional() {
  const [devotional, setDevotional] = useState<DailyDevotional | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchToday = useCallback(async () => {
    setLoading(true);
    setError(null);
    const today = getTodayBrasilia();

    const { data, error: fetchError } = await supabase
      .from("devocional_diario" as any)
      .select("*")
      .eq("data", today)
      .maybeSingle();

    if (fetchError) {
      console.error("Fetch daily devotional error:", fetchError);
      setError("Erro ao buscar devocional");
      setLoading(false);
      return;
    }

    if (data) {
      setDevotional(data as unknown as DailyDevotional);
      setLoading(false);
      return;
    }

    // No devotional for today - generate one
    setGenerating(true);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-daily-devotional`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({}),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || "Erro ao gerar devocional");
      }

      // Refetch after generation
      const { data: newData } = await supabase
        .from("devocional_diario" as any)
        .select("*")
        .eq("data", today)
        .maybeSingle();

      if (newData) {
        setDevotional(newData as unknown as DailyDevotional);
      }
    } catch (e) {
      console.error("Generate daily devotional error:", e);
      setError(e instanceof Error ? e.message : "Erro ao gerar devocional");
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchToday();
  }, [fetchToday]);

  return { devotional, loading, generating, error, refetch: fetchToday };
}
