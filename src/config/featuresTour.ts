// ============================================================
// CONFIGURAÇÃO CENTRALIZADA DE NOVIDADES E TOURS DA PLATAFORMA
// ============================================================

export interface TourStep {
  id: string;
  title: string;
  description: string;
  targetSelector?: string; // Seletor CSS para foco/spotlight
  howToTest?: string;
  path?: string; // Rota para navegar se necessário
  badge?: string;
  placement?: "top" | "bottom" | "left" | "right" | "center";
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: string; // Nome do ícone
  badge: string;
  howToTest: string;
  path: string;
  targetSelector?: string;
}

export const DEPLOY_VERSION = "2026-09-06-v2";

// Lista detalhada de todas as novidades implementadas no deploy de hoje
export const TODAY_FEATURES: FeatureItem[] = [
  {
    id: "bible-reader-13-versions",
    title: "13 Versões da Bíblia na Leitura Principal",
    description:
      "Alterne instantaneamente entre 13 traduções (ARC, ACF, ARA, NVI, NVT, NAA, NTLH, KJA, AME, KJV, BBE, RVR e AA) no cabeçalho de qualquer capítulo.",
    icon: "BookOpen",
    badge: "Novo",
    howToTest:
      "Acesse a aba 'Bíblia', abra qualquer livro/capítulo e clique no seletor de versões no topo para ler na versão de sua preferência.",
    path: "/estudo-biblico",
    targetSelector: "[data-tour='bible-version-selector']",
  },
  {
    id: "verse-tools-menu",
    title: "Menu Contextual de Ferramentas de Versículo",
    description:
      "Ao clicar em qualquer versículo, uma barra inteligente se abre com 7 ferramentas de aprofundamento bíblico.",
    icon: "Sparkles",
    badge: "Interativo",
    howToTest:
      "Na tela de leitura da Bíblia, dê um clique em qualquer versículo para abrir a barra de ferramentas.",
    path: "/estudo-biblico",
    targetSelector: "[data-tour='bible-verse-item']",
  },
  {
    id: "verse-tool-explain",
    title: "Ferramenta 'Me Explica' (Exegese IA)",
    description:
      "Gera uma exegese completa do versículo: Resumo, Contexto Histórico-Literário, Termos em Grego/Hebraico, Aplicação Prática e Fontes.",
    icon: "MessageCircleQuestion",
    badge: "IA Avançada",
    howToTest:
      "Clique em um versículo e selecione 'Me Explica' para receber uma análise profunda e instantânea.",
    path: "/estudo-biblico",
  },
  {
    id: "verse-tool-compare",
    title: "Comparador de 13 Traduções Bíblicas",
    description:
      "Compare o versículo selecionado com qualquer uma das 13 traduções disponíveis de forma pontual ou simultânea.",
    icon: "GitCompare",
    badge: "Essencial",
    howToTest:
      "Abra as ferramentas de um versículo, clique em 'Comparar' e selecione a tradução que deseja confrontar (ex: NVI, ARA, NVT).",
    path: "/estudo-biblico",
  },
  {
    id: "verse-tool-cross-ref-themes",
    title: "Referências Cruzadas e Sugestão de Temas",
    description:
      "Descubra versículos correlatos (classificados em Textual, Doutrinária e Profética) e ideias de temas bíblicos para pregações.",
    icon: "Link2",
    badge: "Homilética",
    howToTest:
      "Clique em 'Referências' ou 'Temas' nas ferramentas de qualquer versículo.",
    path: "/estudo-biblico",
  },
  {
    id: "sermon-generator-rules",
    title: "Novo Motor Homilético Oficial do Gerador de Esboços",
    description:
      "Esboços de sermões com 6 arquiteturas (Expositiva, Textual, Temática, Doutrinária, Evangelística, Estudo Bíblico), rigor bíblico pentecostal e zero superficialidade.",
    icon: "ScrollText",
    badge: "Reformulado",
    howToTest:
      "Acesse o 'Gerador de Esboços', preencha um tema (ex: 'O Poder da Oração') e gere um sermão estruturado pronto para o púlpito.",
    path: "/gerador-pregacoes",
    targetSelector: "[data-tour='sermon-generator-form']",
  },
];

