import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen, Sparkles, FileText, Mic, GraduationCap, Languages,
  HelpCircle, Calendar, ArrowRight, Star, Users, ChevronRight, Mic, BookMarked, ScrollText
} from "lucide-react";


import bibleLandscape from "@/assets/bible-landscape.jpg";
import bibleScrolls from "@/assets/bible-scrolls.jpg";
import bibleCross from "@/assets/bible-cross.jpg";

const features = [
  { icon: BookOpen, title: "Estudo Bíblico Avançado", desc: "Bíblia completa com busca, comparação e comentários teológicos.", link: "/estudo-biblico" },
  { icon: Sparkles, title: "Gerador de Pregações (IA)", desc: "Esboços e sermões completos gerados por inteligência artificial.", link: "/gerador-pregacoes" },
  { icon: FileText, title: "Biblioteca de Mensagens", desc: "Pregações organizadas por temas com texto base e aplicação.", link: "/biblioteca" },
  { icon: GraduationCap, title: "Curso de Teologia", desc: "Estudo completo de teologia sistemática com IA para tirar dúvidas.", link: "/curso-teologia" },
  { icon: Languages, title: "Dicionário Hebraico/Grego", desc: "Palavras bíblicas com significado teológico e pronúncia.", link: "/dicionario" },
  { icon: HelpCircle, title: "Questionários Espirituais", desc: "Testes bíblicos, desafios e reflexões para crescimento.", link: "/questionarios" },
  { icon: Calendar, title: "Devocional Diário", desc: "Versículo do dia, reflexão e oração gerados por IA.", link: "/devocional" },
  { icon: GraduationCap, title: "Área do Pregador", desc: "Salve seus sermões, anotações e acesse seu histórico.", link: "/login" },
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

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const Index = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section — Spiritual & Light */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Layered light gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(235,40%,9%)] via-[hsl(248,32%,13%)] to-[hsl(228,42%,7%)]" />
          {/* Central divine glow */}
          <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] max-w-[900px] max-h-[900px] rounded-full bg-[radial-gradient(circle,hsl(250,45%,28%/0.5)_0%,hsl(240,35%,18%/0.2)_40%,transparent_70%)]" />
          {/* Warm golden halo */}
          <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] max-w-[520px] max-h-[520px] rounded-full bg-[radial-gradient(circle,hsl(40,65%,55%/0.12)_0%,hsl(40,50%,45%/0.04)_50%,transparent_70%)]" />
          {/* Soft upper light beam */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[55vh] max-w-[650px] bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,hsl(220,50%,40%/0.15)_0%,transparent_100%)]" />
          {/* Subtle bottom fade */}
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[hsl(230,42%,7%)] to-transparent" />
        </div>

        <div className="container relative z-10 py-24">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div variants={fadeUp} className="mb-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--gold))/0.3] bg-[hsl(var(--gold))/0.08] px-5 py-1.5 text-sm font-medium text-[hsl(var(--gold-light))]">
                <Star className="h-3.5 w-3.5" /> Plataforma para Pregadores do Evangelho
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mb-6 font-serif text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl md:text-6xl text-[hsl(220,20%,95%)]"
            >
              Palavra que fortalece e{" "}
              <span className="text-gradient-gold">transforma vidas</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mb-10 text-lg sm:text-xl leading-relaxed text-[hsl(220,20%,85%/0.85)] max-w-2xl mx-auto"
            >
              Um espaço de acolhimento e estudo para quem deseja aprofundar‑se
              na Palavra de Deus e levar esperança a cada coração.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/biblioteca">
                <Button size="lg" className="bg-gradient-gold text-background hover:opacity-90 gap-2 text-base px-8 shadow-gold">
                  <BookOpen className="h-5 w-5" /> Explorar pregações
                </Button>
              </Link>
              <Link to="/estudo-biblico">
                <Button size="lg" variant="outline" className="gap-2 text-base border-[hsl(220,20%,85%)/0.2] text-[hsl(220,20%,90%)] hover:bg-[hsl(220,20%,90%)/0.08]">
                  <Sparkles className="h-5 w-5" /> Estudar a Bíblia
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-12 flex items-center justify-center gap-8 text-sm text-[hsl(220,20%,80%)/0.5] flex-wrap">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>+1.000 pregadores</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>66 livros da Bíblia</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>IA avançada</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Bible Landscape Parallax Divider */}
      <section className="relative h-[40vh] min-h-[250px] overflow-hidden">
        <img
          src={bibleLandscape}
          alt="Paisagem bíblica - Monte das Oliveiras ao pôr do sol"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/30" />
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.h2 variants={fadeUp} className="font-serif text-3xl font-bold sm:text-4xl">
              Tudo que o <span className="text-gradient-gold">Pregador</span> Precisa
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Ferramentas completas para estudo, preparação e apresentação de mensagens bíblicas com profundidade e unção.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeUp}>
                <Link to={f.link}>
                  <Card className="group h-full cursor-pointer border-border/50 transition-all hover:shadow-celestial hover:border-[hsl(var(--celestial))/0.3] hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-gold shadow-gold">
                        <f.icon className="h-6 w-6 text-background" />
                      </div>
                      <h3 className="mb-2 font-serif text-lg font-semibold">{f.title}</h3>
                      <p className="text-sm text-muted-foreground">{f.desc}</p>
                      <div className="mt-4 flex items-center text-sm font-medium text-accent group-hover:gap-2 transition-all">
                        Acessar <ChevronRight className="h-4 w-4" />
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
        <img
          src={bibleScrolls}
          alt="Pergaminhos bíblicos antigos com cruz e luz dourada"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/40" />
      </section>

      {/* Conteúdos em Destaque */}
      <section className="py-20">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger} className="text-center mb-12">
            <motion.h2 variants={fadeUp} className="font-serif text-3xl font-bold sm:text-4xl">
              Conteúdos <span className="text-gradient-gold">em Destaque</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Materiais prontos para edificar sua vida e fortalecer seu ministério.
            </motion.p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <Link to="/gerador-pregacoes">
                <Card className="group h-full border-border/50 hover:border-[hsl(var(--gold))/0.4] transition-all hover:-translate-y-1 hover:shadow-gold">
                  <CardContent className="p-8 text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
                      <Mic className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="font-serif text-xl font-bold mb-2">Esboços de Pregação</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      Sermões completos com introdução, desenvolvimento e aplicação prática, gerados por IA com base bíblica sólida.
                    </p>
                    <span className="text-sm font-medium text-accent flex items-center justify-center gap-1 group-hover:gap-2 transition-all">
                      Gerar esboço <ChevronRight className="h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.12 }}>
              <Link to="/biblioteca">
                <Card className="group h-full border-border/50 hover:border-[hsl(var(--gold))/0.4] transition-all hover:-translate-y-1 hover:shadow-gold">
                  <CardContent className="p-8 text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
                      <BookMarked className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="font-serif text-xl font-bold mb-2">Mensagens Bíblicas</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      Pregações organizadas por temas como Fé, Avivamento, Santidade e Salvação, prontas para uso no púlpito.
                    </p>
                    <span className="text-sm font-medium text-accent flex items-center justify-center gap-1 group-hover:gap-2 transition-all">
                      Ver mensagens <ChevronRight className="h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.24 }}>
              <Link to="/estudo-biblico">
                <Card className="group h-full border-border/50 hover:border-[hsl(var(--gold))/0.4] transition-all hover:-translate-y-1 hover:shadow-gold">
                  <CardContent className="p-8 text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
                      <ScrollText className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="font-serif text-xl font-bold mb-2">Estudos Bíblicos</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      Estudos aprofundados dos 66 livros da Bíblia com esboços, temas centrais e análises temáticas transversais.
                    </p>
                    <span className="text-sm font-medium text-accent flex items-center justify-center gap-1 group-hover:gap-2 transition-all">
                      Explorar estudos <ChevronRight className="h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Theme Tags */}
      <section className="py-16 bg-muted/50">
        <div className="container text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="font-serif text-3xl font-bold mb-4">
              Pregações por <span className="text-gradient-gold">Temas</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Encontre mensagens prontas organizadas por categorias espirituais.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
              {themes.map((t, i) => (
                <motion.div key={t} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04, duration: 0.4 }}>
                  <Link to={`/biblioteca?tema=${t.toLowerCase()}`}>
                    <span className="inline-flex items-center rounded-full border border-[hsl(var(--gold))/0.3] bg-card px-5 py-2 text-sm font-medium text-foreground transition-all hover:bg-accent hover:text-accent-foreground hover:shadow-gold cursor-pointer">
                      {t}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Devocional Preview with Background Image */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={bibleCross} alt="Cruz ao nascer do sol" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-[hsl(222,47%,6%)/0.7]" />
        </div>
        <div className="container relative z-10">
          <div className="mx-auto max-w-2xl text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.h2 variants={fadeUp} className="font-serif text-3xl font-bold mb-2 text-[hsl(40,60%,90%)]">
                Devocional do Dia
              </motion.h2>
              <motion.div variants={fadeUp}>
                <Card className="mt-6 overflow-hidden border-[hsl(var(--gold))/0.3] bg-card/90 backdrop-blur-md">
                  <CardContent className="p-8">
                    <p className="font-serif text-sm font-semibold text-accent uppercase tracking-widest mb-4">
                      Versículo do Dia
                    </p>
                    <blockquote className="text-xl font-serif italic text-foreground leading-relaxed mb-4">
                      "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito,
                      para que todo aquele que nele crê não pereça, mas tenha a vida eterna."
                    </blockquote>
                    <p className="text-sm font-semibold text-muted-foreground">— João 3:16</p>
                    <div className="mt-6">
                      <Link to="/devocional">
                        <Button variant="outline" className="gap-2">
                          Ler Devocional Completo <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-celestial text-primary-foreground">
        <div className="container">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={fadeUp} className="font-serif text-3xl font-bold text-center mb-12">
            Impacto no <span className="text-gradient-gold">Ministério</span>
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }}>
                <Card className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-[hsl(var(--gold))] text-[hsl(var(--gold))]" />
                      ))}
                    </div>
                    <p className="text-sm italic mb-4 text-primary-foreground/90">"{t.text}"</p>
                    <div>
                      <p className="font-serif font-semibold">{t.name}</p>
                      <p className="text-xs text-primary-foreground/60">{t.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger} className="container text-center">
          <motion.h2 variants={fadeUp} className="font-serif text-3xl font-bold mb-4">
            Comece a Preparar Pregações <span className="text-gradient-gold">Poderosas</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Cadastre-se gratuitamente e tenha acesso a todas as ferramentas para fortalecer seu ministério.
          </motion.p>
          <motion.div variants={scaleIn}>
            <Link to="/login">
              <Button size="lg" className="bg-gradient-gold text-background hover:opacity-90 gap-2 text-base px-10">
                Começar Agora <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
