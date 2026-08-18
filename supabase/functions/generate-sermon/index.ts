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
Os movimentos REAIS da passagem — podem ser 1, 2, 3, 4 ou 5. Nunca force três; três só se o texto realmente tiver três. Cada movimento com os versículos exatos que o delimitam e uma frase dizendo por que ele é uma unidade distinta.
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
- A estrutura NASCE do texto: os pontos SÃO os movimentos reais identificados no estudo, na mesma ordem. Nunca crie ponto para chegar a três, nunca elimine movimento essencial para caber em três. Se o texto tem 2 movimentos, o plano tem 2 pontos; se tem 5, tem 5.
- O tempo controla a PROFUNDIDADE de cada ponto, não a quantidade de pontos inventados. Em tempos curtos, agrupe movimentos secundários dentro do movimento principal em vez de criar pontos novos.
- Distribua o tempo entre introdução, desenvolvimento e conclusão de modo pregável e respeite o teto de palavras informado.
- Cada ponto deve ter referência própria, verdade bíblica distinta das dos outros pontos e aplicação derivada dos versículos daquele ponto.
- Nenhuma verdade pode aparecer em dois pontos diferentes. Se dois movimentos ensinam a mesma coisa, funda-os em um só.
- Nada de oração, apelo ou ilustração inventada.

Responda em markdown com este formato e nada mais:

### TÍTULO
### TEXTO BASE
### PROPOSIÇÃO
### OBJETIVO
### PLANO DA INTRODUÇÃO
Como apresentar o texto, o contexto histórico/literário e a questão que a passagem responde. PROIBIDO: história, ilustração, caso pessoal, notícia, frase de efeito, oração. Minutos previstos.
### PONTOS
Para cada ponto: número, título derivado do texto, versículos, verdade bíblica (única, não repetida em outro ponto), exegese necessária, referências cruzadas pertinentes, aplicação que nasce daqueles versículos, minutos previstos.
Declare também: **QUANTIDADE DE PONTOS E POR QUÊ** — justifique o número a partir dos movimentos do texto.
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
Siga o PLANO recebido: um bloco por ponto, na ordem e na QUANTIDADE definidas. Nunca acrescente, funda ou divida pontos.
O número de pontos nasce dos movimentos reais do texto: pode ser 1, 2, 3, 4 ou 5. NÃO existe padrão de três pontos; três só aparece quando o texto realmente tem três movimentos.
Dentro de cada ponto a progressão é de CONTEÚDO NOVO a cada etapa:
1. o que o texto diz (citação/paráfrase fiel com referência);
2. o que o texto significa — só informação que a citação não deu: contexto, conectivo, termo original, argumento do autor;
3. que verdade bíblica ou doutrinária decorre disso — formulada em nível diferente da explicação, com referência;
4. o que essa verdade exige/produz na prática — uma implicação concreta, nunca a repetição da verdade em outras palavras.
Se uma etapa não tiver conteúdo novo a acrescentar, ELIMINE a etapa em vez de reescrever a anterior.

## APLICAÇÃO
Toda aplicação é DERIVADA do texto exposto no próprio ponto: precisa ser possível apontar o versículo de onde ela sai. Verdade do texto → princípio bíblico → implicação concreta para a igreja → referência.
PROIBIDO: aplicação motivacional, autoajuda, promessa genérica, frase de encorajamento sem base textual, aplicação que serviria igualmente a qualquer outra passagem.

## CONCLUSÃO
Retoma a verdade central, resume o raciocínio e reafirma as principais verdades bíblicas com referência. Sem doutrina nova, sem segunda mensagem, SEM ORAÇÃO, SEM APELO.
Nunca escreva oração, apelo, convite, chamada à frente ou palavras dirigidas em oração a Deus em NENHUMA parte do material — nem na introdução, nem entre os pontos, nem no fim.

${DOUTRINA}

${ANTI_INVENCAO}

## LINGUAGEM
Simples de compreender e teologicamente consistente. Sem academicismo desnecessário. Termos técnicos (justificação, expiação, propiciação, santificação, escatologia) explicados em uma frase simples e bíblica. Texto pregável em voz alta.

## PROIBIDO ENCHER E PROIBIDO REPETIR
Cada parágrafo precisa acrescentar informação que ainda não foi dita. É proibido:
- dizer a mesma verdade na explicação, na "verdade bíblica" e na aplicação;
- reformular a proposição em cada ponto;
- reabrir na conclusão o que já foi explicado, além de um resumo curto;
- empilhar adjetivos, parágrafos de transição vazios ou alongar para atingir o tempo.
A extensão-alvo é um TETO, não uma meta: se o conteúdo bíblico terminou antes, conclua imediatamente. Um material mais curto e denso é melhor que um material longo e repetitivo.
PROIBIDO conteúdo motivacional: frases de efeito, encorajamento genérico, linguagem de superação ou vitória pessoal sem sustentação no texto.

