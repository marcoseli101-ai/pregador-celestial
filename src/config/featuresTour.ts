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

// Atualize esta constante sempre que houver novas funcionalidades ou melhorias
export const DEPLOY_VERSION = "2026-09-07-v3";

// Lista detalhada de todas as novidades implementadas para usuários existentes
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
    targetSelector: "[data-tour='bible-books-grid']",
  },
  {
    id: "pulpit-reading-mode",
    title: "Modo Púlpito Imersivo & Tipografia Editorial",
    description:
      "Leitura bíblica com tipografia Lora em 20px, entrelinhas de alto conforto, menu lateral flutuante e marca d'água sagrada.",
    icon: "ScrollText",
    badge: "Imersivo",
    howToTest:
      "Abra qualquer capítulo da Bíblia para experimentar a visualização sem distrações otimizada para estudo e pregação.",
    path: "/estudo-biblico",
    targetSelector: "[data-tour='bible-books-grid']",
  },
  {
    id: "sermon-generator-rules",
    title: "Motor Homilético Oficial do Gerador de Esboços",
    description:
      "Esboços com 6 arquiteturas (Expositiva, Textual, Temática, Doutrinária, Evangelística, Estudo Bíblico), rigor bíblico e tela cheia para ministração.",
    icon: "Sparkles",
    badge: "Reformulado",
    howToTest:
      "Acesse o 'Gerador de Esboços', preencha seu tema e gere um sermão pronto com visualização em Modo Púlpito.",
    path: "/gerador-pregacoes",
    targetSelector: "[data-tour='sermon-generator-form']",
  },
  {
    id: "global-search-cmd-k",
    title: "Busca Global Instantânea (Cmd/Ctrl + K)",
    description:
      "Pressione Ctrl+K (ou Cmd+K no Mac) em qualquer tela para abrir a busca universal de ferramentas, livros e conteúdos.",
    icon: "GitCompare",
    badge: "Atalho",
    howToTest:
      "Pressione Ctrl+K no teclado ou clique no botão de busca no topo para navegar instantaneamente.",
    path: "/",
    targetSelector: "[data-tour='global-search-btn']",
  },
  {
    id: "glassmorphism-glow",
    title: "Glassmorphism Refinado & Iluminação Celestial",
    description:
      "Design Editorial Sagrado Moderno com desfoque de vidro suave, cartões com bordas douradas e botão neon pulsante.",
    icon: "Sparkles",
    badge: "Design",
    howToTest:
      "Navegue pela página inicial para conferir a iluminação celestial e os efeitos de profundidade.",
    path: "/",
  },
];

// FLUXO 1: Tutorial Completo da Aplicação (Para novos usuários)
export const FULL_APP_TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    title: "Bem-vindo ao Pregador Pro! 👋",
    description:
      "Sua plataforma completa para estudo bíblico exegético, preparação de sermões e crescimento ministerial. Vamos fazer um tour guiado pelas principais ferramentas?",
    placement: "center",
  },
  {
    id: "navigation",
    title: "Navegação por Menus Agrupados 🧭",
    description:
      "Acesse de forma organizada: Estudo Bíblico, Pregação e Academia através dos menus dropdown no topo ou pela barra móvel no rodapé.",
    path: "/",
    targetSelector: "[data-tour='main-nav']",
    placement: "bottom",
  },
  {
    id: "bible-reading",
    title: "Bíblia Sagrada & 13 Traduções 📖",
    description:
      "Navegue pelos 66 livros da Bíblia com contagem de capítulos, barra de progresso e alterne entre 13 versões consagradas (ARC, NVI, ACF, ARA, etc.).",
    path: "/estudo-biblico",
    targetSelector: "[data-tour='bible-books-grid']",
    howToTest: "Clique em qualquer livro para abrir os capítulos e ler na sua tradução preferida.",
    placement: "top",
  },
  {
    id: "sermon-generator",
    title: "Gerador de Esboços & Modo Púlpito 📜",
    description:
      "Crie sermões fiéis à Palavra com divisões claras, aplicações práticas e visualize em tela cheia no Modo Púlpito com cronômetro ao vivo.",
    path: "/gerador-pregacoes",
    targetSelector: "[data-tour='sermon-generator-form']",
    howToTest: "Preencha o tema, selecione o estilo e clique em 'Gerar Pregação'.",
    placement: "top",
  },
  {
    id: "global-search",
    title: "Busca Global Rápida ⚡",
    description:
      "Encontre rapidamente qualquer livro, sermão ou ferramenta pressionando Ctrl+K (ou Cmd+K) no teclado a qualquer momento.",
    path: "/",
    targetSelector: "[data-tour='global-search-btn']",
    howToTest: "Pressione Ctrl+K para abrir a paleta de comandos rápida.",
    placement: "bottom",
  },
  {
    id: "help-center",
    title: "Central de Novidades & Ajuda 💡",
    description:
      "Você pode rever este tutorial ou conferir as novidades de cada atualização clicando no botão 'Novidades' no topo.",
    path: "/",
    targetSelector: "[data-tour='tour-button']",
    placement: "bottom",
  },
];

// FLUXO 2: Tour Interativo das Novidades (Para usuários que já conhecem o sistema)
export const WHATS_NEW_TOUR_STEPS: TourStep[] = [
  {
    id: "intro-whats-new",
    title: "Novidades do Deploy! 🚀",
    description:
      "Confira as melhorias e novos recursos adicionados na plataforma: 13 versões bíblicas, Modo Púlpito imersivo, novo motor homilético e busca global.",
    placement: "center",
  },
  {
    id: "step-bible-versions",
    title: "1. Leitura Bíblica com 13 Versões 📖",
    description:
      "Os 66 livros da Bíblia agora contam com o seletor integrado de 13 traduções bíblicas e visualização imersiva em Modo Púlpito.",
    path: "/estudo-biblico",
    targetSelector: "[data-tour='bible-books-grid']",
    howToTest: "Abra um capítulo na Bíblia para alternar entre as 13 versões consagradas.",
    placement: "top",
  },
  {
    id: "step-sermon-motor",
    title: "2. Novo Motor Homilético do Gerador 📜",
    description:
      "O Gerador de Esboços foi aprimorado com 6 arquiteturas e botões para visualizar o sermão gerado no Modo Púlpito em tela cheia.",
    path: "/gerador-pregacoes",
    targetSelector: "[data-tour='sermon-generator-form']",
    howToTest: "Acesse o gerador para criar mensagens profundas e estruturadas.",
    placement: "top",
  },
  {
    id: "step-search",
    title: "3. Busca Universal com Atalho ⚡",
    description:
      "Pesquise e acesse ferramentas e livros rapidamente com o atalho Ctrl+K ou clicando no campo de busca.",
    path: "/",
    targetSelector: "[data-tour='global-search-btn']",
    placement: "bottom",
  },
];
