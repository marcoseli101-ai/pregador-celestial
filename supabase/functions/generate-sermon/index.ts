import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_SERMON_PROMPT = `Você é um Teólogo e Homileta Sênior pentecostal clássico, filiado à Convenção Geral das Assembleias de Deus no Brasil (CGADB), mestre em Exegese Bíblica e bibliografia CPAD (Antonio Gilberto, Eurico Bergstén, Myer Pearlman).
Sua missão é gerar um sermão exegético, profundo, completo e rigorosamente fundamentado na Bíblia Sagrada (tradução Almeida Revista e Corrigida - ARC). É ESTRITAMENTE PROIBIDO gerar resumos rápidos, sermões genéricos de autoajuda ou omitir seções.

DIRETRIZES DOUTRINÁRIAS CGADB INVIOLÁVEIS:

- Batismo no Espírito Santo como experiência distinta e subsequente à salvação, com a evidência física inicial do falar em línguas (Atos 2:4).
- Atualidade permanente de todos os dons espirituais (1 Co 12).
- Escatologia dispensacionalista pré-tribulacionista e pré-milenista (iminência do Arrebatamento antes da Grande Tribulação).
- Inerrância bíblica e necessidade de regeneração e santificação pessoal.

ESTRUTURA OBRIGATÓRIA DA RESPOSTA:

# [TÍTULO HOMILÉTICO IMPACTANTE]
**Texto Central:** [Citação textual completa na versão ARC com livro, capítulo e versículos]  
**Tema Homilético:** [Declaração do tema]  
**Proposição:** [Tese central do sermão em 1 frase afirmativa]  
**Sentença de Transição:** [Conexão fluida entre introdução e os tópicos]

---

## I. INTRODUÇÃO EXEGÉTICA & HISTÓRICA
- **Contexto Histórico, Político e Cultural:** Cenário da época, autor, destinatários e linha de pensamento da perícope.
- **O Dilema Central da Narrativa:** Conflito teológico/humano da passagem e a ponte de aplicação direta para a igreja contemporânea.

---

## II. APARATO LÉXICO E TEOLÓGICO ORIGINAL
- **Análise Léxica no Original:** Análise exegética de 2 a 3 termos-chave no Grego Koiné ou Hebraico transliterados, incluindo numeração do Léxico de Strong (ex: Strong #H1234 / Strong #G2424) e significado morfológico exato.
- **Fundamentação Teológica CPAD:** Citações e teses fundamentadas nas obras de teólogos da CPAD (Eurico Bergstén, Myer Pearlman, Antonio Gilberto).

---

## III. CORPO HOMILÉTICO (3 A 4 PONTOS PRINCIPAIS DETALHADOS)

### 1. [Título do Ponto Principal 1]
- **Exposição Bíblica Aprofundada:** Versículo correspondente exposto com fidelidade hermenêutica.
- **Aplicação Pentecostal e Mover do Espírito Santo:** Ação transformadora do Espírito Santo e vivência de poder.
- **Ilustração Bíblica Cruzada:** Passagem paralela da Escritura que reforça este princípio.
- **Aplicação Prática ao Coração do Crente:** Como viver esta verdade no dia a dia, santificação e família.

### 2. [Título do Ponto Principal 2]
- **Exposição Bíblica Aprofundada:** Versículo correspondente exposto com fidelidade hermenêutica.
- **Aplicação Pentecostal e Mover do Espírito Santo:** Ação transformadora do Espírito Santo e vivência de poder.
- **Ilustração Bíblica Cruzada:** Passagem paralela da Escritura que reforça este princípio.
- **Aplicação Prática ao Coração do Crente:** Como viver esta verdade no dia a dia, santificação e família.

### 3. [Título do Ponto Principal 3]
- **Exposição Bíblica Aprofundada:** Versículo correspondente exposto com fidelidade hermenêutica.
- **Aplicação Pentecostal e Mover do Espírito Santo:** Ação transformadora do Espírito Santo e vivência de poder.
- **Ilustração Bíblica Cruzada:** Passagem paralela da Escritura que reforça este princípio.
- **Aplicação Prática ao Coração do Crente:** Como viver esta verdade no dia a dia, santificação e família.

---

## IV. CONCLUSÃO, APELO E LITURGIA PASTORAL
- **Recapitulação Assertiva:** Resumo sintético das verdades centrais proclamadas.
- **Apelo Ministerial:** Chamamento pastoral direcionado à ocasião litúrgica solicitada.
- **Oração Pastoral Sugerida:** Oração guiada para ministração no altar e quebrantamento.
- **Sugestão de Hinos da Harpa Cristã:** Sugestão de 2 hinos temáticos correspondentes da Harpa Cristã (com número oficial e título).`;

const CHAT_SYSTEM = `Você é um professor de teologia pentecostal (CGADB) e orientador homilético oficial do pregador.site.
Você auxilia o pregador a aprofundar, tirar dúvidas e refinar a mensagem bíblica segundo a teologia bíblica e bibliografia CPAD.
- Responda sempre ancorado nas Escrituras Sagradas (ARC), citando as referências bíblicas com fidelidade.
- Sem autoajuda secular, sempre focado no poder da Palavra e do Espírito Santo.
- Formate a resposta de maneira limpa em Markdown.`;