// Passos do FLUXO 1: Tutorial Completo da Aplicação (Para novos usuários)
export const FULL_APP_TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    title: "Bem-vindo ao Pregador Pro! 👋",
    description:
      "Sua plataforma completa para estudo bíblico exegético, preparação de sermões bíblicos e crescimento ministerial. Vamos fazer um tour rápido?",
    placement: "center",
  },
  {
    id: "navigation",
    title: "Navegação Principal 🧭",
    description:
      "Acesse facilmente todas as áreas: Bíblia, Gerador de Esboços, Biblioteca Teológica, Curso de Teologia, Dicionário e muito mais através da barra de navegação.",
    targetSelector: "header nav, header [data-tour='mobile-menu']",
    placement: "bottom",
  },
  {
    id: "bible-reading",
    title: "Leitura Bíblica com 13 Versões 📖",
    description:
      "Leia e navegue pelos 66 livros da Bíblia. Agora você pode alternar facilmente entre 13 versões (ARC, NVI, ACF, ARA, NVT, KJA, etc.) em qualquer capítulo.",
    path: "/estudo-biblico",
    targetSelector: "[data-tour='bible-version-selector']",
    howToTest: "Clique no seletor no topo da leitura para trocar de versão instantaneamente.",
    placement: "bottom",
  },
  {
    id: "verse-tools",
    title: "Ferramentas Contextuais do Versículo ⚡",
    description:
      "Dê um clique em qualquer versículo para abrir opções poderosas: Me Explica (Exegese com IA), Comparar Traduções, Referências Cruzadas, Temas e Anotações.",
    path: "/estudo-biblico",
    targetSelector: "[data-tour='bible-verse-item']",
    howToTest: "Clique sobre o texto de qualquer versículo para ver a barra de ferramentas em ação.",
    placement: "top",
  },
  {
    id: "sermon-generator",
    title: "Gerador de Esboços Homiléticos 📜",
    description:
      "Crie sermões fiéis à Palavra, com 6 arquiteturas (Expositiva, Textual, Temática, Doutrinária, etc.) e estrutura pronta para ministrar no púlpito.",
    path: "/gerador-pregacoes",
    targetSelector: "[data-tour='sermon-generator-form']",
    howToTest: "Digite seu tema, selecione o estilo e clique em 'Gerar Pregação'.",
    placement: "top",
  },
  {
    id: "help-center",
    title: "Ajuda e Tour a Qualquer Momento 💡",
    description:
      "Você pode rever este tutorial ou conferir as novidades a qualquer momento clicando no botão de lâmpada/novidades.",
    placement: "center",
  },
];

// Passos do FLUXO 2: Mini Tour Interativo das Novidades de Hoje (Para usuários existentes)
export const WHATS_NEW_TOUR_STEPS: TourStep[] = [
  {
    id: "intro-whats-new",
    title: "Novidades do Deploy de Hoje! 🚀",
    description:
      "Preparamos atualizações incríveis para tornar seu estudo e preparação de mensagens ainda mais práticos e profundos. Vamos testar?",
    placement: "center",
  },
  {
    id: "step-bible-versions",
    title: "1. Seletor de 13 Versões na Leitura 📖",
    description:
      "No cabeçalho de cada capítulo, você agora tem o seletor com 13 traduções consagradas com carregamento ultra-rápido e memória de preferência.",
    path: "/estudo-biblico",
    targetSelector: "[data-tour='bible-version-selector']",
    howToTest: "Experimente selecionar uma versão como NVI ou ACF no topo.",
    placement: "bottom",
  },
  {
    id: "step-verse-tools",
    title: "2. Barra de Ferramentas ao Clicar no Versículo 🔍",
    description:
      "Ao clicar em qualquer versículo, você tem acesso imediato a 'Me Explica', 'Comparar', 'Referências', 'Temas', 'Marcar' e 'Anotar'.",
    path: "/estudo-biblico",
    targetSelector: "[data-tour='bible-verse-item']",
    howToTest: "Clique em um versículo e experimente a ferramenta 'Me Explica' ou 'Comparar'.",
    placement: "top",
  },
  {
    id: "step-sermon-motor",
    title: "3. Motor Homilético Oficial do Pregador 📜",
    description:
      "O Gerador de Esboços foi completamente reformulado com 6 arquiteturas e estrito alinhamento homilético sem superficialidades.",
    path: "/gerador-pregacoes",
    targetSelector: "[data-tour='sermon-generator-form']",
    howToTest: "Acesse o gerador para criar mensagens com nível elevado de fidelidade bíblica.",
    placement: "top",
  },
];
