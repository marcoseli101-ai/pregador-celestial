import { TranslationInfo } from "../types";

// ============================================================
// TRADUÇÕES DISPONÍVEIS
//
// IMPORTANTE SOBRE LICENÇAS:
// - ARC, ACF, AA/ARA são tradicionalmente tratadas como de uso mais
//   livre em projetos cristãos (embora ACF pertença formalmente à
//   Sociedade Bíblica Trinitariana).
// - NVI, NAA, NTLH, NVT pertencem a sociedades bíblicas (Bíblica Inc.,
//   Sociedade Bíblica do Brasil) e, tecnicamente, uso comercial em
//   grande escala pede licenciamento formal. Aqui elas são buscadas
//   via API pública gratuita (sem chave), mas isso NÃO é uma garantia
//   jurídica de uso irrestrito — recomenda-se exibir a atribuição
//   (requiresAttribution) e, se o site crescer muito, considerar
//   contato formal com a sociedade bíblica correspondente.
// - KJA e edições em inglês (KJV) têm status de uso mais aberto.
// ============================================================

export const TRANSLATIONS: TranslationInfo[] = [
  {
    code: "ARC",
    label: "Almeida Revista e Corrigida",
    source: "midvash",
    sourceCode: "arc",
    requiresAttribution: false,
  },
  {
    code: "ACF",
    label: "Almeida Corrigida Fiel",
    source: "midvash",
    sourceCode: "acf",
    requiresAttribution: true,
    attributionNote: "Sociedade Bíblica Trinitariana do Brasil",
  },
  {
    code: "ARA",
    label: "Almeida Revista e Atualizada",
    source: "midvash",
    sourceCode: "ara",
    requiresAttribution: true,
    attributionNote: "Sociedade Bíblica do Brasil",
  },
  {
    code: "AA",
    label: "Almeida Revisada Imprensa Bíblica",
    source: "midvash",
    sourceCode: "aa",
    requiresAttribution: false,
  },
  {
    code: "NAA",
    label: "Nova Almeida Atualizada",
    source: "midvash",
    sourceCode: "naa",
    requiresAttribution: true,
    attributionNote: "Sociedade Bíblica do Brasil",
  },
  {
    code: "NVI",
    label: "Nova Versão Internacional",
    source: "midvash",
    sourceCode: "nvi",
    requiresAttribution: true,
    attributionNote: "Bíblica, Inc.",
  },
  {
    code: "NVT",
    label: "Nova Versão Transformadora",
    source: "midvash",
    sourceCode: "nvt",
    requiresAttribution: true,
    attributionNote: "Mundo Cristão / Biblica",
  },
  {
    code: "NTLH",
    label: "Nova Tradução na Linguagem de Hoje",
    source: "midvash",
    sourceCode: "ntlh",
    requiresAttribution: true,
    attributionNote: "Sociedade Bíblica do Brasil",
  },
  {
    code: "KJA",
    label: "King James Atualizada",
    source: "midvash",
    sourceCode: "kja",
    requiresAttribution: true,
    attributionNote: "Abba Editora / BV Books",
  },
  {
    code: "AME",
    label: "Ave Maria",
    source: "midvash",
    sourceCode: "ave-maria",
    requiresAttribution: true,
    attributionNote: "Edições Ave Maria (tradição católica)",
  },
  {
    code: "KJV",
    label: "King James Version (inglês)",
    source: "midvash",
    sourceCode: "kjv",
    requiresAttribution: false,
  },
  {
    code: "BBE",
    label: "Bible in Basic English",
    source: "abibliadigital",
    sourceCode: "bbe",
    requiresAttribution: false,
  },
  {
    code: "RVR",
    label: "Reina Valera (espanhol)",
    source: "abibliadigital",
    sourceCode: "rvr",
    requiresAttribution: false,
  },
];

export function getTranslation(code: string): TranslationInfo | undefined {
  return TRANSLATIONS.find((t) => t.code.toUpperCase() === code.toUpperCase());
}

export function listTranslationCodes(): string[] {
  return TRANSLATIONS.map((t) => t.code);
}
