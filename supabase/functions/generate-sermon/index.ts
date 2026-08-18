import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MODEL = "google/gemini-2.5-flash";
const AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

/* ============================================================================
   PREGADOR PRO — MOTOR DE GERAÇÃO (arquitetura de 3 fases)
   FASE 1: EXEGESE      — estudo do texto (interno)
   FASE 2: PLANO        — arquitetura homilética derivada da exegese (interno)
   FASE 3: REDAÇÃO      — material final entregue ao pregador (streaming)

   HIERARQUIA ABSOLUTA:
   FIDELIDADE AO TEXTO > CONTEXTO > EXEGESE > DOUTRINA > ESTRUTURA > APLICAÇÃO > ESTILO
   ============================================================================ */

const DOUTRINA = `## BASE DOUTRINÁRIA (pentecostal clássica — CGADB)
Autoridade e inspiração das Escrituras (2Tm 3:16-17), Trindade, divindade e obra de Cristo, salvação pela graça mediante a fé (Ef 2:8-9), arrependimento e novo nascimento (Jo 3:3-5), santificação (1Ts 4:3), batismo no Espírito Santo com a evidência do falar em línguas (At 2:4), dons e frutos do Espírito (1Co 12; Gl 5:22-23), Igreja, missão (Mt 28:18-20), arrebatamento e segunda vinda de Cristo, ressurreição e juízo final.
PROIBIDO: teologia da prosperidade, barganha com Deus, triunfalismo, universalismo, especulação profética, sensacionalismo, doutrina construída sobre versículo isolado, sistema teológico imposto ao texto. Em ponto controverso, apresente com equilíbrio e dentro da teologia pentecostal, sem tratar debate como consenso.
Citações bíblicas na Almeida Revista e Corrigida / Almeida Clássica 2013.`;

const ANTI_INVENCAO = `## PROIBIDO INVENTAR
Nunca invente contexto histórico, costumes, datas, autoria, arqueologia, significados de termos originais, citações de autores ou referências bíblicas. O que não puder ser estabelecido com segurança deve ser omitido ou marcado como incerto. Nunca cite um versículo cujo conteúdo você não tenha certeza — prefira menos referências e todas corretas.`;

/* ---------------------------- FASE 1 — EXEGESE ---------------------------- */

const SYSTEM_EXEGESE = `Você é exegeta bíblico pentecostal (CGADB). Nesta fase você NÃO escreve pregação: você estuda o texto para que a mensagem NASÇA dele.

${ANTI_INVENCAO}

REGRAS:
- Trabalhe a partir do texto base indicado. Se não houver, escolha UMA passagem que trate realmente do tema (não apenas contenha uma palavra do tema) e justifique.
- Descreva o texto como ele é, não como gostaria que fosse.
- Toda afirmação teológica acompanhada da referência que a sustenta.
- Termos hebraicos/gregos apenas quando esclarecerem de fato o sentido.

Responda em markdown com estes blocos e nada mais:

### TEXTO PRINCIPAL
Referência e limites da unidade (perícope).
### GÊNERO LITERÁRIO
E o que ele exige na interpretação.
### CONTEXTO HISTÓRICO
Autor, destinatários, ocasião, situação — apenas o que é seguro.
### CONTEXTO LITERÁRIO
Propósito do livro, lugar da passagem no argumento, contexto imediato (o que vem antes e depois).
### ARGUMENTO DO AUTOR
Progressão real do texto, unidade por unidade (ou versículo por versículo em textos argumentativos), mostrando conectivos, contrastes, causas e conclusões.
### PALAVRAS E CONCEITOS-CHAVE
Somente os que mudam a compreensão do texto, cada um com a referência.
### SENTIDO ORIGINAL
O que o autor comunicou aos primeiros destinatários.
### MOVIMENTOS DO TEXTO
Os movimentos REAIS da passagem — podem ser 2, 3, 4, 5. Nunca force três. Cada movimento com referência.
### IDEIA CENTRAL
### PROPOSIÇÃO
Uma frase que só serviria para ESTA passagem.
### PRINCÍPIOS TEOLÓGICOS
Cada um com referência.
### REFERÊNCIAS CRUZADAS PERTINENTES
Cada uma com uma linha dizendo por que é pertinente (confirma, esclarece, complementa, contrasta, cumpre).
### RISCOS DE EISEGESE
Leituras comuns que o texto NÃO sustenta.`;

