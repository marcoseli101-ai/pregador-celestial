import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";

// All Portuguese book names (including numbered variants)
const BOOK_NAMES = [
  "Gênesis", "Êxodo", "Levítico", "Números", "Deuteronômio",
  "Josué", "Juízes", "Rute",
  "1 Samuel", "2 Samuel", "1 Reis", "2 Reis",
  "1 Crônicas", "2 Crônicas", "Esdras", "Neemias", "Ester",
  "Jó", "Salmos", "Provérbios", "Eclesiastes", "Cantares",
  "Isaías", "Jeremias", "Lamentações", "Ezequiel", "Daniel",
  "Oséias", "Joel", "Amós", "Obadias", "Jonas", "Miquéias",
  "Naum", "Habacuque", "Sofonias", "Ageu", "Zacarias", "Malaquias",
  "Mateus", "Marcos", "Lucas", "João", "Atos", "Romanos",
  "1 Coríntios", "2 Coríntios", "Gálatas", "Efésios", "Filipenses",
  "Colossenses", "1 Tessalonicenses", "2 Tessalonicenses",
  "1 Timóteo", "2 Timóteo", "Tito", "Filemom", "Hebreus",
  "Tiago", "1 Pedro", "2 Pedro", "1 João", "2 João", "3 João",
  "Judas", "Apocalipse",
];

// Common abbreviations mapped to full names
const ABBREV_MAP: Record<string, string> = {
  "Gn": "Gênesis", "Gên": "Gênesis", "Gen": "Gênesis",
  "Ex": "Êxodo", "Êx": "Êxodo",
  "Lv": "Levítico", "Lev": "Levítico",
  "Nm": "Números", "Num": "Números",
  "Dt": "Deuteronômio", "Deut": "Deuteronômio",
  "Js": "Josué", "Jos": "Josué",
  "Jz": "Juízes", "Jui": "Juízes",
  "Rt": "Rute",
  "1Sm": "1 Samuel", "1 Sm": "1 Samuel", "1Sam": "1 Samuel",
  "2Sm": "2 Samuel", "2 Sm": "2 Samuel", "2Sam": "2 Samuel",
  "1Rs": "1 Reis", "1 Rs": "1 Reis",
  "2Rs": "2 Reis", "2 Rs": "2 Reis",
  "1Cr": "1 Crônicas", "1 Cr": "1 Crônicas",
  "2Cr": "2 Crônicas", "2 Cr": "2 Crônicas",
  "Ed": "Esdras", "Esd": "Esdras",
  "Ne": "Neemias",
  "Et": "Ester", "Est": "Ester",
  "Sl": "Salmos", "Sal": "Salmos",
  "Pv": "Provérbios", "Prov": "Provérbios",
  "Ec": "Eclesiastes", "Ecl": "Eclesiastes",
  "Ct": "Cantares", "Cant": "Cantares",
  "Is": "Isaías", "Isa": "Isaías",
  "Jr": "Jeremias", "Jer": "Jeremias",
  "Lm": "Lamentações", "Lam": "Lamentações",
  "Ez": "Ezequiel", "Eze": "Ezequiel",
  "Dn": "Daniel", "Dan": "Daniel",
  "Os": "Oséias", "Ose": "Oséias",
  "Jl": "Joel",
  "Am": "Amós",
  "Ob": "Obadias", "Abd": "Obadias",
  "Jn": "Jonas",
  "Mq": "Miquéias", "Miq": "Miquéias",
  "Na": "Naum",
  "Hc": "Habacuque", "Hab": "Habacuque",
  "Sf": "Sofonias", "Sof": "Sofonias",
  "Ag": "Ageu",
  "Zc": "Zacarias", "Zac": "Zacarias",
  "Ml": "Malaquias", "Mal": "Malaquias",
  "Mt": "Mateus", "Mat": "Mateus",
  "Mc": "Marcos", "Mar": "Marcos",
  "Lc": "Lucas", "Luc": "Lucas",
  "Jo": "João",
  "At": "Atos",
  "Rm": "Romanos", "Rom": "Romanos",
  "1Co": "1 Coríntios", "1 Co": "1 Coríntios", "1Cor": "1 Coríntios",
  "2Co": "2 Coríntios", "2 Co": "2 Coríntios", "2Cor": "2 Coríntios",
  "Gl": "Gálatas", "Gal": "Gálatas",
  "Ef": "Efésios",
  "Fp": "Filipenses", "Fil": "Filipenses",
  "Cl": "Colossenses", "Col": "Colossenses",
  "1Ts": "1 Tessalonicenses", "1 Ts": "1 Tessalonicenses",
  "2Ts": "2 Tessalonicenses", "2 Ts": "2 Tessalonicenses",
  "1Tm": "1 Timóteo", "1 Tm": "1 Timóteo", "1Tim": "1 Timóteo",
  "2Tm": "2 Timóteo", "2 Tm": "2 Timóteo", "2Tim": "2 Timóteo",
  "Tt": "Tito",
  "Fm": "Filemom",
  "Hb": "Hebreus", "Heb": "Hebreus",
  "Tg": "Tiago", "Tia": "Tiago",
  "1Pe": "1 Pedro", "1 Pe": "1 Pedro",
  "2Pe": "2 Pedro", "2 Pe": "2 Pedro",
  "1Jo": "1 João", "1 Jo": "1 João",
  "2Jo": "2 João", "2 Jo": "2 João",
  "3Jo": "3 João", "3 Jo": "3 João",
  "Jd": "Judas",
  "Ap": "Apocalipse", "Apo": "Apocalipse",
};

