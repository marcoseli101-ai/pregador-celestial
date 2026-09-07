import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { word, language } = await req.json();

    if (!word || !word.trim()) {
      return new Response(JSON.stringify({ error: "Palavra é obrigatória" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey =
      Deno.env.get("GEMINI_API_CHATGPT") ||
      Deno.env.get("OPENAI_API_KEY") ||
      Deno.env.get("CHATGPT_API_KEY") ||
      Deno.env.get("GEMINI_API_KEY") ||
      Deno.env.get("LOVABLE_API_KEY");

    if (!apiKey) {
      throw new Error("Chave de IA não configurada no Supabase.");
    }

    const cleanKey = apiKey.replace(/^["']|["']$/g, "").trim();
    const isOpenAI = cleanKey.startsWith("sk-proj-") || cleanKey.startsWith("sk-");

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

    let response: Response;

    if (isOpenAI) {
      response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cleanKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Pesquise a palavra ou conceito bíblico: "${word}"` },
          ],
          response_format: { type: "json_object" },
          temperature: 0.3,
        }),
      });
    } else if (cleanKey.startsWith("AIza")) {
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${cleanKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: `${systemPrompt}\n\nPesquise a palavra ou conceito bíblico: "${word}"` }] }
          ]
        })
      });
    } else {
      response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cleanKey}`,
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
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || data.candidates?.[0]?.content?.parts?.[0]?.text || "";

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
