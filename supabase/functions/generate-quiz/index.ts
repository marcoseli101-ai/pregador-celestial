import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { nivel, questionsAnswered } = await req.json();
    const apiKey =
      Deno.env.get("GEMINI_API_CHATGPT") ||
      Deno.env.get("OPENAI_API_KEY") ||
      Deno.env.get("CHATGPT_API_KEY") ||
      Deno.env.get("GEMINI_API_KEY") ||
      Deno.env.get("LOVABLE_API_KEY");

    if (!apiKey) throw new Error("Chave de IA não configurada no Supabase.");

    const cleanKey = apiKey.replace(/^["']|["']$/g, "").trim();
    const isOpenAI = cleanKey.startsWith("sk-proj-") || cleanKey.startsWith("sk-");

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
- Retorne no formato JSON:
{
  "question": "texto da pergunta",
  "options": ["alternativa 1", "alternativa 2", "alternativa 3", "alternativa 4"],
  "correct": 0,
  "explanation": "explicação da resposta correta com referência bíblica"
}

Perguntas já feitas (NÃO repita estas): ${questionsAnswered || "nenhuma ainda"}`;

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
            { role: "user", content: `Gere 1 pergunta bíblica de nível ${nivel}.` },
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
        }),
      });
    } else if (cleanKey.startsWith("AIza")) {
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${cleanKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: `${systemPrompt}\n\nGere 1 pergunta bíblica de nível ${nivel}. Retorne apenas JSON.` }] }
          ]
        })
      });
    } else {
      response = await fetch(`https://ai.gateway.lovable.dev/v1/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cleanKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Gere 1 pergunta bíblica de nível ${nivel}.` },
          ],
        }),
      });
    }

    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("Erro ao gerar pergunta");
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Se veio via function call / tool calls
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall) {
      content = toolCall.function.arguments;
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Resposta inválida da IA");

    const questionData = JSON.parse(jsonMatch[0]);

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