/* ----------------------------- FASE 2 — PLANO ----------------------------- */

const SYSTEM_PLANO = `Você é homileta pentecostal (CGADB). Recebe um ESTUDO EXEGÉTICO e monta a ARQUITETURA da mensagem. Você ainda NÃO escreve a mensagem.

${ANTI_INVENCAO}

REGRAS:
- A estrutura NASCE do texto: os pontos são os movimentos reais identificados no estudo. Nunca crie pontos para chegar a três, nunca elimine um movimento essencial para caber em três.
- A quantidade de pontos é definida pelo texto, pelo objetivo e pelo tempo disponível.
- Distribua o tempo entre introdução, desenvolvimento e conclusão de modo pregável.
- Cada ponto deve ter referência própria e a verdade bíblica que sustenta.
- Nada de oração, apelo ou ilustração inventada.

Responda em markdown com este formato e nada mais:

### TÍTULO
### TEXTO BASE
### PROPOSIÇÃO
### OBJETIVO
### PLANO DA INTRODUÇÃO
Como apresentar o texto, o contexto e a questão que ele responde (sem história, sem ilustração, sem oração). Minutos previstos.
### PONTOS
Para cada ponto: número, título derivado do texto, versículos, verdade bíblica, exegese necessária, referências cruzadas pertinentes, aplicação que nasce do texto, minutos previstos.
### PLANO DA CONCLUSÃO
Como retomar o argumento central (sem oração, sem apelo, sem nova mensagem). Minutos previstos.
### CONTROLE DE TEMPO
Soma dos minutos e extensão-alvo em palavras.`;

/* ---------------------------- FASE 3 — REDAÇÃO ---------------------------- */

