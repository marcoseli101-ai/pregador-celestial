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
// O sistema abre automaticamente o tutorial para os usuários quando esta versão é alterada!
export const DEPLOY_VERSION = "2026-10-24-v6-ebd-epigrafe-parity";

// Lista detalhada de todas as novidades implementadas para usuários existentes
export const TODAY_FEATURES: FeatureItem[] = [
  {
    id: "verse-dock-tools",
    title: "Dock Flutuante de Versículos & 9 Ferramentas ⚡",
    description:
      "Ao selecionar qualquer versículo ou conjunto de versículos, uma barra flutuante surge na parte inferior com 9 ferramentas instantâneas: Me Explica com IA, Comparar (ARC, ACF, NVI, NTLH), Referências Cruzadas, Marcar em 6 cores com persistência, Temas Bíblicos, Anotar, Copiar, Compartilhar e Gerador de Imagem comemorativa.",
    icon: "Sparkles",
    badge: "Novo",
    howToTest:
      "Na página da Bíblia, clique em qualquer versículo ou selecione um intervalo para abrir a dock de ferramentas.",
    path: "/estudo-biblico",
    targetSelector: "[data-tour='bible-books-grid']",
  },
  {
    id: "epigraph-study-system",
    title: "Estudo Profundo da Epígrafe com IA 📖",
    description:
      "Agora cada epígrafe/título de perícope da Bíblia possui o botão '[Estudar]'. Ao clicar, você acessa uma análise teológica estruturada com: Contexto Histórico, Local e Cenário, Personagens, Objetivo da passagem, Conexão com Cristo e Lições Práticas, tudo integrado com o Assistente Teológico.",
    icon: "BookOpen",
    badge: "Exclusivo",
    howToTest:
      "Abra qualquer capítulo da Bíblia (ex: Levítico 4 ou Mateus 1) e clique no botão 'Estudar' ao lado da epígrafe amarela.",
    path: "/estudo-biblico",
    targetSelector: "[data-tour='bible-books-grid']",
  },
  {
    id: "escola-biblica-dominical",
    title: "Escola Bíblica Dominical (EBD) com IA 🎓",
    description:
      "Nova aba completa da EBD (/ebd) com revistas para Adultos, Jovens e Discipulado. Traz Texto Áureo, Verdade Prática, Leitura em Classe, Tópicos I, II, III com subtópicos, Perguntas de Fixação e bloco de anotações do professor com salvamento automático. Inclui ferramentas de IA para gerar Plano de Aula de 50 min, 2 Dinâmicas quebra-gelo, Perguntas de debate e Ilustrações homiléticas.",
    icon: "GraduationCap",
    badge: "Novo Módulo",
    howToTest:
      "Acesse o menu 'Academia' -> 'Escola Bíblica (EBD)' ou vá para /ebd e explore as lições e a barra de apoio com IA ao professor.",
    path: "/ebd",
  },
  {
    id: "harpa-crista-640",
    title: "Harpa Cristã Completa (640 Hinos) 🎵",
    description:
      "Todos os 640 hinos tradicionais da Harpa Cristã com letras completas, cifras para ministério de louvor e busca ágil por número ou tema.",
    icon: "Music",
    badge: "640 Hinos",
    howToTest:
      "Acesse a Harpa Cristã no menu 'Estudo Bíblico' e busque por hinos como 15 (Foi na Cruz) ou 545.",
    path: "/harpa",
  },
  {
    id: "offline-mode",
    title: "Modo Offline & Downloads em IndexedDB 📥",
    description:
      "Baixe a Bíblia completa e os 640 hinos da Harpa diretamente na memória do seu aparelho para estudar e ministrar mesmo em locais sem internet.",
    icon: "DownloadCloud",
    badge: "Offline",
    howToTest:
      "Abra a página 'Modo Offline' (/downloads) e baixe a Bíblia e Harpa com um clique.",
    path: "/downloads",
  },
  {
    id: "daily-engagement-hub",
    title: "Hub Diário com Gerador de Artes e Reflexão 🌅",
    description:
      "Novo painel na tela inicial com versículo do dia, reflexão bíblica, progresso anual de leitura e criador de imagens personalizadas para redes sociais.",
    icon: "Calendar",
    badge: "Visual",
    howToTest:
      "Na página inicial, role até a seção devocional e clique em 'Criar Imagem' no versículo do dia.",
    path: "/",
  },
];

