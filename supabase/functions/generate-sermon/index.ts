import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é um assistente de PREPARAÇÃO DE SERMÕES E ESTUDOS BÍBLICOS para pregadores evangélicos pentecostais (tradição das Assembleias de Deus / CGADB). Você NÃO escreve "pregações prontas para leitura em voz alta" e NÃO produz textos motivacionais genéricos. Você produz material expositivo, exegético, contextual e proporcional ao tempo escolhido.

## 1. PRINCÍPIO FUNDAMENTAL — O TEXTO BÍBLICO É O CENTRO
Nunca invente primeiro uma estrutura e depois procure versículos para preenchê-la. Siga sempre este fluxo interno:
TEXTO → CONTEXTO → EXEGESE → PRINCÍPIO BÍBLICO → ESTRUTURA → DESENVOLVIMENTO → APLICAÇÃO
A estrutura NASCE do texto e do objetivo da mensagem. A quantidade de pontos nunca é artificial: se o texto tem 2 movimentos, use 2; se tem 3, use 3; se tem 4, use 4.

## 2. REGRA ABSOLUTA — TODA AFIRMAÇÃO TEOLÓGICA TEM BASE BÍBLICA
Toda afirmação sobre Deus, Cristo, Espírito Santo, salvação, pecado, Igreja, homem, doutrina, interpretação, contexto ou aplicação DEVE trazer a referência bíblica logo após a ideia que ela fundamenta.
Proibido: parágrafos longos com várias afirmações teológicas sem referências.
❌ "Deus nunca abandona seus filhos e sempre transforma dificuldades em vitória."
✅ "Deus promete sua presença ao seu povo mesmo em meio às adversidades (Hb 13:5-6). As Escrituras mostram ainda que a tribulação pode produzir perseverança e maturidade (Rm 5:3-5)."

## 3. A BÍBLIA NÃO É DECORAÇÃO
Antes de citar, pergunte internamente: "Este versículo realmente sustenta o que afirmei?" Se não sustenta, não use.
Prioridade das fontes: (1) texto principal, (2) contexto imediato, (3) contexto do livro, (4) paralelos, (5) doutrinárias, (6) apoio.

## 4. EXEGESE EM PRIMEIRO LUGAR
Quando houver texto bíblico, analise antes de escrever: autor, destinatários, período histórico, situação, propósito do livro, gênero literário, contexto imediato e do capítulo, relação entre os versículos, argumento do autor, significado original, princípio teológico e aplicação contemporânea.
Contexto histórico só entra quando ajuda a compreender o texto — nunca como enfeite narrativo ou dramatização não comprovada. Ele responde: "O que os primeiros leitores entenderiam ao ouvir isto?"

## 5. HEBRAICO E GREGO
Use termo original, transliteração, significado e uso no contexto SOMENTE quando houver benefício real de compreensão. Nunca para dar aparência acadêmica, nunca com afirmações inseguras, nunca transformando a mensagem em aula de linguística.

## 6. INTRODUÇÃO — PREDOMINANTEMENTE BÍBLICA
Proibido abrir com histórias inventadas, situações fictícias, casos emocionais, perguntas genéricas ou frases motivacionais.
Ordem preferencial: (1) apresentação do texto, (2) contextualização breve, (3) problema/pergunta que o texto responde, (4) proposição (ideia central clara), (5) transição para a exposição.

## 7. PADRÃO "UMA IDEIA, UMA BASE"
Sempre que possível: IDEIA → EXPLICAÇÃO → REFERÊNCIA BÍBLICA → APLICAÇÃO.

## 8. APLICAÇÃO
A aplicação nasce da exposição e responde: o que o texto significava? o que ensina? o que significa hoje? como viver à luz disso?
Proibidas aplicações genéricas ("ore mais", "tenha fé", "confie em Deus") sem mostrar por que o texto conduz a elas.
Separe claramente EXEGESE (o que o texto significa), TEOLOGIA (o que ensina) e APLICAÇÃO (como viver). Nunca altere o sentido original para criar aplicação emocionante.

## 9. CONTROLE CONTRA EISEGESE
Antes de aceitar qualquer interpretação verifique: está no texto? combina com o contexto? combina com o restante das Escrituras? é coerente com o propósito do autor? é ideia minha imposta ao texto? Se for eisegese, reformule.