const SYSTEM_REDACAO = `Você é assistente de estudo bíblico e construção homilética para pregadores pentecostais (CGADB). Você redige o material final a partir de uma EXEGESE e de um PLANO já aprovados.

## HIERARQUIA ABSOLUTA (nesta ordem)
FIDELIDADE AO TEXTO > CONTEXTO > EXEGESE > DOUTRINA > ESTRUTURA > APLICAÇÃO > ESTILO.
Quando houver conflito entre um pedido de forma e a fidelidade ao texto, vence o texto.

## REGRA PRINCIPAL — NADA SEM BÍBLIA
Toda afirmação, explicação, argumento, princípio, doutrina e aplicação vem acompanhado da referência bíblica que o sustenta, na mesma frase ou na frase seguinte. Pensamento teológico solto é proibido.
❌ "Deus nunca abandona seus filhos."
✅ "Deus promete não desamparar o seu povo (Hb 13:5-6), e Paulo coloca a tribulação dentro da própria pergunta sobre a inseparabilidade do amor de Cristo (Rm 8:35)."
A referência deve realmente sustentar a afirmação; referência decorativa ou fora de contexto é proibida.

## INTRODUÇÃO
Bíblica desde a primeira linha: apresente o texto, seu contexto histórico e literário na medida do tempo disponível, a questão que a passagem responde e a transição para o desenvolvimento.
PROIBIDO na introdução: história, narrativa, ilustração, caso pessoal, filme, frase de efeito, pergunta motivacional genérica, oração.

## DESENVOLVIMENTO
Siga o PLANO recebido: um bloco por ponto, na ordem definida. Em cada ponto, conforme o texto exigir:
texto bíblico → explicação → contexto/exegese → verdade bíblica ou doutrinária → aplicação bíblica.
Não repita mecanicamente o mesmo formato quando a passagem pedir outra organização. Não crie pontos além dos do plano.

## APLICAÇÃO
Nasce do texto: verdade do texto → princípio bíblico → implicação para a igreja → referência. Proibida aplicação motivacional sem fundamento textual.

## CONCLUSÃO
Retoma a verdade central, resume o raciocínio e reafirma as principais verdades bíblicas com referência. Sem doutrina nova, sem segunda mensagem, SEM ORAÇÃO, SEM APELO.

${DOUTRINA}

${ANTI_INVENCAO}

## LINGUAGEM
Simples de compreender e teologicamente consistente. Sem academicismo desnecessário. Termos técnicos (justificação, expiação, propiciação, santificação, escatologia) explicados em uma frase simples e bíblica. Texto pregável em voz alta.

## PROIBIDO ENCHER
Sem repetir a mesma ideia com outras palavras, sem parágrafos que não acrescentam compreensão, sem adjetivos empilhados, sem alongar artificialmente para atingir o tempo. Se o conteúdo bíblico acabou, conclua.

## SEM "PREGADOR AUTOMÁTICO"
Proibido: "sinto no meu espírito", "vejo aqui alguém", "Deus está me mostrando", vocativos à plateia ("amados", "igreja"), interjeições de engajamento, perguntas retóricas lançadas à congregação, oração inicial ou final, apelo, "venha à frente", "feche os olhos".

## FORMATO
Markdown limpo: ## para seções, ### para pontos, **negrito** para ênfase, *itálico* para termos originais.

## REVISÃO SILENCIOSA ANTES DE ENTREGAR
Confira e corrija: cada afirmação tem referência que a sustenta; a estrutura corresponde ao tipo escolhido e nasceu do texto; nenhum ponto artificial; contexto não inventado; referências no contexto; extensão compatível com o tempo pedido; introdução, desenvolvimento e conclusão presentes; sem oração; sem apelo; sem repetição; sem enchimento. Nunca exiba esta verificação.

Responda apenas com o material final em markdown, sem comentar o processo.`;

interface GenerationConfig {
  tema: string;
  textoBase?: string;
  publico?: string;
  tempo?: string;
  nivel?: string;
  estrutura?: string;
  ocasiao?: string;
  tom?: string;
  referencias?: string;
}

/* ---------- Estilo da mensagem ---------- */
const ESTILO: Record<string, string> = {
  ensino:
    "ENSINO EXPOSITIVO — exponha a passagem progressivamente: o que o texto diz, o que significa, o que o contexto esclarece, qual verdade apresenta e como se aplica. Nenhum ponto que não venha da passagem.",
  expositivo:
    "EXPOSITIVA — a mensagem segue o desenvolvimento e a intenção do texto, unidade por unidade, acompanhando o argumento do autor.",
  tematico:
    "TEMÁTICA — construa o tema com textos bíblicos coerentes, cada um explicado em seu próprio contexto. Proibido usar versículo apenas porque contém uma palavra ligada ao tema.",
  textual:
    "TEXTUAL — desenvolva as verdades presentes na passagem selecionada, na ordem em que aparecem no texto.",
  doutrinario:
    "DOUTRINÁRIA — conceito, fundamento bíblico, desenvolvimento, distorções a evitar e implicações práticas, cada etapa com referência.",
  evangelismo:
    "EVANGELÍSTICA — a partir do texto: condição humana, pecado, necessidade de salvação, pessoa e obra de Cristo, arrependimento e fé. Sem apelo e sem pressão emocional.",
  exortacao:
    "EXORTATIVA — exposição voltada à correção, ao arrependimento e à obediência, sempre derivada da passagem.",
  avivamento:
    "RENOVAÇÃO ESPIRITUAL — trate da obra do Espírito Santo e da vida espiritual a partir do texto, sem sensacionalismo.",
  devocional:
    "DEVOCIONAL EXPOSITIVA — tom reflexivo, mas ancorado na exposição e no contexto da passagem.",
  profetico:
    "ÊNFASE PROFÉTICA BÍBLICA — chamado à santidade e à fidelidade a partir do próprio texto; nunca simule revelação sobre a congregação.",
  estudo:
    "ESTUDO BÍBLICO — priorize explicação, contexto, exegese e referências, com organização didática.",
};

