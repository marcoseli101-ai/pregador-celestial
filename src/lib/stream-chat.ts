import { getAuthToken } from "./auth-helpers";
import { SUPABASE_URL } from "@/integrations/supabase/client";

const GENERATE_SERMON_URL = `${SUPABASE_URL}/functions/v1/generate-sermon`;

type SSECallbacks = {
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (msg: string) => void;
};

async function parseSSEStream(resp: Response, { onDelta, onDone, onError }: SSECallbacks) {
  if (!resp.ok) {
    const data = await resp.json().catch(() => ({ error: "Erro desconhecido" }));
    onError(data.error || `Erro ${resp.status}`);
    return;
  }
  if (!resp.body) { onError("Sem resposta"); return; }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let streamDone = false;

  try {
    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") { streamDone = true; break; }
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }
  } catch (err) {
    console.error("Stream reading error:", err);
    onError(err instanceof Error ? err.message : "Erro na leitura da resposta");
    return;
  }

  if (textBuffer.trim()) {
    for (let raw of textBuffer.split("\n")) {
      if (!raw) continue;
      if (raw.endsWith("\r")) raw = raw.slice(0, -1);
      if (raw.startsWith(":") || raw.trim() === "") continue;
      if (!raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch { /* ignore */ }
    }
  }

  onDone();
}

export interface GenerateSermonParams {
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
  // Campos complementares
  publico?: string;
  tempo?: string;
  nivel?: string;
  estrutura?: string;
  tom?: string;
  referencias?: string;
}

function buildFullSermonPrompt(params: GenerateSermonParams): string {
  const hasOriginal = params.analiseOriginal ?? params.incluirOriginal ?? true;
  const hasCPAD = params.fundamentacaoCPAD ?? params.incluirCPAD ?? true;

  const exigenciasObrigatorias: string[] = [
    "- PROIBIÇÃO ABSOLUTA DE LITURGIA E APELO: NUNCA gere oração (pastoral ou de qualquer tipo), NUNCA gere apelo, chamado de altar, convite de decisão ou frases como 'venha ao altar', 'se você não conhece Jesus', e NUNCA sugira hinos, cânticos ou Harpa Cristã.",
    "- A Seção IV DEVE ser puramente uma 'IV. CONCLUSÃO E APLICAÇÃO EXPOSITIVA' contendo a conclusão do próprio esboço em si: (1) Recapitulação Assertiva dos pontos expostos e (2) Aplicação Prática Final para a vida cristã.",
    "- DESTAQUE INICIAL E FINAL OBRIGATÓRIO: Inicie o texto impreterivelmente com a linha '> 📖 **LEIA A BÍBLIA**' antes do título e finalize o texto com a linha '> 📖 **LEIA A BÍBLIA**' no final de tudo.",
    "- DENSIDADE HOMILÉTICA (ANTI-RESUMO): Escreva um sermão COMPLETO, EXTENSO E PROFUNDO (1200 a 1500+ palavras), com múltiplos parágrafos bem explicados para cada ponto, exegese rica e sólida fundamentação bíblica ARC.",
  ];

  if (hasOriginal) {
    exigenciasObrigatorias.push(
      "- SEÇÃO II OBRIGATÓRIA (Aparato Léxico): Análise léxica e exegética de 2 a 3 termos no Grego Koiné ou Hebraico com numeração exata do Léxico de Strong (ex: Strong #G4334, Strong #H1234) e significado morfológico/etimológico."
    );
  }
  if (hasCPAD) {
    exigenciasObrigatorias.push(
      "- SEÇÃO II OBRIGATÓRIA (Fundamentação CPAD): Citação textual ou fundamentação nas obras de teólogos clássicos da CPAD (Eurico Bergstén, Myer Pearlman, Antonio Gilberto)."
    );
  }

  const metodo = params.metodoHomiletico || params.estrutura || "Expositivo (Versículo por versículo)";
  const linha = params.linhaDoutrinaria || "Pneumatologia & Avivamento Pentecostal";
  const profundidade = params.profundidade || params.nivel || "Profundo / Acadêmico (Exegese no original com léxico Strong)";

  return `
Você é um Teólogo e Homileta Sênior pentecostal clássico (CGADB / CPAD).
Gere um sermão homilético COMPLETO, EXTENSO, EXEGÉTICO E PROFUNDO.
Corrija automaticamente quaisquer erros de digitação ou ortografia do tema.

TEMA CENTRAL: ${params.tema}
TEXTO BASE: ${params.textoBase && params.textoBase.trim() ? params.textoBase.trim() : "Selecione a perícope bíblica mais apropriada na versão ARC e transcreva na íntegra"}
MÉTODO HOMILÉTICO: ${metodo}
LINHA DOUTRINÁRIA (CGADB): ${linha}
PROFUNDIDADE: ${profundidade}
${params.ocasiao ? `OCASIÃO LITÚRGICA: ${params.ocasiao}` : ""}
${params.publico ? `PÚBLICO-ALVO: ${params.publico}` : ""}

DIRETRIZES E REQUISITOS INEGOCIÁVEIS:
${exigenciasObrigatorias.join("\n")}

ESTRUTURA HOMILÉTICA COMPLETA (SIGA EXATAMENTE):

> 📖 **LEIA A BÍBLIA**

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
${hasOriginal ? "- **Análise Léxica no Original:** Análise exegética aprofundada de 2 a 3 termos-chave no Grego Koiné ou Hebraico transliterados com numeração do Léxico de Strong (ex: Strong #G4334 / Strong #H1234) e significado etimológico/morfológico exato." : ""}
${hasCPAD ? "- **Fundamentação Teológica CPAD:** Citações e teses fundamentadas nas obras de teólogos clássicos da CPAD (Eurico Bergstén, Myer Pearlman, Antonio Gilberto)." : ""}

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

## IV. CONCLUSÃO E APLICAÇÃO EXPOSITIVA
- **Recapitulação Assertiva:** Resumo sintético e vigoroso dos pontos proclamados e reafirmação da proposição/tema central do esboço.
- **Aplicação Prática Final:** Como o cristão deve aplicar esta mensagem na sua vida diária. Conclusão focada estritamente no estudo/esboço, SEM apelo de altar, SEM oração pastoral e SEM sugestão de hinos/músicas.

---

> 📖 **LEIA A BÍBLIA**

Comece imediatamente na primeira linha com > 📖 **LEIA A BÍBLIA**.
`.trim();
}

