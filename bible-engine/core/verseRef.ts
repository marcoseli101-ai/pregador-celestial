import { VerseRef } from "../types.ts";

export function slugifyBook(bookLabel: string): string {
  return bookLabel
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-");
}

export function verseRefLabel(ref: VerseRef): string {
  const range = ref.verseEnd && ref.verseEnd !== ref.verse ? `-${ref.verseEnd}` : "";
  return `${ref.bookLabel} ${ref.chapter}:${ref.verse}${range}`;
}

// Chave de cache: SEMPRE referência + tradução, nunca por usuário.
// Isso garante a regra "a mesma resposta para todos os usuários".
export function buildCacheKey(ref: VerseRef, translationCode: string): string {
  const range = ref.verseEnd && ref.verseEnd !== ref.verse ? `-${ref.verseEnd}` : "";
  return `${ref.book}.${ref.chapter}.${ref.verse}${range}__${translationCode.toUpperCase()}`;
}

export function parseVerseRef(raw: {
  book: string;
  bookLabel: string;
  chapter: number;
  verse: number;
  verseEnd?: number;
}): VerseRef {
  return {
    book: slugifyBook(raw.book),
    bookLabel: raw.bookLabel,
    chapter: raw.chapter,
    verse: raw.verse,
    verseEnd: raw.verseEnd,
  };
}