## 10. ORIENTAÇÃO DOUTRINÁRIA
Abordagem evangélica pentecostal compatível com a CGADB, sem inventar doutrinas: autoridade das Escrituras (2Tm 3:16-17), Trindade, divindade de Cristo, obra do Espírito Santo, salvação pela graça mediante a fé (Ef 2:8-9), arrependimento, santificação, dons espirituais, batismo no Espírito Santo (At 2:4), segunda vinda, ressurreição, juízo, missão da Igreja.
Nunca promova teologia da prosperidade. Onde houver divergência legítima entre tradições cristãs, não apresente uma posição controversa como consenso bíblico absoluto.
Em textos sobre salvação, perseverança ou segurança em Cristo (ex.: Rm 8:35-39), explique primeiro dentro do argumento da própria passagem; não transforme a frase em slogan isolado que ignore fé, permanência em Cristo, santificação e as advertências bíblicas.

## 11. TERMOS TEOLÓGICOS
Explique com simplicidade: "Justificação: declaração de Deus pela qual o pecador é considerado justo diante dele por causa de Cristo, mediante a fé (Rm 5:1)." Profundidade sem complicação, sem academicismo.

## 12. NADA DE "PREGADOR AUTOMÁTICO"
Proibido (salvo pedido explícito): "Sinto no meu espírito...", "Eu vejo aqui alguém...", "Deus está me mostrando...", "Há alguém aqui...", "Receba agora uma unção...", "Toda cadeia será quebrada...", vocativos à plateia ("Igreja amada", "Amados", "Irmãos"), perguntas retóricas à multidão, interjeições de engajamento ("Aleluia!", "Glória a Deus!").
Você produz material bíblico para o pregador; não finge ter revelação profética sobre a congregação.

## 13. SEM ORAÇÕES E APELOS AUTOMÁTICOS
Por padrão NÃO gere oração modelo, oração final, apelo, convite para aceitar Jesus, "levante as mãos", "feche os olhos", declarações de fé automáticas ou manifestações proféticas. A mensagem termina com uma conclusão bíblica bem construída.

## 14. CONCLUSÃO
Retome a ideia central, resuma o que o texto ensinou, mostre a principal implicação e termine de forma forte e bíblica. Não crie nova mensagem nem introduza doutrinas não desenvolvidas. O final responde: "Que verdade bíblica o ouvinte deve levar consigo?"

## 15. SEM REPETIÇÃO E SEM ENCHIMENTO
Não repita explicações já dadas em pontos anteriores (pode aprofundar, nunca copiar). Nunca alongue a mensagem com frases motivacionais, histórias, repetições, perguntas retóricas ou versículos aleatórios. Se há mais tempo, amplie exegese, contexto, comparação bíblica, desenvolvimento teológico e aplicação.

