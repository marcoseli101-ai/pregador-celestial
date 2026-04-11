import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é um pregador experiente e teólogo pentecostal formado pela grade curricular da CGADB (Convenção Geral das Assembleias de Deus no Brasil).

## FUNDAMENTOS DOUTRINÁRIOS OBRIGATÓRIOS
Toda pregação DEVE estar alinhada com as doutrinas da CGADB:
1. A Bíblia Sagrada é a inerrante e infalível Palavra de Deus.
2. Há um só Deus, eternamente subsistente em três Pessoas: Pai, Filho e Espírito Santo.
3. Jesus Cristo é Deus encarnado, nascido de uma virgem, morreu vicariamente, ressuscitou corporalmente e voltará visivelmente.
4. O batismo no Espírito Santo é uma experiência subsequente à salvação, com evidência inicial de falar em outras línguas (At 2:4). Os dons espirituais de 1Co 12 são atuais.
5. A salvação é pela graça mediante a fé em Cristo Jesus (Ef 2:8-9).
6. Arrebatamento pré-tribulacional, milênio literal, juízo final e eternidade.
7. A Igreja é o Corpo de Cristo, com ordenanças de Batismo por imersão e Santa Ceia.
8. Jesus ainda cura hoje (Is 53:4-5).

## REGRAS ABSOLUTAS
- Use tradução Almeida Revista e Corrigida ou NVI.
- Formate usando markdown: títulos (##), subtítulos (###), negrito (**), listas.
- NUNCA contradiga as doutrinas das Assembleias de Deus.
- Siga RIGOROSAMENTE todos os parâmetros informados pelo usuário. NENHUM parâmetro pode ser ignorado.`;

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

function buildUserPrompt(params: {
  tema: string;
  publico?: string;
  tempo?: string;
  nivel?: string;
  estrutura?: string;
  ocasiao?: string;
  tom?: string;
  referencias?: string;
}): string {
  const { tema, publico, tempo, nivel, estrutura, ocasiao, tom, referencias } = params;

  // --- TEMPO ---
  const tempoMin = parseInt(tempo || "30", 10) || 30;
  const palavrasMap: Record<number, number> = { 15: 1800, 30: 3600, 45: 5400, 60: 7200 };
  const palavrasAlvo = palavrasMap[tempoMin] || Math.round(tempoMin * 120);

  // --- PÚBLICO ---
  const publicoDescMap: Record<string, string> = {
    igreja: "Igreja geral — linguagem acessível para todos os membros da congregação, de diferentes idades e maturidade espiritual",
    jovens: "Jovens (15-30 anos) — use linguagem moderna e atual, exemplos do universo jovem, desafios contemporâneos da juventude cristã, referências culturais relevantes. Evite linguagem antiquada.",
    cruzada: "Cruzada Evangelística — público misto com muitos não-convertidos. Linguagem simples, clara, sem jargão evangélico. Foco em apresentar o Evangelho de forma compreensível.",
    congresso: "Congresso de Obreiros e Líderes — linguagem madura e profunda, com aprofundamento teológico, exegético e pastoral. Público com formação bíblica avançada.",
    casais: "Casais — foco em relacionamento conjugal, família cristã, exemplos práticos do cotidiano do casal. Linguagem madura e sensível.",
    criancas: "Crianças (até 12 anos) — linguagem MUITO simples, frases curtas, histórias bíblicas contadas como narrativas envolventes, exemplos do dia a dia infantil, perguntas interativas. EVITE termos teológicos complexos.",
    idosos: "Idosos — linguagem respeitosa e calorosa, valorize memórias e legado de fé, exemplos de personagens bíblicos que serviram a Deus até a velhice. Tom de gratidão e esperança.",
  };
  const publicoDesc = publicoDescMap[publico || "igreja"] || publicoDescMap["igreja"];

  // --- ESTILO / NÍVEL ---
  const nivelDescMap: Record<string, string> = {
    exortacao: "Exortação — tom de encorajamento e fortalecimento espiritual. Verbos imperativos, frases motivadoras.",
    avivamento: "Avivamento — tom de fogo, mover do Espírito Santo, renovação. Linguagem intensa, apaixonada, com clamor espiritual.",
    ensino: "Ensino Expositivo — tom didático, análise versículo por versículo com exegese profunda. Explique contexto histórico, termos no original (hebraico/grego).",
    evangelismo: "Evangelístico — foco total em conversão e chamado ao altar. Apresente o plano de salvação de forma clara, use testemunhos e apelos emocionais.",
    devocional: "Devocional — tom íntimo, reflexivo, pessoal. Convide à comunhão pessoal com Deus, meditação profunda, aplicação interior.",
    profetico: "Profético — tom de urgência, declaração da vontade de Deus, chamado à santidade. Linguagem forte e direta.",
  };
  const nivelDesc = nivelDescMap[nivel || "ensino"] || nivelDescMap["ensino"];

  // --- ESTRUTURA HOMILÉTICA ---
  const estruturaDescMap: Record<string, string> = {
    textual: "3 Pontos Clássicos — Introdução que contextualiza o texto base → 3 pontos principais extraídos diretamente do texto bíblico (cada ponto com subtítulo, versículo de sustentação, explicação e aplicação) → Conclusão com apelo.",
    tematica: "Temática — Organize ao redor do tema central usando vários textos bíblicos de apoio. Cada seção explora uma faceta diferente do tema.",
    expositiva: "Expositiva — Análise versículo a versículo do texto base. Aprofunde cada verso com contexto original, significado e aplicação prática.",
    narrativa: "Narrativa — Conte a história bíblica em formato de narrativa envolvente com: Início (contexto), Conflito (problema/desafio), Clímax (intervenção divina), Resolução (desfecho) e Aplicação (o que aprendemos).",
    topica: "Tópica — Aborde um tópico doutrinário com múltiplas referências bíblicas organizadas por subtemas.",
    dedutiva: "Dedutiva — Apresente a tese/verdade central logo no início e então prove-a progressivamente com textos bíblicos e argumentação teológica.",
    indutiva: "Indutiva — Comece com perguntas, observações e investigação do texto. Conduza o ouvinte numa jornada de descoberta até chegar à verdade/conclusão.",
  };
  const estruturaDesc = estruturaDescMap[estrutura || "textual"] || estruturaDescMap["textual"];

  // --- TOM EMOCIONAL ---
  const tomDescMap: Record<string, string> = {
    encorajamento: "Encorajador — Use verbos de fortalecimento, frases de esperança, promessas bíblicas. O ouvinte deve sair fortalecido e motivado.",
    consolacao: "Consolador — Linguagem acolhedora e sensível. Fale ao coração de quem sofre. Use textos de consolo e empatia.",
    confrontacao: "Desafiador — Confrontação amorosa. Desafie à mudança, ao compromisso, à santidade. Use perguntas retóricas e chamados à ação.",
    celebracao: "Celebrativo — Linguagem de louvor, gratidão e alegria no Senhor. Ritmo vibrante e festivo.",
    urgencia: "Profético — Senso de urgência espiritual, preparo para a volta de Cristo. Linguagem forte e direta.",
    reflexao: "Reflexivo — Conduza à introspecção e meditação espiritual profunda. Faça pausas reflexivas, perguntas que levem ao autoexame.",
  };
  const tomDesc = tomDescMap[tom || "encorajamento"] || "Encorajador";

  // --- OCASIÃO ---
  const ocasiaoDescMap: Record<string, string> = {
    culto_domingo: "Culto Regular de Domingo — Introdução acolhedora, conclusão com convite à adoração.",
    culto_oracao: "Culto de Oração — Foco em intimidade com Deus, intercessão e busca espiritual.",
    santa_ceia: "Santa Ceia — Reflexão sobre o sacrifício de Cristo, exame de consciência, reverência.",
    batismo: "Culto de Batismo — Celebre a nova vida em Cristo, o significado do batismo por imersão.",
    casamento: "Cerimônia de Casamento — Celebre o amor conjugal à luz bíblica, conselhos para o casal.",
    funeral: "Funeral — Consolação, esperança na ressurreição, celebração da vida e legado de fé do falecido.",
    dedicacao: "Dedicação de Crianças — Responsabilidade dos pais, bênção sobre a criança, promessas de Deus.",
    vigilia: "Vigília de Oração — Intensidade espiritual, clamor, busca por avivamento.",
    semana_santa: "Semana Santa / Páscoa — Crucificação e ressurreição de Cristo, significado redentor.",
    natal: "Natal — Encarnação de Cristo, esperança messiânica, amor de Deus ao enviar seu Filho.",
    ano_novo: "Ano Novo — Gratidão pelo ano que passou, fé e expectativa para o novo ano, consagração.",
    missoes: "Conferência de Missões — Chamado missionário, urgência da evangelização mundial, obediência à Grande Comissão.",
  };
  const ocasiaoDesc = ocasiao && ocasiaoDescMap[ocasiao] ? ocasiaoDescMap[ocasiao] : null;

  // --- REFERÊNCIAS ---
  const refSim = referencias && referencias !== "nao";
  const refDesc = refSim
    ? "SIM — Inclua uma seção '## 📖 Referências Bíblicas Complementares' ao final com pelo menos 5 versículos relacionados ao tema, cada um com: referência completa, texto do versículo e conexão com o tema."
    : "NÃO — Use apenas o texto base e os versículos estritamente necessários no desenvolvimento. Não inclua seção de referências extras.";

  // --- MONTAR PROMPT ---
  const lines = [
    `Você é um pregador experiente. Gere uma pregação COMPLETA seguindo RIGOROSAMENTE estes parâmetros sem ignorar nenhum deles:`,
    ``,
    `## PARÂMETROS DA PREGAÇÃO`,
    ``,
    `**1. TEMA:** ${tema.trim()}`,
    ``,
    `**2. TEMPO DE PREGAÇÃO:** ${tempoMin} minutos`,
    `⚠️ REGRA CRÍTICA DE TAMANHO: A pregação DEVE ter aproximadamente **${palavrasAlvo} palavras**. Isso equivale a ${tempoMin} minutos falados. Conte as palavras mentalmente enquanto escreve. Se o texto ficar significativamente menor que ${palavrasAlvo} palavras, EXPANDA com mais exemplos, ilustrações e aprofundamento. Se ficar maior, RESUMA. O tamanho é OBRIGATÓRIO.`,
    ``,
    `**3. PÚBLICO-ALVO:** ${publicoDesc}`,
    `⚠️ ADAPTE toda a linguagem, vocabulário, exemplos e ilustrações para este público específico. A pregação deve soar natural para quem está ouvindo.`,
    ``,
    `**4. ESTILO DA PREGAÇÃO:** ${nivelDesc}`,
    `⚠️ O estilo define a ABORDAGEM do conteúdo. Siga fielmente a descrição acima.`,
    ``,
    `**5. ESTRUTURA HOMILÉTICA:** ${estruturaDesc}`,
    `⚠️ Siga EXATAMENTE esta estrutura. A organização dos pontos e seções deve obedecer o formato descrito.`,
    ``,
    `**6. TOM EMOCIONAL:** ${tomDesc}`,
    `⚠️ O tom emocional deve permear TODA a pregação: a escolha de verbos, adjetivos, ritmo das frases e a forma como as verdades são apresentadas. Não basta mencionar o tom — ele deve ser SENTIDO em cada parágrafo.`,
    ``,
    `**7. REFERÊNCIAS CRUZADAS:** ${refDesc}`,
  ];

  if (ocasiaoDesc) {
    lines.push(``);
    lines.push(`**8. OCASIÃO/EVENTO:** ${ocasiaoDesc}`);
    lines.push(`⚠️ Adapte a introdução e a conclusão especificamente para esta ocasião. Mencione o contexto do evento. A pregação deve parecer feita sob medida para este momento.`);
  }

  lines.push(``);
  lines.push(`## FORMATO OBRIGATÓRIO DE SAÍDA`);
  lines.push(``);
  lines.push(`A pregação DEVE conter estas seções em markdown:`);
  lines.push(`- **## Texto Base**: Referência bíblica principal com versículo transcrito`);
  lines.push(`- **## Tema Central**: Título claro e impactante`);
  lines.push(`- **## Introdução**: Contextualização que capture a atenção do público`);
  lines.push(`- **## Desenvolvimento**: Corpo da pregação seguindo a ESTRUTURA HOMILÉTICA definida acima`);
  lines.push(`  - Cada ponto deve ter: subtítulo, versículos citados integralmente, explicação e aplicação`);
  lines.push(`- **## Ministração**: Frases de impacto espiritual para o momento de altar`);
  lines.push(`- **## Conclusão**: Apelo, convite à decisão e oração de encerramento`);
  lines.push(`- **## Aplicação Prática**: 3-5 pontos de ação para a semana`);
  if (refSim) {
    lines.push(`- **## 📖 Referências Bíblicas Complementares**: Mínimo 5 versículos com texto e conexão ao tema`);
  }

  lines.push(``);
  lines.push(`## CHECKLIST FINAL (verifique antes de finalizar)`);
  lines.push(`✅ O texto tem aproximadamente ${palavrasAlvo} palavras (${tempoMin} min)?`);
  lines.push(`✅ A linguagem é adequada para o público (${publico || "igreja"})?`);
  lines.push(`✅ O estilo (${nivel || "ensino"}) está presente em todo o texto?`);
  lines.push(`✅ A estrutura homilética (${estrutura || "textual"}) foi seguida?`);
  lines.push(`✅ O tom emocional (${tom || "encorajamento"}) permeia toda a pregação?`);
  if (ocasiaoDesc) {
    lines.push(`✅ A introdução e conclusão estão adaptadas para a ocasião?`);
  }
  lines.push(``);
  lines.push(`AGORA GERE A PREGAÇÃO COMPLETA. Não pule nenhuma seção. Não encurte. Respeite o tamanho de ${palavrasAlvo} palavras.`);

  return lines.join("\n");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { tema, publico, tempo, nivel, estrutura, ocasiao, tom, referencias, mode, messages: chatMessages } = await req.json();
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY is not configured");
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

      const userPrompt = buildUserPrompt({ tema, publico, tempo, nivel, estrutura, ocasiao, tom, referencias });

      messages = [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ];
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns segundos." }), {
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
      return new Response(JSON.stringify({ error: "Erro ao gerar pregação" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("generate-sermon error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
