// ============================================================
// supabase/functions/bible-verse-tools/index.ts
//
// Uma única Edge Function que atende todas as ferramentas do menu
// de seleção de versículo: comparar, explicar, referências, temas.
// O frontend chama com { action, ref, translationCode, compareWith? }.
//
// Usa a mesma LOVABLE_API_KEY e gateway que todas as outras
// Edge Functions do projeto (generate-sermon, theology-chat, etc.).
// ============================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { fetchVerseInMultipleTranslations, fetchVerseText } from "../../../bible-engine/core/bibleApiClient.ts";
import {
  getOrCreateCrossReferences,
  getOrCreateExplanation,
  getOrCreateThemeSuggestions,
} from "../../../bible-engine/core/explanationEngine.ts";
import { parseVerseRef } from "../../../bible-engine/core/verseRef.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!apiKey || !supabaseUrl || !serviceRoleKey) {
      throw new Error("Variáveis de ambiente ausentes (LOVABLE_API_KEY / SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const body = await req.json();
    const { action, book, bookLabel, chapter, verse, verseEnd, translationCode, compareWith, compareAll } = body;

    const ref = parseVerseRef({ book, bookLabel, chapter, verse, verseEnd });

    let result: unknown;

    switch (action) {
      case "get_verse":
        result = await fetchVerseText(ref, translationCode);
        break;

      case "compare": {
        // Regra do usuário: comparação é sempre incremental — só
        // compara com "todas" se compareAll vier explicitamente true.
        const { listTranslationCodes } = await import("../../../bible-engine/config/translations.ts");
        const codes = compareAll ? listTranslationCodes() : (compareWith || []);
        result = { ref, versions: await fetchVerseInMultipleTranslations(ref, [translationCode, ...codes]) };
        break;
      }

      case "explain":
        result = await getOrCreateExplanation(supabase, ref, translationCode, apiKey);
        break;

      case "cross_references":
        result = await getOrCreateCrossReferences(supabase, ref, translationCode, apiKey);
        break;

      case "suggest_themes":
        result = await getOrCreateThemeSuggestions(supabase, ref, translationCode, apiKey);
        break;

      default:
        throw new Error(`Ação desconhecida: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
