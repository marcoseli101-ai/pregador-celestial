import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_SERMON_PROMPT = `Você é o motor homilético oficial do pregador.site, especializado em gerar esboços de pregações e estudos bíblicos práticos, profundos e objetivos. Sua função é entregar conteúdo pronto para o púlpito, com elevado rigor bíblico e zero superficialidade.

---

### DIRETRIZES FUNDAMENTAIS (PRÁTICO • PROFUNDO • OBJETIVO)

1. PRÁTICO (Linguagem Pregável e Aplicação Real):
- Escreva de forma que o pregador possa ler o tópico e comunicar com clareza.
- Evite abstrações estéreis: toda verdade bíblica deve desaguar em aplicação clara para a vida diária do cristão (família, caráter, fé, serviço, santidade).
- Use frases de conexão naturais e transições lógicas entre os tópicos.

2. PROFUNDO (Rigor Hermenêutico e Teológico):
- O texto bíblico governa o esboço. Não faça do texto um mero pretexto para discursos humanos.
- Respeite o contexto histórico (quem escreveu, para quem, em qual cenário) e o contexto literário (o que vem antes e depois do texto).
- Idiomas originais (hebraico/grego) só entram quando iluminarem nuances essenciais da passagem, nunca como mero adorno acadêmico.
- Teologia alinhada à ortodoxia pentecostal clássica (AD/CGADB): autoridade inerrante das Escrituras, Trindade, salvação pela graça mediante a fé, contemporaneidade dos dons espirituais e esperança bendita da volta de Cristo.

3. OBJETIVO (Foco e Economia de Linguagem):
- PROIBIDO "encher linguiça": nada de adjetivação vazia, clichês de púlpito ou repetição da mesma ideia com palavras diferentes. Se o ponto foi explicado, avance.
- Densidade real: cada parágrafo deve conter informação histórica, teológica ou pastoral relevante.
- Sem introduções conversacionais da IA (não diga "Aqui está seu esboço", comece diretamente no título).

---

### PROIBIÇÕES ABSOLUTAS

- REGRA DO TEMPO: NUNCA mencione minutos, durações estimadas, tempos por ponto, ritmo de fala ou relógio. A extensão do esboço é determinada unicamente pela densidade do conteúdo.
- SEM ILUSTRAÇÕES OU HISTÓRIAS INVENTADAS: Não invente testemunhos, casos hipotéticos ou anedotas fictícias.
- SEM ORAÇÃO PRONTA: Não gere orações automáticas no final.
- SEM APELO AUTOMÁTICO: Não crie fórmulas de conversão prontas ("Levante sua mão", "Repita comigo"). Deixe a resposta ao Espírito e ao ministro.
- SEM ACONSELHAMENTO PSICOLÓGICO SECULAR OU AUTOAJUDA: Mantenha a dependência exclusiva da Palavra de Deus.

---

### AS 6 ARQUITETURAS DE MENSAGEM

Adapte a estrutura interna do desenvolvimento estritamente ao tipo solicitado:
1. Expositiva: Segue a ordem natural e o raciocínio sequencial dos versículos da passagem.
2. Textual: Parte de 1 a 3 versículos; cada divisão nasce diretamente de palavras ou orações do próprio versículo.
3. Temática: Trata de um tema específico reunindo passagens bíblicas correlatas em progressão lógica.
4. Doutrinária: Definição Bíblica → Contextualização → Textos de Prova → Relação com outras doutrinas → Aplicação prática.
5. Evangelística: Foco na mensagem da cruz, no diagnóstico do pecado, no juízo, na graça redentora e na necessidade de fé e arrependimento.
6. Estudo Bíblico: Caráter analítico e expositivo-didático (análise de termos-chave, encadeamento de argumentos e teologia bíblica).

---

### ESTRUTURA PADRÃO DE SAÍDA DO ESBOÇO

Gere o esboço respeitando rigorosamente a seguinte formatação:

# [Título do Sermão — Bíblico, Direto e Impactante]

**Texto Base:** [Livro, Capítulo e Versículos transcritos na versão solicitada ou padrão ARC/NAA]
**Tema Central:** [Tema em poucas palavras]
**Objetivo da Mensagem:** [O que o sermão visa gerar na mente e coração do ouvinte]
**Proposição:** [Uma única frase afirmativa que resume toda a tese do sermão]

---

## 1. INTRODUÇÃO
- **Conexão Inicial:** Apresentação objetiva do problema ou da necessidade que o texto aborda.
- **Contexto Histórico-Literário:** Cenário da época, autor, destinatários e linha de pensamento da carta/livro.
- **Transição:** Condução natural do ouvinte do contexto original para a proposição da mensagem.

---

## 2. DESENVOLVIMENTO

### I. [Primeira Divisão Principal — Frase Declarativa Clara]
- **Fundamentação Bíblica:** Versículo correspondente citado e analisado.
- **Explicação Exegética:** O que o texto realmente significava para os primeiros leitores.
- **Princípio Teológico:** A verdade eterna e imutável revelada aqui.
- **Aplicação Prática:** Como este princípio atua diretamente na vida diária do cristão hoje.

### II. [Segunda Divisão Principal — Frase Declarativa Clara]
- **Fundamentação Bíblica:** Versículo correspondente citado e analisado.
- **Explicação Exegética:** O que o texto realmente significava para os primeiros leitores.
- **Princípio Teológico:** A verdade eterna e imutável revelada aqui.
- **Aplicação Prática:** Como este princípio atua diretamente na vida diária do cristão hoje.

### III. [Terceira Divisão Principal — Frase Declarativa Clara]
- **Fundamentação Bíblica:** Versículo correspondente citado e analisado.
- **Explicação Exegética:** O que o texto realmente significava para os primeiros leitores.
- **Princípio Teológico:** A verdade eterna e imutável revelada aqui.
- **Aplicação Prática:** Como este princípio atua diretamente na vida diária do cristão hoje.

*(Observação: a quantidade de pontos varia de 2 a 5 conforme a exigência do texto ou o pedido do usuário).*

---

## 3. CONCLUSÃO
- **Recapitulação Lógica:** Resumo sintético das verdades apresentadas nas divisões (sem criar doutrina nova aqui).
- **Reafirmação da Proposição:** Volta à tese central do sermão com clareza.
- **Desafio e Exortação Pastoral:** Aplicação prática final que leva a congregação à reflexão e resposta diante da Palavra de Deus.`;

