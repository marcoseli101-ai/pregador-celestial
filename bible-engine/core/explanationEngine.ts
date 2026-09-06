import { CrossReferenceSet, ThemeSuggestionSet, VerseExplanation, VerseRef } from "../types";
import { buildCacheKey, verseRefLabel } from "./verseRef";
import { fetchVerseText } from "./bibleApiClient";
import {
  buildCrossReferenceSystemPrompt,
  buildCrossReferenceUserPrompt,
  buildExplanationSystemPrompt,
  buildExplanationUserPrompt,
  buildThemeSuggestionSystemPrompt,
  buildThemeSuggestionUserPrompt,
} from "./promptBuilder";
import {
  SupabaseLikeClient,
  getCachedCrossReferences,
  getCachedExplanation,
  getCachedThemes,
  saveCrossReferences,
  saveExplanation,
  saveThemes,
} from "./cache";

// ------------------------------------------------------------
// Cliente LLM — mesmo motor de IA usado no restante do site
// (Lovable AI Gateway → Google Gemini). A chave fica em secret
// da Edge Function (LOVABLE_API_KEY), nunca exposta no frontend.
// ------------------------------------------------------------
const AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash";

async function callModel(
  systemPrompt: string,
  userPrompt: string,
  apiKey: string,
  maxTokens = 2048
): Promise<string> {
  const response = await fetch(AI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Falha ao chamar o modelo: ${response.status} ${errText}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content?.trim() ?? "";

  if (!text) {
    throw new Error("O modelo não retornou texto (possível bloqueio de segurança ou resposta vazia).");
  }

  return text;
}

// O modelo às vezes envolve JSON em ```json ... ``` mesmo quando
// instruído a não fazer isso. Esta função remove esses cercados
// antes do JSON.parse.
function stripJsonFences(raw: string): string {
  return raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

function parseSections(raw: string): Record<string, string> {
  const titles = [
    "Resumo",
    "Contexto Imediato",
    "Observações Linguísticas",
    "Referências Cruzadas",
    "Aplicação Prática",
    "Fontes para Estudo",
  ];

  const sections: Record<string, string> = {};
  for (let i = 0; i < titles.length; i++) {
    const start = raw.indexOf(titles[i]);
    if (start === -1) continue;
    const nextTitle = titles.slice(i + 1).find((t) => raw.indexOf(t, start + titles[i].length) !== -1);
    const end = nextTitle ? raw.indexOf(nextTitle, start + titles[i].length) : raw.length;
    sections[titles[i]] = raw.slice(start + titles[i].length, end).trim();
  }
  return sections;
}

function formatExplanation(ref: VerseRef, translationCode: string, sections: Record<string, string>): string {
  const label = verseRefLabel(ref);
  return [
    `Análise Exegética de ${label} (${translationCode})`,
    "",
    "Resumo",
    sections["Resumo"] || "",
    "",
    "Contexto Imediato",
    sections["Contexto Imediato"] || "",
    "",
    "Observações Linguísticas",
    sections["Observações Linguísticas"] || "",
    "",
    "Referências Cruzadas",
    sections["Referências Cruzadas"] || "",
    "",
    "Aplicação Prática",
    sections["Aplicação Prática"] || "",
    "",
    "Fontes para Estudo",
    sections["Fontes para Estudo"] || "",
  ].join("\n");
}

// ------------------------------------------------------------
// "Me Explica" — gera uma vez, cacheia, sempre retorna igual
// ------------------------------------------------------------
export async function getOrCreateExplanation(
  client: SupabaseLikeClient,
  ref: VerseRef,
  translationCode: string,
  apiKey: string
): Promise<VerseExplanation> {
  const refKey = buildCacheKey(ref, translationCode);

  const cached = await getCachedExplanation(client, refKey);
  if (cached) return cached;

  const verse = await fetchVerseText(ref, translationCode);

  const raw = await callModel(
    buildExplanationSystemPrompt(),
    buildExplanationUserPrompt(ref, translationCode, verse.text),
    apiKey
  );

  const sections = parseSections(raw);
  const formatted = formatExplanation(ref, translationCode, sections);

  const explanation: VerseExplanation = {
    refKey,
    translationCode,
    title: `Análise Exegética de ${verseRefLabel(ref)} (${translationCode})`,
    resumo: sections["Resumo"] || "",
    contextoImediato: sections["Contexto Imediato"] || "",
    observacoesLinguisticas: sections["Observações Linguísticas"] || "",
    referenciasCruzadas: sections["Referências Cruzadas"] || "",
    aplicacaoPratica: sections["Aplicação Prática"] || "",
    fontesParaEstudo: (sections["Fontes para Estudo"] || "")
      .split("\n")
      .map((s) => s.replace(/^-+\s*/, "").trim())
      .filter(Boolean),
    formatted,
    createdAt: new Date().toISOString(),
  };

  await saveExplanation(client, explanation);
  return explanation;
}

// ------------------------------------------------------------
// Referências cruzadas — gera uma vez, cacheia
// ------------------------------------------------------------
export async function getOrCreateCrossReferences(
  client: SupabaseLikeClient,
  ref: VerseRef,
  translationCode: string,
  apiKey: string
): Promise<CrossReferenceSet> {
  const refKey = buildCacheKey(ref, translationCode);

  const cached = await getCachedCrossReferences(client, refKey);
  if (cached) return cached;

  const verse = await fetchVerseText(ref, translationCode);

  const raw = await callModel(
    buildCrossReferenceSystemPrompt(),
    buildCrossReferenceUserPrompt(ref, verse.text),
    apiKey
  );

  let references: CrossReferenceSet["references"] = [];
  try {
    const parsed = JSON.parse(stripJsonFences(raw));
    references = (parsed.references || []).map((r: any) => ({
      ref: { book: "", bookLabel: r.refLabel, chapter: 0, verse: 0 },
      refLabel: r.refLabel,
      relationType: r.relationType,
      reason: r.reason,
    }));
  } catch {
    references = [];
  }

  const set: CrossReferenceSet = {
    refKey,
    references,
    createdAt: new Date().toISOString(),
  };

  await saveCrossReferences(client, set);
  return set;
}

// ------------------------------------------------------------
// Temas sugeridos — gera uma vez, cacheia
// ------------------------------------------------------------
export async function getOrCreateThemeSuggestions(
  client: SupabaseLikeClient,
  ref: VerseRef,
  translationCode: string,
  apiKey: string
): Promise<ThemeSuggestionSet> {
  const refKey = buildCacheKey(ref, translationCode);

  const cached = await getCachedThemes(client, refKey);
  if (cached) return cached;

  const verse = await fetchVerseText(ref, translationCode);

  const raw = await callModel(
    buildThemeSuggestionSystemPrompt(),
    buildThemeSuggestionUserPrompt(ref, verse.text),
    apiKey
  );

  let themes: ThemeSuggestionSet["themes"] = [];
  try {
    const parsed = JSON.parse(stripJsonFences(raw));
    themes = parsed.themes || [];
  } catch {
    themes = [];
  }

  const set: ThemeSuggestionSet = {
    refKey,
    themes,
    createdAt: new Date().toISOString(),
  };

  await saveThemes(client, set);
  return set;
}
