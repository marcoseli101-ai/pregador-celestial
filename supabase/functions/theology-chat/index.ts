import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY não configurada");

    const systemPrompt = `Você é um professor de teologia das Assembleias de Deus (CGADB — Convenção Geral das Assembleias de Deus no Brasil). Responda dúvidas teológicas com profundidade acadêmica e fidelidade à doutrina pentecostal clássica.

Contexto atual do aluno: ${context || "Curso de Teologia CGADB"}

Diretrizes:
- Siga fielmente o Credo das Assembleias de Deus e as posições doutrinárias da CGADB
- Enfatize a atualidade dos dons espirituais, o batismo no Espírito Santo com evidência de línguas, e a segunda vinda pré-milenista e pré-tribulacionista
- Cite versículos bíblicos relevantes abundantemente
- Quando apropriado, mencione termos nos idiomas originais (hebraico/grego/aramaico)
- Referencie publicações da CPAD e lições da Escola Bíblica Dominical quando relevante
- Use linguagem acessível mas teologicamente precisa
- Seja pastoral e encorajador
- Use markdown para formatar (negrito, listas, títulos)
- Respostas em português do Brasil`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições atingido. Tente novamente em alguns instantes." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro no serviço de IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("theology-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