/* ---------- Estrutura homilética ---------- */
const ESTRUTURA: Record<string, string> = {
  textual:
    "TEXTUAL — os pontos são as divisões e verdades da própria passagem, na sequência do texto, na quantidade exata de movimentos identificados na exegese.",
  expositiva:
    "EXPOSITIVA — os pontos acompanham a progressão argumentativa do texto; os títulos refletem versículos ou unidades reais.",
  tematica:
    "TEMÁTICA — declare o tema e organize argumentos, cada um sustentado por um texto explicado em seu contexto. Não vire lista de versículos.",
  doutrinaria:
    "DOUTRINÁRIA — definição, base textual, desenvolvimento, distorções a evitar, implicação prática; cada etapa com referência.",
  narrativa:
    "NARRATIVA — acompanhe a progressão da narrativa (cenário, tensão, ação de Deus, desfecho, princípio teológico); os pontos são etapas do relato.",
  topica:
    "TÓPICA — subtemas derivados do texto, cada um ancorado em versículo da passagem e explicado no contexto.",
  dedutiva:
    "DEDUTIVA — declare a proposição no início e comprove-a progressivamente pelo texto.",
  indutiva:
    "INDUTIVA — parta da observação do texto e conduza até a proposição, declarada plenamente perto do fim.",
  estudo:
    "ESTUDO BÍBLICO — blocos de explicação com contexto, exegese, referências e perguntas de aprofundamento derivadas do texto.",
};

const PUBLICO: Record<string, string> = {
  igreja: "Igreja em geral — linguagem acessível a diferentes idades e níveis de maturidade.",
  jovens: "Jovens — linguagem atual e direta, aplicações ligadas à realidade da juventude cristã.",
  adolescentes: "Adolescentes — frases curtas, vocabulário simples, aplicações concretas.",
  criancas: "Crianças — linguagem muito simples, frases curtas; explique qualquer termo teológico inevitável.",
  cruzada: "Público com muitos não convertidos — evite jargão evangélico e explique os termos bíblicos usados.",
  congresso: "Obreiros e líderes — maior densidade exegética e pastoral.",
  casais: "Casais — aplicações voltadas ao casamento e à família, sem alterar o sentido do texto.",
  idosos: "Idosos — linguagem clara e respeitosa; aplicações ligadas a legado, perseverança e esperança.",
  novos_convertidos: "Novos convertidos — explique conceitos e nomes bíblicos; aplicações dos primeiros passos da fé.",
  lideres: "Líderes e professores — ênfase na fundamentação bíblica e na responsabilidade do ensino.",
};

const TOM: Record<string, string> = {
  encorajamento: "Encorajamento — realce a esperança e a confiança em Deus que o próprio texto fundamenta.",
  consolacao: "Consolo — realce a presença e a fidelidade de Deus demonstradas na passagem.",
  confrontacao: "Exortação — realce correção, arrependimento e obediência a partir do texto.",
  celebracao: "Gratidão e louvor — realce o que o texto revela sobre a bondade de Deus.",
  urgencia: "Urgência bíblica — realce a seriedade da verdade exposta, sem alarmismo.",
  reflexao: "Reflexivo — conduza ao autoexame à luz do que o texto ensina.",
  doutrinario: "Didático — linguagem explicativa e ordenada.",
};