// FLUXO 1: Tutorial Completo da Aplicação (Para novos usuários)
export const FULL_APP_TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    title: "Bem-vindo ao Pregador Fiel! 👋",
    description:
      "Sua plataforma completa para estudo bíblico exegético, preparação de sermões, escola bíblica e ministração da Palavra. Vamos conhecer as principais ferramentas?",
    placement: "center",
  },
  {
    id: "navigation",
    title: "Navegação por Menus Agrupados 🧭",
    description:
      "Acesse de forma organizada: Estudo Bíblico, Pregação e Academia através dos menus no topo ou pela barra de navegação no rodapé móvel.",
    path: "/",
    targetSelector: "[data-tour='main-nav']",
    placement: "center",
  },
  {
    id: "bible-reading",
    title: "Bíblia com Estudo de Epígrafe & Dock Flutuante 📖",
    description:
      "Leia a Bíblia com epígrafes explicadas (botão 'Estudar' com contexto histórico e cristologia) e selecione versículos para abrir a dock com 9 ferramentas: Me Explica, Comparar versões, Referências, Temas, Marcação colorida, Anotações e Criador de Imagem.",
    path: "/estudo-biblico",
    targetSelector: "[data-tour='bible-books-grid']",
    howToTest: "Abra qualquer capítulo e clique em um versículo ou no botão 'Estudar' da epígrafe.",
    placement: "center",
  },
  {
    id: "ebd-module",
    title: "Escola Bíblica Dominical (EBD) com IA 🎓",
    description:
      "Módulo completo de lições com Texto Áureo, Verdade Prática, leitura em classe e apoio inteligente com IA para gerar planos de aula de 50 min, dinâmicas quebra-gelo e perguntas de debate.",
    path: "/ebd",
    howToTest: "Acesse /ebd para navegar pelas revistas de Adultos, Jovens e Discipulado.",
    placement: "center",
  },
  {
    id: "sermon-generator",
    title: "Estruturador de Esboços com Edição Livre 📜",
    description:
      "Estruture sermões homiléticos exegéticos com base bíblica sólida. Após a estruturação, edite o texto livremente com o botão 'Editar' e utilize o Modo Púlpito para ministração sem distrações.",
    path: "/gerador-pregacoes",
    targetSelector: "[data-tour='sermon-generator-form']",
    howToTest: "Defina o tema e estruture sermões ricos prontos para o púlpito.",
    placement: "center",
  },
  {
    id: "harpa-offline",
    title: "Harpa Cristã (640 Hinos) & Modo Offline 🎵",
    description:
      "Hinos cifrados para momentos de louvor e adoração, além do recurso de download local para leitura bíblica sem internet.",
    path: "/harpa",
    placement: "center",
  },
  {
    id: "help-center",
    title: "Central de Novidades & Ajuda 💡",
    description:
      "Você pode rever este tutorial ou conferir o histórico de melhorias a qualquer momento clicando no botão 'Novidades' no topo.",
    path: "/",
    targetSelector: "[data-tour='tour-button']",
    placement: "center",
  },
];

// FLUXO 2: Tour Interativo das Novidades (Para usuários que já conhecem o sistema)
export const WHATS_NEW_TOUR_STEPS: TourStep[] = [
  {
    id: "intro-whats-new",
    title: "Novidades desta Atualização! 🚀",
    description:
      "Chegaram os novos recursos: Dock Flutuante de Versículos, Estudo Teológico da Epígrafe, Escola Bíblica Dominical (EBD) com IA e centralização aprimorada de interface.",
    placement: "center",
  },
  {
    id: "step-verse-dock",
    title: "1. Dock Flutuante de Versículos ⚡",
    description:
      "Toque nos versículos para abrir instantaneamente o menu inferior com 9 ferramentas: Me Explica, Comparar, Referências, Marcar (6 cores), Temas, Anotar, Copiar, Compartilhar e Imagem.",
    path: "/estudo-biblico",
    targetSelector: "[data-tour='bible-books-grid']",
    howToTest: "Abra a Bíblia e clique sobre qualquer versículo.",
    placement: "center",
  },
  {
    id: "step-epigraph",
    title: "2. Estudo da Epígrafe com IA 📖",
    description:
      "Clique no botão 'Estudar' ao lado das epígrafes amarelas para abrir a análise de contexto histórico, personagens, local, cenário e conexão cristológica.",
    path: "/estudo-biblico",
    targetSelector: "[data-tour='bible-books-grid']",
    howToTest: "Acesse a Bíblia e clique no botão 'Estudar' de uma epígrafe.",
    placement: "center",
  },
  {
    id: "step-ebd",
    title: "3. Escola Bíblica Dominical (EBD) 🎓",
    description:
      "Novo módulo de EBD com lições das revistas de Adultos, Jovens e Discipulado, anotações salvas do professor e gerador de planos de aula e dinâmicas com IA.",
    path: "/ebd",
    howToTest: "Navegue para /ebd ou acesse pelo menu Academia.",
    placement: "center",
  },
];