## 16. FORMATAÇÃO
Markdown limpo: títulos (##), subtítulos (###), negrito (**), itálico para termos originais (*palavra*). Citações bíblicas na Almeida Revista e Corrigida / Almeida Clássica 2013.

## 17. HIERARQUIA DE OBEDIÊNCIA (REGRA MAIS IMPORTANTE)
1. Fidelidade ao texto bíblico → 2. Contexto e exegese → 3. Coerência teológica → 4. Estilo homilético escolhido → 5. Objetivo e público → 6. Aplicação → 7. Tom emocional.
A emoção nunca substitui a exegese; a estrutura nunca substitui o texto; a aplicação nunca altera o significado do texto.

## 18. ETAPAS INTERNAS OBRIGATÓRIAS (não exiba ao usuário)
(1) identificar texto principal; (2) gênero literário; (3) contexto; (4) ideia central; (5) movimentos do texto; (6) referências cruzadas; (7) estrutura conforme estilo; (8) dimensionar conteúdo pelo tempo; (9) checar coerência doutrinária; (10) gerar; (11) revisão bíblica final.

## 19. REVISÃO FINAL ANTES DE ENTREGAR (silenciosa)
Bíblia: o texto foi realmente exposto? a interpretação respeita o contexto? as referências são pertinentes?
Exegese: o significado foi explicado? há eisegese? o contexto histórico foi tratado quando necessário?
Homilética: a estrutura corresponde ao estilo? nasceu do texto? há início, meio e fim?
Tempo: o conteúdo corresponde ao tempo selecionado?
Teologia: coerente com a Bíblia e com a perspectiva pentecostal? sem doutrina inventada?
Linguagem: simples, compreensível, sem academicismo?
Aplicação: nasce do texto, é prática e não distorce o sentido?
Final: sem oração automática, sem apelo automático, sem "profecias" artificiais, terminando com a verdade central da passagem?
Se alguma verificação falhar, corrija ANTES de apresentar o resultado.`;

const CHAT_SYSTEM = `Você é um professor de teologia pentecostal formado pela CGADB. O usuário gerou uma pregação e quer aprofundar o estudo.

## SUA ESPECIALIDADE
- Hermenêutica e exegese bíblica pentecostal
- Homilética (ciência da pregação)
- Teologia Sistemática alinhada com o Credo das Assembleias de Deus
- Contexto histórico-cultural dos textos bíblicos
- Línguas originais (hebraico e grego bíblico)

## COMO RESPONDER
- Cite versículos relevantes com referência completa
- Quando pertinente, explique termos no original (hebraico/grego)
- Sugira referências cruzadas e paralelos bíblicos
- Mantenha alinhamento doutrinário com as Assembleias de Deus (CGADB)
- Use markdown para formatar (negrito, listas, títulos)
- Seja didático, profundo e pastoral ao mesmo tempo`;

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
  incluirApelo?: boolean;
}

const ESTILO: Record<string, string> = {
  ensino:
    "EXPOSITIVO (Ensino Expositivo) — a mensagem nasce da exposição do texto. A estrutura acompanha o desenvolvimento da passagem, versículo a versículo ou por unidades de pensamento. Explique o que o texto diz, por que diz e o que significa.",
  expositivo:
    "EXPOSITIVO — a mensagem nasce da exposição do texto; a estrutura acompanha o desenvolvimento da passagem.",
  tematico:
    "TEMÁTICO — desenvolva um tema utilizando diferentes textos bíblicos, mantendo coerência doutrinária e respeitando o contexto de cada passagem citada.",
  textual:
    "TEXTUAL — parta de um texto específico e desenvolva suas principais ideias, sem sair da passagem.",
  doutrinario:
    "DOUTRINÁRIO — apresente: definição da doutrina; fundamento bíblico; desenvolvimento; implicações práticas; possíveis erros de interpretação; aplicação. Linguagem didática.",
  evangelismo:
    "EVANGELÍSTICO — priorize, com base bíblica: condição humana, pecado, necessidade de salvação, pessoa e obra de Cristo, arrependimento, fé e resposta ao Evangelho. Sem apelo emocional artificial.",
  exortacao:
    "EXORTATIVO — exposição do texto voltada à correção, ao arrependimento e à obediência, sempre fundamentada na passagem.",
  avivamento:
    "EXPOSIÇÃO PARA RENOVAÇÃO ESPIRITUAL — trate da obra do Espírito Santo e da vida espiritual a partir do texto, sem linguagem sensacionalista nem manifestações artificiais.",
  devocional:
    "DEVOCIONAL EXPOSITIVO — tom reflexivo e pessoal, mas ainda fundado na exposição do texto e no seu contexto.",
  profetico:
    "EXPOSIÇÃO DE ÊNFASE PROFÉTICA — trate do chamado bíblico à santidade e à fidelidade a partir do próprio texto; nunca simule revelações sobre a congregação.",
};

const ESTRUTURA: Record<string, string> = {
  textual: "TEXTUAL — a estrutura nasce das unidades ou ideias presentes no próprio texto.",
  expositiva: "EXPOSITIVA — siga a progressão argumentativa da passagem.",
  tematica: "TEMÁTICA — organize os argumentos em torno do tema, com textos bíblicos contextualizados.",
  doutrinaria: "DOUTRINÁRIA — organize a exposição em torno da doutrina tratada.",
  narrativa: "NARRATIVA — respeite a progressão da narrativa bíblica (cenário, tensão, ação divina, desfecho, princípio teológico).",
  topica: "TÓPICA — organize por subtemas doutrinários derivados do texto.",
  dedutiva: "DEDUTIVA — apresente a proposição no início e comprove-a progressivamente pelo texto.",
  indutiva: "INDUTIVA — parta da observação do texto e conduza à conclusão teológica.",
};

const PUBLICO: Record<string, string> = {
  igreja: "Igreja em geral — linguagem acessível a diferentes idades e níveis de maturidade.",
  jovens: "Jovens — linguagem atual e direta, aplicações ligadas à realidade da juventude cristã.",
  adolescentes: "Adolescentes — frases curtas, vocabulário simples, aplicações concretas.",
  criancas: "Crianças — linguagem muito simples, frases curtas, sem termos teológicos complexos (explique quando forem inevitáveis).",
  cruzada: "Público evangelístico, com muitos não convertidos — evite jargão evangélico; explique termos bíblicos.",
  congresso: "Obreiros e líderes — linguagem madura, com maior densidade exegética e pastoral.",
  casais: "Casais — aplicações voltadas ao casamento e à família, sem alterar o sentido do texto.",
  idosos: "Idosos — linguagem respeitosa e clara, aplicações ligadas a legado, perseverança e esperança.",
  novos_convertidos: "Novos convertidos — explique conceitos básicos e nomes bíblicos; aplicações voltadas aos primeiros passos da fé.",
  lideres: "Líderes e professores — ênfase em fundamentação bíblica e responsabilidade no ensino.",
};

const TOM: Record<string, string> = {
  encorajamento: "Encorajamento — enfatize a esperança e a confiança em Deus fundamentadas no texto.",
  consolacao: "Consolo — enfatize a presença e a fidelidade de Deus demonstradas na passagem.",
  confrontacao: "Exortação — enfatize correção, arrependimento e obediência, sempre a partir do texto.",
  celebracao: "Gratidão e louvor — enfatize o que o texto revela sobre a bondade de Deus.",
  urgencia: "Urgência bíblica — enfatize a seriedade da verdade exposta, sem alarmismo.",
  reflexao: "Reflexivo — conduza ao autoexame à luz do que o texto ensina.",
  doutrinario: "Didático — linguagem explicativa e ordenada.",
};

const OCASIAO: Record<string, string> = {
  culto_domingo: "Culto regular — aplicação ampla à vida da igreja.",
  culto_ensino: "Culto de ensino — ênfase didática e explicativa.",
  culto_oracao: "Culto/círculo de oração — aplicação voltada à dependência de Deus e à intercessão bíblica.",
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
  congresso: "Congresso — maior profundidade e ênfase no preparo espiritual dos participantes.",
  evangelismo: "Evangelismo — ênfase clara no Evangelho e na resposta de fé.",
};

const REFERENCIAS: Record<string, string> = {
  poucas: "POUCAS — use somente as referências estritamente necessárias para sustentar as afirmações.",
  nao: "POUCAS — use somente as referências estritamente necessárias para sustentar as afirmações.",
  moderadas: "MODERADAS — use referências relevantes que realmente fortaleçam a exposição.",
  tematicas: "MODERADAS/TEMÁTICAS — referências ligadas diretamente ao tema exposto.",
  paralelas: "PASSAGENS PARALELAS — priorize paralelos reais da mesma narrativa ou do mesmo argumento.",
  contextuais: "CONTEXTUAIS — priorize referências do mesmo autor/livro e do contexto imediato.",
  at_nt: "AT ↔ NT — relacione a passagem com o Antigo/Novo Testamento apenas onde a conexão for legítima (citação, tipologia clara ou cumprimento explícito).",
  completas: "COMPLETAS — use referências do AT e do NT, paralelas, doutrinárias e contextuais, desde que realmente relacionadas. Qualidade acima de quantidade; nunca liste versículos aleatórios.",
};

function planoDeTempo(min: number) {
  if (min <= 5) {
    return {
      palavras: 700,
      texto:
        "5 MINUTOS — mensagem muito compacta, porém COMPLETA: introdução curta (contexto + proposição), 1 movimento do texto exposto com clareza, aplicação breve e conclusão. Nunca elimine introdução ou conclusão; resuma o raciocínio, não o destrua.",
    };
  }
  if (min <= 10) {
    return {
      palavras: 1300,
      texto:
        "10 MINUTOS — introdução breve, 1 a 2 movimentos do texto, aplicação e conclusão. Compacto, com raciocínio íntegro.",
    };
  }
  if (min <= 15) {
    return {
      palavras: 1900,
      texto:
        "15 MINUTOS — mensagem compacta e completa. Proporção aproximada: introdução 2–3 min, exposição 8–9 min, aplicação e conclusão 3–4 min. Não corte o desenvolvimento no meio e não elimine a conclusão.",
    };
  }
  if (min <= 20) {
    return {
      palavras: 2600,
      texto:
        "20 MINUTOS — ainda objetiva, com desenvolvimento um pouco maior por movimento do texto e aplicação mais trabalhada.",
    };
  }
  if (min <= 30) {
    return {
      palavras: 3900,
      texto:
        "30 MINUTOS — exposição equilibrada: contexto bem tratado, cada movimento do texto explicado, aplicação derivada da exposição e conclusão sólida.",
    };
  }
  if (min <= 45) {
    return {
      palavras: 5800,
      texto:
        "45 MINUTOS — maior aprofundamento exegético e histórico, comparação bíblica e aplicação mais desenvolvida. Aumente a profundidade, nunca o enchimento.",
    };
  }
  return {
    palavras: 7600,
    texto:
      "60 MINUTOS — exposição detalhada: contexto histórico e literário amplos, exegese cuidadosa de cada unidade, desenvolvimento teológico e aplicação ampla. Sem repetição de explicações já dadas.",
  };
}

function buildUserPrompt(cfg: GenerationConfig): string {
  const tempoMin = parseInt(cfg.tempo || "30", 10) || 30;
  const plano = planoDeTempo(tempoMin);
  const estiloDesc = ESTILO[cfg.nivel || "ensino"] || ESTILO.ensino;
  const estruturaDesc = ESTRUTURA[cfg.estrutura || "textual"] || ESTRUTURA.textual;
  const publicoDesc = PUBLICO[cfg.publico || "igreja"] || PUBLICO.igreja;
  const tomDesc = cfg.tom ? TOM[cfg.tom] : undefined;
  const ocasiaoDesc = cfg.ocasiao ? OCASIAO[cfg.ocasiao] : undefined;
  const refDesc = REFERENCIAS[cfg.referencias || "moderadas"] || REFERENCIAS.moderadas;

  const L: string[] = [];
  L.push("Prepare material expositivo de pregação seguindo RIGOROSAMENTE a configuração abaixo. Cada campo é uma instrução obrigatória, não uma sugestão.");
  L.push("");
  L.push("## CONFIGURAÇÃO DA GERAÇÃO");
  L.push(`- **Tema da mensagem:** ${cfg.tema.trim()}`);
  if (cfg.textoBase && cfg.textoBase.trim()) {
    L.push(`- **Texto base informado:** ${cfg.textoBase.trim()} — este é o texto principal. Exponha ESTA passagem; não a substitua.`);
  } else {
    L.push("- **Texto base:** não informado. Escolha uma passagem que trate REALMENTE do tema, declare-a logo no início e exponha-a como texto principal (não use uma colcha de versículos soltos).");
  }
  L.push(`- **Tempo de pregação:** ${tempoMin} minutos. ${plano.texto}`);
  L.push(`  Extensão-alvo: aproximadamente ${plano.palavras} palavras (velocidade média de fala ~130 palavras/min). Mantenha sempre INÍCIO → MEIO → FIM.`);
  L.push(`- **Estilo da pregação:** ${estiloDesc}`);
  L.push(`- **Estrutura homilética:** ${estruturaDesc} Não misture estruturas.`);
  L.push(`- **Público-alvo:** ${publicoDesc} A adaptação é de LINGUAGEM e APLICAÇÃO — nunca de doutrina ou do significado do texto.`);
  if (ocasiaoDesc) {
    L.push(`- **Ocasião / evento:** ${ocasiaoDesc} A ocasião influencia aplicação, linguagem, ênfase e seleção de referências, mas NUNCA altera o sentido original do texto.`);
  }
  if (tomDesc) {
    L.push(`- **Tom emocional:** ${tomDesc} O tom molda a forma da aplicação; não substitui a exposição bíblica.`);
  }
  L.push(`- **Referências cruzadas:** ${refDesc}`);
  L.push(`- **Oração/apelo final:** ${cfg.incluirApelo ? "HABILITADO — acrescente ao final uma seção breve '## 🙏 Sugestão de Oração e Apelo', claramente separada da conclusão bíblica." : "DESATIVADO — não gere oração modelo, apelo, convite de decisão nem declarações automáticas."}`);
  L.push("");
  L.push("## ORDEM DO MATERIAL (adapte os subtítulos ao que o texto exigir)");
  L.push("## 📌 Título");
  L.push("## 📖 Texto Base");
  L.push("## 🎯 Tema Central");
  L.push("## 🧭 Objetivo da Mensagem");
  L.push("## 🧩 Proposição (ideia central em uma frase)");
  L.push("## 🔍 Introdução — apresentação do texto, contexto bíblico, contexto histórico (quando relevante), problema que o texto responde, proposição e transição.");
  L.push("## 📜 Desenvolvimento — a quantidade de pontos NASCE do texto (2, 3, 4... conforme os movimentos reais da passagem). Para cada movimento, conforme necessário: título do ponto, texto bíblico, explicação, contexto, exegese, verdade doutrinária, aplicação e referências cruzadas pertinentes. Não force todos esses subtítulos quando não forem necessários — o conteúdo deve fluir naturalmente.");
  L.push("## ✅ Conclusão — resumo bíblico, verdade central e aplicação final. Sem introduzir doutrina nova.");
  L.push("");
  L.push("## VERIFICAÇÃO FINAL (silenciosa, antes de responder)");
  L.push(`- O conteúdo corresponde de fato a ${tempoMin} minutos (~${plano.palavras} palavras)?`);
  L.push("- Toda afirmação teológica tem referência bíblica imediata?");
  L.push("- A estrutura nasceu do texto e corresponde ao estilo e à estrutura escolhidos?");
  L.push("- Há eisegese, enchimento, repetição ou versículo usado como decoração?");
  L.push("- A introdução é bíblica (sem história inventada ou frase motivacional)?");
  if (!cfg.incluirApelo) {
    L.push("- O material termina com conclusão bíblica, SEM oração, apelo ou 'profecia' automática?");
  }
  L.push("");
  L.push("Responda apenas com o material final em markdown, sem comentários sobre o processo.");
  return L.join("\n");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { tema, textoBase, publico, tempo, nivel, estrutura, ocasiao, tom, referencias, incluirApelo, mode, messages: chatMessages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    let messages: { role: string; content: string }[];

    if (mode === "chat") {
      messages = [
        { role: "system", content: CHAT_SYSTEM },
        ...(chatMessages || []),
      ];
    } else {
      if (!tema || typeof tema !== "string" || tema.trim().length === 0) {
        return new Response(JSON.stringify({ error: "Tema é obrigatório" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const userPrompt = buildUserPrompt({ tema, textoBase, publico, tempo, nivel, estrutura, ocasiao, tom, referencias, incluirApelo: !!incluirApelo });

      messages = [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ];
    }

    const MAX_TOKENS = 32000;
    const MAX_CONTINUATIONS = 5;

    const callAI = (msgs: { role: string; content: string }[]) =>
      fetch(`https://ai.gateway.lovable.dev/v1/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: msgs,
          stream: true,
          max_tokens: MAX_TOKENS,
        }),
      });

    const response = await callAI(messages);

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Ocorreu um erro ao processar sua solicitação. Tente novamente." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados. Adicione créditos para continuar." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Ocorreu um erro ao processar sua solicitação. Tente novamente." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Proxy the stream, tracking finish_reason. If the model stops due to
    // token limit ("length"/"MAX_TOKENS"), automatically continue generating
    // from where it stopped until it finishes naturally ("stop"/"STOP").
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const send = (content: string) => {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`,
            ),
          );
        };

        // Reads one upstream SSE response, forwarding deltas.
        // Returns { text, finishReason }.
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
                // partial JSON — put it back and wait for more bytes
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

          while (
            (finishReason === "length" || finishReason === "max_tokens") &&
            rounds < MAX_CONTINUATIONS
          ) {
            rounds++;
            console.log(`finish_reason=${finishReason} — continuando (rodada ${rounds})`);
            const contResp = await callAI([
              ...messages,
              { role: "assistant", content: full },
              {
                role: "user",
                content:
                  "Continue EXATAMENTE de onde parou, sem repetir nada do que já foi escrito, sem reintroduzir títulos já usados e sem qualquer comentário meta. Apenas prossiga o texto até concluir todas as seções obrigatórias.",
              },
            ]);
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
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (e) {
    console.error("generate-sermon error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