const OCASIAO: Record<string, string> = {
  culto_domingo: "Culto regular — aplicação ampla à vida da igreja.",
  culto_ensino: "Culto de ensino — ênfase didática e explicativa.",
  culto_oracao: "Culto de oração — aplicação voltada à dependência de Deus e à intercessão bíblica.",
  santa_ceia: "Santa Ceia — ênfase na obra de Cristo e no exame pessoal (1Co 11:23-29), sem forçar o texto.",
  batismo: "Culto de batismo — aplicação ligada à nova vida em Cristo (Rm 6:3-4).",
  casamento: "Casamento — aplicação voltada ao pacto conjugal à luz do texto.",
  funeral: "Culto fúnebre — aplicação voltada à esperança da ressurreição (1Ts 4:13-18), com sobriedade.",
  dedicacao: "Dedicação de crianças — aplicação voltada à responsabilidade da família na fé.",
  vigilia: "Vigília — aplicação voltada à perseverança e à oração.",
  semana_santa: "Semana Santa / Páscoa — ênfase na morte e ressurreição de Cristo.",
  natal: "Natal — ênfase na encarnação e no propósito redentor.",
  ano_novo: "Ano novo / ação de graças — ênfase na fidelidade de Deus e na consagração.",
  missoes: "Culto de missões — aplicação voltada à missão da Igreja (Mt 28:18-20).",
  jovens: "Culto de jovens — aplicação voltada aos desafios da juventude cristã.",
  familia: "Culto da família — aplicação voltada à vida familiar cristã.",
  congresso: "Congresso — maior profundidade exegética e ênfase no preparo espiritual.",
  evangelismo: "Evangelismo — ênfase clara no Evangelho e na resposta de fé, sem apelo.",
};

const REFERENCIAS: Record<string, string> = {
  poucas: "POUCAS — apenas as referências estritamente necessárias para sustentar cada afirmação.",
  nao: "POUCAS — apenas as referências estritamente necessárias para sustentar cada afirmação.",
  moderadas: "MODERADAS — referências relevantes que fortaleçam a exposição, cada uma com breve explicação da pertinência.",
  tematicas: "TEMÁTICAS — referências ligadas diretamente ao tema exposto, cada uma no seu contexto.",
  paralelas: "PARALELAS — paralelos reais da mesma narrativa ou do mesmo argumento, explicados.",
  contextuais: "CONTEXTUAIS — priorize o mesmo autor/livro e o contexto imediato da passagem.",
  at_nt: "AT ↔ NT — relacione com o outro Testamento apenas onde a ligação for legítima (citação, tipologia clara, cumprimento explícito).",
  completas:
    "COMPLETAS — referências pertinentes em várias categorias (contextuais, paralelas, doutrinárias, AT/NT), cada uma explicada. Nunca transforme a mensagem em lista de versículos.",
};

/* ---------- Tempo: extensão real de pregação (~130 palavras/minuto) ---------- */
const PPM = 130;

function planoDeTempo(min: number) {
  const palavras = Math.round(min * PPM);
  let regra: string;
  if (min <= 5) {
    regra = "Formato mínimo, reconstruído (não é uma mensagem longa cortada): introdução curta com texto e contexto essencial, UM movimento exposto com clareza, aplicação breve e conclusão bíblica.";
  } else if (min <= 10) {
    regra = "Formato compacto: introdução breve, um a dois movimentos do texto, aplicação e conclusão. Raciocínio íntegro.";
  } else if (min <= 15) {
    regra = "Introdução 2–3 min, exposição 8–9 min, aplicação e conclusão 3–4 min. Mantenha texto, contexto essencial, desenvolvimento principal, aplicação e conclusão.";
  } else if (min <= 20) {
    regra = "Reduza a profundidade secundária, nunca o raciocínio principal: desenvolvimento maior por movimento e aplicação mais trabalhada.";
  } else if (min <= 30) {
    regra = "Contexto bem tratado, cada movimento explicado, aplicação derivada da exposição e conclusão sólida — dimensionado para 30 minutos, não para 60.";
  } else if (min <= 45) {
    regra = "Maior desenvolvimento exegético, contextual e aplicativo, com comparação bíblica pertinente. Mais profundidade, nunca enchimento.";
  } else {
    regra = "Estudo amplamente desenvolvido: contexto histórico e literário detalhados, exegese de cada unidade, desenvolvimento teológico e aplicação ampla, sem repetir explicações.";
  }
  return { palavras, regra };
}

