import {
  CrossReferenceSet,
  ThemeSuggestionSet,
  VerseExplanation,
} from "../types.ts";

// ============================================================
// Interface mínima de um cliente Supabase, para não acoplar este
// módulo a uma versão específica do SDK. Na Edge Function real,
// passe o client criado com @supabase/supabase-js.
// ============================================================
export interface SupabaseLikeClient {
  from(table: string): {
    select: (columns: string) => {
      eq: (col: string, val: string) => {
        maybeSingle: () => Promise<{ data: any; error: any }>;
      };
    };
    upsert: (row: Record<string, any>, opts?: Record<string, any>) => Promise<{ error: any }>;
  };
}

const TABLE_EXPLANATIONS = "bible_verse_explanations";
const TABLE_CROSS_REFS = "bible_cross_references";
const TABLE_THEMES = "bible_theme_suggestions";

// ------------------------------------------------------------
// Explicações ("Me Explica")
// ------------------------------------------------------------
export async function getCachedExplanation(
  client: SupabaseLikeClient,
  refKey: string
): Promise<VerseExplanation | null> {
  const { data, error } = await client
    .from(TABLE_EXPLANATIONS)
    .select("*")
    .eq("ref_key", refKey)
    .maybeSingle();

  if (error || !data) return null;

  return {
    refKey: data.ref_key,
    translationCode: data.translation_code,
    title: data.title,
    resumo: data.resumo,
    contextoImediato: data.contexto_imediato,
    observacoesLinguisticas: data.observacoes_linguisticas,
    referenciasCruzadas: data.referencias_cruzadas,
    aplicacaoPratica: data.aplicacao_pratica,
    fontesParaEstudo: data.fontes_para_estudo ?? [],
    formatted: data.formatted,
    createdAt: data.created_at,
  };
}

export async function saveExplanation(
  client: SupabaseLikeClient,
  explanation: VerseExplanation
): Promise<void> {
  await client.from(TABLE_EXPLANATIONS).upsert(
    {
      ref_key: explanation.refKey,
      translation_code: explanation.translationCode,
      title: explanation.title,
      resumo: explanation.resumo,
      contexto_imediato: explanation.contextoImediato,
      observacoes_linguisticas: explanation.observacoesLinguisticas,
      referencias_cruzadas: explanation.referenciasCruzadas,
      aplicacao_pratica: explanation.aplicacaoPratica,
      fontes_para_estudo: explanation.fontesParaEstudo,
      formatted: explanation.formatted,
      created_at: explanation.createdAt,
    },
    { onConflict: "ref_key" }
  );
}

// ------------------------------------------------------------
// Referências cruzadas
// ------------------------------------------------------------
export async function getCachedCrossReferences(
  client: SupabaseLikeClient,
  refKey: string
): Promise<CrossReferenceSet | null> {
  const { data, error } = await client
    .from(TABLE_CROSS_REFS)
    .select("*")
    .eq("ref_key", refKey)
    .maybeSingle();

  if (error || !data) return null;

  return {
    refKey: data.ref_key,
    references: data.references ?? [],
    createdAt: data.created_at,
  };
}

export async function saveCrossReferences(
  client: SupabaseLikeClient,
  set: CrossReferenceSet
): Promise<void> {
  await client.from(TABLE_CROSS_REFS).upsert(
    {
      ref_key: set.refKey,
      references: set.references,
      created_at: set.createdAt,
    },
    { onConflict: "ref_key" }
  );
}

// ------------------------------------------------------------
// Temas sugeridos
// ------------------------------------------------------------
export async function getCachedThemes(
  client: SupabaseLikeClient,
  refKey: string
): Promise<ThemeSuggestionSet | null> {
  const { data, error } = await client
    .from(TABLE_THEMES)
    .select("*")
    .eq("ref_key", refKey)
    .maybeSingle();

  if (error || !data) return null;

  return {
    refKey: data.ref_key,
    themes: data.themes ?? [],
    createdAt: data.created_at,
  };
}

export async function saveThemes(
  client: SupabaseLikeClient,
  set: ThemeSuggestionSet
): Promise<void> {
  await client.from(TABLE_THEMES).upsert(
    {
      ref_key: set.refKey,
      themes: set.themes,
      created_at: set.createdAt,
    },
    { onConflict: "ref_key" }
  );
}
