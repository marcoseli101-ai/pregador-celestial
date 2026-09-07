import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_SERMON_PROMPT = `Você é um Teólogo e Homileta Sênior pentecostal clássico, filiado à Convenção Geral das Assembleias de Deus no Brasil (CGADB), mestre em Exegese Bíblica e bibliografia CPAD (Antonio Gilberto, Eurico Bergstén, Myer Pearlman).
Sua missão é gerar um sermão exegético, profundo, completo e rigorosamente fundamentado na Bíblia Sagrada (tradução Almeida Revista e Corrigida - ARC).

REGRA ANTI-RESUMO E DENSIDADE HOMILÉTICA (INVIOLÁVEL):
Você NÃO PODE gerar apenas tópicos ou resumos rápidos de 2 linhas. Cada um dos 3 a 4 tópicos do sermão DEVE ser um texto denso, aprofundado e detalhado (com múltiplos parágrafos ricos), contendo explicação exegética completa, aplicação pastoral prática para a congregação e a referência bíblica cruzada explicada. É ESTRITAMENTE PROIBIDO gerar resumos rápidos, sermões genéricos de autoajuda ou omitir seções.

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
- **Análise Léxica no Original:** Análise exegética aprofundada de 2 a 3 termos-chave no Grego Koiné ou Hebraico transliterados, incluindo numeração do Léxico de Strong (ex: Strong #G4334 / Strong #H1234) e significado etimológico/morfológico exato.
- **Fundamentação Teológica CPAD:** Citações e teses fundamentadas nas obras de teólogos clássicos da CPAD (Eurico Bergstén, Myer Pearlman, Antonio Gilberto).

---

## III. CORPO HOMILÉTICO (3 A 4 PONTOS PRINCIPAIS DETALHADOS)

### 1. [Título do Ponto Principal 1]
- **Exposição Bíblica Aprofundada:** Versículo correspondente exposto com riqueza e fidelidade hermenêutica.
- **Aplicação Pentecostal e Mover do Espírito Santo:** Ação transformadora do Espírito Santo e vivência de poder espiritual.
- **Ilustração Bíblica Cruzada:** Passagem paralela da Escritura que reforça e ilumina este princípio.
- **Aplicação Prática ao Coração do Crente:** Como viver esta verdade no dia a dia, santificação, vitória e família.

### 2. [Título do Ponto Principal 2]
- **Exposição Bíblica Aprofundada:** Versículo correspondente exposto com riqueza e fidelidade hermenêutica.
- **Aplicação Pentecostal e Mover do Espírito Santo:** Ação transformadora do Espírito Santo e vivência de poder espiritual.
- **Ilustração Bíblica Cruzada:** Passagem paralela da Escritura que reforça e ilumina este princípio.
- **Aplicação Prática ao Coração do Crente:** Como viver esta verdade no dia a dia, santificação, vitória e família.

### 3. [Título do Ponto Principal 3]
- **Exposição Bíblica Aprofundada:** Versículo correspondente exposto com riqueza e fidelidade hermenêutica.
- **Aplicação Pentecostal e Mover do Espírito Santo:** Ação transformadora do Espírito Santo e vivência de poder espiritual.
- **Ilustração Bíblica Cruzada:** Passagem paralela da Escritura que reforça e ilumina este princípio.
- **Aplicação Prática ao Coração do Crente:** Como viver esta verdade no dia a dia, santificação, vitória e família.

---

## IV. CONCLUSÃO, APELO E LITURGIA PASTORAL
- **Recapitulação Assertiva:** Resumo sintético e vigoroso das verdades centrais proclamadas.
- **Apelo Ministerial:** Chamamento pastoral fervoroso direcionado à ocasião litúrgica solicitada.
- **Oração Pastoral Sugerida:** Oração guiada para ministração no altar e quebrantamento congregacional.
- **Sugestão de Hinos da Harpa Cristã:** Lista de exatamente 2 hinos temáticos correspondentes da Harpa Cristã (com número oficial e título, ex: Hino 300 - "A Esperança da Igreja", Hino 15 - "Foi na Cruz").`;

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
  analiseOriginal?: boolean;
  incluirOriginal?: boolean;
  sugerirHarpa?: boolean;
  incluirHarpa?: boolean;
  fundamentacaoCPAD?: boolean;
  incluirCPAD?: boolean;
  publico?: string;
  tempo?: string;
  nivel?: string;
  estrutura?: string;
  tom?: string;
  referencias?: string;
}): string {
  const hasOriginal = params.analiseOriginal ?? params.incluirOriginal ?? true;
  const hasHarpa = params.sugerirHarpa ?? params.incluirHarpa ?? true;
  const hasCPAD = params.fundamentacaoCPAD ?? params.incluirCPAD ?? true;

  const exigenciasObrigatorias: string[] = [];

  if (hasOriginal) {
    exigenciasObrigatorias.push(
      "- SEÇÃO OBRIGATÓRIA (Aparato Léxico): Análise léxica e exegética de pelo menos 2 a 3 palavras-chave no Grego (Koiné) ou Hebraico com o respectivo número de Strong (ex: Strong #G3474 para moros, #G5429 para phronimos) e seu profundo impacto teológico."
    );
  }
  if (hasCPAD) {
    exigenciasObrigatorias.push(
      "- SEÇÃO OBRIGATÓRIA (Fundamentação CPAD): Citação explícita de fundamentos da teologia pentecostal clássica da CPAD (Myer Pearlman, Eurico Bergstén ou Antonio Gilberto), explicando a doutrina, a simbologia bíblica e a atuação do Espírito Santo."
    );
  }
  if (hasHarpa) {
    exigenciasObrigatorias.push(
      "- SEÇÃO OBRIGATÓRIA NO FINAL: Recomende exatamente 2 hinos pertinentes da Harpa Cristã com número e nome (ex: Hino 300 - 'A Esperança da Igreja', Hino 15 - 'Foi na Cruz')."
    );
  }

  const metodo = params.metodoHomiletico || params.estrutura || "Expositivo (Versículo por versículo)";
  const linha = params.linhaDoutrinaria || "Pneumatologia & Avivamento Pentecostal";
  const profundidade = params.profundidade || params.nivel || "Profundo / Acadêmico (Exegese no original com léxico Strong)";

  const promptText = `
Escreva um sermão COMPLETO, EXTENSO, EXEGÉTICO E PROFUNDO (mínimo de 1200 a 1500 palavras, terminantemente proibido gerar apenas tópicos curtos ou resumos de duas linhas).
IMPORTANTE: Corrija automaticamente qualquer erro ortográfico ou de digitação do tema informado (por exemplo, corrija 'palabolas' para 'parábolas').

TEMA: ${params.tema}
TEXTO BASE: ${params.textoBase && params.textoBase.trim() ? params.textoBase.trim() : "Selecione o texto central mais adequado da Bíblia ARC e transcreva na íntegra"}
MÉTODO HOMILÉTICO: ${metodo}
LINHA DOUTRINÁRIA (CGADB): ${linha}
PROFUNDIDADE: ${profundidade}
${params.ocasiao ? `OCASIÃO LITÚRGICA: ${params.ocasiao}` : ""}
${params.publico ? `PÚBLICO-ALVO: ${params.publico}` : ""}

REQUISITOS INEGOCIÁVEIS:
${exigenciasObrigatorias.join("\n")}

ESTRUTURA COMPLETA A SEGUIR:
# [TÍTULO HOMILÉTICO IMPACTANTE]
**Texto Central:** [Citação textual completa na versão ARC]
**Tema Homilético:** [Declaração do tema corrigido]
**Proposição:** [Tese central do sermão]
**Sentença de Transição:** [Conexão fluida]

---
## I. INTRODUÇÃO EXEGÉTICA & HISTÓRICA
- Contexto Histórico, Político e Cultural detalhado
- O Dilema Central da Narrativa e aplicação para a igreja contemporânea

---
## II. APARATO LÉXICO E TEOLÓGICO ORIGINAL
${hasOriginal ? "- Análise Léxica no Original com Strong #GXXXX / Strong #HXXXX e significado morfológico" : ""}
${hasCPAD ? "- Fundamentação Teológica CPAD (Eurico Bergstén, Myer Pearlman, Antonio Gilberto)" : ""}

---
## III. CORPO HOMILÉTICO (3 A 4 PONTOS PRINCIPAIS DETALHADOS COM MÚLTIPLOS PARÁGRAFOS)
### 1. [Título do Ponto 1]
- Exposição Bíblica Aprofundada
- Aplicação Pentecostal e Mover do Espírito Santo
- Ilustração Bíblica Cruzada
- Aplicação Prática ao Coração do Crente

### 2. [Título do Ponto 2]
- Exposição Bíblica Aprofundada
- Aplicação Pentecostal e Mover do Espírito Santo
- Ilustração Bíblica Cruzada
- Aplicação Prática ao Coração do Crente

### 3. [Título do Ponto 3]
- Exposição Bíblica Aprofundada
- Aplicação Pentecostal e Mover do Espírito Santo
- Ilustração Bíblica Cruzada
- Aplicação Prática ao Coração do Crente

---
## IV. CONCLUSÃO, APELO E LITURGIA PASTORAL
- Recapitulação Assertiva
- Apelo Ministerial Fervoroso
- Oração Pastoral Sugerida
${hasHarpa ? "- Sugestão de 2 Hinos da Harpa Cristã (número e nome)" : ""}

Desenvolva cada divisão com múltiplos parágrafos bem explicados, exegese detalhada e aplicação real para o púlpito. Comece diretamente no título (# [Título]).
`.trim();

  return promptText;
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
      analiseOriginal,
      incluirOriginal,
      sugerirHarpa,
      incluirHarpa,
      fundamentacaoCPAD,
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
                analiseOriginal: analiseOriginal ?? incluirOriginal,
                incluirOriginal: incluirOriginal ?? analiseOriginal,
                sugerirHarpa: sugerirHarpa ?? incluirHarpa,
                incluirHarpa: incluirHarpa ?? sugerirHarpa,
                fundamentacaoCPAD: fundamentacaoCPAD ?? incluirCPAD,
                incluirCPAD: incluirCPAD ?? fundamentacaoCPAD,
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
            temperature: 0.35,
            max_tokens: 6000,
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
          max_tokens: 6000,
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
