import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

import bgSpiritualLight from "@/assets/bg-spiritual-light.jpg";
import bgBibleWarm from "@/assets/bg-bible-warm.jpg";
import bibleLandscape from "@/assets/bible-landscape.jpg";
import bibleCross from "@/assets/bible-cross.jpg";

const bgMap: Record<string, string> = {
  "/": bgSpiritualLight,
  "/estudo-biblico": bgBibleWarm,
  "/biblioteca": bibleCross,
  "/gerador-pregacoes": bgSpiritualLight,
  "/devocional": bibleLandscape,
  "/dicionario": bgBibleWarm,
  "/curso-teologia": bgSpiritualLight,
  "/questionarios": bibleCross,
  "/login": bgBibleWarm,
};

export function Layout() {
  const { pathname } = useLocation();
  const bg = bgMap[pathname] || bgSpiritualLight;

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Fixed background image */}
      <div className="fixed inset-0 -z-20">
        <img
          src={bg}
          alt=""
          className="h-full w-full object-cover"
          loading="eager"
        />
      </div>
      {/* Overlay for readability */}
      <div className="fixed inset-0 -z-10 bg-background/85 backdrop-blur-sm" />

      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
