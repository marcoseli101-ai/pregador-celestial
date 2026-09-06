import { CrossReferenceSet, ThemeSuggestionSet, VerseExplanation, VerseRef } from "../types.ts";
import { buildCacheKey, verseRefLabel } from "./verseRef.ts";
import { fetchVerseText } from "./bibleApiClient.ts";
import {
  buildCrossReferenceSystemPrompt,
  buildCrossReferenceUserPrompt,
  buildExplanationSystemPrompt,
  buildExplanationUserPrompt,
  buildThemeSuggestionSystemPrompt,
  buildThemeSuggestionUserPrompt,
} from "./promptBuilder.ts";
import {
  SupabaseLikeClient,
  getCachedCrossReferences,
  getCachedExplanation,
  getCachedThemes,
  saveCrossReferences,
  saveExplanation,
  saveThemes,
} from "./cache.ts";

// ------------------------------------------------------------
// Cliente LLM — mesmo motor de IA usado no restante do site
// (Lovable AI Gateway → Google Gemini). A chave fica em secret
// da Edge Function (LOVABLE_API_KEY), nunca exposta no frontend.
// ------------------------------------------------------------
const AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash";

async function callOpenAIDirect(
  systemPrompt: string,
  userPrompt: string,
  apiKey: string,
  maxTokens = 2048
): Promise<string> {
  const models = ["gpt-4o-mini", "gpt-4o", "gpt-3.5-turbo"];
  let lastError = "";

  for (const model of models) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          max_tokens: maxTokens,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        lastError = `${response.status} - ${errText}`;
        continue;
      }

      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content?.trim() ?? "";
      if (text) return text;
    } catch (e: any) {
      lastError = e?.message || String(e);
    }
  }

  throw new Error(`Falha ao chamar OpenAI (ChatGPT): ${lastError}`);
}

async function callGeminiDirect(
  systemPrompt: string,
  userPrompt: string,
  apiKey: string,
  maxTokens = 2048
): Promise<string> {
  const models = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-3.6-flash"];
  let lastError = "";

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: [
            { role: "user", parts: [{ text: userPrompt }] },
          ],
          generationConfig: {
            maxOutputTokens: maxTokens,
            temperature: 0.3,
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        lastError = `${response.status} - ${errText}`;
        continue;
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
      if (text) return text;
    } catch (e: any) {
      lastError = e?.message || String(e);
    }
  }

  throw new Error(`Falha ao chamar Google Gemini: ${lastError}`);
}

async function callLovableGateway(
  systemPrompt: string,
  userPrompt: string,
  apiKey: string,
  maxTokens = 2048
): Promise<string> {
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Falha ao chamar Lovable AI Gateway (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content?.trim() ?? "";
  if (!text) {
    throw new Error("O modelo não retornou texto.");
  }
  return text;
}

async function callModel(
  systemPrompt: string,
  userPrompt: string,
  apiKey: string,
  maxTokens = 2048
): Promise<string> {
  const cleanKey = apiKey.replace(/^["']|["']$/g, "").trim();

  // OpenAI / ChatGPT key pattern
  if (cleanKey.startsWith("sk-proj-") || cleanKey.startsWith("sk-")) {
    try {
      return await callOpenAIDirect(systemPrompt, userPrompt, cleanKey, maxTokens);
    } catch (openAiErr: any) {
      // Fallback to Lovable Gateway if OpenAI fails
      try {
        return await callLovableGateway(systemPrompt, userPrompt, cleanKey, maxTokens);
      } catch {
        throw openAiErr;
      }
    }
  }

  // Google Gemini default
  return await callGeminiDirect(systemPrompt, userPrompt, cleanKey, maxTokens);
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
  apiKey: string,
  providedText?: string
): Promise<VerseExplanation> {
  const refKey = buildCacheKey(ref, translationCode);

  const cached = await getCachedExplanation(client, refKey);
  if (cached) return cached;

  let text = providedText || "";
  if (!text) {
    try {
      const verse = await fetchVerseText(ref, translationCode);
      text = verse.text;
    } catch {
      text = "";
    }
  }

  const raw = await callModel(
    buildExplanationSystemPrompt(),
    buildExplanationUserPrompt(ref, translationCode, text),
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
  apiKey: string,
  providedText?: string
): Promise<CrossReferenceSet> {
  const refKey = buildCacheKey(ref, translationCode);

  const cached = await getCachedCrossReferences(client, refKey);
  if (cached) return cached;

  let text = providedText || "";
  if (!text) {
    try {
      const verse = await fetchVerseText(ref, translationCode);
      text = verse.text;
    } catch {
      text = "";
    }
  }

  const raw = await callModel(
    buildCrossReferenceSystemPrompt(),
    buildCrossReferenceUserPrompt(ref, text),
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
  apiKey: string,
  providedText?: string
): Promise<ThemeSuggestionSet> {
  const refKey = buildCacheKey(ref, translationCode);

  const cached = await getCachedThemes(client, refKey);
  if (cached) return cached;

  let text = providedText || "";
  if (!text) {
    try {
      const verse = await fetchVerseText(ref, translationCode);
      text = verse.text;
    } catch {
      text = "";
    }
  }

  const raw = await callModel(
    buildThemeSuggestionSystemPrompt(),
    buildThemeSuggestionUserPrompt(ref, text),
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