## SEM "PREGADOR AUTOMÁTICO"
Proibido: "sinto no meu espírito", "vejo aqui alguém", "Deus está me mostrando", vocativos à plateia ("amados", "igreja"), interjeições de engajamento, perguntas retóricas lançadas à congregação, oração inicial ou final, apelo, "venha à frente", "feche os olhos".

## FORMATO
Markdown limpo: ## para seções, ### para pontos, **negrito** para ênfase, *itálico* para termos originais.

## REVISÃO SILENCIOSA ANTES DE ENTREGAR
Confira e corrija: (1) cada afirmação teológica tem referência que realmente a sustenta; (2) cada aplicação sai de um versículo exposto no próprio ponto; (3) a introdução é bíblica/contextual, sem história e sem oração; (4) não há oração nem apelo em parte alguma; (5) nenhuma verdade aparece repetida em explicação, verdade bíblica e aplicação — se aparecer, apague as ocorrências redundantes; (6) o número de pontos é o do plano e nasceu dos movimentos do texto; (7) a extensão não ultrapassa o teto de palavras pedido; (8) não há trecho motivacional sem base textual. Nunca exiba esta verificação.

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
    "EXPOSITIVA — exposição SEQUENCIAL da passagem: percorra o texto na ordem em que ele se apresenta, unidade por unidade / versículo por versículo, explicando o que cada parte diz e como avança o argumento do autor. Não reorganize o texto em tópicos temáticos.",
  tematico:
    "TEMÁTICA — desenvolva o tema com VÁRIOS textos bíblicos, e cada texto é explicado dentro do SEU próprio contexto (autor, destinatários, argumento) antes de ser aplicado ao tema. Proibido usar versículo apenas porque contém uma palavra ligada ao tema, e proibido empilhar referências sem explicação.",
  textual:
    "TEXTUAL — desenvolva as DIVISÕES encontradas dentro da própria passagem: identifique as partes que o texto já traz e faça de cada divisão um desenvolvimento próprio, na ordem do texto. Os pontos são as divisões do texto, não temas trazidos de fora.",
  doutrinario:
    "DOUTRINÁRIA — para cada bloco, nesta ordem: CONCEITO (definição precisa) → FUNDAMENTAÇÃO BÍBLICA (textos que estabelecem a doutrina, explicados) → EXPLICAÇÃO (o que significa e o que não significa) → IMPLICAÇÕES (consequências para fé e prática). Cada etapa com referência.",
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
    "ESTUDO BÍBLICO — prioridade MÁXIMA para contexto histórico/literário e exegese: a maior parte do material é explicação do texto (autor, destinatários, gênero, conectivos, termos originais quando esclarecem). Aplicação existe, mas é secundária em relação à compreensão do texto.",
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

/* ---------- Tempo: extensão real de pregação (~120 palavras/minuto) ----------
   O tempo é TETO de conteúdo. Curto = condensado (mesma estrutura, menos
   desenvolvimento). Longo = mais profundidade exegética, nunca mais enchimento. */
const PPM = 120;

function planoDeTempo(min: number) {
  const palavras = Math.round(min * PPM);
  const minimo = Math.round(palavras * 0.8);
  let regra: string;
  if (min <= 5) {
    regra = "Formato mínimo condensado: introdução de 2–3 frases (texto + contexto essencial), UM movimento do texto exposto com clareza, aplicação breve derivada dele e conclusão de 2–3 frases. Nada de contexto ampliado, nada de referências cruzadas extensas.";
  } else if (min <= 10) {
    regra = "Formato compacto: introdução breve, um a dois movimentos do texto, aplicação e conclusão curtas. Corte referências cruzadas secundárias e detalhes de contexto não indispensáveis.";
  } else if (min <= 15) {
    regra = "Condensado, porém completo: introdução ~2 min (texto e contexto essencial), desenvolvimento ~10 min (todos os movimentos, cada um em profundidade média), conclusão ~2 min. Um só parágrafo de explicação por ideia; no máximo uma referência cruzada por ponto.";
  } else if (min <= 20) {
    regra = "Desenvolvimento médio: cada movimento com explicação mais trabalhada e uma a duas referências cruzadas, sem ampliar o número de pontos.";
  } else if (min <= 30) {
    regra = "Aprofundamento proporcional: contexto histórico e literário desenvolvidos, exegese de cada movimento, referências cruzadas explicadas e aplicação bem derivada. A profundidade cresce, a quantidade de pontos NÃO.";
  } else if (min <= 45) {
    regra = "Aprofundamento amplo: contexto detalhado, exegese verso a verso nos trechos decisivos, termos originais quando esclarecem, comparações bíblicas pertinentes explicadas. Se não houver material bíblico real para preencher, entregue material menor em vez de repetir.";
  } else {
    regra = "Estudo extenso: contexto histórico e literário detalhados, exegese de cada unidade, desenvolvimento teológico das implicações doutrinárias e aplicação ampla. Todo acréscimo deve ser INFORMAÇÃO NOVA sobre o texto; jamais reexplique o que já foi explicado.";
  }
  return { palavras, minimo, regra };
}

