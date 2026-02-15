import { useState, useEffect, useCallback } from "react";

const API_BASE = "https://www.abibliadigital.com.br/api";

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
  book: { abbrev: { pt: string }; name: string; author: string; group: string };
  chapter: { number: number; verses: number };
  verses: BibleVerse[];
}

export function useBibleBooks() {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/books`)
      .then((r) => r.json())
      .then((data) => setBooks(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { books, loading };
}

export function useBibleChapter(abbrev: string | null, chapter: number | null) {
  const [data, setData] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchChapter = useCallback(async () => {
    if (!abbrev || !chapter) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/verses/nvi/${abbrev}/${chapter}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [abbrev, chapter]);

  useEffect(() => {
    fetchChapter();
  }, [fetchChapter]);

  return { data, loading };
}