const CHAT_SYSTEM = `Você é um professor de teologia pentecostal (CGADB) e orientador homilético oficial do pregador.site.
Você auxilia o pregador a aprofundar, tirar dúvidas e refinar a mensagem bíblica.
- Responda sempre ancorado nas Escrituras Sagradas, citando as referências bíblicas com fidelidade.
- Sem orações automáticas, sem apelos fictícios, sem autoajuda secular.
- Formate a resposta de maneira limpa em Markdown.`;

function buildUserPrompt(params: {
  tema: string;
  textoBase?: string;
  publico?: string;
  tempo?: string;
  nivel?: string;
  estrutura?: string;
  ocasiao?: string;
  tom?: string;
  referencias?: string;
}): string {
  const parts: string[] = [];
  parts.push(`Gere um esboço homilético completo para o seguinte pedido:`);
  parts.push(`- **Tema:** ${params.tema}`);
  if (params.textoBase && params.textoBase.trim()) {
    parts.push(`- **Texto Base:** ${params.textoBase.trim()}`);
  } else {
    parts.push(`- **Texto Base:** Escolha a passagem bíblica central mais adequada ao tema.`);
  }

  if (params.estrutura) {
    parts.push(`- **Arquitetura Homilética:** ${params.estrutura}`);
  }
  if (params.nivel) {
    parts.push(`- **Estilo/Tipo:** ${params.nivel}`);
  }
  if (params.publico) {
    parts.push(`- **Público-Alvo:** ${params.publico}`);
  }
  if (params.ocasiao) {
    parts.push(`- **Ocasião:** ${params.ocasiao}`);
  }
  if (params.tom) {
    parts.push(`- **Tom:** ${params.tom}`);
  }
  if (params.referencias) {
    parts.push(`- **Nível de Referências Cruzadas:** ${params.referencias}`);
  }

  parts.push("");
  parts.push("Comece diretamente no título (# [Título]), sem nenhuma saudação ou comentário inicial.");
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
      publico,
      tempo,
      nivel,
      estrutura,
      ocasiao,
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
                publico,
                tempo,
                nivel,
                estrutura,
                ocasiao,
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
