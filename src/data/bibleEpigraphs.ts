// Auto-generated comprehensive biblical epigraphs database
// Covers all 66 books of the Bible and all 1,189 chapters
import epigraphsData from "./bibleEpigraphs.json";

export type EpigraphMap = Record<string, Record<string, Record<string, string>>>;

export const BIBLE_EPIGRAPHS: EpigraphMap = epigraphsData as unknown as EpigraphMap;

const normalizeKey = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

// Map normalized keys to canonical book names
const NORMALIZED_BOOK_MAP: Record<string, string> = {};
for (const canonicalBook of Object.keys(BIBLE_EPIGRAPHS)) {
  NORMALIZED_BOOK_MAP[normalizeKey(canonicalBook)] = canonicalBook;
}

// English and common aliases
const EN_ALIASES: Record<string, string> = {
  genesis: "Gênesis",
  exodus: "Êxodo",
  leviticus: "Levítico",
  numbers: "Números",
  deuteronomy: "Deuteronômio",
  joshua: "Josué",
  judges: "Juízes",
  ruth: "Rute",
  "1 samuel": "1 Samuel",
  "2 samuel": "2 Samuel",
  "1 kings": "1 Reis",
  "2 kings": "2 Reis",
  "1 chronicles": "1 Crônicas",
  "2 chronicles": "2 Crônicas",
  ezra: "Esdras",
  nehemiah: "Neemias",
  esther: "Ester",
  job: "Jó",
  psalms: "Salmos",
  psalm: "Salmos",
  proverbs: "Provérbios",
  ecclesiastes: "Eclesiastes",
  "song of solomon": "Cantares",
  "song of songs": "Cantares",
  isaias: "Isaías",
  isaiah: "Isaías",
  jeremiah: "Jeremias",
  lamentations: "Lamentações",
  ezekiel: "Ezequiel",
  daniel: "Daniel",
  hosea: "Oséias",
  joel: "Joel",
  amos: "Amós",
  obadiah: "Obadias",
  jonah: "Jonas",
  micah: "Miquéias",
  nahum: "Naum",
  habakkuk: "Habacuque",
  zephaniah: "Sofonias",
  haggai: "Ageu",
  zechariah: "Zacarias",
  malachi: "Malaquias",
  matthew: "Mateus",
  mark: "Marcos",
  luke: "Lucas",
  john: "João",
  acts: "Atos",
  romans: "Romanos",
  "1 corinthians": "1 Coríntios",
  "2 corinthians": "2 Coríntios",
  galatians: "Gálatas",
  ephesians: "Efésios",
  philippians: "Filipenses",
  colossians: "Colossenses",
  "1 thessalonians": "1 Tessalonicenses",
  "2 thessalonians": "2 Tessalonicenses",
  "1 timothy": "1 Timóteo",
  "2 timothy": "2 Timóteo",
  titus: "Tito",
  philemon: "Filemom",
  hebrews: "Hebreus",
  james: "Tiago",
  "1 peter": "1 Pedro",
  "2 peter": "2 Pedro",
  "1 john": "1 João",
  "2 john": "2 João",
  "3 john": "3 João",
  jude: "Judas",
  revelation: "Apocalipse",
};

for (const [alias, canonical] of Object.entries(EN_ALIASES)) {
  NORMALIZED_BOOK_MAP[normalizeKey(alias)] = canonical;
}

export function resolveBookName(bookName: string): string | null {
  if (!bookName) return null;
  if (BIBLE_EPIGRAPHS[bookName]) return bookName;
  const norm = normalizeKey(bookName);
  return NORMALIZED_BOOK_MAP[norm] || null;
}

export function getVerseEpigraph(bookName: string, chapter: number, verse: number): string | null {
  if (!bookName || !chapter || !verse) return null;
  const resolved = resolveBookName(bookName);
  if (!resolved) return null;
  const bookMap = BIBLE_EPIGRAPHS[resolved];
  if (!bookMap) return null;
  const chapterMap = bookMap[String(chapter)];
  if (!chapterMap) return null;
  return chapterMap[String(verse)] || null;
}

export function getChapterEpigraphs(bookName: string, chapter: number): Record<number, string> {
  if (!bookName || !chapter) return {};
  const resolved = resolveBookName(bookName);
  if (!resolved) return {};
  const bookMap = BIBLE_EPIGRAPHS[resolved];
  if (!bookMap) return {};
  const chapterMap = bookMap[String(chapter)];
  if (!chapterMap) return {};
  const result: Record<number, string> = {};
  for (const [vStr, title] of Object.entries(chapterMap)) {
    result[Number(vStr)] = title;
  }
  return result;
}
