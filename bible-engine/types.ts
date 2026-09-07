// ============================================================
// TIPOS DO MOTOR DA PÁGINA "BÍBLIA" — PREGADOR.SITE
// ============================================================

export interface VerseRef {
  book: string; // slug do livro, ex: "mateus"
  bookLabel: string; // nome exibido, ex: "Mateus"
  chapter: number;
  verse: number;
  verseEnd?: number; // para ranges, ex: Mateus 22:1-14
}

export interface TranslationInfo {
  code: string; // ex: "ARC"
  label: string; // ex: "Almeida Revista e Corrigida"
  source: "abibliadigital" | "midvash"; // provedor de onde o texto é buscado
  sourceCode: string; // código do provedor para essa versão
  requiresAttribution: boolean; // true para versões com direitos autorais ativos (NVI, NAA, NTLH, NVT)
  attributionNote?: string;
}

export interface VerseText {
  ref: VerseRef;
  translationCode: string;
  text: string;
}

// ------------------------------------------------------------
// Cache key: sempre verseRef + translationCode, nunca variando
// por usuário — a resposta é igual para todo mundo (Regra do
// usuário: "deve ser fixo... entregar a mesma resposta a todos").
// ------------------------------------------------------------
export interface CacheKeyInput {
  ref: VerseRef;
  translationCode: string;
}

export interface VerseExplanation {
  refKey: string; // ex: "mateus.22.1__ARC"
  translationCode: string;
  title: string;
  resumo: string;
  contextoImediato: string;
  observacoesLinguisticas: string;
  referenciasCruzadas: string; // texto explicativo (as referências "cruas" ficam em CrossReferenceSet)
  aplicacaoPratica: string;
  fontesParaEstudo: string[]; // obras consultadas, citadas apenas como fonte, não transcritas
  formatted: string; // texto final montado com todas as seções
  createdAt: string;
}

export interface CrossReference {
  ref: VerseRef;
  refLabel: string; // ex: "Salmo 45:6-9"
  relationType: "tematica" | "profetica" | "doutrinaria" | "textual" | "tipologica";
  reason: string; // explicação curta de por que essa referência se conecta
}

export interface CrossReferenceSet {
  refKey: string;
  references: CrossReference[];
  createdAt: string;
}

export interface ThemeSuggestion {
  theme: string;
  reason: string; // por que esse tema se aplica a este versículo específico
}

export interface ThemeSuggestionSet {
  refKey: string;
  themes: ThemeSuggestion[];
  createdAt: string;
}

// ------------------------------------------------------------
// Comparação de versões — incremental, nunca automática total
// ------------------------------------------------------------
export interface CompareRequest {
  ref: VerseRef;
  baseTranslation: string;
  compareWith: string[]; // sempre explícito: nunca todas por padrão
  compareAll?: boolean; // só true se o usuário pedir explicitamente
}

export interface CompareResult {
  ref: VerseRef;
  versions: VerseText[];
}

// ------------------------------------------------------------
// Marcação e anotação (dados pessoais do usuário)
// ------------------------------------------------------------
export type HighlightColor =
  | "yellow"
  | "green"
  | "blue"
  | "orange"
  | "red"
  | "pink"
  | "purple"
  | "brown"
  | "gray"
  | "none";

export interface Highlight {
  userId: string;
  ref: VerseRef;
  translationCode: string;
  color: HighlightColor;
}

export interface Note {
  userId: string;
  ref: VerseRef;
  translationCode: string;
  text: string;
  updatedAt: string;
}

// ------------------------------------------------------------
// Notificação de novidades
// ------------------------------------------------------------
export interface FeatureAnnouncement {
  id: string; // ex: "biblia-v2-2026-09"
  title: string;
  message: string;
  features: string[];
}
