import { TranslationInfo, VerseRef, VerseText } from "../types.ts";
import { getTranslation } from "../config/translations.ts";

// ============================================================
// Busca o texto de um versículo em uma tradução específica,
// usando as APIs públicas gratuitas configuradas.
// ============================================================

async function fetchFromMidvash(
  ref: VerseRef,
  translation: TranslationInfo
): Promise<string> {
  // https://api.midvash.com/pt-br — 86 versões, sem chave, sem cadastro
  const url = `https://api.midvash.com/v1/pt-br/${translation.sourceCode}/${ref.book}/${ref.chapter}/${ref.verse}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Midvash: falha ao buscar ${ref.book} ${ref.chapter}:${ref.verse} (${translation.code})`);
  const data = await res.json();
  return data?.data?.text ?? data?.text ?? "";
}

async function fetchFromABibliaDigital(
  ref: VerseRef,
  translation: TranslationInfo
): Promise<string> {
  // https://www.abibliadigital.com.br — versões nvi, ra, acf, kjv, bbe, apee, rvr
  const url = `https://www.abibliadigital.com.br/api/verses/${translation.sourceCode}/${ref.book}/${ref.chapter}/${ref.verse}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`ABibliaDigital: falha ao buscar ${ref.book} ${ref.chapter}:${ref.verse} (${translation.code})`);
  const data = await res.json();
  return data?.text ?? "";
}

export async function fetchVerseText(
  ref: VerseRef,
  translationCode: string
): Promise<VerseText> {
  const translation = getTranslation(translationCode);
  if (!translation) {
    throw new Error(`Tradução desconhecida: ${translationCode}`);
  }

  const text =
    translation.source === "midvash"
      ? await fetchFromMidvash(ref, translation)
      : await fetchFromABibliaDigital(ref, translation);

  return { ref, translationCode: translation.code, text };
}

// Busca o mesmo versículo em várias traduções de uma vez (para a
// função Comparar). Sempre incremental — a lista de códigos vem
// explicitamente de quem chamou, nunca "todas" por padrão.
export async function fetchVerseInMultipleTranslations(
  ref: VerseRef,
  translationCodes: string[]
): Promise<VerseText[]> {
  const results = await Promise.allSettled(
    translationCodes.map((code) => fetchVerseText(ref, code))
  );

  return results
    .filter((r): r is PromiseFulfilledResult<VerseText> => r.status === "fulfilled")
    .map((r) => r.value);
}
