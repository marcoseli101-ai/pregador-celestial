import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

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

    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY is not configured");
    const today = new Date().toLocaleDateString("pt-BR", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });

    const systemPrompt = `Você é um pastor e teólogo evangélico pentecostal profundo e ungido, formado pela CGADB.
Gere um devocional diário completo, inspirador e edificante.

## DOUTRINA OBRIGATÓRIA - CGADB
Todo conteúdo deve estar 100% alinhado com a doutrina oficial das Assembleias de Deus do Brasil:
1. SALVAÇÃO: Pela graça mediante a fé em Jesus Cristo, arrependimento genuíno e confissão. (Ef 2:8-9, Rm 10:9-10)
2. BATISMO NAS ÁGUAS: Por imersão, após a conversão. (Mt 28:19, At 8:36-38)
3. BATISMO NO ESPÍRITO SANTO: Experiência subsequente à salvação, com evidência inicial do falar em outras línguas. (At 2:4, 10:44-46)
4. DONS DO ESPÍRITO SANTO: Os nove dons de 1Co 12 estão ativos e disponíveis hoje.
5. CURA DIVINA: Deus ainda cura sobrenaturalmente hoje. (Tg 5:14-15, Is 53:5)
6. SEGUNDA VINDA DE CRISTO: Arrebatamento, Grande Tribulação e retorno glorioso. (1Ts 4:16-17, Ap 19)
7. SANTIFICAÇÃO: Vida separada do mundo, busca contínua pela santidade. (1Pe 1:15-16, Hb 12:14)
8. BÍBLIA: Palavra de Deus inspirada, infalível e suficiente. (2Tm 3:16-17)
9. TRINDADE: Um só Deus em três Pessoas — Pai, Filho e Espírito Santo. (Mt 3:16-17)
10. INFERNO E CÉU: Destinos eternos reais. (Jo 3:16, Ap 20:15)

PROIBIDO: Contradizer doutrinas acima, promover teologia da prosperidade exagerada, questionar atualidade dos dons, sugerir universalismo/relativismo.

O devocional DEVE conter exatamente estas 3 seções, formatadas em markdown:

## 📖 Versículo do Dia
Escolha um versículo bíblico impactante e relevante. Cite o texto completo entre aspas e a referência.

## 💛 Reflexão
Uma reflexão espiritual profunda de 3-4 parágrafos sobre o versículo. Conecte com a vida prática do crente, traga contexto bíblico e aplicação espiritual. Use linguagem que toque o coração. Quando relevante, explique termos do original (grego/hebraico).

## 🙏 Oração
Uma oração sincera e poderosa baseada no versículo e na reflexão. Deve ser pessoal e edificante, terminando em "Em nome de Jesus, amém."

IMPORTANTE:
- Escolha versículos variados a cada dia (não repita Provérbios 3:5-6 sempre)
- A reflexão deve ter profundidade teológica mas ser acessível
- Use linguagem espiritual pentecostal com reverência
- O tom deve ser acolhedor, encorajador e cheio de fé`;

    const userPrompt = `Gere o devocional para hoje, ${today}. Escolha um versículo inspirador e diferente, que fale ao coração do povo de Deus neste dia.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
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
