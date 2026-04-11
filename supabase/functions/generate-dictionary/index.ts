import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { word, language } = await req.json();

    if (!word || !word.trim()) {
      return new Response(JSON.stringify({ error: "Palavra é obrigatória" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY not configured");

    const langFilter = language && language !== "Todos" ? `Foque no idioma ${language}.` : "Inclua resultados em Hebraico, Aramaico e Grego quando aplicável.";

    const systemPrompt = `Você é um lexicógrafo bíblico especialista em Hebraico, Aramaico e Grego bíblico. 
Dado um termo ou conceito bíblico, retorne um JSON com um array "results" contendo de 1 a 5 palavras bíblicas relacionadas.

${langFilter}

Cada item DEVE ter EXATAMENTE estes campos:
- "word": a palavra no alfabeto original (hebraico, aramaico ou grego)
- "transliteration": transliteração precisa em caracteres latinos
- "pronunciation_guide": guia fonético detalhado para pronúncia correta em português brasileiro (ex: "rú-akh", "agá-pe")
- "language": "Hebraico", "Aramaico" ou "Grego"
- "strongs_number": código Strong's (ex: "H7307", "G26") 
- "meaning": significado teológico profundo e detalhado (3-5 frases)
- "usage": como a palavra é usada nas Escrituras com contexto histórico
- "verses": 3-5 referências bíblicas principais com breve explicação de cada
- "related_words": array de 2-3 palavras relacionadas com transliteração

IMPORTANTE: Seja academicamente preciso. Use transliterações aceitas pela academia teológica.
Retorne APENAS o JSON válido, sem texto adicional.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Pesquise a palavra ou conceito bíblico: "${word}"` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Muitas requisições. Tente novamente em alguns segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Resposta inválida da IA");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Dictionary error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
