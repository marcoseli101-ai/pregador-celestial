import { useEffect, useState } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ============================================================
// Banner de novidades — aparece uma vez por usuário para cada
// anúncio novo, usando a tabela app_seen_announcements.
// ============================================================

export interface FeatureAnnouncement {
  id: string;
  title: string;
  message: string;
  features: string[];
}

export const CURRENT_ANNOUNCEMENT: FeatureAnnouncement = {
  id: "biblia-v2-2026-09",
  title: "Novidades na página Bíblia",
  message: "Atualizamos a experiência de leitura bíblica do Pregador.site:",
  features: [
    "13 traduções diferentes para comparar lado a lado",
    "Explicação teológica de cada versículo (Me Explica)",
    "Referências cruzadas de toda a Bíblia",
    "Sugestão de temas específicos para cada versículo",
    "Marcação de versículos e anotações pessoais",
  ],
};

interface AnnouncementBannerProps {
  supabase: SupabaseClient;
  userId: string | null;
  announcement?: FeatureAnnouncement;
}

export function AnnouncementBanner({
  supabase,
  userId,
  announcement = CURRENT_ANNOUNCEMENT,
}: AnnouncementBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    async function checkSeen() {
      const { data } = await supabase
        .from("app_seen_announcements")
        .select("announcement_id")
        .eq("user_id", userId)
        .eq("announcement_id", announcement.id)
        .maybeSingle();

      if (!cancelled && !data) setVisible(true);
    }

    checkSeen();
    return () => {
      cancelled = true;
    };
  }, [userId, announcement.id, supabase]);

  async function dismiss() {
    setVisible(false);
    if (!userId) return;
    await supabase
      .from("app_seen_announcements")
      .upsert({ user_id: userId, announcement_id: announcement.id }, { onConflict: "user_id,announcement_id" });
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 mx-auto mb-4 max-w-lg rounded-xl border border-indigo-500/30 bg-slate-900/95 p-4 shadow-xl backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-indigo-300">🎉 {announcement.title}</p>
          <p className="mt-1 text-sm text-slate-300">{announcement.message}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
            {announcement.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </div>
      <button
        onClick={dismiss}
        className="mt-3 w-full rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-500"
      >
        Entendi
      </button>
    </div>
  );
}

// Uso no app (exemplo):
//
// const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// const { data: { user } } = await supabase.auth.getUser();
// <AnnouncementBanner supabase={supabase} userId={user?.id ?? null} />
