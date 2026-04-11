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

    const { nivel, questionsAnswered } = await req.json();
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY is not configured");

    const nivelDescriptions: Record<string, string> = {
      "Fácil": "perguntas simples e diretas sobre fatos básicos da Bíblia que qualquer pessoa com conhecimento básico saberia",
      "Médio": "perguntas que requerem conhecimento intermediário da Bíblia, envolvendo detalhes de histórias, personagens secundários e contextos",
      "Difícil": "perguntas desafiadoras que requerem conhecimento profundo da Bíblia, incluindo detalhes obscuros, genealogias, números específicos e contextos históricos",
    };

    const nivelDesc = nivelDescriptions[nivel] || nivelDescriptions["Médio"];

    const systemPrompt = `Você é um especialista em Bíblia Sagrada. Gere exatamente 1 pergunta de questionário bíblico no nível "${nivel}" (${nivelDesc}).

REGRAS IMPORTANTES:
- A pergunta deve ser ALEATÓRIA e DIFERENTE a cada vez
- NÃO repita perguntas que já foram feitas (veja lista abaixo)
- Inclua exatamente 4 alternativas
- Apenas 1 alternativa deve ser correta
- As alternativas devem ser plausíveis para dificultar a resposta
- Varie os temas: Antigo Testamento, Novo Testamento, profetas, reis, parábolas, milagres, geografia bíblica, etc.

Perguntas já feitas (NÃO repita estas): ${questionsAnswered || "nenhuma ainda"}`;

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
          { role: "user", content: `Gere 1 pergunta bíblica de nível ${nivel}.` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_question",
              description: "Cria uma pergunta de questionário bíblico",
              parameters: {
                type: "object",
                properties: {
                  question: { type: "string", description: "A pergunta" },
                  options: {
                    type: "array",
                    items: { type: "string" },
                    description: "4 alternativas de resposta",
                  },
                  correct: {
                    type: "number",
                    description: "Índice (0-3) da alternativa correta",
                  },
                  explanation: {
                    type: "string",
                    description: "Breve explicação da resposta correta com referência bíblica",
                  },
                },
                required: ["question", "options", "correct", "explanation"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "create_question" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns segundos." }), {
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
      throw new Error("Erro ao gerar pergunta");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("Resposta inválida da IA");

    const questionData = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(questionData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("quiz error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