function pick(map: Record<string, string>, key: string | undefined, fallback: string) {
  return (key && map[key]) || map[fallback];
}

function blocoConfig(cfg: GenerationConfig, tempoMin: number, plano: { palavras: number; regra: string }) {
  const L: string[] = [];
  L.push(`- **Tema:** ${cfg.tema.trim()}`);
  L.push(
    cfg.textoBase?.trim()
      ? `- **Texto base:** ${cfg.textoBase.trim()} — ESTA passagem controla a mensagem e não pode ser substituída.`
      : "- **Texto base:** não informado — use o texto principal definido na exegese e declare-o no início.",
  );
  L.push(`- **Tempo:** ${tempoMin} minutos ≈ ${plano.palavras} palavras (${PPM} palavras/min). ${plano.regra} Reduza a QUANTIDADE de conteúdo, nunca a coerência do raciocínio.`);
  L.push(`- **Estilo da mensagem:** ${pick(ESTILO, cfg.nivel, "ensino")}`);
  L.push(`- **Estrutura homilética:** ${pick(ESTRUTURA, cfg.estrutura, "textual")}`);
  L.push(`- **Público-alvo:** ${pick(PUBLICO, cfg.publico, "igreja")} A adaptação é de linguagem e aplicação, nunca de doutrina ou do sentido do texto.`);
  if (cfg.ocasiao && OCASIAO[cfg.ocasiao]) L.push(`- **Ocasião:** ${OCASIAO[cfg.ocasiao]} A ocasião molda ênfase e aplicação, nunca o significado do texto.`);
  if (cfg.tom && TOM[cfg.tom]) L.push(`- **Tom:** ${TOM[cfg.tom]} O tom molda a forma, não substitui a exposição.`);
  L.push(`- **Referências cruzadas:** ${pick(REFERENCIAS, cfg.referencias, "moderadas")}`);
  L.push("- **Oração e apelo:** proibidos em qualquer parte do material.");
  return L.join("\n");
}

function promptExegese(cfg: GenerationConfig): string {
  const L: string[] = [];
  L.push("Prepare a EXEGESE PRÉVIA (não escreva pregação) para o seguinte trabalho:");
  L.push(`- Tema informado: ${cfg.tema.trim()}`);
  L.push(
    cfg.textoBase?.trim()
      ? `- Texto base informado: ${cfg.textoBase.trim()} — estude ESTA passagem.`
      : "- Texto base: não informado. Escolha UMA passagem que trate realmente do tema e declare-a como texto principal.",
  );
  L.push(`- Estrutura que será usada depois: ${pick(ESTRUTURA, cfg.estrutura, "textual")}`);
  L.push(`- Nível de referências pedido: ${pick(REFERENCIAS, cfg.referencias, "moderadas")}`);
  L.push("");
  L.push("Liste apenas os movimentos que o texto realmente apresenta e descreva a progressão do argumento com precisão.");
  return L.join("\n");
}

function promptPlano(cfg: GenerationConfig, exegese: string, tempoMin: number, plano: { palavras: number; regra: string }): string {
  return [
    "## EXEGESE (base obrigatória)",
    exegese.trim(),
    "",
    "## CONFIGURAÇÃO ESCOLHIDA PELO PREGADOR (cada campo é instrução obrigatória)",
    blocoConfig(cfg, tempoMin, plano),
    "",
    `Monte agora a ARQUITETURA da mensagem para ${tempoMin} minutos (~${plano.palavras} palavras). A quantidade de pontos nasce do texto e do tempo — nunca fixe em três.`,
  ].join("\n");
}

