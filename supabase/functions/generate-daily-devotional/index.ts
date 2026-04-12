import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Determine the target date (today in Brasília timezone)
    const now = new Date();
    const brasiliaOffset = -3 * 60;
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const brasiliaMs = utcMs + brasiliaOffset * 60000;
    const brasiliaDate = new Date(brasiliaMs);
    const targetDate = brasiliaDate.toISOString().split("T")[0]; // YYYY-MM-DD

    // Check if devotional already exists for this date
    const { data: existing } = await supabaseAdmin
      .from("devocional_diario")
      .select("id")
      .eq("data", targetDate)
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({ message: "Devocional já existe para hoje", date: targetDate }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const dateLabel = brasiliaDate.toLocaleDateString("pt-BR", {
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

VERSÃO BÍBLICA: Use a versão João Ferreira de Almeida (Almeida Clássica) para todas as citações bíblicas.

O devocional DEVE conter exatamente estas 4 seções, formatadas em markdown:

## 📖 Versículo do Dia
Escolha um versículo bíblico impactante e relevante. Cite o texto completo entre aspas e a referência (versão Almeida Clássica).

## 💛 Reflexão
Uma reflexão espiritual profunda de 3-4 parágrafos sobre o versículo. Conecte com a vida prática do crente, traga contexto bíblico e aplicação espiritual.

## 🙏 Oração
Uma oração sincera e poderosa baseada no versículo e na reflexão. Terminando em "Em nome de Jesus, amém."

## ✅ Aplicação Prática
2-3 pontos práticos e objetivos que o leitor pode aplicar hoje na sua vida baseados no devocional.

IMPORTANTE:
- Escolha versículos variados a cada dia
- A reflexão deve ter profundidade teológica mas ser acessível
- Tom: acolhedor, encorajador e cheio de fé
- Tamanho adequado para leitura matinal de 3-5 minutos`;

    const userPrompt = `Gere o devocional para hoje, ${dateLabel}. Escolha um versículo inspirador e diferente.

IMPORTANTE: Comece sua resposta com o TÍTULO do devocional na primeira linha (sem # nem formatação), seguido de uma linha vazia, e depois as seções. Exemplo:
A Paz que Excede Todo Entendimento

## 📖 Versículo do Dia
...`;

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
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Erro ao gerar devocional via IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResult = await response.json();
    const fullContent = aiResult.choices?.[0]?.message?.content ?? "";

    if (!fullContent) {
      return new Response(
        JSON.stringify({ error: "IA retornou conteúdo vazio" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse title and verse from content
    const lines = fullContent.split("\n");
    let titulo = "";
    let versiculoBase = "";
    let conteudo = fullContent;

    // First non-empty line before ## is the title
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("##") && !trimmed.startsWith("#")) {
        titulo = trimmed;
        conteudo = fullContent.replace(line, "").trim();
        break;
      }
      if (trimmed.startsWith("##")) break;
    }

    // Extract verse reference from the versículo section
    const verseMatch = fullContent.match(/##\s*📖[^\n]*\n([\s\S]*?)(?=##|$)/);
    if (verseMatch) {
      const verseSection = verseMatch[1].trim();
      // Try to find a bible reference like "João 3:16" or "(Rm 10:9-10)"
      const refMatch = verseSection.match(/\(([^)]+)\)\s*$/) || verseSection.match(/-\s*(.+)$/m);
      if (refMatch) versiculoBase = refMatch[1].trim();
    }

    // Insert using service role (bypasses RLS)
    const { error: insertError } = await supabaseAdmin
      .from("devocional_diario")
      .insert({
        data: targetDate,
        titulo: titulo || `Devocional de ${dateLabel}`,
        versiculo_base: versiculoBase,
        conteudo,
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      // If duplicate, it's fine
      if (insertError.code === "23505") {
        return new Response(
          JSON.stringify({ message: "Devocional já existe", date: targetDate }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ error: "Erro ao salvar devocional" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Devocional gerado com sucesso", date: targetDate, titulo }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-daily-devotional error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro interno" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
