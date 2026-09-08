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
export const DEPLOY_VERSION = "2026-09-08-v4-multi-verse-edit";

// Lista detalhada de todas as novidades implementadas para usuários existentes
export const TODAY_FEATURES: FeatureItem[] = [
  {
    id: "multi-verse-tools",
    title: "Seleção Múltipla de Versículos nas Ferramentas 📖",
    description:
      "Agora você pode selecionar vários versículos consecutivos (um intervalo, ex: Marcos 5:25-29) e usar todas as 7 ferramentas exegéticas (Me Explica, Comparar, Referências, Temas, Marcar, Anotar, Copiar) no trecho completo.",
    icon: "GitCompare",
    badge: "Novo",
    howToTest:
      "Na página Bíblia, toque em um primeiro versículo e depois toque em um versículo posterior para selecionar o intervalo completo.",
    path: "/estudo-biblico",
    targetSelector: "[data-tour='bible-books-grid']",
  },
  {
    id: "sermon-live-edit",
    title: "Edição Livre de Esboços Pós-Geração ✏️",
    description:
      "Após gerar seu sermão, use o novo botão 'Editar' para personalizar, acrescentar ou reescrever qualquer divisão ou anotação diretamente na interface.",
    icon: "Sparkles",
    badge: "Novo",
    howToTest:
      "Gere um esboço no Gerador de Pregações e clique em 'Editar Esboço' para alterar o texto livremente antes de salvar ou ministrar.",
    path: "/gerador-pregacoes",
    targetSelector: "[data-tour='sermon-generator-form']",
  },
  {
    id: "bible-reader-13-versions",
    title: "13 Versões da Bíblia na Leitura Principal",
    description:
      "Alterne instantaneamente entre 13 traduções (ARC, ACF, ARA, NVI, NVT, NAA, NTLH, KJA, AME, KJV, BBE, RVR e AA) no cabeçalho de qualquer capítulo.",
    icon: "BookOpen",
    badge: "Atualizado",
    howToTest:
      "Acesse a aba 'Bíblia', abra qualquer livro/capítulo e clique no seletor de versões no topo para ler na versão de sua preferência.",
    path: "/estudo-biblico",
    targetSelector: "[data-tour='bible-books-grid']",
  },
  {
    id: "pulpit-reading-mode",
    title: "Modo Púlpito Imersivo & Tipografia Editorial",
    description:
      "Leitura bíblica e de esboços com tipografia Lora em 20px, entrelinhas de alto conforto, menu lateral flutuante e visualização sem distrações.",
    icon: "ScrollText",
    badge: "Imersivo",
    howToTest:
      "Abra qualquer capítulo da Bíblia ou esboço homilético para experimentar a visualização em tela cheia otimizada para o púlpito.",
    path: "/estudo-biblico",
    targetSelector: "[data-tour='bible-books-grid']",
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
    title: "Bíblia Sagrada & Seleção Múltipla de Versículos 📖",
    description:
      "Navegue pelos 66 livros em 13 versões consagradas. Ao tocar nos versículos, você pode selecionar um ou múltiplos versículos em intervalo (ex: Marcos 5:25-29) e usar as 7 ferramentas exegéticas (Me Explica, Comparar, Referências, Temas, Marcar, Anotar e Copiar) no bloco completo.",
    path: "/estudo-biblico",
    targetSelector: "[data-tour='bible-books-grid']",
    howToTest: "Clique em qualquer livro para abrir os capítulos e experimentar a seleção de versículos.",
    placement: "top",
  },
  {
    id: "sermon-generator",
    title: "Gerador de Esboços com Edição Livre & Modo Púlpito 📜",
    description:
      "Crie sermões fiéis e exegéticos com divisões claras e sem apelo/oração automáticos. Após a geração, edite o texto livremente com o botão 'Editar' e visualize em tela cheia no Modo Púlpito.",
    path: "/gerador-pregacoes",
    targetSelector: "[data-tour='sermon-generator-form']",
    howToTest: "Preencha o tema, gere o esboço e personalize qualquer trecho com a edição livre.",
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
    title: "Novidades desta Atualização! 🚀",
    description:
      "Confira os novos recursos: seleção de múltiplos versículos nas ferramentas da Bíblia, edição livre de esboços gerados e motor homilético aprimorado.",
    placement: "center",
  },
  {
    id: "step-multi-verse",
    title: "1. Seleção Múltipla de Versículos na Bíblia 📖",
    description:
      "Agora você pode tocar no primeiro versículo e estender a seleção até um versículo posterior (ex: Marcos 5:25-29). Todas as 7 ferramentas (Me Explica, Comparar, Referências, Temas, Marcar, Anotar e Copiar) atuam sobre o intervalo inteiro!",
    path: "/estudo-biblico",
    targetSelector: "[data-tour='bible-books-grid']",
    howToTest: "Abra um capítulo bíblico e selecione um trecho de versículos para testar.",
    placement: "top",
  },
  {
    id: "step-sermon-edit",
    title: "2. Edição Livre de Esboços Gerados ✏️",
    description:
      "Após a geração do sermão, clique no botão 'Editar' para modificar, adicionar ou reescrever qualquer parte livremente antes de salvar ou ministrar.",
    path: "/gerador-pregacoes",
    targetSelector: "[data-tour='sermon-generator-form']",
    howToTest: "Acesse o gerador para criar mensagens e editar seu texto.",
    placement: "top",
  },
  {
    id: "step-bible-versions",
    title: "3. Leitura Bíblica com 13 Versões 📖",
    description:
      "Alterne instantaneamente entre as 13 traduções consagradas e aproveite o Modo Púlpito para ministração.",
    path: "/estudo-biblico",
    targetSelector: "[data-tour='bible-books-grid']",
    placement: "top",
  },
];
