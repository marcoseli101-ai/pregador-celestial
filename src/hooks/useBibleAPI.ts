import { useState, useEffect, useCallback } from "react";

export interface BibleBook {
  abbrev: { pt: string; en: string };
  author: string;
  chapters: number;
  group: string;
  name: string;
  testament: string;
}

export interface BibleVerse {
  number: number;
  text: string;
}

export interface ChapterData {
  bookName: string;
  chapter: number;
  verses: BibleVerse[];
}

const BOOKS: BibleBook[] = [
  { abbrev:{pt:"gn",en:"genesis"}, author:"Moisés", chapters:50, group:"Pentateuco", name:"Gênesis", testament:"VT" },
  { abbrev:{pt:"ex",en:"exodus"}, author:"Moisés", chapters:40, group:"Pentateuco", name:"Êxodo", testament:"VT" },
  { abbrev:{pt:"lv",en:"leviticus"}, author:"Moisés", chapters:27, group:"Pentateuco", name:"Levítico", testament:"VT" },
  { abbrev:{pt:"nm",en:"numbers"}, author:"Moisés", chapters:36, group:"Pentateuco", name:"Números", testament:"VT" },
  { abbrev:{pt:"dt",en:"deuteronomy"}, author:"Moisés", chapters:34, group:"Pentateuco", name:"Deuteronômio", testament:"VT" },
  { abbrev:{pt:"js",en:"joshua"}, author:"Josué", chapters:24, group:"Históricos", name:"Josué", testament:"VT" },
  { abbrev:{pt:"jz",en:"judges"}, author:"Samuel", chapters:21, group:"Históricos", name:"Juízes", testament:"VT" },
  { abbrev:{pt:"rt",en:"ruth"}, author:"Samuel", chapters:4, group:"Históricos", name:"Rute", testament:"VT" },
  { abbrev:{pt:"1sm",en:"1 samuel"}, author:"Samuel", chapters:31, group:"Históricos", name:"1 Samuel", testament:"VT" },
  { abbrev:{pt:"2sm",en:"2 samuel"}, author:"Desconhecido", chapters:24, group:"Históricos", name:"2 Samuel", testament:"VT" },
  { abbrev:{pt:"1rs",en:"1 kings"}, author:"Jeremias", chapters:22, group:"Históricos", name:"1 Reis", testament:"VT" },
  { abbrev:{pt:"2rs",en:"2 kings"}, author:"Jeremias", chapters:25, group:"Históricos", name:"2 Reis", testament:"VT" },
  { abbrev:{pt:"1cr",en:"1 chronicles"}, author:"Esdras", chapters:29, group:"Históricos", name:"1 Crônicas", testament:"VT" },
  { abbrev:{pt:"2cr",en:"2 chronicles"}, author:"Esdras", chapters:36, group:"Históricos", name:"2 Crônicas", testament:"VT" },
  { abbrev:{pt:"ed",en:"ezra"}, author:"Esdras", chapters:10, group:"Históricos", name:"Esdras", testament:"VT" },
  { abbrev:{pt:"ne",en:"nehemiah"}, author:"Neemias", chapters:13, group:"Históricos", name:"Neemias", testament:"VT" },
  { abbrev:{pt:"et",en:"esther"}, author:"Desconhecido", chapters:10, group:"Históricos", name:"Ester", testament:"VT" },
  { abbrev:{pt:"jó",en:"job"}, author:"Desconhecido", chapters:42, group:"Poéticos", name:"Jó", testament:"VT" },
  { abbrev:{pt:"sl",en:"psalms"}, author:"Davi", chapters:150, group:"Poéticos", name:"Salmos", testament:"VT" },
  { abbrev:{pt:"pv",en:"proverbs"}, author:"Salomão", chapters:31, group:"Poéticos", name:"Provérbios", testament:"VT" },
  { abbrev:{pt:"ec",en:"ecclesiastes"}, author:"Salomão", chapters:12, group:"Poéticos", name:"Eclesiastes", testament:"VT" },
  { abbrev:{pt:"ct",en:"song of solomon"}, author:"Salomão", chapters:8, group:"Poéticos", name:"Cantares", testament:"VT" },
  { abbrev:{pt:"is",en:"isaiah"}, author:"Isaías", chapters:66, group:"Profetas Maiores", name:"Isaías", testament:"VT" },
  { abbrev:{pt:"jr",en:"jeremiah"}, author:"Jeremias", chapters:52, group:"Profetas Maiores", name:"Jeremias", testament:"VT" },
  { abbrev:{pt:"lm",en:"lamentations"}, author:"Jeremias", chapters:5, group:"Profetas Maiores", name:"Lamentações", testament:"VT" },
  { abbrev:{pt:"ez",en:"ezekiel"}, author:"Ezequiel", chapters:48, group:"Profetas Maiores", name:"Ezequiel", testament:"VT" },
  { abbrev:{pt:"dn",en:"daniel"}, author:"Daniel", chapters:12, group:"Profetas Maiores", name:"Daniel", testament:"VT" },
  { abbrev:{pt:"os",en:"hosea"}, author:"Oséias", chapters:14, group:"Profetas Menores", name:"Oséias", testament:"VT" },
  { abbrev:{pt:"jl",en:"joel"}, author:"Joel", chapters:3, group:"Profetas Menores", name:"Joel", testament:"VT" },
  { abbrev:{pt:"am",en:"amos"}, author:"Amós", chapters:9, group:"Profetas Menores", name:"Amós", testament:"VT" },
  { abbrev:{pt:"ob",en:"obadiah"}, author:"Obadias", chapters:1, group:"Profetas Menores", name:"Obadias", testament:"VT" },
  { abbrev:{pt:"jn",en:"jonah"}, author:"Jonas", chapters:4, group:"Profetas Menores", name:"Jonas", testament:"VT" },
  { abbrev:{pt:"mq",en:"micah"}, author:"Miquéias", chapters:7, group:"Profetas Menores", name:"Miquéias", testament:"VT" },
  { abbrev:{pt:"na",en:"nahum"}, author:"Naum", chapters:3, group:"Profetas Menores", name:"Naum", testament:"VT" },
  { abbrev:{pt:"hc",en:"habakkuk"}, author:"Habacuque", chapters:3, group:"Profetas Menores", name:"Habacuque", testament:"VT" },
  { abbrev:{pt:"sf",en:"zephaniah"}, author:"Sofonias", chapters:3, group:"Profetas Menores", name:"Sofonias", testament:"VT" },
  { abbrev:{pt:"ag",en:"haggai"}, author:"Ageu", chapters:2, group:"Profetas Menores", name:"Ageu", testament:"VT" },
  { abbrev:{pt:"zc",en:"zechariah"}, author:"Zacarias", chapters:14, group:"Profetas Menores", name:"Zacarias", testament:"VT" },
  { abbrev:{pt:"ml",en:"malachi"}, author:"Malaquias", chapters:4, group:"Profetas Menores", name:"Malaquias", testament:"VT" },
  { abbrev:{pt:"mt",en:"matthew"}, author:"Mateus", chapters:28, group:"Evangelhos", name:"Mateus", testament:"NT" },
  { abbrev:{pt:"mc",en:"mark"}, author:"Marcos", chapters:16, group:"Evangelhos", name:"Marcos", testament:"NT" },
  { abbrev:{pt:"lc",en:"luke"}, author:"Lucas", chapters:24, group:"Evangelhos", name:"Lucas", testament:"NT" },
  { abbrev:{pt:"jo",en:"john"}, author:"João", chapters:21, group:"Evangelhos", name:"João", testament:"NT" },
  { abbrev:{pt:"at",en:"acts"}, author:"Lucas", chapters:28, group:"Históricos", name:"Atos", testament:"NT" },
  { abbrev:{pt:"rm",en:"romans"}, author:"Paulo", chapters:16, group:"Cartas Paulinas", name:"Romanos", testament:"NT" },
  { abbrev:{pt:"1co",en:"1 corinthians"}, author:"Paulo", chapters:16, group:"Cartas Paulinas", name:"1 Coríntios", testament:"NT" },
  { abbrev:{pt:"2co",en:"2 corinthians"}, author:"Paulo", chapters:13, group:"Cartas Paulinas", name:"2 Coríntios", testament:"NT" },
  { abbrev:{pt:"gl",en:"galatians"}, author:"Paulo", chapters:6, group:"Cartas Paulinas", name:"Gálatas", testament:"NT" },
  { abbrev:{pt:"ef",en:"ephesians"}, author:"Paulo", chapters:6, group:"Cartas Paulinas", name:"Efésios", testament:"NT" },
  { abbrev:{pt:"fp",en:"philippians"}, author:"Paulo", chapters:4, group:"Cartas Paulinas", name:"Filipenses", testament:"NT" },
  { abbrev:{pt:"cl",en:"colossians"}, author:"Paulo", chapters:4, group:"Cartas Paulinas", name:"Colossenses", testament:"NT" },
  { abbrev:{pt:"1ts",en:"1 thessalonians"}, author:"Paulo", chapters:5, group:"Cartas Paulinas", name:"1 Tessalonicenses", testament:"NT" },
  { abbrev:{pt:"2ts",en:"2 thessalonians"}, author:"Paulo", chapters:3, group:"Cartas Paulinas", name:"2 Tessalonicenses", testament:"NT" },
  { abbrev:{pt:"1tm",en:"1 timothy"}, author:"Paulo", chapters:6, group:"Cartas Paulinas", name:"1 Timóteo", testament:"NT" },
  { abbrev:{pt:"2tm",en:"2 timothy"}, author:"Paulo", chapters:4, group:"Cartas Paulinas", name:"2 Timóteo", testament:"NT" },
  { abbrev:{pt:"tt",en:"titus"}, author:"Paulo", chapters:3, group:"Cartas Paulinas", name:"Tito", testament:"NT" },
  { abbrev:{pt:"fm",en:"philemon"}, author:"Paulo", chapters:1, group:"Cartas Paulinas", name:"Filemom", testament:"NT" },
  { abbrev:{pt:"hb",en:"hebrews"}, author:"Desconhecido", chapters:13, group:"Cartas Gerais", name:"Hebreus", testament:"NT" },
  { abbrev:{pt:"tg",en:"james"}, author:"Tiago", chapters:5, group:"Cartas Gerais", name:"Tiago", testament:"NT" },
  { abbrev:{pt:"1pe",en:"1 peter"}, author:"Pedro", chapters:5, group:"Cartas Gerais", name:"1 Pedro", testament:"NT" },
  { abbrev:{pt:"2pe",en:"2 peter"}, author:"Pedro", chapters:3, group:"Cartas Gerais", name:"2 Pedro", testament:"NT" },
  { abbrev:{pt:"1jo",en:"1 john"}, author:"João", chapters:5, group:"Cartas Gerais", name:"1 João", testament:"NT" },
  { abbrev:{pt:"2jo",en:"2 john"}, author:"João", chapters:1, group:"Cartas Gerais", name:"2 João", testament:"NT" },
  { abbrev:{pt:"3jo",en:"3 john"}, author:"João", chapters:1, group:"Cartas Gerais", name:"3 João", testament:"NT" },
  { abbrev:{pt:"jd",en:"jude"}, author:"Judas", chapters:1, group:"Cartas Gerais", name:"Judas", testament:"NT" },
  { abbrev:{pt:"ap",en:"revelation"}, author:"João", chapters:22, group:"Profético", name:"Apocalipse", testament:"NT" },
];

export function useBibleBooks() {
  return { books: BOOKS, loading: false };
}

export function useBibleChapter(bookEnName: string | null, chapter: number | null) {
  const [data, setData] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChapter = useCallback(async () => {
    if (!bookEnName || !chapter) return;
    setLoading(true);
    setError(null);
    try {
      const ref = encodeURIComponent(`${bookEnName} ${chapter}`);
      const res = await fetch(`https://bible-api.com/${ref}?translation=almeida`);
      if (!res.ok) throw new Error("Falha ao carregar capítulo");
      const json = await res.json();
      if (!json.verses || !Array.isArray(json.verses)) {
        throw new Error("Formato inesperado da API");
      }
      setData({
        bookName: json.reference ?? bookEnName,
        chapter,
        verses: json.verses.map((v: { verse: number; text: string }) => ({
          number: v.verse,
          text: v.text,
        })),
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro desconhecido";
      setError(msg);
      console.error("Bible API error:", e);
    } finally {
      setLoading(false);
    }
  }, [bookEnName, chapter]);

  useEffect(() => {
    fetchChapter();
  }, [fetchChapter]);

  return { data, loading, error };
}