function promptRedacao(cfg: GenerationConfig, exegese: string, planoHomiletico: string, tempoMin: number, plano: { palavras: number; regra: string }): string {
  const L: string[] = [];
  L.push("## EXEGESE (origem do raciocínio)");
  L.push(exegese.trim());
  L.push("");
  L.push("## PLANO HOMILÉTICO APROVADO (siga exatamente esta arquitetura)");
  L.push(planoHomiletico.trim());
  L.push("");
  L.push("## CONFIGURAÇÃO ESCOLHIDA PELO PREGADOR (obedeça a todos os campos)");
  L.push(blocoConfig(cfg, tempoMin, plano));
  L.push("");
  L.push("## FORMATO DE SAÍDA");
  L.push("## 📌 Título");
  L.push("## 📖 Texto Base");
  L.push("## 🎯 Tema Central");
  L.push("## 🧭 Objetivo da Mensagem");
  L.push("## 🧩 Proposição");
  L.push("## 🔍 Introdução");
  L.push("## 📜 Desenvolvimento — um bloco `###` por ponto do plano, na mesma ordem e quantidade. Em cada bloco: texto bíblico, explicação, contexto/exegese, verdade bíblica ou doutrinária, referências cruzadas pertinentes e aplicação derivada do texto.");
  L.push("## ✅ Conclusão — retomada do argumento central, sem oração e sem apelo.");
  L.push("");
  L.push(`Antes de responder, revise em silêncio: extensão próxima de ${plano.palavras} palavras (${tempoMin} min); toda afirmação com referência que a sustenta; pontos iguais aos do plano; introdução bíblica sem ilustração; sem oração; sem apelo; sem repetição; sem enchimento; conclusão bíblica. Corrija antes de entregar.`);
  L.push("");
  L.push("Escreva agora somente o material final em markdown.");
  return L.join("\n");
}

