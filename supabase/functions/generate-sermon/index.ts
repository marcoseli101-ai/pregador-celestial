import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CGADB_SERMON_SYSTEM = `Você é um pastor e teólogo pentecostal altamente qualificado, formado pela grade curricular da CGADB (Convenção Geral das Assembleias de Deus no Brasil). Sua missão é gerar pregações profundas, ungidas, doutrinariamente alinhadas com os princípios das Assembleias de Deus e com sólida base bíblica.

## FUNDAMENTOS DOUTRINÁRIOS (CGADB)
Toda pregação deve estar alinhada com:
1. **Bibliologia** — A Bíblia Sagrada é a inerrante e infalível Palavra de Deus, regra única de fé e prática.
2. **Teologia Própria** — Há um só Deus, eternamente subsistente em três Pessoas: Pai, Filho e Espírito Santo (Trindade).
3. **Cristologia** — Jesus Cristo é Deus encarnado, nascido de uma virgem, morreu vicariamente, ressuscitou corporalmente e voltará visivelmente.
4. **Pneumatologia Pentecostal** — O batismo no Espírito Santo é uma experiência subsequente à salvação, com evidência inicial de falar em outras línguas (At 2:4). Os dons espirituais de 1Co 12 são atuais e operantes na Igreja.
5. **Soteriologia** — A salvação é pela graça mediante a fé em Cristo Jesus, não por obras (Ef 2:8-9). Inclui arrependimento, novo nascimento e santificação progressiva.
6. **Escatologia** — Crença no arrebatamento da Igreja antes da Grande Tribulação (pré-tribulacionismo), milênio literal, juízo final e eternidade.
7. **Eclesiologia** — A Igreja é o Corpo de Cristo, composta por todos os salvos, com ordenanças de Batismo por imersão e Santa Ceia.
8. **Cura Divina** — Jesus ainda cura hoje, sendo a cura divina um benefício da expiação (Is 53:4-5).

## ESTRUTURA OBRIGATÓRIA DA PREGAÇÃO
Gere a pregação completa com:
- **Texto Base**: Referência bíblica principal com o versículo transcrito
- **Tema Central**: Título claro e impactante
- **Introdução**: Contextualização histórica do texto, capturando a atenção
- **Desenvolvimento**: 3 a 5 pontos bem fundamentados, cada um com:
  - Subtítulo claro
  - Versículos de sustentação (citados integralmente)
  - Explicação exegética com contexto original (hebraico/grego quando relevante)
  - Aplicação prática e contemporânea
  - Ilustração ou exemplo pastoral
- **Ministração**: Frases de impacto espiritual para o momento de altar
- **Conclusão**: Apelo, convite à decisão e oração de encerramento
- **Aplicação Prática**: 3-5 pontos de ação para a semana

## 📖 REFERÊNCIAS BÍBLICAS COMPLEMENTARES
Ao final, inclua seção "## 📖 Referências Bíblicas Complementares" com 10-15 versículos adicionais conectados ao tema, cada um com:
- Referência completa
- Texto do versículo
- Conexão com o tema

## DIRETRIZES DE ESTILO
- Use linguagem reverente, ungida e acessível
- Mantenha fidelidade à tradução Almeida Revista e Corrigida ou NVI
- Inclua referências cruzadas entre Antigo e Novo Testamento
- Valorize a atualidade dos dons espirituais e a experiência pentecostal
- Formate usando markdown com títulos (##), subtítulos (###), negrito (**) e listas
- NUNCA contradiga as doutrinas fundamentais das Assembleias de Deus`;

