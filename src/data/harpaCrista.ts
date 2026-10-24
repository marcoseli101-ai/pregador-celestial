import harpaData from "./harpaCrista.json";

export interface HarpHymn {
  number: number;
  title: string;
  chorus: string;
  verses: Record<string, string>;
  fullText: string;
}

// Convert JSON object into a clean indexed array
const rawData = harpaData as Record<string, any>;

export const HARPA_HYMNS: HarpHymn[] = [];

for (let i = 1; i <= 640; i++) {
  const item = rawData[String(i)];
  if (item) {
    // Extract title cleaning "1 - Chuvas de Graça" -> "Chuvas de Graça"
    const rawHino: string = item.hino || "";
    const cleanTitle = rawHino.replace(/^\d+\s*[-–]\s*/, "").trim();
    const chorusClean = (item.coro || "").replace(/<br\s*\/?>/gi, "\n").trim();

    const versesMap: Record<string, string> = {};
    const rawVerses = item.verses || {};
    for (const [vNum, vText] of Object.entries(rawVerses)) {
      versesMap[vNum] = String(vText).replace(/<br\s*\/?>/gi, "\n").trim();
    }

    const versesCombined = Object.values(versesMap).join("\n\n");
    const fullText = `${cleanTitle}\n\n${chorusClean ? `[Coro]\n${chorusClean}\n\n` : ""}${versesCombined}`;

    HARPA_HYMNS.push({
      number: i,
      title: cleanTitle,
      chorus: chorusClean,
      verses: versesMap,
      fullText,
    });
  }
}

export function getHymnByNumber(hymnNumber: number): HarpHymn | undefined {
  return HARPA_HYMNS.find((h) => h.number === hymnNumber);
}

// Deterministic hymn of the day based on date
export function getHymnOfTheDay(date: Date = new Date()): HarpHymn {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  // Pick hymn from 1 to 640
  const index = ((dayOfYear * 7 + 13) % HARPA_HYMNS.length);
  return HARPA_HYMNS[index] || HARPA_HYMNS[0];
}

export function searchHymns(query: string): HarpHymn[] {
  if (!query || !query.trim()) return HARPA_HYMNS;
  const q = query.trim().toLowerCase();

  // If search query is purely numbers, match exact or prefix
  if (/^\d+$/.test(q)) {
    const num = parseInt(q, 10);
    return HARPA_HYMNS.filter(
      (h) => h.number === num || String(h.number).startsWith(q)
    );
  }

  return HARPA_HYMNS.filter((h) => {
    return (
      h.title.toLowerCase().includes(q) ||
      h.chorus.toLowerCase().includes(q) ||
      Object.values(h.verses).some((v) => v.toLowerCase().includes(q))
    );
  });
}
