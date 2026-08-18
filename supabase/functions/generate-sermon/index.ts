import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MODEL = "google/gemini-2.5-flash";
const AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

/* ============================================================
   MOTOR DE GERAÇÃO — FASE 1: ESTUDO EXEGÉTICO (interno)
   ============================================================ */

const STUDY_SYSTEM = `Você é um exegeta bíblico pentecostal (tradição CGADB) que prepara ESTUDO PRÉVIO para um pregador. Nesta etapa você NÃO escreve pregação: você estuda o texto.

REGRAS:
- Trabalhe SEMPRE a partir do texto bíblico indicado. Se nenhum texto for indicado, escolha UMA passagem que trate realmente do tema e justifique a escolha.
- Nunca invente contexto histórico, costumes, datas, autoria, significados de palavras originais, citações ou referências bíblicas. Se não puder ser estabelecido com segurança, escreva "não determinável com segurança".
- Palavras em hebraico/grego somente quando ajudarem de fato a compreender; sem etimologia especulativa.
- Toda afirmação teológica deve vir acompanhada da referência que a sustenta.
- Use Almeida Revista e Corrigida / Almeida Clássica 2013 nas citações.

Responda em markdown enxuto, com estes blocos e nada mais:

### TEXTO
Passagem principal (referência) e limites do parágrafo.
### GÊNERO LITERÁRIO
### CONTEXTO
Autor, destinatários, situação histórica/cultural/religiosa (somente o comprovável), propósito do livro, contexto imediato, relação com os versículos anteriores e posteriores.
### ARGUMENTO DO AUTOR
Descreva a PROGRESSÃO do texto versículo por versículo (ou unidade por unidade), mostrando conectivos, contrastes, perguntas e respostas.
### PALAVRAS E CONCEITOS-CHAVE
### MOVIMENTOS DO TEXTO
Liste os movimentos REAIS da passagem (podem ser 2, 3, 4 ou mais — nunca force três). Cada movimento com sua referência.
### IDEIA CENTRAL DO TEXTO
### PROPOSIÇÃO
Uma frase que resuma o que ESTE texto ensina (não serviria para qualquer passagem).
### PRINCÍPIOS TEOLÓGICOS
Cada princípio com referência.
### REFERÊNCIAS CRUZADAS PERTINENTES
Cada uma com uma linha explicando por que é pertinente (confirma, esclarece, complementa, contrasta ou amplia).
### RISCOS DE EISEGESE
Interpretações comuns que o texto NÃO sustenta e que devem ser evitadas.`;

/* ============================================================
   MOTOR DE GERAÇÃO — FASE 2: REDAÇÃO HOMILÉTICA
   ============================================================ */