export async function streamSermon(
  params: GenerateSermonParams & SSECallbacks
) {
  const { onDelta, onDone, onError, ...bodyPayload } = params;
  const fullPrompt = buildFullSermonPrompt(params);

  const payload = {
    mode: "chat",
    messages: [
      {
        role: "user",
        content: fullPrompt,
      },
    ],
    ...bodyPayload,
    sugerirHarpa: false,
    incluirHarpa: false,
    incluirOracao: false,
    incluirApelo: false,
    analiseOriginal: bodyPayload.analiseOriginal ?? bodyPayload.incluirOriginal ?? true,
    incluirOriginal: bodyPayload.incluirOriginal ?? bodyPayload.analiseOriginal ?? true,
    fundamentacaoCPAD: bodyPayload.fundamentacaoCPAD ?? bodyPayload.incluirCPAD ?? true,
    incluirCPAD: bodyPayload.incluirCPAD ?? bodyPayload.fundamentacaoCPAD ?? true,
  };

  const token = await getAuthToken();
  const resp = await fetch(GENERATE_SERMON_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  await parseSSEStream(resp, { onDelta, onDone, onError });
}

export type ChatMessage = { role: "user" | "assistant"; content: string };

export async function streamSermonChat({
  messages, onDelta, onDone, onError,
}: {
  messages: ChatMessage[];
} & SSECallbacks) {
  const token = await getAuthToken();
  const resp = await fetch(GENERATE_SERMON_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mode: "chat", messages }),
  });
  await parseSSEStream(resp, { onDelta, onDone, onError });
}
