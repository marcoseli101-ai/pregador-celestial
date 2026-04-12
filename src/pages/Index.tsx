import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen, Sparkles, FileText, Mic, GraduationCap, Languages,
  HelpCircle, Calendar, ArrowRight, Star, Users, ChevronRight, BookMarked, ScrollText,
  StickyNote, Bookmark, Zap, Heart, Shield
} from "lucide-react";
import { useRef } from "react";

import bibleLandscape from "@/assets/bible-landscape.jpg";
import bibleScrolls from "@/assets/bible-scrolls.jpg";
import bibleCross from "@/assets/bible-cross.jpg";

const features = [
  { icon: BookOpen, title: "Estudo Bíblico Avançado", desc: "Bíblia completa com busca, comparação e comentários teológicos.", link: "/estudo-biblico", color: "from-[hsl(220,55%,50%)] to-[hsl(250,50%,60%)]" },
  { icon: Sparkles, title: "Gerador de Pregações (IA)", desc: "Esboços e sermões completos gerados por inteligência artificial.", link: "/gerador-pregacoes", color: "from-[hsl(38,70%,50%)] to-[hsl(45,65%,58%)]" },
  { icon: FileText, title: "Biblioteca de Mensagens", desc: "Pregações organizadas por temas com texto base e aplicação.", link: "/biblioteca", color: "from-[hsl(260,45%,52%)] to-[hsl(280,50%,58%)]" },
  { icon: GraduationCap, title: "Curso de Teologia", desc: "Estudo completo de teologia sistemática com IA para tirar dúvidas.", link: "/curso-teologia", color: "from-[hsl(195,65%,42%)] to-[hsl(210,60%,52%)]" },
  { icon: Languages, title: "Dicionário Hebraico/Grego", desc: "Palavras bíblicas com significado teológico e pronúncia.", link: "/dicionario", color: "from-[hsl(155,50%,38%)] to-[hsl(170,55%,48%)]" },
  { icon: HelpCircle, title: "Questionários Espirituais", desc: "Testes bíblicos, desafios e reflexões para crescimento.", link: "/questionarios", color: "from-[hsl(335,55%,52%)] to-[hsl(350,60%,58%)]" },
  { icon: Calendar, title: "Devocional Diário", desc: "Versículo do dia, reflexão e oração gerados por IA.", link: "/devocional", color: "from-[hsl(25,65%,48%)] to-[hsl(38,60%,55%)]" },
  { icon: BookMarked, title: "Plano de Leitura", desc: "Planos de leitura bíblica organizados para acompanhar seu progresso.", link: "/plano-leitura", color: "from-[hsl(185,60%,42%)] to-[hsl(200,65%,52%)]" },
  { icon: GraduationCap, title: "Área do Pregador", desc: "Salve seus sermões, anotações e acesse seu histórico.", link: "/area-pregador", color: "from-[hsl(220,50%,48%)] to-[hsl(240,55%,58%)]" },
  { icon: StickyNote, title: "Notas Pessoais", desc: "Crie e organize suas anotações de estudo, pregações e reflexões.", link: "/notas", color: "from-[hsl(42,70%,48%)] to-[hsl(50,65%,55%)]" },
  { icon: Bookmark, title: "Marcadores de Versículos", desc: "Salve e destaque versículos importantes com cores e anotações.", link: "/marcadores", color: "from-[hsl(275,50%,52%)] to-[hsl(295,45%,55%)]" },
];

const themes = [
  "Avivamento", "Fé", "Santidade", "Salvação", "Arrependimento",
  "Espírito Santo", "Escatologia", "Evangelismo", "Oração", "Graça"
];

const testimonials = [
  { name: "Pr. Marcos Silva", role: "Pastor Titular", text: "Esta plataforma revolucionou minha preparação para os cultos. Os esboços gerados são profundos e cheios de unção." },
  { name: "Ev. Ana Beatriz", role: "Evangelista", text: "O gerador de pregações me ajuda a preparar mensagens impactantes para cruzadas em poucos minutos." },
  { name: "Dc. Pedro Santos", role: "Diácono e Líder", text: "Os questionários bíblicos são perfeitos para o discipulado dos novos convertidos na nossa igreja." },
];