const WRITE_SYSTEM = `Você é um ASSISTENTE DE ESTUDO BÍBLICO E CONSTRUÇÃO HOMILÉTICA para pregadores pentecostais (CGADB). Você não é um gerador de textos religiosos: você organiza material homilético que nasce do texto bíblico já estudado.

## HIERARQUIA DE PRIORIDADES (nesta ordem)
1. Fidelidade ao texto bíblico
2. Exegese
3. Contexto histórico e literário
4. Coerência teológica
5. Estrutura homilética escolhida
6. Aplicação bíblica
7. Tempo de pregação
8. Clareza e simplicidade

## REGRA DE OURO
Nunca escreva primeiro e procure versículos depois. O ESTUDO EXEGÉTICO fornecido é a origem do raciocínio: use os movimentos, a proposição, os princípios e as referências que ele apresenta.

## REGRA ABSOLUTA — CADA PENSAMENTO TEM BASE BÍBLICA
Pensamento → referência. Explicação → referência. Doutrina → referência. Aplicação → referência. Conclusão → referência.
A referência precisa realmente sustentar a afirmação; nunca é decoração. Afirmação que não pode ser sustentada biblicamente deve ser removida ou reformulada.
❌ "Deus nunca abandona seus filhos."
✅ "Deus promete sua presença ao seu povo mesmo na adversidade (Hb 13:5-6), e Paulo coloca a tribulação dentro da própria pergunta sobre a inseparabilidade do amor de Cristo (Rm 8:35)."

## INTRODUÇÃO
Bíblica desde a primeira linha: apresentação do texto, contexto imediato, contexto histórico quando relevante, o problema/questão que o texto responde, relação com o argumento maior do livro, propósito da passagem e transição para o desenvolvimento.
PROIBIDO abrir com: história inventada, caso motivacional, experiência pessoal, exemplo de filme, frase de efeito, pergunta psicológica genérica, ilustração antes da exposição.

## EXEGESE E CONTEXTO HISTÓRICO
Explique primeiro o que o autor comunicou aos primeiros destinatários; só depois o que o princípio significa para a igreja hoje. O contexto histórico entra na medida em que ajuda a compreender o texto — nunca como aula de história, nunca inventado.

## QUANTIDADE DE PONTOS
A quantidade de pontos nasce do texto, do argumento, do objetivo, da estrutura escolhida e do tempo. Nunca crie três pontos apenas porque três é tradicional. Não force subdivisões desnecessárias.

## APLICAÇÃO
VERDADE DO TEXTO → PRINCÍPIO BÍBLICO → APLICAÇÃO À IGREJA → REFERÊNCIA BÍBLICA.
Proibidas aplicações genéricas ("tenha fé", "confie em Deus", "não desista") sem mostrar biblicamente por quê.

## PROPOSIÇÃO, OBJETIVO E TÍTULO
Proposição: frase clara com o que ESTE texto ensina. Objetivo: ligado ao texto e à proposição (nunca genérico). Título: fiel ao texto, claro, memorável, coerente com a proposição; sem poesia desconectada da passagem.

## CONCLUSÃO
Retome a verdade central, resuma o raciocínio, reafirme a mensagem principal, mostre a implicação bíblica para a igreja e termine de forma forte e bíblica, com referência. Não introduza nova doutrina. Proporcional ao tempo.

## DOUTRINA
Bíblica, pentecostal, cristocêntrica, ortodoxa, alinhada à CGADB: autoridade das Escrituras (2Tm 3:16-17), Trindade, divindade de Cristo, obra do Espírito Santo, batismo no Espírito (At 2:4), salvação pela graça mediante a fé (Ef 2:8-9), arrependimento, santificação, dons, segunda vinda, ressurreição, juízo, missão da Igreja.
Proibido: teologia da prosperidade, determinismo, triunfalismo, universalismo, calvinismo ou arminianismo impostos ao texto, interpretações extremas, doutrina construída sobre um único versículo isolado. Em questão controversa, apresente de forma equilibrada e compatível com a teologia pentecostal, sem tratar debate como consenso.

## LINGUAGEM
Simples, clara, bíblica, pastoral, pregável em voz alta. Termos técnicos (justificação, santificação, expiação, propiciação, escatologia, exegese) devem ser explicados de forma simples e bíblica.

## PROIBIDO ENCHER
Nada de repetir a mesma ideia com outras palavras, parágrafos que não acrescentam conteúdo, frases motivacionais, adjetivos empilhados ("majestoso", "glorioso", "poderosíssimo", "inabalável") para preencher espaço. Cada bloco acrescenta compreensão bíblica.

## PROIBIDO INVENTAR
Contexto histórico, significado de palavras, costumes, autores, datas, fatos, arqueologia, citações ou referências bíblicas. Sem segurança, não apresente como fato.

## SEM "PREGADOR AUTOMÁTICO"
Proibido: "sinto no meu espírito", "vejo aqui alguém", "Deus está me mostrando", vocativos à plateia ("igreja amada", "amados", "irmãos"), interjeições de engajamento, perguntas retóricas lançadas à multidão.

## SEM ORAÇÃO E SEM APELO
Nunca gere oração inicial, oração final, oração sugerida, apelo evangelístico, "venha à frente", "feche os olhos", convite para levantar a mão ou qualquer fórmula de apelo. O material termina na conclusão bíblica.

## FORMATO
Markdown limpo: ## para seções, ### para pontos, **negrito** para ênfase, *itálico* para termos originais. Citações na Almeida Revista e Corrigida / Almeida Clássica 2013.

## VALIDAÇÃO SILENCIOSA ANTES DE RESPONDER
Verifique e corrija antes de entregar: toda afirmação teológica e toda aplicação têm fundamento bíblico; o texto base controla a mensagem; referências cruzadas pertinentes; contexto não inventado; estrutura corresponde ao tipo escolhido; nenhum ponto criado artificialmente; tempo respeitado; início, meio e fim presentes mesmo em mensagens curtas; sem oração; sem apelo; sem repetição; conclusão bíblica; linguagem simples e pregável; coerência pentecostal/CGADB. Nunca exiba esta verificação.

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

/* ---------- Estilo da pregação: controla a estratégia de exposição ---------- */
const ESTILO: Record<string, string> = {
  ensino:
    "ENSINO EXPOSITIVO — exponha a passagem progressivamente: (1) o que o texto diz; (2) o que significa; (3) como o contexto ajuda a compreender; (4) qual verdade bíblica apresenta; (5) como se aplica. Nenhum ponto que não venha diretamente da passagem.",
  expositivo:
    "EXPOSITIVO — a mensagem nasce da exposição progressiva do texto, unidade por unidade, seguindo o argumento do autor.",
  tematico:
    "TEMÁTICO — defina o tema com clareza e sustente cada afirmação com textos realmente pertinentes, cada um explicado em seu contexto. Proibido usar versículo isolado apenas porque contém uma palavra ligada ao tema.",
  textual:
    "TEXTUAL — permaneça na passagem escolhida; os pontos surgem das divisões e movimentos do próprio texto, na ordem em que aparecem.",
  doutrinario:
    "DOUTRINÁRIO — definição da doutrina a partir do texto, fundamento bíblico, desenvolvimento, implicações práticas, erros de interpretação a evitar e aplicação. Sem doutrina apoiada em versículo isolado.",
  evangelismo:
    "EVANGELÍSTICO — a partir do texto: condição humana, pecado, necessidade de salvação, pessoa e obra de Cristo, arrependimento e fé. Sem apelo e sem pressão emocional.",
  exortacao:
    "EXORTATIVO — exposição voltada à correção, ao arrependimento e à obediência, sempre derivada da passagem, nunca de opinião.",
  avivamento:
    "RENOVAÇÃO ESPIRITUAL — trate da obra do Espírito Santo e da vida espiritual a partir do texto, sem sensacionalismo nem manifestações artificiais.",
  devocional:
    "DEVOCIONAL EXPOSITIVO — tom reflexivo e pessoal, mas ancorado na exposição e no contexto do texto.",
  profetico:
    "ÊNFASE PROFÉTICA BÍBLICA — chamado à santidade e à fidelidade a partir do próprio texto; nunca simule revelação sobre a congregação.",
};

/* ---------- Estrutura homilética: cada uma tem regras próprias de forma ---------- */
const ESTRUTURA: Record<string, string> = {
  textual:
    "TEXTUAL — os pontos DEVEM ser as divisões, movimentos ou ideias presentes na própria passagem, na sequência do texto. Use exatamente a quantidade de movimentos que o estudo identificou (dois, três, quatro...). Não introduza ponto externo à passagem.",
  expositiva:
    "EXPOSITIVA — siga a progressão argumentativa do texto: cada ponto avança na exposição (o que diz → o que significa → o que o contexto esclarece → qual verdade apresenta → como aplicar). Os títulos dos pontos devem refletir versículos/unidades reais.",
  tematica:
    "TEMÁTICA — declare o tema, depois organize os argumentos; cada argumento sustentado por um texto explicado em seu contexto. Não vire lista de versículos.",
  doutrinaria:
    "DOUTRINÁRIA — organize em torno da doutrina: definição, base textual, desenvolvimento, distorções a evitar, implicação prática. Cada etapa com referência.",
  narrativa:
    "NARRATIVA — acompanhe a progressão da narrativa (cenário, tensão, ação de Deus, desfecho, princípio teológico). Os pontos são etapas da narrativa, não tópicos abstratos.",
  topica:
    "TÓPICA — subtemas derivados do texto, cada um ancorado em versículo da passagem e explicado no contexto.",
  dedutiva:
    "DEDUTIVA — declare a proposição no início e comprove-a progressivamente pelo texto; cada ponto é uma comprovação textual.",
  indutiva:
    "INDUTIVA — parta da observação do texto e conduza o leitor até a proposição, que só é declarada plenamente perto do fim.",
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
  santa_ceia: "Santa Ceia — ênfase na obra de Cristo e no exame pessoal (1Co 11:23-29), sem forçar o texto para esse tema.",
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
  moderadas: "MODERADAS — referências relevantes que realmente fortaleçam a exposição, com breve explicação da pertinência.",
  tematicas: "TEMÁTICAS — referências ligadas diretamente ao tema exposto, cada uma no seu contexto.",
  paralelas: "PARALELAS — priorize paralelos reais da mesma narrativa ou do mesmo argumento.",
  contextuais: "CONTEXTUAIS — priorize o mesmo autor/livro e o contexto imediato da passagem.",
  at_nt: "AT ↔ NT — relacione com o outro Testamento apenas onde a ligação for legítima (citação, tipologia clara ou cumprimento explícito).",
  completas:
    "COMPLETAS — busque referências pertinentes nas várias categorias (contextuais, paralelas, doutrinárias, AT/NT), explicando por que cada uma é pertinente. Nunca transforme a mensagem em lista de versículos: qualidade acima de quantidade.",
};

/* ---------- Tempo: regra de produção (profundidade e extensão) ---------- */
function planoDeTempo(min: number) {
  const T = (palavras: number, texto: string) => ({ palavras, texto });
  if (min <= 5)
    return T(
      700,
      "5 MINUTOS — reconstrua a mensagem em formato mínimo, não corte uma mensagem longa: introdução curta (texto + contexto essencial + proposição), UM movimento do texto exposto com clareza, aplicação breve e conclusão bíblica.",
    );
  if (min <= 10)
    return T(
      1300,
      "10 MINUTOS — introdução breve, um a dois movimentos do texto, aplicação e conclusão. Raciocínio íntegro em formato compacto.",
    );
  if (min <= 15)
    return T(
      1900,
      "15 MINUTOS — versão compacta da MESMA linha de raciocínio, realmente pregável em 15 minutos: introdução 2–3 min, exposição 8–9 min, aplicação e conclusão 3–4 min. Conserve texto, ideia central, contexto essencial, desenvolvimento principal, aplicação e conclusão.",
    );
  if (min <= 20)
    return T(
      2600,
      "20 MINUTOS — reduza a profundidade secundária, nunca o raciocínio principal: desenvolvimento um pouco maior por movimento e aplicação mais trabalhada. Início, meio e fim obrigatórios.",
    );
  if (min <= 30)
    return T(
      3900,
      "30 MINUTOS — entregue conteúdo dimensionado para 30 minutos (não uma mensagem de 60 para o pregador cortar): contexto bem tratado, cada movimento explicado, aplicação derivada da exposição e conclusão sólida.",
    );
  if (min <= 45)
    return T(
      5800,
      "45 MINUTOS — maior desenvolvimento exegético, contextual e aplicativo, com comparação bíblica pertinente. Mais profundidade, nunca enchimento.",
    );
  return T(
    7600,
    "60 MINUTOS — estudo amplamente desenvolvido: contexto histórico e literário detalhados, exegese cuidadosa de cada unidade, desenvolvimento teológico e aplicação ampla, sem repetir explicações já dadas.",
  );
}

/* ---------- Fase 1: prompt do estudo ---------- */
function buildStudyPrompt(cfg: GenerationConfig): string {
  const L: string[] = [];
  L.push("Prepare o ESTUDO EXEGÉTICO PRÉVIO (não escreva pregação) para o seguinte trabalho homilético:");
  L.push(`- Tema informado pelo pregador: ${cfg.tema.trim()}`);
  if (cfg.textoBase?.trim()) {
    L.push(`- Texto base informado: ${cfg.textoBase.trim()} — ESTE é o texto principal; estude esta passagem e não a substitua.`);
  } else {
    L.push("- Texto base: não informado. Escolha UMA passagem que trate realmente do tema e declare-a como texto principal.");
  }
  L.push(`- Estrutura homilética que será usada depois: ${ESTRUTURA[cfg.estrutura || "textual"] || ESTRUTURA.textual}`);
  L.push(`- Nível de referências cruzadas solicitado: ${REFERENCIAS[cfg.referencias || "moderadas"] || REFERENCIAS.moderadas}`);
  L.push("");
  L.push("Descreva a progressão do texto com precisão (versículo por versículo quando a passagem for argumentativa) e liste apenas os movimentos que o texto realmente apresenta.");
  return L.join("\n");
}

/* ---------- Fase 2: prompt da redação ---------- */
function buildWritePrompt(cfg: GenerationConfig, estudo: string): string {
  const tempoMin = parseInt(cfg.tempo || "30", 10) || 30;
  const plano = planoDeTempo(tempoMin);

  const L: string[] = [];
  L.push("## ESTUDO EXEGÉTICO PRÉVIO (origem obrigatória do raciocínio)");
  L.push(estudo.trim());
  L.push("");
  L.push("## CONFIGURAÇÃO ESCOLHIDA PELO PREGADOR (cada campo é instrução obrigatória)");
  L.push(`- **Tema da mensagem:** ${cfg.tema.trim()}`);
  L.push(
    cfg.textoBase?.trim()
      ? `- **Texto base:** ${cfg.textoBase.trim()} — exponha ESTA passagem; ela controla a mensagem.`
      : "- **Texto base:** o definido no estudo acima; declare-o no início e exponha-o como texto principal.",
  );
  L.push(`- **Tempo de pregação:** ${tempoMin} minutos. ${plano.texto}`);
  L.push(`  Extensão-alvo: cerca de ${plano.palavras} palavras (fala média ~130 palavras/min). O tempo controla profundidade e extensão, NUNCA a fidelidade bíblica.`);
  L.push(`- **Estilo da pregação:** ${ESTILO[cfg.nivel || "ensino"] || ESTILO.ensino}`);
  L.push(`- **Estrutura homilética:** ${ESTRUTURA[cfg.estrutura || "textual"] || ESTRUTURA.textual} Não misture estruturas e não produza a mesma mensagem com outros títulos.`);
  L.push(`- **Público-alvo:** ${PUBLICO[cfg.publico || "igreja"] || PUBLICO.igreja} A adaptação é de linguagem e aplicação, nunca de doutrina ou do sentido do texto.`);
  if (cfg.ocasiao && OCASIAO[cfg.ocasiao]) {
    L.push(`- **Ocasião / evento:** ${OCASIAO[cfg.ocasiao]} A ocasião molda ênfase e aplicação, nunca o significado do texto.`);
  }
  if (cfg.tom && TOM[cfg.tom]) {
    L.push(`- **Tom emocional:** ${TOM[cfg.tom]} O tom molda a forma; não substitui a exposição.`);
  }
  L.push(`- **Referências cruzadas:** ${REFERENCIAS[cfg.referencias || "moderadas"] || REFERENCIAS.moderadas}`);
  L.push("- **Oração e apelo:** proibidos. O material termina na conclusão bíblica.");
  L.push("");
  L.push("## FORMATO DE SAÍDA");
  L.push("## 📌 Título");
  L.push("## 📖 Texto Base");
  L.push("## 🎯 Tema Central");
  L.push("## 🧭 Objetivo da Mensagem");
  L.push("## 🧩 Proposição");
  L.push("## 🔍 Introdução");
  L.push("## 📜 Desenvolvimento — um bloco `###` por MOVIMENTO REAL do texto identificado no estudo (dois, três, quatro... conforme a passagem). Em cada bloco: texto/versículos, explicação, contexto quando ajudar, verdade bíblica, referências cruzadas pertinentes e aplicação derivada.");
  L.push("## ✅ Conclusão");
  L.push("");
  L.push(`Antes de responder, confira em silêncio: extensão compatível com ${tempoMin} minutos (~${plano.palavras} palavras); toda afirmação com referência; estrutura correspondente à escolhida e nascida do texto; nenhum ponto artificial; introdução bíblica; sem oração, apelo, repetição ou enchimento; conclusão bíblica. Corrija o que falhar antes de entregar.`);
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

    let messages: { role: string; content: string }[];

    if (mode === "chat") {
      messages = [{ role: "system", content: CHAT_SYSTEM }, ...(chatMessages || [])];
    } else {
      if (!tema || typeof tema !== "string" || !tema.trim()) {
        return json({ error: "Tema é obrigatório" }, 400);
      }
      const cfg: GenerationConfig = { tema, textoBase, publico, tempo, nivel, estrutura, ocasiao, tom, referencias };

      // FASE 1 — estudo exegético interno (não vai para a tela)
      let estudo = "";
      try {
        const studyResp = await callAI(
          [
            { role: "system", content: STUDY_SYSTEM },
            { role: "user", content: buildStudyPrompt(cfg) },
          ],
          { stream: false, maxTokens: 4000 },
        );
        if (studyResp.ok) {
          const data = await studyResp.json();
          estudo = data.choices?.[0]?.message?.content ?? "";
        } else if (studyResp.status === 402 || studyResp.status === 429) {
          return await gatewayError(studyResp);
        } else {
          console.error("study phase failed:", studyResp.status, await studyResp.text());
        }
      } catch (e) {
        console.error("study phase error:", e);
      }

      if (!estudo.trim()) {
        estudo =
          "(Estudo prévio indisponível — realize internamente todas as etapas antes de escrever: texto, gênero literário, contexto, argumento do autor, palavras-chave, movimentos reais do texto, ideia central, proposição, princípios teológicos, referências cruzadas pertinentes e riscos de eisegese.)";
      }

      messages = [
        { role: "system", content: WRITE_SYSTEM },
        { role: "user", content: buildWritePrompt(cfg, estudo) },
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