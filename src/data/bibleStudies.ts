import {
  BookOpen, ScrollText, Landmark, Crown, Music2, Flame, Heart, Star,
  Shield, Sword, Eye, Feather, Scale, Sparkles, Cross, Sun, Zap,
  Globe, Wheat, Mountain, Anchor, Lightbulb, HandMetal, Gem, Bird,
  TreePine, Compass, Flag, Infinity, Flower2, Drama, Target,
  CircleDot, Waypoints, Milestone, GraduationCap, Handshake
} from "lucide-react";

export interface BibleStudy {
  book: string;
  group: string;
  testament: "VT" | "NT";
  title: string;
  theme: string;
  description: string;
  icon: any;
  keyVerses: string[];
  outline: string[];
  application: string;
}

export const COMPLETE_BIBLE_STUDIES: BibleStudy[] = [
  // ===== PENTATEUCO =====
  {
    book: "Gênesis", group: "Pentateuco", testament: "VT",
    title: "O Princípio de Todas as Coisas",
    theme: "Criação e Aliança",
    description: "A origem do universo, da humanidade e do plano redentor de Deus. Deus cria, o homem cai, e Deus inicia Sua aliança com Abraão.",
    icon: Globe,
    keyVerses: ["Gênesis 1:1", "Gênesis 12:1-3", "Gênesis 3:15", "Gênesis 15:6"],
    outline: [
      "A Criação (cap. 1-2): Deus como Criador soberano",
      "A Queda (cap. 3): O pecado e a promessa do Redentor",
      "O Dilúvio e Noé (cap. 6-9): Juízo e graça",
      "A Torre de Babel (cap. 11): O orgulho humano",
      "Abraão — o pai da fé (cap. 12-25): Aliança e promessa",
      "Isaque e Jacó (cap. 25-36): Continuidade da aliança",
      "José no Egito (cap. 37-50): A providência de Deus"
    ],
    application: "Deus tem um plano desde a fundação do mundo. Mesmo diante do pecado, Ele oferece redenção. Confie na Sua soberania."
  },
  {
    book: "Êxodo", group: "Pentateuco", testament: "VT",
    title: "Libertação e Lei",
    theme: "Redenção e Aliança no Sinai",
    description: "Deus liberta Israel da escravidão no Egito, revela Sua lei no Sinai e habita no meio do Seu povo através do Tabernáculo.",
    icon: Flame,
    keyVerses: ["Êxodo 3:14", "Êxodo 12:13", "Êxodo 20:1-3", "Êxodo 33:14"],
    outline: [
      "A escravidão e o chamado de Moisés (cap. 1-4)",
      "As dez pragas e o poder de Deus (cap. 5-12)",
      "A Páscoa — tipo de Cristo (cap. 12)",
      "A travessia do Mar Vermelho (cap. 14)",
      "Os Dez Mandamentos (cap. 20)",
      "O Tabernáculo — a presença de Deus (cap. 25-40)"
    ],
    application: "Assim como Deus libertou Israel, Ele nos liberta do pecado pelo sangue de Cristo, o Cordeiro Pascal."
  },
  {
    book: "Levítico", group: "Pentateuco", testament: "VT",
    title: "Santidade ao Senhor",
    theme: "Santificação e Adoração",
    description: "Manual de adoração e santidade. Ensina como um povo pecador pode se aproximar de um Deus santo através de sacrifícios e purificação.",
    icon: Star,
    keyVerses: ["Levítico 11:44", "Levítico 17:11", "Levítico 19:2", "Levítico 16:30"],
    outline: [
      "Os cinco tipos de ofertas (cap. 1-7)",
      "Consagração dos sacerdotes (cap. 8-10)",
      "Leis de pureza e impureza (cap. 11-15)",
      "O Dia da Expiação (cap. 16)",
      "O código de santidade (cap. 17-26)",
      "Votos e dízimos (cap. 27)"
    ],
    application: "Cristo é nosso sacrifício perfeito. Somos chamados à santidade porque Deus é santo."
  },
  {
    book: "Números", group: "Pentateuco", testament: "VT",
    title: "Peregrinação no Deserto",
    theme: "Fidelidade e Disciplina",
    description: "A jornada de Israel pelo deserto. Murmurações, rebeliões e a fidelidade de Deus mesmo diante da infidelidade do povo.",
    icon: Compass,
    keyVerses: ["Números 6:24-26", "Números 14:18", "Números 23:19", "Números 21:8-9"],
    outline: [
      "O censo e a organização do povo (cap. 1-4)",
      "Leis e purificação (cap. 5-10)",
      "As murmurações e a rebelião (cap. 11-14)",
      "A rebelião de Corá (cap. 16)",
      "A serpente de bronze — tipo de Cristo (cap. 21)",
      "Balaão e as bênçãos sobre Israel (cap. 22-24)",
      "Preparação para Canaã (cap. 26-36)"
    ],
    application: "O deserto é escola de Deus. Ele nos disciplina por amor e nos prepara para a terra da promessa."
  },
  {
    book: "Deuteronômio", group: "Pentateuco", testament: "VT",
    title: "A Segunda Lei",
    theme: "Renovação da Aliança",
    description: "Moisés recapitula a lei e a história de Israel antes de entrar na Terra Prometida. Um chamado à obediência e ao amor a Deus.",
    icon: ScrollText,
    keyVerses: ["Deuteronômio 6:4-5", "Deuteronômio 28:1", "Deuteronômio 30:19", "Deuteronômio 31:6"],
    outline: [
      "Recapitulação histórica (cap. 1-4)",
      "Repetição dos Dez Mandamentos (cap. 5)",
      "O Shemá — amar a Deus sobre tudo (cap. 6)",
      "Bênçãos e maldições (cap. 28)",
      "Renovação da aliança (cap. 29-30)",
      "A despedida e morte de Moisés (cap. 31-34)"
    ],
    application: "Amar a Deus de todo o coração é o mandamento principal. A obediência traz bênção, a desobediência traz consequências."
  },

  // ===== HISTÓRICOS AT =====
  {
    book: "Josué", group: "Históricos", testament: "VT",
    title: "Conquista da Terra Prometida",
    theme: "Fé e Vitória",
    description: "Josué lidera Israel na conquista de Canaã. A fidelidade de Deus em cumprir Suas promessas através da fé e obediência.",
    icon: Flag,
    keyVerses: ["Josué 1:8-9", "Josué 24:15", "Josué 21:45", "Josué 6:20"],
    outline: [
      "A comissão de Josué (cap. 1)",
      "A espionagem de Jericó e Raabe (cap. 2)",
      "A travessia do Jordão (cap. 3-4)",
      "A queda de Jericó (cap. 6)",
      "O pecado de Acã (cap. 7)",
      "A conquista e divisão da terra (cap. 10-21)",
      "O discurso de despedida de Josué (cap. 23-24)"
    ],
    application: "Deus cumpre Suas promessas. Coragem e obediência são necessárias para conquistar o que Ele preparou para nós."
  },
  {
    book: "Juízes", group: "Históricos", testament: "VT",
    title: "Ciclos de Pecado e Libertação",
    theme: "Consequência e Misericórdia",
    description: "Israel cai em ciclos repetidos de pecado, opressão, arrependimento e livramento. Deus levanta juízes para salvar Seu povo.",
    icon: Scale,
    keyVerses: ["Juízes 2:16", "Juízes 6:12", "Juízes 21:25", "Juízes 16:28"],
    outline: [
      "O ciclo de desobediência (cap. 2)",
      "Débora — a juíza profetisa (cap. 4-5)",
      "Gideão — vitória na fraqueza (cap. 6-8)",
      "Jefté e seu voto (cap. 11)",
      "Sansão — força e fraqueza (cap. 13-16)",
      "O caos moral de Israel (cap. 17-21)"
    ],
    application: "Sem submissão a Deus, cada um faz o que parece certo aos seus olhos. A obediência é o caminho da verdadeira liberdade."
  },
  {
    book: "Rute", group: "Históricos", testament: "VT",
    title: "Redenção e Fidelidade",
    theme: "Amor e Providência",
    description: "A história de Rute, a moabita, que por sua lealdade a Noemi, encontra redenção em Boaz — um tipo de Cristo, nosso Redentor.",
    icon: Heart,
    keyVerses: ["Rute 1:16", "Rute 2:12", "Rute 4:14", "Rute 3:9"],
    outline: [
      "A tragédia de Noemi e a lealdade de Rute (cap. 1)",
      "Rute nos campos de Boaz (cap. 2)",
      "O pedido de redenção (cap. 3)",
      "Boaz como resgatador — tipo de Cristo (cap. 4)"
    ],
    application: "Deus trabalha nos bastidores. A fidelidade e a lealdade são recompensadas pela graça divina."
  },
  {
    book: "1 Samuel", group: "Históricos", testament: "VT",
    title: "Do Sacerdócio à Monarquia",
    theme: "Chamado e Obediência",
    description: "A transição de Israel do período dos juízes para a monarquia. Samuel, Saul e a ascensão de Davi.",
    icon: Crown,
    keyVerses: ["1 Samuel 3:10", "1 Samuel 15:22", "1 Samuel 16:7", "1 Samuel 17:45"],
    outline: [
      "O nascimento e chamado de Samuel (cap. 1-3)",
      "A arca capturada e devolvida (cap. 4-7)",
      "Israel pede um rei — Saul é ungido (cap. 8-12)",
      "A desobediência de Saul (cap. 13-15)",
      "Davi é ungido e enfrenta Golias (cap. 16-17)",
      "A perseguição de Davi por Saul (cap. 18-31)"
    ],
    application: "Deus olha o coração, não a aparência. Obediência vale mais que sacrifício."
  },
  {
    book: "2 Samuel", group: "Históricos", testament: "VT",
    title: "O Reinado de Davi",
    theme: "Graça e Consequência",
    description: "Davi reina sobre Israel. Suas vitórias, seu pecado com Bate-Seba e a aliança davídica que aponta para Cristo.",
    icon: Crown,
    keyVerses: ["2 Samuel 7:16", "2 Samuel 12:13", "2 Samuel 22:2-3", "2 Samuel 24:24"],
    outline: [
      "Davi é feito rei sobre Judá e depois sobre todo Israel (cap. 1-5)",
      "A arca em Jerusalém (cap. 6)",
      "A aliança davídica — promessa messiânica (cap. 7)",
      "O pecado com Bate-Seba (cap. 11-12)",
      "A rebelião de Absalão (cap. 15-18)",
      "Os últimos anos de Davi (cap. 19-24)"
    ],
    application: "O pecado tem consequências, mas o arrependimento sincero encontra misericórdia. A aliança de Deus é eterna."
  },
  {
    book: "1 Reis", group: "Históricos", testament: "VT",
    title: "Glória e Divisão",
    theme: "Sabedoria e Apostasia",
    description: "O reinado de Salomão, a construção do Templo e a trágica divisão do reino. O profeta Elias confronta a idolatria.",
    icon: Landmark,
    keyVerses: ["1 Reis 3:9", "1 Reis 8:27", "1 Reis 18:21", "1 Reis 19:12"],
    outline: [
      "Salomão pede sabedoria (cap. 3)",
      "A construção e dedicação do Templo (cap. 5-8)",
      "A glória e queda de Salomão (cap. 9-11)",
      "A divisão do reino (cap. 12)",
      "Elias no Monte Carmelo (cap. 18)",
      "A voz mansa e delicada (cap. 19)"
    ],
    application: "A sabedoria sem obediência leva à queda. Permaneça fiel a Deus em todas as circunstâncias."
  },
  {
    book: "2 Reis", group: "Históricos", testament: "VT",
    title: "Decadência e Exílio",
    theme: "Juízo e Esperança",
    description: "O declínio dos reinos de Israel e Judá, o ministério de Eliseu e o exílio como consequência da persistente desobediência.",
    icon: Sword,
    keyVerses: ["2 Reis 2:9", "2 Reis 5:14", "2 Reis 17:7-8", "2 Reis 22:13"],
    outline: [
      "Eliseu sucede Elias — porção dobrada (cap. 2)",
      "Milagres de Eliseu (cap. 4-6)",
      "Naamã curado da lepra (cap. 5)",
      "Queda do reino do Norte — Assíria (cap. 17)",
      "O avivamento de Josias (cap. 22-23)",
      "Queda de Jerusalém — Babilônia (cap. 25)"
    ],
    application: "O juízo é real, mas Deus sempre preserva um remanescente. O arrependimento genuíno traz avivamento."
  },
  {
    book: "1 Crônicas", group: "Históricos", testament: "VT",
    title: "A Linhagem do Messias",
    theme: "Adoração e Genealogia",
    description: "Genealogias de Israel e o reinado de Davi sob a perspectiva da adoração e do preparo para o Templo.",
    icon: TreePine,
    keyVerses: ["1 Crônicas 16:11", "1 Crônicas 29:11-12", "1 Crônicas 4:10", "1 Crônicas 17:14"],
    outline: [
      "Genealogias de Adão a Davi (cap. 1-9)",
      "A oração de Jabez (cap. 4:9-10)",
      "Davi é feito rei (cap. 10-12)",
      "A arca trazida a Jerusalém (cap. 13-16)",
      "A aliança davídica (cap. 17)",
      "Preparativos para o Templo (cap. 22-29)"
    ],
    application: "A adoração é central na vida do povo de Deus. Tudo o que temos pertence ao Senhor."
  },
  {
    book: "2 Crônicas", group: "Históricos", testament: "VT",
    title: "O Templo e os Reis de Judá",
    theme: "Avivamento e Reforma",
    description: "A construção do Templo por Salomão e a história dos reis de Judá, com ênfase nos avivamentos espirituais.",
    icon: Landmark,
    keyVerses: ["2 Crônicas 7:14", "2 Crônicas 16:9", "2 Crônicas 20:12", "2 Crônicas 15:2"],
    outline: [
      "O Templo de Salomão (cap. 1-9)",
      "A promessa de restauração: 'Se o meu povo...' (cap. 7:14)",
      "A divisão do reino (cap. 10)",
      "Os avivamentos de Asa, Josafá e Ezequias",
      "A reforma de Josias (cap. 34-35)",
      "A queda de Jerusalém e o exílio (cap. 36)"
    ],
    application: "Deus promete ouvir, perdoar e sarar quando Seu povo se humilha e busca Sua face."
  },
  {
    book: "Esdras", group: "Históricos", testament: "VT",
    title: "Restauração e Reconstrução",
    theme: "Retorno e Purificação",
    description: "O retorno do exílio babilônico e a reconstrução do Templo. Esdras lidera a reforma espiritual do povo.",
    icon: Landmark,
    keyVerses: ["Esdras 3:11", "Esdras 7:10", "Esdras 9:6", "Esdras 1:3"],
    outline: [
      "O decreto de Ciro e o retorno (cap. 1-2)",
      "Reconstrução do Templo (cap. 3-6)",
      "A missão de Esdras (cap. 7-8)",
      "A confissão dos casamentos mistos (cap. 9-10)"
    ],
    application: "Deus cumpre Suas promessas de restauração. A Palavra deve ser o fundamento de toda reforma."
  },
  {
    book: "Neemias", group: "Históricos", testament: "VT",
    title: "Reconstrução dos Muros",
    theme: "Liderança e Perseverança",
    description: "Neemias lidera a reconstrução dos muros de Jerusalém apesar da oposição. Um modelo de oração, liderança e determinação.",
    icon: Shield,
    keyVerses: ["Neemias 1:4", "Neemias 2:20", "Neemias 4:14", "Neemias 8:10"],
    outline: [
      "A oração de Neemias (cap. 1)",
      "A viagem a Jerusalém (cap. 2)",
      "Construção em meio à oposição (cap. 3-4)",
      "Reformas sociais (cap. 5)",
      "Conclusão dos muros em 52 dias (cap. 6)",
      "Avivamento e leitura da Lei (cap. 8-10)"
    ],
    application: "A alegria do Senhor é a nossa força. Ore, planeje e trabalhe — Deus honra a perseverança."
  },
  {
    book: "Ester", group: "Históricos", testament: "VT",
    title: "A Providência Invisível de Deus",
    theme: "Coragem e Providência",
    description: "Embora o nome de Deus não apareça, Sua mão soberana opera através de Ester para salvar o povo judeu da destruição.",
    icon: Gem,
    keyVerses: ["Ester 4:14", "Ester 2:17", "Ester 7:3", "Ester 9:22"],
    outline: [
      "A rainha Vasti é deposta (cap. 1)",
      "Ester é escolhida rainha (cap. 2)",
      "O plano maligno de Hamã (cap. 3)",
      "'Para um tempo como este' — a decisão de Ester (cap. 4)",
      "A reversão do decreto (cap. 5-8)",
      "A festa de Purim (cap. 9-10)"
    ],
    application: "Deus posiciona Seus filhos no lugar certo e no tempo certo. Coragem e fé mudam a história."
  },

  // ===== POÉTICOS =====
  {
    book: "Jó", group: "Poéticos", testament: "VT",
    title: "O Sofrimento do Justo",
    theme: "Soberania e Sofrimento",
    description: "O drama de Jó questiona o sofrimento do justo e revela a soberania absoluta de Deus sobre todas as coisas.",
    icon: Scale,
    keyVerses: ["Jó 1:21", "Jó 13:15", "Jó 19:25", "Jó 42:5-6"],
    outline: [
      "A provação de Jó (cap. 1-2)",
      "O debate com os três amigos (cap. 3-31)",
      "O discurso de Eliú (cap. 32-37)",
      "Deus responde do meio da tempestade (cap. 38-41)",
      "A restauração de Jó (cap. 42)"
    ],
    application: "O sofrimento não é sempre resultado de pecado. Deus é soberano e digno de confiança mesmo quando não entendemos."
  },
  {
    book: "Salmos", group: "Poéticos", testament: "VT",
    title: "O Hinário de Israel",
    theme: "Adoração e Oração",
    description: "150 salmos que expressam toda a gama das emoções humanas — louvor, lamento, gratidão, arrependimento e esperança messiânica.",
    icon: Music2,
    keyVerses: ["Salmos 23:1", "Salmos 27:4", "Salmos 51:10", "Salmos 119:105"],
    outline: [
      "Salmos de louvor (ex: 8, 19, 29, 100, 150)",
      "Salmos de lamento (ex: 13, 22, 42, 88)",
      "Salmos messiânicos (ex: 2, 22, 110)",
      "Salmos de confiança (ex: 23, 27, 46, 91)",
      "Salmos de arrependimento (ex: 32, 51)",
      "Salmos de sabedoria (ex: 1, 37, 73, 119)",
      "Os Cânticos de Subida (Salmos 120-134)"
    ],
    application: "Os Salmos nos ensinam a expressar todas as emoções diante de Deus com honestidade e fé."
  },
  {
    book: "Provérbios", group: "Poéticos", testament: "VT",
    title: "Sabedoria Prática para a Vida",
    theme: "Sabedoria e Temor do Senhor",
    description: "Coleção de ditados sábios para a vida diária. O temor do Senhor é o princípio da sabedoria.",
    icon: Lightbulb,
    keyVerses: ["Provérbios 1:7", "Provérbios 3:5-6", "Provérbios 22:6", "Provérbios 31:10"],
    outline: [
      "O valor da sabedoria (cap. 1-9)",
      "Provérbios de Salomão (cap. 10-22)",
      "Palavras dos sábios (cap. 22-24)",
      "Mais provérbios de Salomão (cap. 25-29)",
      "Palavras de Agur e Lemuel (cap. 30-31)",
      "A mulher virtuosa (cap. 31:10-31)"
    ],
    application: "A verdadeira sabedoria começa com o temor do Senhor. Aplique os princípios divinos em todas as áreas da vida."
  },
  {
    book: "Eclesiastes", group: "Poéticos", testament: "VT",
    title: "Vaidade das Vaidades",
    theme: "Sentido da Vida",
    description: "O pregador busca o sentido da vida e conclui que tudo é vaidade sem Deus. Somente em Deus a vida tem propósito.",
    icon: Eye,
    keyVerses: ["Eclesiastes 1:2", "Eclesiastes 3:1", "Eclesiastes 12:1", "Eclesiastes 12:13"],
    outline: [
      "Tudo é vaidade (cap. 1-2)",
      "Tempo para tudo (cap. 3)",
      "Injustiças da vida (cap. 4-6)",
      "Sabedoria prática (cap. 7-10)",
      "Aproveite a juventude com sabedoria (cap. 11)",
      "Conclusão: tema a Deus e guarda Seus mandamentos (cap. 12)"
    ],
    application: "Sem Deus, nada satisfaz. O verdadeiro propósito está em temê-Lo e obedecer Seus mandamentos."
  },
  {
    book: "Cantares", group: "Poéticos", testament: "VT",
    title: "O Cântico do Amor",
    theme: "Amor e Intimidade",
    description: "Poema de amor entre o noivo e a noiva. Celebra o amor conjugal e tipifica o amor de Cristo pela Sua Igreja.",
    icon: Heart,
    keyVerses: ["Cantares 2:16", "Cantares 8:6-7", "Cantares 2:4", "Cantares 4:7"],
    outline: [
      "O início do amor — atração e cortejo (cap. 1-3)",
      "O casamento e a celebração (cap. 3-5)",
      "Conflito e reconciliação (cap. 5-6)",
      "A beleza e profundidade do amor (cap. 7-8)"
    ],
    application: "O amor conjugal é um presente de Deus. Cristo nos ama com amor perfeito, eterno e inabalável."
  },

  // ===== PROFETAS MAIORES =====
  {
    book: "Isaías", group: "Profetas Maiores", testament: "VT",
    title: "O Evangelho do Antigo Testamento",
    theme: "Juízo e Redenção Messiânica",
    description: "Profecias de juízo e consolação. Contém as mais detalhadas profecias sobre o Messias, incluindo o Servo Sofredor.",
    icon: Sparkles,
    keyVerses: ["Isaías 6:8", "Isaías 9:6", "Isaías 40:31", "Isaías 53:5"],
    outline: [
      "Profecias de juízo sobre Judá e as nações (cap. 1-35)",
      "A vocação de Isaías (cap. 6)",
      "O Emanuel — profecia messiânica (cap. 7-12)",
      "Eventos históricos de Ezequias (cap. 36-39)",
      "Consolação e restauração (cap. 40-48)",
      "O Servo Sofredor (cap. 49-57, especialmente 53)",
      "A glória futura de Sião (cap. 58-66)"
    ],
    application: "Jesus é o cumprimento das profecias de Isaías. Ele carregou nossas dores e por Suas pisaduras fomos sarados."
  },
  {
    book: "Jeremias", group: "Profetas Maiores", testament: "VT",
    title: "O Profeta das Lágrimas",
    theme: "Arrependimento e Nova Aliança",
    description: "Jeremias clama ao povo para se arrepender antes do juízo. Profetiza a Nova Aliança que Cristo estabeleceria.",
    icon: Feather,
    keyVerses: ["Jeremias 1:5", "Jeremias 29:11", "Jeremias 31:31-33", "Jeremias 33:3"],
    outline: [
      "O chamado de Jeremias (cap. 1)",
      "Avisos contra a idolatria (cap. 2-20)",
      "Profecias contra reis e falsos profetas (cap. 21-29)",
      "A Nova Aliança (cap. 31)",
      "A queda de Jerusalém (cap. 39-44)",
      "Profecias contra as nações (cap. 46-51)"
    ],
    application: "Deus conhece nossos planos e tem pensamentos de paz para nós. A Nova Aliança em Cristo nos dá acesso direto ao Pai."
  },
  {
    book: "Lamentações", group: "Profetas Maiores", testament: "VT",
    title: "Lamento sobre Jerusalém",
    theme: "Dor e Esperança",
    description: "Cinco poemas de lamento sobre a destruição de Jerusalém. No centro da dor, brilha a fidelidade de Deus.",
    icon: Drama,
    keyVerses: ["Lamentações 3:22-23", "Lamentações 3:25-26", "Lamentações 3:40", "Lamentações 5:21"],
    outline: [
      "Primeiro lamento — a cidade abandonada (cap. 1)",
      "Segundo lamento — a ira de Deus (cap. 2)",
      "Terceiro lamento — esperança na misericórdia (cap. 3)",
      "Quarto lamento — o cerco (cap. 4)",
      "Quinto lamento — oração por restauração (cap. 5)"
    ],
    application: "As misericórdias do Senhor se renovam a cada manhã. Grande é a Sua fidelidade, mesmo nos momentos mais escuros."
  },
  {
    book: "Ezequiel", group: "Profetas Maiores", testament: "VT",
    title: "A Glória de Deus",
    theme: "Visão e Restauração",
    description: "Visões do trono de Deus, profecias de juízo e a promessa de restauração. O vale de ossos secos mostra o poder vivificador de Deus.",
    icon: Zap,
    keyVerses: ["Ezequiel 36:26", "Ezequiel 37:5", "Ezequiel 34:26", "Ezequiel 47:9"],
    outline: [
      "A visão do trono de Deus (cap. 1)",
      "O chamado de Ezequiel (cap. 2-3)",
      "Juízo sobre Jerusalém (cap. 4-24)",
      "Profecias contra as nações (cap. 25-32)",
      "O vale de ossos secos — avivamento (cap. 37)",
      "O novo Templo e o rio de Deus (cap. 40-48)"
    ],
    application: "Deus pode dar vida ao que está morto. Ele promete um novo coração e um novo espírito para Seu povo."
  },
  {
    book: "Daniel", group: "Profetas Maiores", testament: "VT",
    title: "Fé no Império",
    theme: "Soberania e Profecia",
    description: "Daniel permanece fiel a Deus na corte babilônica. Suas visões proféticas revelam o plano de Deus para os impérios e o fim dos tempos.",
    icon: Mountain,
    keyVerses: ["Daniel 2:44", "Daniel 3:17-18", "Daniel 6:10", "Daniel 7:13-14"],
    outline: [
      "Daniel na corte de Nabucodonosor (cap. 1)",
      "A estátua e o reino eterno (cap. 2)",
      "A fornalha ardente (cap. 3)",
      "A cova dos leões (cap. 6)",
      "As quatro bestas e o Filho do Homem (cap. 7)",
      "As 70 semanas — profecia messiânica (cap. 9)",
      "Visões do fim dos tempos (cap. 10-12)"
    ],
    application: "Deus é soberano sobre todos os reinos. A fidelidade a Ele, mesmo sob pressão, traz livramento sobrenatural."
  },

  // ===== PROFETAS MENORES =====
  {
    book: "Oséias", group: "Profetas Menores", testament: "VT",
    title: "O Amor Redentor de Deus",
    theme: "Infidelidade e Amor Incondicional",
    description: "Deus ordena Oséias a se casar com uma mulher infiel como ilustração do amor de Deus por Israel, que persiste apesar da infidelidade.",
    icon: Heart,
    keyVerses: ["Oséias 2:19-20", "Oséias 6:6", "Oséias 11:1", "Oséias 14:4"],
    outline: ["O casamento de Oséias como parábola (cap. 1-3)", "Acusação contra Israel (cap. 4-8)", "Juízo e restauração (cap. 9-14)"],
    application: "O amor de Deus é inabalável. Ele nos busca mesmo quando nos afastamos."
  },
  {
    book: "Joel", group: "Profetas Menores", testament: "VT",
    title: "O Derramamento do Espírito",
    theme: "Arrependimento e Pentecostes",
    description: "Joel profetiza sobre o dia do Senhor e o derramamento do Espírito Santo sobre toda carne — cumprido em Atos 2.",
    icon: Flame,
    keyVerses: ["Joel 2:28-29", "Joel 2:12-13", "Joel 2:25", "Joel 3:14"],
    outline: ["A praga de gafanhotos (cap. 1)", "O chamado ao arrependimento (cap. 2:1-17)", "O derramamento do Espírito (cap. 2:28-32)", "O dia do juízo final (cap. 3)"],
    application: "Deus derrama Seu Espírito sobre todos os que se arrependem. Ele restaura os anos que o gafanhoto consumiu."
  },
  {
    book: "Amós", group: "Profetas Menores", testament: "VT",
    title: "Justiça Social e Espiritual",
    theme: "Justiça e Juízo",
    description: "O pastor Amós confronta a injustiça social e a falsa religiosidade de Israel. Deus exige justiça verdadeira.",
    icon: Scale,
    keyVerses: ["Amós 5:24", "Amós 3:3", "Amós 5:4", "Amós 7:14-15"],
    outline: ["Juízo sobre as nações vizinhas (cap. 1-2)", "Três sermões contra Israel (cap. 3-6)", "Cinco visões de juízo (cap. 7-9)", "Promessa de restauração (cap. 9:11-15)"],
    application: "A verdadeira adoração produz justiça. Deus se importa com como tratamos os outros."
  },
  {
    book: "Obadias", group: "Profetas Menores", testament: "VT",
    title: "O Juízo sobre Edom",
    theme: "Orgulho e Queda",
    description: "A menor profecia do AT. Denuncia o orgulho de Edom por se alegrar com a queda de Judá.",
    icon: Mountain,
    keyVerses: ["Obadias 1:3-4", "Obadias 1:15", "Obadias 1:17", "Obadias 1:21"],
    outline: ["O orgulho de Edom (v. 1-9)", "A traição contra Judá (v. 10-14)", "O dia do Senhor (v. 15-21)"],
    application: "O orgulho precede a queda. Nunca se alegre com o sofrimento alheio."
  },
  {
    book: "Jonas", group: "Profetas Menores", testament: "VT",
    title: "A Misericórdia Universal de Deus",
    theme: "Fuga e Compaixão",
    description: "Jonas foge do chamado de Deus, mas aprende que a misericórdia divina se estende a todas as nações.",
    icon: Bird,
    keyVerses: ["Jonas 2:9", "Jonas 3:10", "Jonas 4:2", "Jonas 1:17"],
    outline: ["A fuga de Jonas (cap. 1)", "A oração no ventre do peixe (cap. 2)", "Nínive se arrepende (cap. 3)", "A lição da planta — a compaixão de Deus (cap. 4)"],
    application: "A misericórdia de Deus não tem fronteiras. Não fuja do Seu chamado."
  },
  {
    book: "Miquéias", group: "Profetas Menores", testament: "VT",
    title: "O Que o Senhor Requer",
    theme: "Justiça e Messias",
    description: "Miquéias profetiza sobre o nascimento do Messias em Belém e define a religião verdadeira.",
    icon: Target,
    keyVerses: ["Miquéias 5:2", "Miquéias 6:8", "Miquéias 7:18-19", "Miquéias 4:3"],
    outline: ["Juízo sobre Samaria e Judá (cap. 1-3)", "Esperança messiânica (cap. 4-5)", "O que o Senhor requer: justiça, misericórdia, humildade (cap. 6)", "Esperança na misericórdia de Deus (cap. 7)"],
    application: "O que Deus requer é praticar justiça, amar a misericórdia e andar humildemente com Ele."
  },
  {
    book: "Naum", group: "Profetas Menores", testament: "VT",
    title: "A Queda de Nínive",
    theme: "Juízo Divino",
    description: "Profecia sobre a destruição de Nínive, capital assíria. Deus é justo e julga as nações opressoras.",
    icon: Sword,
    keyVerses: ["Naum 1:7", "Naum 1:2-3", "Naum 1:15", "Naum 3:19"],
    outline: ["A majestade e justiça de Deus (cap. 1)", "O cerco a Nínive descrito (cap. 2)", "As razões do juízo (cap. 3)"],
    application: "O Senhor é bom, é refúgio no dia da angústia. Ele conhece os que nEle confiam."
  },
  {
    book: "Habacuque", group: "Profetas Menores", testament: "VT",
    title: "A Fé em Tempos de Crise",
    theme: "Dúvida e Confiança",
    description: "Habacuque questiona Deus sobre o mal e a injustiça, mas termina com um dos mais belos hinos de fé da Bíblia.",
    icon: Anchor,
    keyVerses: ["Habacuque 2:4", "Habacuque 3:17-19", "Habacuque 2:14", "Habacuque 1:5"],
    outline: ["Primeira queixa: por que a injustiça? (cap. 1:1-4)", "Resposta: Deus usará a Babilônia (cap. 1:5-11)", "Segunda queixa: por que os ímpios? (cap. 1:12-2:1)", "Resposta: o justo viverá pela fé (cap. 2:2-20)", "O hino de fé de Habacuque (cap. 3)"],
    application: "O justo viverá pela fé. Mesmo quando tudo parecer perdido, Deus merece confiança e louvor."
  },
  {
    book: "Sofonias", group: "Profetas Menores", testament: "VT",
    title: "O Dia do Senhor",
    theme: "Juízo e Remanescente",
    description: "Sofonias anuncia o terrível dia do Senhor, mas promete que Deus preservará um remanescente humilde e fiel.",
    icon: Sun,
    keyVerses: ["Sofonias 3:17", "Sofonias 2:3", "Sofonias 1:14", "Sofonias 3:9"],
    outline: ["O juízo universal anunciado (cap. 1)", "Chamado ao arrependimento (cap. 2)", "Juízo sobre Jerusalém (cap. 3:1-8)", "A restauração do remanescente (cap. 3:9-20)"],
    application: "Deus canta de alegria sobre Seus filhos. Ele é poderoso para salvar."
  },
  {
    book: "Ageu", group: "Profetas Menores", testament: "VT",
    title: "Reconstrua a Casa de Deus",
    theme: "Prioridades e Obediência",
    description: "Ageu exorta o povo a parar de cuidar apenas de suas casas e reconstruir o Templo do Senhor.",
    icon: Landmark,
    keyVerses: ["Ageu 1:4", "Ageu 2:9", "Ageu 1:7-8", "Ageu 2:19"],
    outline: ["Primeira mensagem: considere os vossos caminhos (cap. 1:1-11)", "O povo obedece (cap. 1:12-15)", "Segunda mensagem: a glória do novo Templo (cap. 2:1-9)", "Terceira e quarta mensagens: bênção prometida (cap. 2:10-23)"],
    application: "Coloque Deus em primeiro lugar. Quando priorizamos Sua casa, Ele cuida da nossa."
  },
  {
    book: "Zacarias", group: "Profetas Menores", testament: "VT",
    title: "Visões Messiânicas",
    theme: "Restauração e Messias",
    description: "Visões simbólicas e profecias detalhadas sobre o Messias — Sua entrada triunfal, Sua rejeição e Sua volta gloriosa.",
    icon: Eye,
    keyVerses: ["Zacarias 4:6", "Zacarias 9:9", "Zacarias 12:10", "Zacarias 14:9"],
    outline: ["As oito visões noturnas (cap. 1-6)", "'Não por força, mas pelo meu Espírito' (cap. 4:6)", "Profecias messiânicas (cap. 9-14)", "O rei humilde montado em um jumento (cap. 9:9)", "O traspassado (cap. 12:10)", "A volta do Senhor ao Monte das Oliveiras (cap. 14)"],
    application: "Não é por força nem por poder, mas pelo Espírito do Senhor. Jesus é o Rei que voltará em glória."
  },
  {
    book: "Malaquias", group: "Profetas Menores", testament: "VT",
    title: "O Último Profeta antes do Silêncio",
    theme: "Fidelidade nos Dízimos e Adoração",
    description: "Malaquias confronta a frieza espiritual, os dízimos negligenciados e promete a vinda do mensageiro — João Batista.",
    icon: Flame,
    keyVerses: ["Malaquias 3:10", "Malaquias 4:2", "Malaquias 3:6", "Malaquias 4:5-6"],
    outline: ["O amor de Deus por Israel (cap. 1:1-5)", "Sacerdotes negligentes (cap. 1:6-2:9)", "Infidelidade conjugal (cap. 2:10-16)", "A vinda do mensageiro (cap. 3:1-5)", "Dízimos e ofertas (cap. 3:6-12)", "O sol da justiça (cap. 4)"],
    application: "Deus desafia: 'Provai-me e vede.' A fidelidade nos dízimos e na adoração abre as janelas do céu."
  },

  // ===== EVANGELHOS =====
  {
    book: "Mateus", group: "Evangelhos", testament: "NT",
    title: "Jesus, o Rei de Israel",
    theme: "O Reino dos Céus",
    description: "Apresenta Jesus como o Messias prometido, Rei dos reis. Contém o Sermão da Montanha e as parábolas do reino.",
    icon: Crown,
    keyVerses: ["Mateus 5:3-12", "Mateus 6:33", "Mateus 28:19-20", "Mateus 16:16"],
    outline: [
      "Genealogia e nascimento de Jesus (cap. 1-2)",
      "Batismo e tentação (cap. 3-4)",
      "O Sermão da Montanha (cap. 5-7)",
      "Milagres e parábolas do reino (cap. 8-13)",
      "Transfiguração e ensinos (cap. 14-20)",
      "Entrada triunfal e última semana (cap. 21-27)",
      "Ressurreição e Grande Comissão (cap. 28)"
    ],
    application: "Busque primeiro o Reino de Deus. Jesus é o Rei prometido que nos comissiona a fazer discípulos de todas as nações."
  },
  {
    book: "Marcos", group: "Evangelhos", testament: "NT",
    title: "Jesus, o Servo Sofredor",
    theme: "Ação e Serviço",
    description: "O evangelho da ação. Marcos apresenta Jesus como o Servo que veio não para ser servido, mas para servir e dar Sua vida.",
    icon: HandMetal,
    keyVerses: ["Marcos 10:45", "Marcos 8:34", "Marcos 16:15", "Marcos 1:15"],
    outline: [
      "O ministério na Galileia (cap. 1-7)",
      "A confissão de Pedro e transfiguração (cap. 8-9)",
      "A caminhada para Jerusalém (cap. 10)",
      "A última semana (cap. 11-15)",
      "A ressurreição (cap. 16)"
    ],
    application: "Jesus é o modelo de servo. A grandeza no reino de Deus está em servir."
  },
  {
    book: "Lucas", group: "Evangelhos", testament: "NT",
    title: "Jesus, o Filho do Homem",
    theme: "Compaixão e Salvação Universal",
    description: "Lucas destaca a humanidade de Jesus, Sua compaixão pelos marginalizados e a universalidade da salvação.",
    icon: Globe,
    keyVerses: ["Lucas 4:18-19", "Lucas 15:7", "Lucas 19:10", "Lucas 23:43"],
    outline: [
      "Nascimento e infância de Jesus (cap. 1-2)",
      "Ministério na Galileia (cap. 3-9)",
      "A viagem a Jerusalém (cap. 9-19)",
      "Parábolas exclusivas: Bom Samaritano, Filho Pródigo (cap. 10, 15)",
      "Paixão e morte (cap. 22-23)",
      "Ressurreição e ascensão (cap. 24)"
    ],
    application: "Jesus veio buscar e salvar o perdido. Ninguém está além do alcance da Sua graça."
  },
  {
    book: "João", group: "Evangelhos", testament: "NT",
    title: "Jesus, o Filho de Deus",
    theme: "Divindade e Vida Eterna",
    description: "João apresenta Jesus como o Verbo encarnado, Deus em carne. Os sete sinais e os sete 'Eu Sou' revelam Sua divindade.",
    icon: Infinity,
    keyVerses: ["João 1:1", "João 3:16", "João 14:6", "João 11:25-26"],
    outline: [
      "O Verbo encarnado (cap. 1)",
      "Os sete sinais milagrosos (cap. 2-11)",
      "Os sete 'Eu Sou' (espalhados no evangelho)",
      "O discurso do cenáculo (cap. 13-17)",
      "A oração sacerdotal (cap. 17)",
      "Paixão, morte e ressurreição (cap. 18-21)"
    ],
    application: "Jesus é o caminho, a verdade e a vida. Crer nEle é ter a vida eterna."
  },

  // ===== ATOS =====
  {
    book: "Atos", group: "Históricos", testament: "NT",
    title: "A Igreja Nascente",
    theme: "Espírito Santo e Missões",
    description: "O derramamento do Espírito Santo e a expansão da Igreja de Jerusalém até os confins da terra.",
    icon: Flame,
    keyVerses: ["Atos 1:8", "Atos 2:4", "Atos 4:12", "Atos 17:6"],
    outline: [
      "A ascensão e o Pentecostes (cap. 1-2)",
      "A Igreja em Jerusalém (cap. 3-7)",
      "Perseguição e expansão — Samaria (cap. 8-12)",
      "As viagens missionárias de Paulo (cap. 13-21)",
      "Prisão de Paulo e viagem a Roma (cap. 22-28)"
    ],
    application: "O Espírito Santo capacita para testemunhar. A Igreja é chamada a levar o evangelho a todas as nações."
  },

  // ===== CARTAS PAULINAS =====
  {
    book: "Romanos", group: "Cartas Paulinas", testament: "NT",
    title: "O Evangelho da Justificação",
    theme: "Justificação pela Fé",
    description: "A mais completa exposição teológica do evangelho. Todos pecaram, mas são justificados gratuitamente pela fé em Cristo.",
    icon: Scale,
    keyVerses: ["Romanos 1:16", "Romanos 3:23-24", "Romanos 8:28", "Romanos 12:1-2"],
    outline: [
      "A necessidade universal de salvação (cap. 1-3)",
      "Justificação pela fé (cap. 4-5)",
      "Santificação — vida no Espírito (cap. 6-8)",
      "Israel no plano de Deus (cap. 9-11)",
      "Vida cristã prática (cap. 12-16)"
    ],
    application: "A salvação é pela graça mediante a fé. Nada nos pode separar do amor de Deus em Cristo."
  },
  {
    book: "1 Coríntios", group: "Cartas Paulinas", testament: "NT",
    title: "Ordem na Igreja",
    theme: "Unidade e Dons Espirituais",
    description: "Paulo aborda divisões, imoralidade, dons espirituais e a ressurreição. O amor é o maior de todos os dons.",
    icon: Handshake,
    keyVerses: ["1 Coríntios 13:13", "1 Coríntios 12:27", "1 Coríntios 15:55-57", "1 Coríntios 6:19"],
    outline: [
      "Divisões na igreja (cap. 1-4)",
      "Questões morais (cap. 5-6)",
      "Casamento e liberdade cristã (cap. 7-10)",
      "A ceia e os dons espirituais (cap. 11-14)",
      "O hino ao amor (cap. 13)",
      "A ressurreição dos mortos (cap. 15)"
    ],
    application: "O amor é o caminho mais excelente. Somos corpo de Cristo, cada membro é essencial."
  },
  {
    book: "2 Coríntios", group: "Cartas Paulinas", testament: "NT",
    title: "Poder na Fraqueza",
    theme: "Consolação e Ministério",
    description: "Paulo defende seu apostolado e revela que o poder de Deus se aperfeiçoa na fraqueza humana.",
    icon: Anchor,
    keyVerses: ["2 Coríntios 4:7", "2 Coríntios 5:17", "2 Coríntios 9:7", "2 Coríntios 12:9"],
    outline: [
      "Consolação nas tribulações (cap. 1-2)",
      "O ministério da Nova Aliança (cap. 3-5)",
      "Nova criatura em Cristo (cap. 5:17)",
      "A oferta generosa (cap. 8-9)",
      "O espinho na carne e a graça suficiente (cap. 12)"
    ],
    application: "Se alguém está em Cristo, nova criatura é. O poder de Deus se aperfeiçoa em nossa fraqueza."
  },
  {
    book: "Gálatas", group: "Cartas Paulinas", testament: "NT",
    title: "Liberdade em Cristo",
    theme: "Graça versus Lei",
    description: "Paulo combate o legalismo e declara que somos justificados pela fé, não pelas obras da lei.",
    icon: Flag,
    keyVerses: ["Gálatas 2:20", "Gálatas 5:1", "Gálatas 5:22-23", "Gálatas 3:28"],
    outline: [
      "Defesa do evangelho da graça (cap. 1-2)",
      "Fé versus obras da lei (cap. 3-4)",
      "Liberdade cristã e fruto do Espírito (cap. 5-6)"
    ],
    application: "Já estou crucificado com Cristo. Cristo vive em mim. A verdadeira liberdade está na graça."
  },
  {
    book: "Efésios", group: "Cartas Paulinas", testament: "NT",
    title: "A Igreja — Corpo de Cristo",
    theme: "Identidade e Unidade em Cristo",
    description: "Revela as riquezas espirituais do cristão em Cristo e a unidade do Corpo. Inclui a armadura de Deus.",
    icon: Shield,
    keyVerses: ["Efésios 2:8-9", "Efésios 4:4-6", "Efésios 5:25", "Efésios 6:10-12"],
    outline: [
      "Bênçãos espirituais em Cristo (cap. 1)",
      "Salvação pela graça (cap. 2)",
      "O mistério da Igreja (cap. 3)",
      "A unidade do corpo (cap. 4)",
      "A vida no Espírito e relações (cap. 5)",
      "A armadura de Deus (cap. 6)"
    ],
    application: "Em Cristo temos toda bênção espiritual. Revistam-se de toda a armadura de Deus para resistir ao mal."
  },
  {
    book: "Filipenses", group: "Cartas Paulinas", testament: "NT",
    title: "A Alegria em Cristo",
    theme: "Alegria e Contentamento",
    description: "Escrita da prisão, é a carta da alegria. Paulo ensina a encontrar contentamento em todas as circunstâncias.",
    icon: Sun,
    keyVerses: ["Filipenses 1:21", "Filipenses 2:5-8", "Filipenses 3:14", "Filipenses 4:13"],
    outline: [
      "Alegria no evangelho (cap. 1)",
      "A humildade de Cristo (cap. 2)",
      "O alvo da vida cristã (cap. 3)",
      "Contentamento em todas as circunstâncias (cap. 4)"
    ],
    application: "Posso todas as coisas em Cristo que me fortalece. A verdadeira alegria não depende das circunstâncias."
  },
  {
    book: "Colossenses", group: "Cartas Paulinas", testament: "NT",
    title: "A Supremacia de Cristo",
    theme: "Cristo Acima de Tudo",
    description: "Cristo é a imagem do Deus invisível, primogênito de toda criação. Nele habita toda a plenitude da divindade.",
    icon: Crown,
    keyVerses: ["Colossenses 1:15-17", "Colossenses 2:9-10", "Colossenses 3:1-2", "Colossenses 3:23"],
    outline: [
      "A preeminência de Cristo (cap. 1)",
      "Completos em Cristo — contra heresias (cap. 2)",
      "A nova vida em Cristo (cap. 3)",
      "Instruções práticas (cap. 4)"
    ],
    application: "Cristo é tudo em todos. Busque as coisas do alto e faça tudo para a glória de Deus."
  },
  {
    book: "1 Tessalonicenses", group: "Cartas Paulinas", testament: "NT",
    title: "A Volta de Cristo",
    theme: "Esperança e Santificação",
    description: "Paulo encoraja os crentes a viverem em santidade enquanto aguardam a volta gloriosa de Jesus.",
    icon: Sparkles,
    keyVerses: ["1 Tessalonicenses 4:16-17", "1 Tessalonicenses 5:16-18", "1 Tessalonicenses 5:23", "1 Tessalonicenses 4:3"],
    outline: ["Gratidão pela fé dos tessalonicenses (cap. 1-3)", "Vida santa e a volta de Cristo (cap. 4)", "Vigília e encorajamento (cap. 5)"],
    application: "Regozijai-vos sempre, orai sem cessar, em tudo dai graças. Jesus voltará!"
  },
  {
    book: "2 Tessalonicenses", group: "Cartas Paulinas", testament: "NT",
    title: "Perseverança até a Volta",
    theme: "Juízo Final e Trabalho",
    description: "Correções sobre a volta de Cristo e exortação ao trabalho e à perseverança.",
    icon: Milestone,
    keyVerses: ["2 Tessalonicenses 2:1-3", "2 Tessalonicenses 3:10", "2 Tessalonicenses 1:7", "2 Tessalonicenses 3:3"],
    outline: ["Encorajamento na perseguição (cap. 1)", "O homem do pecado antes da volta (cap. 2)", "Exortação ao trabalho (cap. 3)"],
    application: "Fiel é o Senhor que nos fortalece. Enquanto aguardamos Sua volta, trabalhemos com diligência."
  },
  {
    book: "1 Timóteo", group: "Cartas Paulinas", testament: "NT",
    title: "Manual do Líder Cristão",
    theme: "Liderança e Sã Doutrina",
    description: "Instruções de Paulo ao jovem pastor Timóteo sobre liderança, doutrina e conduta na igreja.",
    icon: GraduationCap,
    keyVerses: ["1 Timóteo 4:12", "1 Timóteo 2:5", "1 Timóteo 6:10", "1 Timóteo 3:1"],
    outline: ["Combater falsas doutrinas (cap. 1)", "Oração e ordem no culto (cap. 2)", "Qualificações de líderes (cap. 3)", "Ser exemplo dos fiéis (cap. 4)", "Responsabilidades pastorais (cap. 5-6)"],
    application: "Ninguém despreze a sua mocidade. Seja exemplo dos fiéis na palavra, na conduta e no amor."
  },
  {
    book: "2 Timóteo", group: "Cartas Paulinas", testament: "NT",
    title: "O Testamento de Paulo",
    theme: "Perseverança e Fidelidade",
    description: "A última carta de Paulo. Um chamado a perseverar na fé, pregar a Palavra e suportar as dificuldades como bom soldado.",
    icon: Sword,
    keyVerses: ["2 Timóteo 1:7", "2 Timóteo 2:15", "2 Timóteo 3:16-17", "2 Timóteo 4:7-8"],
    outline: ["Não se envergonhe do evangelho (cap. 1)", "Soldado, atleta e lavrador (cap. 2)", "Toda Escritura é inspirada (cap. 3)", "'Combati o bom combate' (cap. 4)"],
    application: "Toda a Escritura é inspirada por Deus e útil. Combata o bom combate e guarde a fé."
  },
  {
    book: "Tito", group: "Cartas Paulinas", testament: "NT",
    title: "A Graça que Educa",
    theme: "Boas Obras e Graça",
    description: "Paulo instrui Tito sobre a organização da igreja em Creta e a importância das boas obras como fruto da graça.",
    icon: Lightbulb,
    keyVerses: ["Tito 2:11-12", "Tito 3:5", "Tito 2:7-8", "Tito 1:7-9"],
    outline: ["Qualificações de presbíteros (cap. 1)", "Ensino para todas as idades (cap. 2)", "A graça que nos educa (cap. 2:11-14)", "Boas obras e renovação pelo Espírito (cap. 3)"],
    application: "A graça de Deus nos ensina a viver sóbria, justa e piedosamente neste mundo."
  },
  {
    book: "Filemom", group: "Cartas Paulinas", testament: "NT",
    title: "O Poder do Perdão",
    theme: "Reconciliação e Graça",
    description: "Paulo intercede por Onésimo, um escravo fugitivo, pedindo a Filemom que o receba como irmão em Cristo.",
    icon: Handshake,
    keyVerses: ["Filemom 1:6", "Filemom 1:15-16", "Filemom 1:17", "Filemom 1:18"],
    outline: ["Saudação e gratidão (v. 1-7)", "Intercessão por Onésimo (v. 8-16)", "Pedido de reconciliação (v. 17-25)"],
    application: "Em Cristo não há escravo ou livre. O evangelho transforma relações e nos chama à reconciliação."
  },

  // ===== CARTAS GERAIS =====
  {
    book: "Hebreus", group: "Cartas Gerais", testament: "NT",
    title: "Cristo, o Superior",
    theme: "Superioridade de Cristo",
    description: "Cristo é superior aos anjos, a Moisés, ao sacerdócio levítico e à antiga aliança. Ele é o mediador da Nova Aliança.",
    icon: Crown,
    keyVerses: ["Hebreus 4:16", "Hebreus 11:1", "Hebreus 12:1-2", "Hebreus 13:8"],
    outline: [
      "Superior aos anjos (cap. 1-2)",
      "Superior a Moisés e Josué (cap. 3-4)",
      "Superior ao sacerdócio levítico — Melquisedeque (cap. 5-7)",
      "A Nova Aliança superior (cap. 8-10)",
      "Os heróis da fé (cap. 11)",
      "Correndo a carreira com perseverança (cap. 12)"
    ],
    application: "Jesus Cristo é o mesmo ontem, hoje e eternamente. Corramos com perseverança olhando para Ele."
  },
  {
    book: "Tiago", group: "Cartas Gerais", testament: "NT",
    title: "Fé em Ação",
    theme: "Fé Prática e Obras",
    description: "A fé sem obras é morta. Tiago ensina sobre provações, controle da língua, sabedoria e vida cristã prática.",
    icon: HandMetal,
    keyVerses: ["Tiago 1:2-3", "Tiago 1:22", "Tiago 2:17", "Tiago 5:16"],
    outline: ["Provações e tentações (cap. 1)", "Fé e obras (cap. 2)", "O poder da língua (cap. 3)", "Humildade e submissão (cap. 4)", "Paciência e oração (cap. 5)"],
    application: "A fé verdadeira produz obras. Sede praticantes da Palavra e não somente ouvintes."
  },
  {
    book: "1 Pedro", group: "Cartas Gerais", testament: "NT",
    title: "Esperança no Sofrimento",
    theme: "Sofrimento e Esperança",
    description: "Pedro encoraja cristãos perseguidos a permanecer firmes, lembrando da esperança viva pela ressurreição de Cristo.",
    icon: Anchor,
    keyVerses: ["1 Pedro 1:3", "1 Pedro 2:9", "1 Pedro 3:15", "1 Pedro 5:7"],
    outline: ["Esperança viva (cap. 1)", "Povo escolhido — sacerdócio real (cap. 2)", "Sofrimento segundo a vontade de Deus (cap. 3-4)", "Lançando toda ansiedade sobre Ele (cap. 5)"],
    application: "Vocês são geração eleita, sacerdócio real. Lancem toda ansiedade sobre Deus, pois Ele cuida de vocês."
  },
  {
    book: "2 Pedro", group: "Cartas Gerais", testament: "NT",
    title: "Crescimento e Vigilância",
    theme: "Falsos Mestres e Volta de Cristo",
    description: "Pedro alerta contra falsos mestres e encoraja o crescimento nas virtudes cristãs enquanto aguardam a volta de Cristo.",
    icon: Eye,
    keyVerses: ["2 Pedro 1:3-4", "2 Pedro 1:20-21", "2 Pedro 3:9", "2 Pedro 3:18"],
    outline: ["As virtudes cristãs (cap. 1)", "Alerta contra falsos mestres (cap. 2)", "A promessa da volta de Cristo (cap. 3)"],
    application: "Deus não retarda Sua promessa, mas é longânimo. Cresçam na graça e conhecimento de Cristo."
  },
  {
    book: "1 João", group: "Cartas Gerais", testament: "NT",
    title: "Deus é Amor e Luz",
    theme: "Comunhão, Amor e Verdade",
    description: "João ensina que Deus é luz e amor. A prova da vida eterna é andar na luz, amar os irmãos e crer no Filho.",
    icon: Sun,
    keyVerses: ["1 João 1:7", "1 João 1:9", "1 João 4:8", "1 João 5:13"],
    outline: ["Deus é luz — andar na verdade (cap. 1-2)", "Filhos de Deus versus filhos do diabo (cap. 3)", "Deus é amor — amemos uns aos outros (cap. 4)", "A certeza da vida eterna (cap. 5)"],
    application: "Deus é amor. Se confessamos nossos pecados, Ele é fiel e justo para nos perdoar."
  },
  {
    book: "2 João", group: "Cartas Gerais", testament: "NT",
    title: "Andar na Verdade",
    theme: "Verdade e Discernimento",
    description: "Breve carta exortando a caminhar na verdade e ter cuidado com os enganadores que negam Cristo.",
    icon: Compass,
    keyVerses: ["2 João 1:6", "2 João 1:8", "2 João 1:9", "2 João 1:4"],
    outline: ["Andar na verdade e no amor (v. 1-6)", "Cuidado com os enganadores (v. 7-11)", "Saudação final (v. 12-13)"],
    application: "Andar no amor é andar segundo os mandamentos de Deus. Vigie contra os que distorcem a verdade."
  },
  {
    book: "3 João", group: "Cartas Gerais", testament: "NT",
    title: "Hospitalidade e Fidelidade",
    theme: "Servir com Amor",
    description: "João elogia Gaio pela hospitalidade e condena Diótrefes pelo orgulho e rejeição da autoridade apostólica.",
    icon: Handshake,
    keyVerses: ["3 João 1:4", "3 João 1:11", "3 João 1:2", "3 João 1:8"],
    outline: ["Elogio a Gaio pela hospitalidade (v. 1-8)", "Condenação de Diótrefes (v. 9-10)", "Recomendação de Demétrio (v. 11-12)"],
    application: "Não imite o mal, mas o bem. A hospitalidade e o servir são marcas do verdadeiro cristão."
  },
  {
    book: "Judas", group: "Cartas Gerais", testament: "NT",
    title: "Contendendo pela Fé",
    theme: "Apostasia e Perseverança",
    description: "Judas exorta a lutar pela fé entregue aos santos e alerta sobre falsos mestres infiltrados na igreja.",
    icon: Sword,
    keyVerses: ["Judas 1:3", "Judas 1:20-21", "Judas 1:24-25", "Judas 1:4"],
    outline: ["O chamado a contender pela fé (v. 1-4)", "Exemplos de juízo no AT (v. 5-7)", "Características dos falsos mestres (v. 8-16)", "Edificando-se na fé (v. 17-23)", "A doxologia final (v. 24-25)"],
    application: "Àquele que é poderoso para vos guardar de tropeçar e vos apresentar sem mácula com alegria."
  },

  // ===== PROFÉTICO NT =====
  {
    book: "Apocalipse", group: "Profético", testament: "NT",
    title: "A Vitória Final de Cristo",
    theme: "Juízo Final e Eternidade",
    description: "A revelação de Jesus Cristo glorificado. Visões do fim dos tempos, o juízo final e a nova Jerusalém — Deus vence!",
    icon: Sparkles,
    keyVerses: ["Apocalipse 1:8", "Apocalipse 3:20", "Apocalipse 19:16", "Apocalipse 21:4"],
    outline: [
      "A visão de Cristo glorificado (cap. 1)",
      "Cartas às sete igrejas (cap. 2-3)",
      "O trono celestial e o Cordeiro (cap. 4-5)",
      "Os sete selos, trombetas e taças (cap. 6-16)",
      "A queda da Babilônia (cap. 17-18)",
      "A volta de Cristo — Rei dos reis (cap. 19)",
      "O milênio e o juízo final (cap. 20)",
      "Novos céus e nova terra (cap. 21-22)"
    ],
    application: "Jesus é o Alfa e o Ômega. Ele enxugará toda lágrima. A vitória final pertence ao Cordeiro!"
  },
];