const stats = [
  { icon: Users, value: "+1.000", label: "Pregadores Ativos" },
  { icon: BookOpen, value: "66", label: "Livros da Bíblia" },
  { icon: Sparkles, value: "11", label: "Ferramentas com IA" },
  { icon: Heart, value: "∞", label: "Vidas Transformadas" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.9, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const floatingParticle = (delay: number, duration: number) => ({
  y: [0, -25, 0],
  x: [0, 8, 0],
  opacity: [0.2, 0.8, 0.2],
  scale: [0.8, 1.2, 0.8],
  transition: { duration, delay, repeat: Infinity, ease: "easeInOut" as const },
});

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="overflow-hidden">
      {/* Hero Section — Enhanced with particles and parallax */}
      <section ref={heroRef} className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
        {/* Animated background layers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] max-w-[900px] max-h-[900px] rounded-full bg-[radial-gradient(circle,hsl(250,45%,28%/0.35)_0%,transparent_60%)]" />
          <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] max-w-[520px] max-h-[520px] rounded-full bg-[radial-gradient(circle,hsl(42,65%,55%/0.15)_0%,transparent_65%)]" />
          {/* Animated glow ring */}
          <motion.div
            className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[650px] max-h-[650px] rounded-full border border-[hsl(42,55%,52%/0.15)]"
            animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-[hsl(var(--gold))]"
              style={{
                left: `${15 + i * 14}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={floatingParticle(i * 0.6, 3 + i * 0.5)}
            />
          ))}
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container relative z-10 py-24">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div custom={0} variants={fadeUp} className="mb-5">
              <motion.span
                className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-5 py-1.5 text-sm font-medium text-accent"
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px hsl(265 30% 55% / 0.3)" }}
              >
                <Star className="h-3.5 w-3.5 animate-[pulse_2s_ease-in-out_infinite]" /> Plataforma para Pregadores do Evangelho
              </motion.span>
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              className="mb-6 font-serif text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl md:text-7xl text-foreground"
            >
              Palavra que fortalece e{" "}
              <motion.span
                className="text-gradient-gold inline-block"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: "200% 200%" }}
              >
                transforma vidas
              </motion.span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              className="mb-10 text-lg sm:text-xl leading-relaxed text-muted-foreground max-w-2xl mx-auto"
            >
              Um espaço de acolhimento e estudo para quem deseja aprofundar‑se
              na Palavra de Deus e levar esperança a cada coração.
            </motion.p>

            <motion.div custom={3} variants={fadeUp} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/biblioteca">
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" className="bg-gradient-gold text-background hover:opacity-90 gap-2 text-base px-8 shadow-gold relative overflow-hidden group">
                    <span className="absolute inset-0 bg-[hsl(0,0%,100%/0.15)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg]" />
                    <BookOpen className="h-5 w-5" /> Explorar pregações
                  </Button>
                </motion.div>
              </Link>
              <Link to="/estudo-biblico">
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" variant="outline" className="gap-2 text-base border-border text-foreground hover:bg-muted">
                    <Sparkles className="h-5 w-5" /> Estudar a Bíblia
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Animated scroll indicator */}
            <motion.div
              custom={4}
              variants={fadeUp}
              className="mt-16 flex justify-center"
            >
              <motion.div
                className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-accent"
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Counter Section */}
      <section className="relative py-16 bg-muted/30 border-y border-border/30">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                custom={i}
                variants={fadeUp}
                className="text-center group"
              >
                <motion.div
                  className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent"
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <s.icon className="h-6 w-6" />
                </motion.div>
                <motion.p
                  className="text-3xl font-serif font-bold text-foreground"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15, type: "spring" }}
                >
                  {s.value}
                </motion.p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bible Landscape Parallax Divider */}
      <section className="relative h-[40vh] min-h-[250px] overflow-hidden">
        <motion.img
          src={bibleLandscape}
          alt="Paisagem bíblica - Monte das Oliveiras ao pôr do sol"
          className="w-full h-full object-cover"
          loading="lazy"
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.p
            className="font-serif text-2xl sm:text-3xl font-bold text-primary-foreground drop-shadow-lg text-center px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            "Lâmpada para os meus pés é a tua <span className="text-gradient-gold">Palavra</span>"
          </motion.p>
        </div>
      </section>

      {/* Features Grid — Enhanced with colored gradients and hover glow */}
      <section className="py-24 bg-background relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[radial-gradient(circle,hsl(42,55%,52%/0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[radial-gradient(circle,hsl(265,30%,55%/0.05)_0%,transparent_70%)] pointer-events-none" />

        <div className="container relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div custom={0} variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1 text-xs font-semibold text-accent uppercase tracking-widest mb-4">
                <Zap className="h-3 w-3" /> 11 Ferramentas Integradas
              </span>
            </motion.div>
            <motion.h2 custom={1} variants={fadeUp} className="font-serif text-3xl font-bold sm:text-5xl">
              Tudo que o <span className="text-gradient-gold">Pregador</span> Precisa
            </motion.h2>
            <motion.p custom={2} variants={fadeUp} className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              Ferramentas completas para estudo, preparação e apresentação de mensagens bíblicas com profundidade e unção.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                variants={fadeUp}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <Link to={f.link}>
                  <Card className="group h-full cursor-pointer border-border/40 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-accent/30 relative overflow-hidden">
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--accent)/0.08)_0%,transparent_60%)]" />
                    <CardContent className="p-6 relative">
                      <motion.div
                        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} shadow-lg`}
                        whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                      >
                        <f.icon className="h-6 w-6 text-primary-foreground" />
                      </motion.div>
                      <h3 className="mb-2 font-serif text-lg font-semibold">{f.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                      <div className="mt-4 flex items-center text-sm font-medium text-accent gap-1 group-hover:gap-2 transition-all">
                        Acessar <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Scrolls Image Divider */}
      <section className="relative h-[35vh] min-h-[220px] overflow-hidden">
        <motion.img
          src={bibleScrolls}
          alt="Pergaminhos bíblicos antigos com cruz e luz dourada"
          className="w-full h-full object-cover"
          loading="lazy"
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/40" />
      </section>

      {/* Conteúdos em Destaque — Enhanced */}
      <section className="py-24">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger} className="text-center mb-14">
            <motion.h2 custom={0} variants={fadeUp} className="font-serif text-3xl font-bold sm:text-5xl">
              Conteúdos <span className="text-gradient-gold">em Destaque</span>
            </motion.h2>
            <motion.p custom={1} variants={fadeUp} className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              Materiais prontos para edificar sua vida e fortalecer seu ministério.
            </motion.p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              { icon: Mic, title: "Esboços de Pregação", desc: "Sermões completos com introdução, desenvolvimento e aplicação prática, gerados por IA com base bíblica sólida.", link: "/gerador-pregacoes", cta: "Gerar esboço" },
              { icon: BookMarked, title: "Mensagens Bíblicas", desc: "Pregações organizadas por temas como Fé, Avivamento, Santidade e Salvação, prontas para uso no púlpito.", link: "/biblioteca", cta: "Ver mensagens" },
              { icon: ScrollText, title: "Estudos Bíblicos", desc: "Estudos aprofundados dos 66 livros da Bíblia com esboços, temas centrais e análises temáticas transversais.", link: "/estudo-biblico", cta: "Explorar estudos" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30, rotateX: 5 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -6 }}
              >
                <Link to={item.link}>
                  <Card className="group h-full border-border/40 hover:border-accent/30 transition-all duration-300 hover:shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardContent className="p-8 text-center">
                      <motion.div
                        className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10"
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <item.icon className="h-8 w-8 text-accent" />
                      </motion.div>
                      <h3 className="font-serif text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.desc}</p>
                      <span className="text-sm font-medium text-accent flex items-center justify-center gap-1 group-hover:gap-2 transition-all">
                        {item.cta} <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Theme Tags — Enhanced with floating animation */}
      <section className="py-20 bg-muted/50 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,hsl(42,55%,52%/0.06)_0%,transparent_60%)] pointer-events-none" />
        <div className="container text-center relative">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
            <motion.h2 custom={0} variants={fadeUp} className="font-serif text-3xl font-bold sm:text-4xl mb-4">
              Pregações por <span className="text-gradient-gold">Temas</span>
            </motion.h2>
            <motion.p custom={1} variants={fadeUp} className="text-muted-foreground mb-10 max-w-xl mx-auto">
              Encontre mensagens prontas organizadas por categorias espirituais.
            </motion.p>
            <motion.div custom={2} variants={fadeUp} className="flex flex-wrap justify-center gap-3">
              {themes.map((t, i) => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4, type: "spring" }}
                  whileHover={{ scale: 1.1, y: -3 }}
                >
                  <Link to={`/biblioteca?tema=${t.toLowerCase()}`}>
                    <span className="inline-flex items-center rounded-full border border-[hsl(var(--gold)/0.3)] bg-card px-6 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-accent hover:text-accent-foreground hover:shadow-gold hover:border-accent cursor-pointer">
                      {t}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Devocional Preview with Background Image — Enhanced */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <motion.img
            src={bibleCross}
            alt="Cruz ao nascer do sol"
            className="w-full h-full object-cover"
            loading="lazy"
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px]" />
        </div>
        <div className="container relative z-10">
          <div className="mx-auto max-w-2xl text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.h2 custom={0} variants={fadeUp} className="font-serif text-3xl sm:text-4xl font-bold mb-2 text-foreground">
                ✨ Devocional do Dia
              </motion.h2>
              <motion.div custom={1} variants={fadeUp}>
                <Card className="mt-8 overflow-hidden border-[hsl(var(--gold)/0.3)] bg-card/90 backdrop-blur-md shadow-2xl">
                  <div className="h-1 bg-gradient-gold" />
                  <CardContent className="p-10">
                    <motion.p
                      className="font-serif text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-6"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      Versículo do Dia
                    </motion.p>
                    <blockquote className="text-xl sm:text-2xl font-serif italic text-foreground leading-relaxed mb-5">
                      "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito,
                      para que todo aquele que nele crê não pereça, mas tenha a vida eterna."
                    </blockquote>
                    <p className="text-sm font-semibold text-muted-foreground">— João 3:16</p>
                    <div className="mt-8">
                      <Link to="/devocional">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                          <Button className="bg-gradient-gold text-background hover:opacity-90 gap-2 shadow-gold">
                            Ler Devocional Completo <ArrowRight className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials — Enhanced with glass morphism */}
      <section className="py-24 bg-gradient-celestial text-primary-foreground relative overflow-hidden">
        {/* Decorative orbs */}
        <motion.div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[hsl(42,55%,52%/0.08)]"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-[hsl(265,30%,55%/0.1)]"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 15, repeat: Infinity }}
        />

        <div className="container relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.h2 custom={0} variants={fadeUp} className="font-serif text-3xl font-bold sm:text-4xl">
              Impacto no <span className="text-gradient-gold">Ministério</span>
            </motion.h2>
            <motion.p custom={1} variants={fadeUp} className="mt-3 text-primary-foreground/70 max-w-xl mx-auto">
              Veja como pregadores estão sendo transformados pela plataforma.
            </motion.p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6, type: "spring" }}
                whileHover={{ y: -5 }}
              >
                <Card className="bg-primary-foreground/10 border-primary-foreground/15 text-primary-foreground backdrop-blur-md h-full">
                  <CardContent className="p-7">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <motion.div
                          key={j}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.15 + j * 0.08, duration: 0.3 }}
                        >
                          <Star className="h-4 w-4 fill-[hsl(var(--gold))] text-[hsl(var(--gold))]" />
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-sm italic mb-5 text-primary-foreground/85 leading-relaxed">"{t.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-gold text-background font-bold text-sm">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-serif font-semibold text-sm">{t.name}</p>
                        <p className="text-xs text-primary-foreground/55">{t.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — Enhanced with shimmer effect */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[radial-gradient(ellipse,hsl(42,55%,52%/0.08)_0%,transparent_60%)]" />
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="container text-center relative"
        >
          <motion.div custom={0} variants={fadeUp} className="mb-6">
            <Shield className="h-12 w-12 mx-auto text-accent mb-4" />
          </motion.div>
          <motion.h2 custom={1} variants={fadeUp} className="font-serif text-3xl font-bold sm:text-5xl mb-5">
            Comece a Preparar Pregações <span className="text-gradient-gold">Poderosas</span>
          </motion.h2>
          <motion.p custom={2} variants={fadeUp} className="text-muted-foreground mb-10 max-w-xl mx-auto text-lg">
            Cadastre-se gratuitamente e tenha acesso a todas as ferramentas para fortalecer seu ministério.
          </motion.p>
          <motion.div custom={3} variants={fadeUp}>
            <Link to="/login">
              <motion.div whileHover={{ scale: 1.07, y: -3 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" className="bg-gradient-gold text-background hover:opacity-90 gap-2 text-lg px-12 py-6 shadow-gold relative overflow-hidden group">
                  <span className="absolute inset-0 bg-[hsl(0,0%,100%/0.15)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg]" />
                  Começar Agora <ArrowRight className="h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
