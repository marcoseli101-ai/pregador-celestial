export interface EBDLesson {
  id: string;
  number: number;
  title: string;
  theme: string;
  textoAureo: {
    verse: string;
    reference: string;
  };
  verdadePratica: string;
  leituraBiblica: {
    reference: string;
    text: string;
  };
  introducao: string;
  topicos: Array<{
    title: string;
    subtopicos: Array<{
      title: string;
      content: string;
    }>;
  }>;
  conclusao: string;
  perguntasFixacao: string[];
}

export interface EBDMagazine {
  id: string;
  category: "adultos" | "jovens" | "discipulado";
  categoryLabel: string;
  title: string;
  quarter: string; // Ex: "4º Trimestre"
  year: number;
  description: string;
  coverColor: string;
  lessons: EBDLesson[];
}

export const EBD_MAGAZINES: EBDMagazine[] = [
  {
    id: "adultos-doutrinas",
    category: "adultos",
    categoryLabel: "Adultos",
    title: "As Grandes Doutrinas da Graça e da Redenção",
    quarter: "4º Trimestre",
    year: 2026,
    description: "Um estudo sistemático e bíblico sobre os fundamentos inabaláveis da fé cristã, a soteriologia e o agir do Espírito Santo.",
    coverColor: "from-amber-600 to-amber-800",
    lessons: [
      {
        id: "licao-1",
        number: 1,
        title: "A Soberania de Deus e o Plano da Salvação",
        theme: "Teologia Bíblica",
        textoAureo: {
          verse: "Porque pela graça sois salvos, por meio da fé; e isto não vem de vós, é dom de Deus.",
          reference: "Efésios 2:8",
        },
        verdadePratica: "A salvação do homem é um ato exclusivo da soberana graça de Deus, manifestada plenamente em Jesus Cristo.",
        leituraBiblica: {
          reference: "Efésios 1:3-14",
          text: "Bendito o Deus e Pai de nosso Senhor Jesus Cristo, o qual nos abençoou com todas as bênçãos espirituais nos lugares celestiais em Cristo; como também nos elegeu nele antes da fundação do mundo, para que fôssemos santos e irrepreensíveis diante dele em amor...",
        },
        introducao: "Nesta lição inaugural, estudaremos a soberania de Deus como o fundamento de toda a obra redentora. Compreenderemos que a salvação não começou no tempo da lei ou no clamor humano, mas na eternidade, no conselho bendito da Trindade.",
        topicos: [
          {
            title: "I. O Deus Soberano e Criador de Todas as Coisas",
            subtopicos: [
              {
                title: "1. A Natureza da Soberania Divina",
                content: "Deus governa soberanamente o universo, sustentando todas as coisas pela palavra do Seu poder (Hb 1:3). Nada foge ao Seu eterno desígnio.",
              },
              {
                title: "2. A Queda e a Necessidade de Redenção",
                content: "Com a desobediência no Éden, o homem tornou-se espiritualmente morto em ofensas e pecados, incapaz de salvar a si mesmo por méritos próprios.",
              },
            ],
          },
          {
            title: "II. O Plano Eterno Manifestado em Cristo",
            subtopicos: [
              {
                title: "1. Eleitos em Cristo",
                content: "O propósito da eleição divina é a santidade e a manifestação do louvor da Sua glória, mediante a redenção pelo sangue do Cordeiro.",
              },
              {
                title: "2. O Mistério Revelado à Igreja",
                content: "Aquilo que outrora era sombra nas profecias e rituais do Antigo Testamento foi gloriosamente revelado na encarnação, morte e ressurreição de Cristo.",
              },
            ],
          },
          {
            title: "III. A Resposta da Fé e a Nova Vida",
            subtopicos: [
              {
                title: "1. A Fé como Instrumento Receptor",
                content: "A fé salvadora não é uma obra meritatória humana, mas a resposta gerada pelo Espírito Santo através da pregação do Evangelho.",
              },
              {
                title: "2. Selados com o Espírito Santo da Promessa",
                content: "Todo aquele que crê é imediatamente selado pelo Espírito Santo, que é o penhor da nossa herança até a redenção final.",
              },
            ],
          },
        ],
        conclusao: "A doutrina da salvação pela graça enche o coração do crente de profunda humildade, louvor e compromisso evangelístico para proclamar Cristo a todas as nações.",
        perguntasFixacao: [
          "O que significa dizer que a salvação é pela graça e não por obras?",
          "Qual é o papel de Jesus Cristo no plano eterno da redenção?",
          "Como o Espírito Santo atua na conversão e na certeza do crente?",
          "De que maneira esta verdade deve impactar nosso testemunho cristão?",
        ],
      },
      {
        id: "licao-2",
        number: 2,
        title: "A Justificação pela Fé: Declarados Justos diante de Deus",
        theme: "Soteriologia",
        textoAureo: {
          verse: "Tendo sido, pois, justificados pela fé, temos paz com Deus, por nosso Senhor Jesus Cristo.",
          reference: "Romanos 5:1",
        },
        verdadePratica: "Pela justificação, Deus imputa a perfeita justiça de Cristo ao pecador arrependido, concedendo-lhe paz e reconciliação eterna.",
        leituraBiblica: {
          reference: "Romanos 3:21-28",
          text: "Mas agora se manifestou sem a lei a justiça de Deus, tendo o testemunho da lei e dos profetas; a saber, a justiça de Deus pela fé em Jesus Cristo para todos e sobre todos os que crêem...",
        },
        introducao: "A justificação pela fé é o coração da Reforma e a coluna mestra da teologia bíblica. Nesta lição, entenderemos a diferença entre perdão legal e justiça imputada.",
        topicos: [
          {
            title: "I. O Tribunal Divino e a Culpa Universal",
            subtopicos: [
              {
                title: "1. Todos Pecaram",
                content: "Diante da lei de Deus, toda boca se cala e todo o mundo é culpado. Ninguém é justificado pelas obras da lei (Rm 3:20).",
              },
              {
                title: "2. O Dilema da Justiça de Deus",
                content: "Deus não pode simplesmente ignorar o pecado, pois Ele é Santo e Justo. A dívida precisava ser quitada.",
              },
            ],
          },
          {
            title: "II. A Propiciação na Cruz do Calvário",
            subtopicos: [
              {
                title: "1. A Morte Substitutiva de Jesus",
                content: "Cristo assumiu a maldição em nosso lugar (Gl 3:13), satisfazendo plenamente a ira justa do Pai.",
              },
              {
                title: "2. A Imputação da Justiça de Cristo",
                content: "Assim como nossos pecados foram creditados a Cristo na cruz, a Sua obediência perfeita foi creditada em nossa conta.",
              },
            ],
          },
          {
            title: "III. Os Frutos Benditos da Justificação",
            subtopicos: [
              {
                title: "1. Paz com Deus",
                content: "A inimizade acabou; o crente agora desfruta de acesso confiante e reverente à presença do Pai.",
              },
              {
                title: "2. Nenhuma Condenação",
                content: "Não há mais condenação judicial para os que estão em Cristo Jesus (Rm 8:1).",
              },
            ],
          },
        ],
        conclusao: "Descansar na justificação é a maior garantia contra as acusações do inimigo e a fonte inesgotável de santidade motivada pelo amor.",
        perguntasFixacao: [
          "O que significa o termo bíblico 'justificação'?",
          "Por que as boas obras não podem justificar o homem pecador?",
          "Qual é o significado da 'justiça imputada'?",
          "Quais bênçãos imediatas acompanham a justificação segundo Romanos 5?",
        ],
      },
      {
        id: "licao-3",
        number: 3,
        title: "A Santificação: Chamados à Separação e Pureza",
        theme: "Vida Cristã",
        textoAureo: {
          verse: "Segui a paz com todos, e a santificação, sem a qual ninguém verá o Senhor.",
          reference: "Hebreus 12:14",
        },
        verdadePratica: "A santificação é o processo contínuo pelo qual o crente é transformado à imagem de Cristo pelo poder do Espírito Santo.",
        leituraBiblica: {
          reference: "1 Tessalonicenses 4:1-8",
          text: "Porque esta é a vontade de Deus, a vossa santificação: que vos abstenhais da prostituição; que cada um de vós saiba possuir o seu vaso em santificação e honra...",
        },
        introducao: "A santidade não é uma opção para o crente, mas a vocação suprema do Reino. Veremos as três dimensões da santificação: posicional, progressiva e final.",
        topicos: [
          {
            title: "I. O Conceito Bíblico de Santidade",
            subtopicos: [
              {
                title: "1. Separados do Pecado",
                content: "Santificar significa consagrar para o uso exclusivo do Senhor, rompendo com o padrão corrompido do mundo.",
              },
              {
                title: "2. Consagrados a Deus",
                content: "A santidade bíblica não é apenas abstenção do mal, mas dedicação ativa e apaixonada a fazer a vontade divina.",
              },
            ],
          },
          {
            title: "II. As Três Fases da Santificação",
            subtopicos: [
              {
                title: "1. Santificação Posicional (Definitiva)",
                content: "No momento da conversão, o crente é lavado e declarado santo em Cristo Jesus (1 Co 6:11).",
              },
              {
                title: "2. Santificação Progressiva (Diária)",
                content: "A luta diária contra a carne, o mundo e o pecado, mediante o poder do Espírito e a meditação na Palavra (Jo 17:17).",
              },
              {
                title: "3. Santificação Final (Glorificação)",
                content: "Na volta de Jesus, receberemos corpos glorificados e seremos livres até da presença do pecado.",
              },
            ],
          },
          {
            title: "III. Instrumentos Divinos para a Nossa Santificação",
            subtopicos: [
              {
                title: "1. A Palavra da Verdade",
                content: "A Bíblia age como espelho e água purificadora que molda nosso caráter e conduta moral.",
              },
              {
                title: "2. A Habitação do Espírito Santo",
                content: "É o Consolador quem produz em nós o Fruto do Espírito e mortifica os desejos da carne (Gl 5:16-22).",
              },
            ],
          },
        ],
        conclusao: "A santidade é a beleza da igreja de Cristo e o maior testemunho do poder do Evangelho em um mundo corrompido.",
        perguntasFixacao: [
          "O que difere a justificação da santificação?",
          "Quais são as três fases da santificação na vida do cristão?",
          "Como a Palavra de Deus atua na nossa purificação diária?",
          "Por que a santificação é indispensável para ver a Deus?",
        ],
      },
    ],
  },
  {
    id: "jovens-proposito",
    category: "jovens",
    categoryLabel: "Jovens",
    title: "Vivendo com Propósito em um Mundo Desafiador",
    quarter: "4º Trimestre",
    year: 2026,
    description: "Respostas bíblicas para os dilemas da juventude: identidade cristã, vocação ministerial, pureza moral e impacto no meio social.",
    coverColor: "from-indigo-600 to-purple-800",
    lessons: [
      {
        id: "licao-jovens-1",
        number: 1,
        title: "Quem Sou Eu em Cristo? A Batalha pela Identidade",
        theme: "Identidade & Vocação",
        textoAureo: {
          verse: "Ninguém despreze a tua mocidade; mas sê o exemplo dos fiéis, na palavra, no trato, no amor, no espírito, na fé, na pureza.",
          reference: "1 Timóteo 4:12",
        },
        verdadePratica: "A identidade do jovem cristão não é definida pelas tendências culturais, mas pelaquilo que a Palavra de Deus diz a seu respeito.",
        leituraBiblica: {
          reference: "Daniel 1:1-8",
          text: "E Daniel propôs no seu coração não se contaminar com a porção das iguarias do rei, nem com o vinho que ele bebia; portanto pediu ao chefe dos eunucos que lhe permitisse não se contaminar...",
        },
        introducao: "Num tempo de pressões e algoritmos digitais, a juventude cristã é convocada a ter a mesma firmeza de Daniel na Babilônia: preservar sua identidade santa sem negociar a fé.",
        topicos: [
          {
            title: "I. A Pressão da Babilônia Moderna",
            subtopicos: [
              {
                title: "1. Mudança de Nomes e Padrões",
                content: "A Babilônia tentou mudar os nomes dos jovens hebreus para apagar a memória de Deus. Hoje o mundo tenta rotular a juventude com ideologias passageiras.",
              },
              {
                title: "2. O Desafio da Conformidade",
                content: "A cultura exige que todos se curvem aos mesmos desejos e estéticas vazias, mas a ordem bíblica é 'não vos conformeis' (Rm 12:2).",
              },
            ],
          },
          {
            title: "II. A Resolução Firme no Coração",
            subtopicos: [
              {
                title: "1. Daniel Decidiu Não se Contaminar",
                content: "A fidelidade começa na intimidade do coração antes de ser testada nas praças públicas.",
              },
              {
                title: "2. Sabedoria e Graça com Mansidão",
                content: "Daniel não foi agressivo, mas firme, respeitoso e confiante de que Deus honraria sua obediência.",
              },
            ],
          },
          {
            title: "III. Jovens como Exemplos Vivos",
            subtopicos: [
              {
                title: "1. O Exemplo dos Fiéis",
                content: "A juventude não é desculpa para imaturidade espiritual; Timóteo foi líder e modelo de consagração desde moço.",
              },
              {
                title: "2. A Recompensa da Fidelidade",
                content: "Deus concedeu a Daniel e seus amigos dez vezes mais sabedoria e graça diante de todo o reino.",
              },
            ],
          },
        ],
        conclusao: "Quando um jovem decide se posicionar por Deus, ele se torna uma tocha viva de esperança e avivamento para toda a sua geração.",
        perguntasFixacao: [
          "Quais são as principais armadilhas para a identidade do jovem hoje?",
          "O que motivou Daniel a tomar uma postura de não contaminação?",
          "Como manter a pureza e a fé no ambiente escolar e universitário?",
          "De que maneira 1 Timóteo 4:12 desafia a juventude da nossa igreja?",
        ],
      },
    ],
  },
  {
    id: "discipulado-fundamentos",
    category: "discipulado",
    categoryLabel: "Discipulado & Novos Crentes",
    title: "Primeiros Passos com Cristo: Fundamentos da Nova Vida",
    quarter: "4º Trimestre",
    year: 2026,
    description: "Manual prático de discipulado para consolidar os novos irmãos: oração, leitura bíblica, batismo nas águas e vida comunitária.",
    coverColor: "from-emerald-600 to-teal-800",
    lessons: [
      {
        id: "licao-disc-1",
        number: 1,
        title: "Nova Criatura: O Início de uma Jornada Gloriosa",
        theme: "Novo Nascimento",
        textoAureo: {
          verse: "Assim que, se alguém está em Cristo, nova criatura é; as coisas velhas já passaram; eis que tudo se fez novo.",
          reference: "2 Coríntios 5:17",
        },
        verdadePratica: "O encontro com Cristo opera uma transformação completa em nosso interior, dando-nos um novo coração e um novo destino.",
        leituraBiblica: {
          reference: "João 3:1-8",
          text: "E havia entre os fariseus um homem, chamado Nicodemos, príncipe dos judeus. Este foi ter de noite com Jesus... Disse-lhe Jesus: Em verdade, em verdade te digo que aquele que não nascer de novo, não pode ver o reino de Deus.",
        },
        introducao: "Parabéns pela decisão de seguir a Jesus! Nesta primeira lição de discipulado, você compreenderá o que aconteceu no momento em que entregou sua vida ao Senhor.",
        topicos: [
          {
            title: "I. O Que Significa Nascer de Novo?",
            subtopicos: [
              {
                title: "1. Não é Reforma Externa, é Regeneração",
                content: "Jesus explicou a Nicodemos que a religiosidade moralista não salva. Precisamos de um renascimento operado pelo Espírito Santo.",
              },
              {
                title: "2. O Perdão Completo do Passado",
                content: "Todos os seus pecados foram apagados pelo sangue de Jesus no Calvário. Você foi perdoado e reconciliado com o Pai.",
              },
            ],
          },
          {
            title: "II. Os Primeiros Hábitos da Nova Vida",
            subtopicos: [
              {
                title: "1. A Oração Diária: Conversando com o Pai",
                content: "Orar é falar com Deus com simplicidade e sinceridade todos os dias, compartilhando alegrias e angústias.",
              },
              {
                title: "2. A Leitura Bíblica: O Pão Espiritual",
                content: "Assim como nosso corpo precisa de alimento, nosso espírito se nutre diariamente da Palavra de Deus.",
              },
            ],
          },
          {
            title: "III. A Família da Fé e o Batismo",
            subtopicos: [
              {
                title: "1. A Importância de Estar na Igreja",
                content: "Nenhum cristão foi chamado para caminhar sozinho; na igreja encontramos irmãos para orar e crescer juntos.",
              },
              {
                title: "2. O Próximo Passo: O Batismo nas Águas",
                content: "O batismo é o testemunho público da nossa morte para o pecado e ressurreição para viver para Cristo.",
              },
            ],
          },
        ],
        conclusao: "Você agora pertence à família de Deus! Persevere firme nos passos de Jesus e veja a glória de Deus se manifestar em sua vida.",
        perguntasFixacao: [
          "O que significa dizer que as coisas velhas já passaram?",
          "Por que a oração e a leitura bíblica diária são essenciais para o novo crente?",
          "Qual é o significado do batismo bíblico?",
          "Como posso testemunhar de Jesus para meus familiares e amigos?",
        ],
      },
    ],
  },
];
