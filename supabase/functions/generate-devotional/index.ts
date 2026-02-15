import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const today = new Date().toLocaleDateString("pt-BR", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });

    const systemPrompt = `Você é um pastor e teólogo evangélico pentecostal profundo e ungido.
Gere um devocional diário completo, inspirador e edificante.

O devocional DEVE conter exatamente estas 3 seções, formatadas em markdown:

## 📖 Versículo do Dia
Escolha um versículo bíblico impactante e relevante. Cite o texto completo entre aspas e a referência.

## 💛 Reflexão
Uma reflexão espiritual profunda de 3-4 parágrafos sobre o versículo. Conecte com a vida prática do crente, traga contexto bíblico e aplicação espiritual. Use linguagem que toque o coração.

## 🙏 Oração
Uma oração sincera e poderosa baseada no versículo e na reflexão. Deve ser pessoal e edificante, terminando em "Em nome de Jesus, amém."

IMPORTANTE:
- Escolha versículos variados a cada dia (não repita Provérbios 3:5-6 sempre)
- A reflexão deve ter profundidade teológica mas ser acessível
- Use linguagem espiritual pentecostal com reverência
- O tom deve ser acolhedor, encorajador e cheio de fé`;

    const userPrompt = `Gere o devocional para hoje, ${today}. Escolha um versículo inspirador e diferente, que fale ao coração do povo de Deus neste dia.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns segundos." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados. Adicione créditos para continuar." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro ao gerar devocional" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("generate-devotional error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