const CGADB_CHAT_SYSTEM = `Você é um professor de teologia pentecostal formado pela grade curricular da CGADB (Convenção Geral das Assembleias de Deus no Brasil). O usuário gerou uma pregação e quer aprofundar o estudo.

## SUA ESPECIALIDADE
- Hermenêutica e exegese bíblica pentecostal
- Homilética (ciência da pregação)
- Teologia Sistemática alinhada com o Credo das Assembleias de Deus
- Contexto histórico-cultural dos textos bíblicos
- Línguas originais (hebraico e grego bíblico)
- Aplicação pastoral contemporânea

## COMO RESPONDER
- Cite versículos relevantes com referência completa
- Quando pertinente, explique termos no original (hebraico/grego)
- Sugira referências cruzadas e paralelos bíblicos
- Mantenha alinhamento doutrinário com as Assembleias de Deus (CGADB)
- Use markdown para formatar (negrito, listas, títulos)
- Seja didático, profundo e pastoral ao mesmo tempo
- Ao sugerir adaptações, mantenha a integridade doutrinária

## TEMAS QUE DOMINA
- Adaptação de pregações para diferentes públicos (jovens, casais, crianças, líderes)
- Aprofundamento exegético de passagens específicas
- Contextualização histórica e arqueológica
- Conexões tipológicas entre AT e NT
- Aplicações práticas e ilustrações pastorais
- Estrutura homilética (narrativa, textual, temática, expositiva)`;

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

    const { tema, publico, tempo, nivel, estrutura, ocasiao, tom, mode, messages: chatMessages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let messages: { role: string; content: string }[];

    if (mode === "chat") {
      messages = [
        { role: "system", content: CGADB_CHAT_SYSTEM },
        ...(chatMessages || []),
      ];
    } else {
      if (!tema || typeof tema !== "string" || tema.trim().length === 0) {
        return new Response(JSON.stringify({ error: "Tema é obrigatório" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const publicoMap: Record<string, string> = {
        igreja: "Culto de Domingo na Igreja",
        jovens: "Congresso ou Culto de Jovens",
        cruzada: "Cruzada Evangelística (público misto, muitos não-convertidos)",
        congresso: "Congresso de Obreiros e Líderes",
        casais: "Culto ou Retiro de Casais",
      };

      const nivelMap: Record<string, string> = {
        exortacao: "Exortação — tom de encorajamento e fortalecimento espiritual",
        avivamento: "Avivamento — tom de fogo, mover do Espírito Santo, renovação",
        ensino: "Ensino Expositivo — tom didático, aprofundamento teológico, estudo expositivo",
        evangelismo: "Evangelismo — tom de salvação, apelo aos não-convertidos",
        devocional: "Devocional — tom íntimo, meditativo, voltado à comunhão pessoal com Deus",
        profetico: "Profético — tom de urgência, declaração da vontade de Deus, chamado à santidade",
      };

      const estruturaMap: Record<string, string> = {
        textual: "Textual — pontos extraídos diretamente do texto bíblico base",
        tematica: "Temática — organizada ao redor de um tema central com textos de apoio",
        expositiva: "Expositiva — análise versículo a versículo do texto base",
        narrativa: "Narrativa — conduz o ouvinte por uma história bíblica com aplicações",
        topica: "Tópica — aborda um tópico doutrinário com múltiplas referências",
      };

      const ocasiaoMap: Record<string, string> = {
        culto_domingo: "Culto Regular de Domingo",
        culto_oracao: "Culto de Oração / Meio de Semana",
        santa_ceia: "Celebração da Santa Ceia",
        batismo: "Culto de Batismo",
        casamento: "Cerimônia de Casamento",
        funeral: "Funeral / Celebração de Vida",
        dedicacao: "Dedicação de Crianças",
        vigilia: "Vigília de Oração",
        semana_santa: "Semana Santa / Páscoa",
        natal: "Celebração de Natal",
        ano_novo: "Celebração de Ano Novo / Virada",
        missoes: "Conferência de Missões",
      };

      const tomMap: Record<string, string> = {
        encorajamento: "Encorajamento — fortalecer a fé e dar esperança",
        consolacao: "Consolação — acolher e consolar os que sofrem",
        confrontacao: "Confrontação Amorosa — desafiar à mudança com amor",
        celebracao: "Celebração — louvor, gratidão e alegria no Senhor",
        urgencia: "Urgência Espiritual — senso de tempo, preparo para a volta de Cristo",
        reflexao: "Reflexão Profunda — levar à introspecção e meditação espiritual",
      };

      let configLines = [
        `- **Tema**: ${tema.trim()}`,
        `- **Público-alvo**: ${publicoMap[publico] || publico || "Culto de Domingo na Igreja"}`,
        `- **Tempo de pregação**: ${tempo || "30"} minutos`,
        `- **Estilo/Abordagem**: ${nivelMap[nivel] || nivel || "Ensino Expositivo"}`,
      ];
      if (estrutura && estruturaMap[estrutura]) configLines.push(`- **Estrutura Homilética**: ${estruturaMap[estrutura]}`);
      if (ocasiao && ocasiaoMap[ocasiao]) configLines.push(`- **Ocasião/Evento**: ${ocasiaoMap[ocasiao]}`);
      if (tom && tomMap[tom]) configLines.push(`- **Tom Emocional**: ${tomMap[tom]}`);

      const userPrompt = `Gere uma pregação completa com as seguintes configurações:\n${configLines.join("\n")}\n\nSiga rigorosamente a estrutura e as diretrizes doutrinais definidas. A pregação deve estar pronta para ser ministrada no púlpito.`;

      messages = [
        { role: "system", content: CGADB_SERMON_SYSTEM },
        { role: "user", content: userPrompt },
      ];
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
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