// Build regex pattern: match full names and abbreviations followed by chapter:verse
const allNames = [
  ...BOOK_NAMES,
  ...Object.keys(ABBREV_MAP),
].sort((a, b) => b.length - a.length); // longest first to avoid partial matches

const escapedNames = allNames.map(n => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const VERSE_REGEX = new RegExp(
  `((?:${escapedNames.join("|")})\\s*\\d+[:\\.,]\\d+(?:\\s*[-–]\\s*\\d+)?)`,
  "gi"
);

/**
 * Parse a verse reference like "João 3:16" or "1Co 12:4-11" into
 * { bookName, chapter } for navigation
 */
function parseVerseRef(ref: string): { bookName: string; chapter: number; verse?: number } | null {
  const match = ref.match(/^(.+?)\s*(\d+)[:\\.,](\d+)/);
  if (!match) return null;

  let bookPart = match[1].trim();
  const chapter = parseInt(match[2], 10);
  const verse = parseInt(match[3], 10);

  const resolved = ABBREV_MAP[bookPart] || BOOK_NAMES.find(
    b => b.toLowerCase() === bookPart.toLowerCase()
  );

  if (!resolved) return null;
  return { bookName: resolved, chapter, verse };
}

interface BibleVerseLinkProps {
  /** The text content to scan for verse references */
  text: string;
  /** Optional class for the container */
  className?: string;
}

/**
 * Renders text with Bible verse references as clickable links.
 * Clicking navigates to /estudo-biblico with book and chapter pre-selected.
 */
export const BibleVerseLink: React.FC<BibleVerseLinkProps> = ({ text, className }) => {
  const navigate = useNavigate();

  const handleClick = (ref: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const parsed = parseVerseRef(ref);
    if (parsed) {
      const params = new URLSearchParams({
        livro: parsed.bookName,
        capitulo: String(parsed.chapter),
        ...(parsed.verse ? { versiculo: String(parsed.verse) } : {}),
      });
      navigate(`/estudo-biblico?${params.toString()}`);
    }
  };

  // Split text by verse references — create fresh regex each render to avoid lastIndex issues
  const splitRegex = new RegExp(VERSE_REGEX.source, "gi");
  const testRegex = new RegExp(VERSE_REGEX.source, "i");
  const parts = text.split(splitRegex);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (testRegex.test(part)) {
          return (
            <button
              key={i}
              onClick={(e) => handleClick(part, e)}
              className="inline-flex items-center gap-0.5 text-accent hover:text-accent/80 underline decoration-accent/40 hover:decoration-accent underline-offset-2 cursor-pointer font-medium transition-colors"
              title={`Abrir ${part} na Bíblia`}
            >
              <BookOpen className="inline h-3 w-3 shrink-0" />
              {part}
            </button>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </span>
  );
};

/**
 * Wraps markdown/pre-wrap content and makes Bible references clickable.
 * Processes line-by-line to preserve whitespace formatting.
 */
export const BibleTextContent: React.FC<{
  content: string;
  className?: string;
}> = ({ content, className }) => {
  const lines = content.split("\n");

  return (
    <div className={className}>
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          <BibleVerseLink text={line} />
          {i < lines.length - 1 && "\n"}
        </React.Fragment>
      ))}
    </div>
  );
};

export default BibleVerseLink;