function pick(map: Record<string, string>, key: string | undefined, fallback: string) {
  return (key && map[key]) || map[fallback];
}

type PlanoTempo = ReturnType<typeof planoDeTempo>;

function blocoConfig(cfg: GenerationConfig, tempoMin: number, plano: PlanoTempo) {
  const L: string[] = [];
  L.push(`- **Tema:** ${cfg.tema.trim()}`);
  L.push(
    cfg.textoBase?.trim()
      ? `- **Texto base:** ${cfg.textoBase.trim()} — ESTA passagem controla a mensagem e não pode ser substituída.`
      : "- **Texto base:** não informado — use o texto principal definido na exegese e declare-o no início.",
  );
  L.push(`- **Tempo:** ${tempoMin} minutos = entre ${plano.minimo} e ${plano.palavras} palavras (${PPM} palavras/min). ${plano.palavras} palavras é TETO ABSOLUTO — ultrapassá-lo é erro. ${plano.regra} O tempo controla a quantidade de conteúdo: reduza desenvolvimento e referências, nunca a coerência (introdução, desenvolvimento e conclusão sempre presentes).`);
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

function promptPlano(cfg: GenerationConfig, exegese: string, tempoMin: number, plano: PlanoTempo): string {
  return [
    "## EXEGESE (base obrigatória)",
    exegese.trim(),
    "",
    "## CONFIGURAÇÃO ESCOLHIDA PELO PREGADOR (cada campo é instrução obrigatória)",
    blocoConfig(cfg, tempoMin, plano),
    "",
    `Monte agora a ARQUITETURA da mensagem para ${tempoMin} minutos (máximo ${plano.palavras} palavras). A quantidade de pontos nasce dos movimentos reais do texto — nunca fixe em três. Distribua o teto de palavras entre introdução, pontos e conclusão e declare quantas palavras cabem a cada parte.`,
  ].join("\n");
}

function promptRedacao(cfg: GenerationConfig, exegese: string, planoHomiletico: string, tempoMin: number, plano: PlanoTempo): string {
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
  L.push(
    `## ORÇAMENTO DE PALAVRAS (obrigatório)\nAlvo: ${plano.minimo}–${plano.palavras} palavras no total, TETO RÍGIDO de ${plano.palavras}. Antes de escrever, distribua esse orçamento entre introdução (~10%), cada ponto do plano (partes iguais de ~80%) e conclusão (~10%), e escreva cada seção dentro da sua cota — conte as palavras à medida que escreve.\nSe o material passar do teto, corte explicações secundárias, referências cruzadas opcionais e frases redundantes ANTES de entregar; nunca entregue acima do teto.\nSe ficar abaixo do mínimo, faltou exegese, contexto ou referência cruzada explicada — aprofunde o TEXTO, jamais repita o já dito nem acrescente material motivacional.`,
  );
  L.push("");
  L.push(`Antes de responder, revise em silêncio: extensão entre ${plano.minimo} e ${plano.palavras} palavras (${tempoMin} min) — nunca acima do teto; toda afirmação teológica com referência que a sustenta; toda aplicação derivada dos versículos do próprio ponto; pontos iguais em ordem e quantidade aos do plano; introdução exclusivamente bíblica/contextual, sem história e sem oração; nenhuma oração e nenhum apelo em parte alguma; nenhuma verdade repetida entre explicação, verdade bíblica e aplicação; nada motivacional sem base textual; conclusão que resume sem abrir assunto novo. Corrija antes de entregar.`);
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
    // teto de saída da redação (chat mantém teto amplo)
    let maxOut = 8000;

    if (mode === "chat") {
      messages = [{ role: "system", content: CHAT_SYSTEM }, ...(chatMessages || [])];
    } else {
      if (!tema || typeof tema !== "string" || !tema.trim()) {
        return json({ error: "Tema é obrigatório" }, 400);
      }
      const cfg: GenerationConfig = { tema, textoBase, publico, tempo, nivel, estrutura, ocasiao, tom, referencias };
      const tempoMin = parseInt(cfg.tempo || "30", 10) || 30;
      const plano = planoDeTempo(tempoMin);
      // ~2.2 tokens por palavra em português + margem de formatação
      maxOut = Math.min(16000, Math.round(plano.palavras * 2.3) + 500);

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

    const MAX_TOKENS = maxOut;
    // continuação só existe para fechar um material cortado, não para alongar
    const MAX_CONTINUATIONS = mode === "chat" ? 2 : 1;

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
                    "Continue EXATAMENTE de onde parou e FECHE o material o mais rápido possível: complete apenas o que falta das seções obrigatórias e escreva a conclusão. Não repita nada já escrito, não reintroduza títulos, não abra assunto novo, não escreva oração nem apelo.",
                },
              ],
              { stream: true, maxTokens: Math.min(MAX_TOKENS, 4000) },
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
