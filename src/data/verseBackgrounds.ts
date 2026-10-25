export interface VerseBackgroundTheme {
  id: string;
  name: string;
  tagline: string;
  category: "celestial" | "natureza" | "escrituras" | "solene";
  feedUrl: string;
  storyUrl: string;
  thumbUrl: string;
  fallbackGradient: string;
  overlayClass: string;
  textColor: string;
  quoteColor: string;
  accentColor: string;
  badgeBg: string;
  borderColor: string;
}

export const VERSE_BACKGROUND_CATEGORIES = [
  { id: "todos", label: "Todos (10)" },
  { id: "celestial", label: "Celestial" },
  { id: "natureza", label: "Natureza" },
  { id: "escrituras", label: "Escrituras" },
  { id: "solene", label: "Solene" },
] as const;

export const VERSE_BACKGROUNDS: VerseBackgroundTheme[] = [
  {
    id: "dourado-celestial",
    name: "Dourado Celestial",
    tagline: "Glória e resplendor divino",
    category: "celestial",
    feedUrl: "/assets/verse-backgrounds/dourado-celestial/feed.jpg",
    storyUrl: "/assets/verse-backgrounds/dourado-celestial/story.jpg",
    thumbUrl: "/assets/verse-backgrounds/dourado-celestial/thumb.jpg",
    fallbackGradient: "bg-gradient-to-br from-[#1a1306] via-[#3d2a09] to-[#0f0b03]",
    overlayClass: "bg-gradient-to-b from-black/60 via-black/40 to-black/75",
    textColor: "text-white",
    quoteColor: "text-amber-200",
    accentColor: "text-amber-400",
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    borderColor: "border-amber-500",
  },
  {
    id: "monte-entardecer",
    name: "Monte ao Entardecer",
    tagline: "Pôr do sol nos montes de Sião",
    category: "natureza",
    feedUrl: "/assets/verse-backgrounds/monte-entardecer/feed.jpg",
    storyUrl: "/assets/verse-backgrounds/monte-entardecer/story.jpg",
    thumbUrl: "/assets/verse-backgrounds/monte-entardecer/thumb.jpg",
    fallbackGradient: "bg-gradient-to-br from-[#1f0b28] via-[#4a1836] to-[#120417]",
    overlayClass: "bg-gradient-to-b from-black/60 via-black/45 to-black/80",
    textColor: "text-white",
    quoteColor: "text-amber-100",
    accentColor: "text-amber-300",
    badgeBg: "bg-pink-500/20 text-pink-300 border-pink-500/40",
    borderColor: "border-pink-500",
  },
  {
    id: "oliveiras-vida",
    name: "Oliveiras & Vida",
    tagline: "Getsêmani e paz restauradora",
    category: "natureza",
    feedUrl: "/assets/verse-backgrounds/oliveiras-vida/feed.jpg",
    storyUrl: "/assets/verse-backgrounds/oliveiras-vida/story.jpg",
    thumbUrl: "/assets/verse-backgrounds/oliveiras-vida/thumb.jpg",
    fallbackGradient: "bg-gradient-to-br from-[#062016] via-[#0d3b2b] to-[#04140e]",
    overlayClass: "bg-gradient-to-b from-black/60 via-black/40 to-black/80",
    textColor: "text-white",
    quoteColor: "text-emerald-100",
    accentColor: "text-emerald-300",
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    borderColor: "border-emerald-500",
  },
  {
    id: "pergaminho-sagrado",
    name: "Pergaminho Sagrado",
    tagline: "Rolos antigos das Escrituras",
    category: "escrituras",
    feedUrl: "/assets/verse-backgrounds/pergaminho-sagrado/feed.jpg",
    storyUrl: "/assets/verse-backgrounds/pergaminho-sagrado/story.jpg",
    thumbUrl: "/assets/verse-backgrounds/pergaminho-sagrado/thumb.jpg",
    fallbackGradient: "bg-gradient-to-br from-[#241a10] via-[#42311f] to-[#171009]",
    overlayClass: "bg-gradient-to-b from-black/65 via-black/45 to-black/85",
    textColor: "text-amber-50",
    quoteColor: "text-amber-200",
    accentColor: "text-amber-400",
    badgeBg: "bg-amber-600/20 text-amber-300 border-amber-600/40",
    borderColor: "border-amber-600",
  },
  {
    id: "biblia-luz",
    name: "Bíblia & Luz",
    tagline: "A Palavra viva e eficaz",
    category: "escrituras",
    feedUrl: "/assets/verse-backgrounds/biblia-luz/feed.jpg",
    storyUrl: "/assets/verse-backgrounds/biblia-luz/story.jpg",
    thumbUrl: "/assets/verse-backgrounds/biblia-luz/thumb.jpg",
    fallbackGradient: "bg-gradient-to-br from-[#1c1608] via-[#382b0e] to-[#0d0a03]",
    overlayClass: "bg-gradient-to-b from-black/60 via-black/40 to-black/80",
    textColor: "text-white",
    quoteColor: "text-amber-100",
    accentColor: "text-amber-300",
    badgeBg: "bg-amber-500/20 text-amber-200 border-amber-500/40",
    borderColor: "border-amber-400",
  },
  {
    id: "aguas-paz",
    name: "Águas de Paz",
    tagline: "Águas tranquilas de refrigério (Sl 23)",
    category: "natureza",
    feedUrl: "/assets/verse-backgrounds/aguas-paz/feed.jpg",
    storyUrl: "/assets/verse-backgrounds/aguas-paz/story.jpg",
    thumbUrl: "/assets/verse-backgrounds/aguas-paz/thumb.jpg",
    fallbackGradient: "bg-gradient-to-br from-[#061c28] via-[#0c364c] to-[#04121a]",
    overlayClass: "bg-gradient-to-b from-black/60 via-black/45 to-black/80",
    textColor: "text-white",
    quoteColor: "text-cyan-100",
    accentColor: "text-cyan-300",
    badgeBg: "bg-cyan-500/20 text-cyan-200 border-cyan-500/40",
    borderColor: "border-cyan-400",
  },
  {
    id: "ceu-promessas",
    name: "Céu de Promessas",
    tagline: "Nuvens gloriosas e horizonte eterno",
    category: "celestial",
    feedUrl: "/assets/verse-backgrounds/ceu-promessas/feed.jpg",
    storyUrl: "/assets/verse-backgrounds/ceu-promessas/story.jpg",
    thumbUrl: "/assets/verse-backgrounds/ceu-promessas/thumb.jpg",
    fallbackGradient: "bg-gradient-to-br from-[#121c33] via-[#24355c] to-[#090f1d]",
    overlayClass: "bg-gradient-to-b from-black/60 via-black/40 to-black/80",
    textColor: "text-white",
    quoteColor: "text-amber-100",
    accentColor: "text-amber-300",
    badgeBg: "bg-indigo-500/20 text-indigo-200 border-indigo-500/40",
    borderColor: "border-indigo-400",
  },
  {
    id: "vitral-adoracao",
    name: "Vitral de Adoração",
    tagline: "Luz sagrada e reverência litúrgica",
    category: "solene",
    feedUrl: "/assets/verse-backgrounds/vitral-adoracao/feed.jpg",
    storyUrl: "/assets/verse-backgrounds/vitral-adoracao/story.jpg",
    thumbUrl: "/assets/verse-backgrounds/vitral-adoracao/thumb.jpg",
    fallbackGradient: "bg-gradient-to-br from-[#240b18] via-[#4a1331] to-[#14040d]",
    overlayClass: "bg-gradient-to-b from-black/65 via-black/50 to-black/85",
    textColor: "text-white",
    quoteColor: "text-amber-200",
    accentColor: "text-amber-400",
    badgeBg: "bg-purple-500/20 text-purple-200 border-purple-500/40",
    borderColor: "border-purple-400",
  },
  {
    id: "jardim-oracao",
    name: "Jardim da Oração",
    tagline: "Comunhão na aurora espiritual",
    category: "natureza",
    feedUrl: "/assets/verse-backgrounds/jardim-oracao/feed.jpg",
    storyUrl: "/assets/verse-backgrounds/jardim-oracao/story.jpg",
    thumbUrl: "/assets/verse-backgrounds/jardim-oracao/thumb.jpg",
    fallbackGradient: "bg-gradient-to-br from-[#121f0b] via-[#29421b] to-[#091205]",
    overlayClass: "bg-gradient-to-b from-black/60 via-black/40 to-black/80",
    textColor: "text-white",
    quoteColor: "text-amber-100",
    accentColor: "text-amber-300",
    badgeBg: "bg-lime-500/20 text-lime-200 border-lime-500/40",
    borderColor: "border-lime-500",
  },
  {
    id: "cruz-esperanca",
    name: "Cruz & Esperança",
    tagline: "Redenção e vitória no Calvário",
    category: "solene",
    feedUrl: "/assets/verse-backgrounds/cruz-esperanca/feed.jpg",
    storyUrl: "/assets/verse-backgrounds/cruz-esperanca/story.jpg",
    thumbUrl: "/assets/verse-backgrounds/cruz-esperanca/thumb.jpg",
    fallbackGradient: "bg-gradient-to-br from-[#1f160d] via-[#3b2a19] to-[#0f0a06]",
    overlayClass: "bg-gradient-to-b from-black/60 via-black/45 to-black/80",
    textColor: "text-white",
    quoteColor: "text-amber-100",
    accentColor: "text-amber-400",
    badgeBg: "bg-amber-600/20 text-amber-200 border-amber-600/40",
    borderColor: "border-amber-500",
  },
];

export function getVerseBackgroundById(id: string): VerseBackgroundTheme {
  return (
    VERSE_BACKGROUNDS.find((bg) => bg.id === id) ||
    VERSE_BACKGROUNDS[0]
  );
}