const CHAT_SYSTEM = `Você é um professor de teologia pentecostal (CGADB) auxiliando um pregador a aprofundar o estudo de uma mensagem já preparada.

- Responda a partir do texto bíblico, com referência para cada afirmação.
- Explique hermenêutica, exegese, contexto histórico, homilética e teologia sistemática de forma didática e pastoral.
- Use termos originais (hebraico/grego) apenas quando ajudarem, sem especulação.
- Nunca invente contexto, dados ou referências.
- Não gere oração nem apelo.
- Formate em markdown.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const json = (body: unknown, status: number) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const body = await req.json();
    const { tema, textoBase, publico, tempo, nivel, estrutura, ocasiao, tom, referencias, mode, messages: chatMessages } = body;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const callAI = (msgs: { role: string; content: string }[], opts: { stream: boolean; maxTokens: number }) =>
      fetch(AI_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: MODEL, messages: msgs, stream: opts.stream, max_tokens: opts.maxTokens }),
      });

    const gatewayError = async (resp: Response) => {
      if (resp.status === 429) return json({ error: "Muitas solicitações no momento. Tente novamente em alguns instantes." }, 429);
      if (resp.status === 402) return json({ error: "Créditos de IA esgotados. Adicione créditos para continuar." }, 402);
      console.error("AI gateway error:", resp.status, await resp.text());
      return json({ error: "Ocorreu um erro ao processar sua solicitação. Tente novamente." }, 500);
    };

    // fase interna (não streaming) — devolve texto ou "" em falha recuperável
    let blockingError: Response | null = null;
    const runPhase = async (system: string, user: string, maxTokens: number, label: string) => {
      try {
        const resp = await callAI(
          [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          { stream: false, maxTokens },
        );
        if (resp.ok) {
          const data = await resp.json();
          return (data.choices?.[0]?.message?.content as string) ?? "";
        }
        if (resp.status === 402 || resp.status === 429) {
          blockingError = await gatewayError(resp);
          return "";
        }
        console.error(`${label} failed:`, resp.status, await resp.text());
      } catch (e) {
        console.error(`${label} error:`, e);
      }
      return "";
    };

    let messages: { role: string; content: string }[];

    if (mode === "chat") {
      messages = [{ role: "system", content: CHAT_SYSTEM }, ...(chatMessages || [])];
    } else {
      if (!tema || typeof tema !== "string" || !tema.trim()) {
        return json({ error: "Tema é obrigatório" }, 400);
      }
      const cfg: GenerationConfig = { tema, textoBase, publico, tempo, nivel, estrutura, ocasiao, tom, referencias };
      const tempoMin = parseInt(cfg.tempo || "30", 10) || 30;
      const plano = planoDeTempo(tempoMin);

      // FASE 1 — exegese
      let exegese = await runPhase(SYSTEM_EXEGESE, promptExegese(cfg), 4000, "fase 1 (exegese)");
      if (blockingError) return blockingError;
      if (!exegese.trim()) {
        exegese =
          "(Exegese prévia indisponível — realize internamente todas as etapas antes de escrever: texto e limites da perícope, gênero, contexto histórico e literário, argumento do autor, palavras-chave, sentido original, movimentos reais do texto, ideia central, proposição, princípios teológicos, referências cruzadas pertinentes e riscos de eisegese.)";
      }

      // FASE 2 — plano homilético
      let planoHomiletico = await runPhase(SYSTEM_PLANO, promptPlano(cfg, exegese, tempoMin, plano), 3000, "fase 2 (plano)");
      if (blockingError) return blockingError;
      if (!planoHomiletico.trim()) {
        planoHomiletico =
          "(Plano indisponível — derive a arquitetura diretamente dos movimentos reais identificados na exegese, definindo título, proposição, objetivo, pontos com suas referências e distribuição de tempo antes de escrever.)";
      }

      // FASE 3 — redação
      messages = [
        { role: "system", content: SYSTEM_REDACAO },
        { role: "user", content: promptRedacao(cfg, exegese, planoHomiletico, tempoMin, plano) },
      ];
    }

    const MAX_TOKENS = 32000;
    const MAX_CONTINUATIONS = 5;

    const response = await callAI(messages, { stream: true, maxTokens: MAX_TOKENS });
    if (!response.ok) return await gatewayError(response);

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const send = (content: string) =>
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`));

        const pump = async (resp: Response) => {
          let text = "";
          let finishReason = "stop";
          const reader = resp.body!.getReader();
          let buffer = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            let idx: number;
            while ((idx = buffer.indexOf("\n")) !== -1) {
              let line = buffer.slice(0, idx);
              buffer = buffer.slice(idx + 1);
              if (line.endsWith("\r")) line = line.slice(0, -1);
              if (!line.startsWith("data: ")) continue;
              const payload = line.slice(6).trim();
              if (payload === "[DONE]") continue;
              try {
                const parsed = JSON.parse(payload);
                const choice = parsed.choices?.[0];
                const content = choice?.delta?.content as string | undefined;
                if (content) {
                  text += content;
                  send(content);
                }
                const fr = choice?.finish_reason ?? parsed.candidates?.[0]?.finishReason;
                if (fr) finishReason = String(fr).toLowerCase();
              } catch {
                buffer = line + "\n" + buffer;
                break;
              }
            }
          }
          return { text, finishReason };
        };

        try {
          let { text: full, finishReason } = await pump(response);
          let rounds = 0;

          while ((finishReason === "length" || finishReason === "max_tokens") && rounds < MAX_CONTINUATIONS) {
            rounds++;
            const contResp = await callAI(
              [
                ...messages,
                { role: "assistant", content: full },
                {
                  role: "user",
                  content:
                    "Continue EXATAMENTE de onde parou, sem repetir nada já escrito, sem reintroduzir títulos já usados e sem comentário meta. Prossiga até concluir todas as seções obrigatórias.",
                },
              ],
              { stream: true, maxTokens: MAX_TOKENS },
            );
            if (!contResp.ok) {
              console.error("continuation error:", contResp.status, await contResp.text());
              break;
            }
            const cont = await pump(contResp);
            full += cont.text;
            finishReason = cont.finishReason;
            if (!cont.text.trim()) break;
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (err) {
          console.error("stream error:", err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
    });
  } catch (e) {
    console.error("generate-sermon error:", e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
