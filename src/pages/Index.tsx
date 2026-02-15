import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen, Sparkles, FileText, Mic, GraduationCap, Languages,
  HelpCircle, Calendar, ArrowRight, Cross, Star, Users, ChevronRight
} from "lucide-react";

const features = [
  { icon: BookOpen, title: "Estudo Bíblico Avançado", desc: "Bíblia completa com busca, comparação e comentários teológicos.", link: "/estudo-biblico" },
  { icon: Sparkles, title: "Gerador de Pregações (IA)", desc: "Esboços e sermões completos gerados por inteligência artificial.", link: "/gerador-pregacoes" },
  { icon: FileText, title: "Biblioteca de Mensagens", desc: "Pregações organizadas por temas com texto base e aplicação.", link: "/biblioteca" },
  { icon: Mic, title: "Multimídia", desc: "PDF, áudio, slides e downloads de materiais para pregação.", link: "/multimidia" },
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
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const Index = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-gradient-celestial text-primary-foreground">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gold/10 blur-3xl animate-glow-pulse" />
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-celestial-glow/20 blur-3xl animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
            <Cross className="h-[500px] w-[500px]" strokeWidth={0.5} />
          </div>
        </div>

        <div className="container relative z-10 py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div variants={fadeUp} className="mb-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold-light">
                <Star className="h-3.5 w-3.5" /> Plataforma para Pregadores do Evangelho
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mb-6 font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl"
            >
              Preparando Pregadores{" "}
              <span className="text-gradient-gold">Cheios da Palavra</span>{" "}
              e do Espírito
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mb-8 text-lg text-primary-foreground/80 sm:text-xl"
            >
              Transforme vidas através da pregação do Evangelho com ferramentas
              poderosas de estudo bíblico, geração de sermões e materiais multimídia.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/gerador-pregacoes">
                <Button size="lg" className="bg-gradient-gold text-background hover:opacity-90 gap-2 text-base px-8">
                  <Sparkles className="h-5 w-5" /> Gerar Pregação com IA
                </Button>
              </Link>
              <Link to="/estudo-biblico">
                <Button size="lg" variant="outline" className="gap-2 text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  <BookOpen className="h-5 w-5" /> Estudar a Bíblia
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 flex items-center justify-center gap-8 text-sm text-primary-foreground/60">
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

      {/* Features Grid */}
      <section className="py-20">
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
                  <Card className="group h-full cursor-pointer border-border/50 transition-all hover:shadow-celestial hover:border-celestial/30 hover:-translate-y-1">
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

      {/* Theme Tags */}
      <section className="py-16 bg-muted/50">
        <div className="container text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">
            Pregações por <span className="text-gradient-gold">Temas</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Encontre mensagens prontas organizadas por categorias espirituais.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {themes.map((t) => (
              <Link key={t} to={`/biblioteca?tema=${t.toLowerCase()}`}>
                <span className="inline-flex items-center rounded-full border border-gold/30 bg-card px-5 py-2 text-sm font-medium text-foreground transition-all hover:bg-accent hover:text-accent-foreground hover:shadow-gold cursor-pointer">
                  {t}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Devocional Preview */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.h2 variants={fadeUp} className="font-serif text-3xl font-bold mb-2">
                Devocional do Dia
              </motion.h2>
              <motion.div variants={fadeUp}>
                <Card className="mt-6 overflow-hidden border-gold/20">
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
          <h2 className="font-serif text-3xl font-bold text-center mb-12">
            Impacto no <span className="text-gradient-gold">Ministério</span>
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="text-sm italic mb-4 text-primary-foreground/90">"{t.text}"</p>
                  <div>
                    <p className="font-serif font-semibold">{t.name}</p>
                    <p className="text-xs text-primary-foreground/60">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">
            Comece a Preparar Pregações <span className="text-gradient-gold">Poderosas</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Cadastre-se gratuitamente e tenha acesso a todas as ferramentas para fortalecer seu ministério.
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-gradient-gold text-background hover:opacity-90 gap-2 text-base px-10">
              Começar Agora <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
