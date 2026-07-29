import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import bibleLandscape from "@/assets/bible-landscape.jpg";
import bibleScrolls from "@/assets/bible-scrolls.jpg";
import bibleCross from "@/assets/bible-cross.jpg";
import heroBible from "@/assets/hero-bible.jpg";
import bgSpiritualLight from "@/assets/bg-spiritual-light.jpg";

const slides = [
  { src: heroBible, alt: "Bíblia aberta iluminada por luz suave" },
  { src: bibleLandscape, alt: "Paisagem com raios de luz ao amanhecer" },
  { src: bibleCross, alt: "Cruz em silhueta sob céu dourado" },
  { src: bibleScrolls, alt: "Rolos antigos das Escrituras" },
  { src: bgSpiritualLight, alt: "Luz celestial difusa" },
];

const INTERVAL = 6000;

export function HeroBackgroundCarousel() {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden={false}>
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        >
          <motion.img
            src={slides[index].src}
            alt={slides[index].alt}
            loading={index === 0 ? "eager" : "lazy"}
            className="h-full w-full object-cover"
            initial={reduced ? undefined : { scale: 1.06 }}
            animate={reduced ? undefined : { scale: 1.16 }}
            transition={{ duration: INTERVAL / 1000 + 2, ease: "linear" }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Legibility overlays */}
      <div className="absolute inset-0 bg-background/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background" />
      <div
        className="absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, hsl(42 65% 55% / 0.35), transparent 60%)",
        }}
      />

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((s, i) => (
          <button
            key={s.alt}
            type="button"
            aria-label={`Mostrar imagem ${i + 1}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === index ? "w-8 bg-gold" : "w-2 bg-foreground/30 hover:bg-foreground/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}