function buildUserPrompt(params: {
  tema: string;
  textoBase?: string;
  metodoHomiletico?: string;
  linhaDoutrinaria?: string;
  profundidade?: string;
  ocasiao?: string;
  incluirOriginal?: boolean;
  incluirHarpa?: boolean;
  incluirCPAD?: boolean;
  // Campos legados para compatibilidade
  publico?: string;
  tempo?: string;
  nivel?: string;
  estrutura?: string;
  tom?: string;
  referencias?: string;
}): string {
  const parts: string[] = [];
  parts.push(`Gere um sermão homilético completo, exegético e profundo com os seguintes parâmetros:`);
  parts.push(`- **Tema Central:** ${params.tema}`);
  
  if (params.textoBase && params.textoBase.trim()) {
    parts.push(`- **Texto Base Bíblico:** ${params.textoBase.trim()} (Transcrever na íntegra na versão ARC)`);
  } else {
    parts.push(`- **Texto Base Bíblico:** Escolha a passagem bíblica central mais adequada e transcreva na íntegra na versão ARC.`);
  }

  const metodo = params.metodoHomiletico || params.estrutura || "Expositivo (Versículo por versículo)";
  parts.push(`- **Método Homilético:** ${metodo}`);

  const linha = params.linhaDoutrinaria || "Pneumatologia & Avivamento Pentecostal";
  parts.push(`- **Linha Doutrinária (CGADB):** ${linha}`);

  const profundidade = params.profundidade || params.nivel || "Profundo / Acadêmico (Exegese no original com léxico Strong)";
  parts.push(`- **Nível de Profundidade:** ${profundidade}`);

  if (params.ocasiao) {
    parts.push(`- **Ocasião Litúrgica:** ${params.ocasiao}`);
  }
  if (params.publico) {
    parts.push(`- **Público-Alvo:** ${params.publico}`);
  }

  parts.push(`- **Diretrizes Especiais:**`);
  if (params.incluirOriginal !== false) {
    parts.push(`  * Incluir seção com análise de termos no original Grego/Hebraico com numeração do Léxico de Strong.`);
  }
  if (params.incluirCPAD !== false) {
    parts.push(`  * Fundamentar com bibliografia clássica CPAD (Eurico Bergstén, Myer Pearlman, Antonio Gilberto).`);
  }
  if (params.incluirHarpa !== false) {
    parts.push(`  * Incluir 2 hinos temáticos da Harpa Cristã (número e nome) para o momento do apelo.`);
  }

  parts.push("");
  parts.push("Comece diretamente no título (# [Título]), com todos os 4 blocos homiléticos completos e sem omitir nenhuma seção.");
  return parts.join("\n");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const json = (body: unknown, status: number) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const body = await req.json();
    const {
      tema,
      textoBase,
      metodoHomiletico,
      linhaDoutrinaria,
      profundidade,
      ocasiao,
      incluirOriginal,
      incluirHarpa,
      incluirCPAD,
      publico,
      tempo,
      nivel,
      estrutura,
      tom,
      referencias,
      mode,
      messages: chatMessages,
    } = body;

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

    const messages =
      mode === "chat"
        ? [{ role: "system", content: CHAT_SYSTEM }, ...(chatMessages || [])]
        : [
            { role: "system", content: SYSTEM_SERMON_PROMPT },
            {
              role: "user",
              content: buildUserPrompt({
                tema: tema || "",
                textoBase,
                metodoHomiletico,
                linhaDoutrinaria,
                profundidade,
                ocasiao,
                incluirOriginal,
                incluirHarpa,
                incluirCPAD,
                publico,
                tempo,
                nivel,
                estrutura,
                tom,
                referencias,
              }),
            },
          ];

    const callAIStream = async () => {
      if (isOpenAI) {
        return fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${cleanKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages,
            stream: true,
            temperature: 0.3,
            max_tokens: 4000,
          }),
        });
      }

      // Fallback para Lovable AI Gateway ou Google Gemini
      return fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cleanKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages,
          stream: true,
          max_tokens: 4000,
        }),
      });
    };

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const response = await callAIStream();

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.error("AI call failed:", response.status, errText);
      return json(
        {
          error: `Falha ao conectar com o modelo de IA (${response.status}): ${errText}`,
        },
        500
      );
    }

    const stream = new ReadableStream({
      async start(controller) {
        let closed = false;
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (closed) break;

            const chunk = decoder.decode(value, { stream: true });
            controller.enqueue(encoder.encode(chunk));
          }
        } catch (err) {
          console.error("Stream reading error:", err);
        } finally {
          if (!closed) {
            closed = true;
            try {
              controller.close();
            } catch {
              // already closed
            }
          }
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (e: any) {
    console.error("generate-sermon error:", e);
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
