import { Compass, Anchor, Wind, Footprints } from "lucide-react";

export interface ThematicStudy {
  id: string;
  title: string;
  theme: string;
  description: string;
  icon: any;
  sections: ThematicSection[];
}

export interface ThematicSection {
  heading: string;
  content: string;
  verses: string[];
  symbolism: string;
}

export const THEMATIC_STUDIES: ThematicStudy[] = [
  {
    id: "veiculos-biblicos",
    title: "Veículos na Bíblia",
    theme: "Transporte e Simbolismo",
    description:
      "Uma análise detalhada de todos os meios de transporte mencionados nas Escrituras: carros de guerra, navios, carroças, animais de montaria e até a carruagem celestial. Cada veículo carrega profundo significado teológico e cultural.",
    icon: Compass,
    sections: [
      {
        heading: "Carros de Guerra (Carruagens)",
        content:
          "Os carros de guerra eram o principal veículo militar do mundo antigo. Puxados por cavalos, representavam poder militar supremo. O Egito era famoso por sua frota de carruagens, que perseguiu Israel na saída do Egito. Faraó utilizou 600 carros escolhidos para caçar os hebreus, mas Deus os destruiu no Mar Vermelho. Na conquista de Canaã, os cananeus possuíam carros de ferro que aterrorizavam Israel. Elias foi levado ao céu por um carro de fogo. Naamã chegou a Eliseu em seu carro oficial. Filipe encontrou o eunuco etíope em sua carruagem lendo Isaías. O profeta Habacuque descreve os carros caldeus como tempestade.",
        verses: [
          "Êxodo 14:6-7 — Os carros de Faraó no Mar Vermelho",
          "Êxodo 15:4 — 'Os carros de Faraó e o seu exército lançou no mar'",
          "Juízes 4:3 — Os 900 carros de ferro de Sísera",
          "2 Reis 2:11 — O carro de fogo que levou Elias",
          "2 Reis 5:9 — Naamã chega na porta de Eliseu com seus carros",
          "Atos 8:28-29 — O eunuco etíope em sua carruagem",
          "Salmos 20:7 — 'Uns confiam em carros e outros em cavalos, mas nós faremos menção do nome do Senhor'",
          "Isaías 31:1 — Advertência contra confiar nos carros do Egito",
          "Habacuque 3:8 — Os carros de salvação do Senhor",
          "Apocalipse 9:9 — Ruído como de carros correndo para a batalha",
        ],
        symbolism:
          "Os carros de guerra simbolizam o poder humano versus a confiança em Deus. Salmo 20:7 contrasta quem confia em carros com quem confia no Senhor. O carro de fogo de Elias representa o poder sobrenatural de Deus que transcende qualquer tecnologia humana.",
      },
      {
        heading: "Cavalos e Montarias",
        content:
          "O cavalo era o animal de guerra por excelência. Reis e comandantes montavam cavalos em batalha. A Lei de Deuteronômio proibia o rei de multiplicar cavalos para que não confiasse no poder militar em vez de Deus. Salomão, porém, acumulou milhares de cavalos importados do Egito. Os profetas frequentemente advertem contra a confiança em cavalos. Jesus entrou em Jerusalém montado num jumento, cumprindo a profecia de Zacarias, demonstrando humildade em vez de poder militar. No Apocalipse, Cristo retorna montado num cavalo branco como Rei dos reis.",
        verses: [
          "Deuteronômio 17:16 — O rei não multiplicará cavalos",
          "1 Reis 10:26 — Salomão acumulou 1.400 carros e 12.000 cavaleiros",
          "Salmos 33:17 — 'O cavalo é vão para a salvação'",
          "Provérbios 21:31 — 'O cavalo prepara-se para o dia da batalha, mas do Senhor vem a vitória'",
          "Isaías 31:3 — 'Os egípcios são homens, e não Deus; os seus cavalos carne, e não espírito'",
          "Zacarias 9:9 — O Messias montado num jumento",
          "Mateus 21:5 — Jesus entra em Jerusalém no jumento",
          "Apocalipse 6:2-8 — Os quatro cavaleiros do Apocalipse",
          "Apocalipse 19:11 — Cristo montado no cavalo branco",
        ],
        symbolism:
          "O cavalo representa poder militar e orgulho humano. O jumento de Cristo simboliza paz e humildade — o Rei que vem não para conquistar pela espada, mas para servir. Os cavalos do Apocalipse representam os juízos divinos sobre a terra.",
      },
      {
        heading: "Navios e Embarcações",
        content:
          "Os navios desempenham papel crucial nas Escrituras. A Arca de Noé foi o primeiro grande veículo, salvando a humanidade do dilúvio. Os navios de Társis eram famosos pelo comércio internacional na época de Salomão. Jonas fugiu de Deus num navio para Társis e enfrentou uma tempestade divina. Jesus pregou de dentro de um barco, acalmou tempestades no Mar da Galileia e andou sobre as águas. Os discípulos eram pescadores que usavam barcos diariamente. Paulo realizou suas viagens missionárias por navios, incluindo o dramático naufrágio relatado em Atos 27.",
        verses: [
          "Gênesis 6:14-16 — As dimensões da Arca de Noé",
          "1 Reis 9:26-28 — A frota de Salomão em Eziom-Geber",
          "1 Reis 22:48 — Os navios de Társis de Josafá",
          "Jonas 1:3 — Jonas foge num navio para Társis",
          "Salmos 107:23-30 — Os que descem ao mar em navios",
          "Provérbios 31:14 — A mulher virtuosa como navios de mercador",
          "Marcos 4:37-39 — Jesus acalma a tempestade no barco",
          "João 6:19 — Jesus anda sobre o mar",
          "Atos 27:41 — O naufrágio de Paulo em Malta",
          "Apocalipse 18:17 — Destruição dos navios de Babilônia",
        ],
        symbolism:
          "A Arca de Noé é tipo de Cristo — o único meio de salvação. O barco no mar agitado representa a igreja em meio às tribulações do mundo. Jesus acalmando a tempestade demonstra Sua soberania sobre a natureza e Sua presença em nossas crises.",
      },
      {
        heading: "Jumentos e Mulas",
        content:
          "O jumento era o animal de transporte mais comum no antigo Israel. Usado por juízes, reis e profetas. Abraão selou seu jumento para a viagem ao Monte Moriá. Balaão montava uma jumenta que viu o anjo do Senhor. Os filhos dos juízes montavam jumentos como sinal de autoridade. Davi ordenou que Salomão fosse colocado na mula real para ser ungido rei. A mula era montaria de príncipes e reis em tempo de paz. Jesus escolheu deliberadamente um jumentinho para Sua entrada triunfal.",
        verses: [
          "Gênesis 22:3 — Abraão sela seu jumento para Moriá",
          "Números 22:21-33 — A jumenta de Balaão fala",
          "Juízes 10:4 — Os 30 filhos de Jair montavam 30 jumentos",
          "Juízes 12:14 — Os 40 filhos de Abdom sobre 70 jumentos",
          "1 Samuel 25:20 — Abigail monta um jumento para encontrar Davi",
          "2 Samuel 18:9 — Absalão preso na árvore enquanto montava uma mula",
          "1 Reis 1:33 — Salomão colocado na mula de Davi para a coroação",
          "Zacarias 9:9 — 'Montado sobre um jumento, sobre um jumentinho'",
          "Lucas 10:34 — O bom samaritano coloca o ferido sobre seu animal",
        ],
        symbolism:
          "O jumento simboliza serviço humilde e paz. Enquanto reis guerreiros montavam cavalos, reis em missão de paz montavam mulas e jumentos. A escolha de Jesus por um jumentinho proclama que Seu reino não é deste mundo — é um reino de humildade e serviço.",
      },
      {
        heading: "Camelos e Caravanas",
        content:
          "O camelo era o veículo do deserto, essencial para o comércio de longas distâncias. Abraão possuía camelos como sinal de riqueza. O servo de Abraão levou dez camelos na viagem para encontrar Rebeca. Os midianitas e ismaelitas usavam caravanas de camelos para comércio. A Rainha de Sabá chegou a Salomão com uma grande caravana de camelos carregados de especiarias, ouro e pedras preciosas. Jesus usa a imagem do camelo passando pelo fundo de uma agulha para ilustrar a dificuldade dos ricos entrarem no Reino.",
        verses: [
          "Gênesis 24:10 — O servo de Abraão com dez camelos busca Rebeca",
          "Gênesis 37:25 — Caravana de ismaelitas com camelos",
          "Juízes 7:12 — Os camelos dos midianitas eram inumeráveis",
          "1 Reis 10:2 — A Rainha de Sabá chega com camelos carregados",
          "Jó 1:3 — Jó possuía 3.000 camelos",
          "Isaías 60:6 — 'Uma multidão de camelos te cobrirá'",
          "Mateus 19:24 — 'É mais fácil passar um camelo pelo fundo de uma agulha'",
          "Mateus 23:24 — 'Coais um mosquito e engolis um camelo'",
        ],
        symbolism:
          "O camelo representa riqueza material e comércio. A metáfora de Jesus sobre o camelo e a agulha ensina que a riqueza pode ser obstáculo à fé. A caravana de camelos da Rainha de Sabá prefigura as nações trazendo suas riquezas ao verdadeiro Rei.",
      },
      {
        heading: "A Carruagem Celestial (Merkavá)",
        content:
          "Ezequiel descreve a visão mais impressionante de um 'veículo' nas Escrituras: o trono-carruagem de Deus (Merkavá), com quatro seres viventes, rodas dentro de rodas, olhos por toda parte e fogo resplandecente. Esta visão se tornou central na mística judaica. O carro de fogo que levou Elias e os carros de fogo ao redor de Eliseu em Dotã revelam a dimensão sobrenatural dos veículos celestiais. No Apocalipse, os quatro seres viventes ao redor do trono ecoam a visão de Ezequiel.",
        verses: [
          "Ezequiel 1:4-28 — A visão da Merkavá (trono-carruagem de Deus)",
          "Ezequiel 10:1-22 — Os querubins e as rodas",
          "2 Reis 2:11 — O carro de fogo de Elias",
          "2 Reis 6:17 — Carros de fogo ao redor de Eliseu em Dotã",
          "Salmos 68:17 — 'Os carros de Deus são vinte milhares'",
          "Salmos 104:3 — 'Ele faz das nuvens o Seu carro'",
          "Isaías 66:15 — 'O Senhor virá com fogo, e os Seus carros como um torvelinho'",
          "Habacuque 3:8 — 'Montaste sobre os Teus cavalos, sobre os Teus carros de salvação'",
        ],
        symbolism:
          "A Merkavá representa a glória, mobilidade e onipresença de Deus. As rodas dentro de rodas simbolizam que Deus se move em todas as direções sem limitação. Os carros de fogo revelam que o exército celestial é infinitamente superior a qualquer poder terreno.",
      },
    ],
  },
];
