import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, GraduationCap, ChevronRight, CheckCircle2, Lock, MessageCircle, Send, Loader2, ChevronDown, Play, FileText, Download, ExternalLink, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

/* ══════════════════════════════════════════════════════════════
   GRADE CURRICULAR — Baseada na CGADB / FAECAD / CPAD
   Convenção Geral das Assembleias de Deus no Brasil
   ══════════════════════════════════════════════════════════════ */
const modules = [
  {
    id: 1,
    title: "Prolegômenos à Teologia Pentecostal",
    lessons: [
      {
        id: "1.1",
        title: "Introdução à Teologia Pentecostal",
        videoUrl: "https://www.youtube.com/embed/dFSbVen5K9s",
        videoTitle: "Introdução à Teologia Pentecostal — Aula Completa",
        materials: [
          { title: "Apostila: Fundamentos da Teologia Pentecostal", type: "pdf", description: "Material base com os conceitos fundamentais da teologia pentecostal clássica." },
          { title: "Credo das Assembleias de Deus (CGADB)", type: "doc", description: "Documento oficial com as doutrinas fundamentais da denominação." },
          { title: "Leitura complementar: O que é Pentecostalismo?", type: "artigo", description: "Artigo da CPAD sobre as raízes e características do movimento pentecostal." },
        ],
        content: `### O que é Teologia Pentecostal?

A Teologia Pentecostal é o ramo da teologia cristã que enfatiza a **experiência pessoal com o Espírito Santo**, os **dons espirituais** e a **atualidade dos sinais e maravilhas** como elementos centrais da vida cristã e do ministério.

#### Características Distintivas
- **Experiência do Espírito** — A experiência com Deus é tão importante quanto o conhecimento teológico
- **Batismo no Espírito Santo** — Experiência subsequente à conversão, com evidência inicial de falar em outras línguas (Atos 2:4)
- **Atualidade dos dons** — Todos os dons espirituais de 1 Coríntios 12 estão disponíveis hoje
- **Cura divina** — Deus continua curando sobrenaturalmente
- **Segunda vinda de Cristo** — Crença na volta iminente e literal de Jesus

#### Base Bíblica Fundamental
- **Joel 2:28-29** — *"Derramarei o meu Espírito sobre toda a carne"*
- **Atos 1:8** — *"Recebereis poder, ao descer sobre vós o Espírito Santo"*
- **Atos 2:4** — *"Todos foram cheios do Espírito Santo e começaram a falar em outras línguas"*

#### A CGADB e a Teologia Pentecostal
A Convenção Geral das Assembleias de Deus no Brasil (CGADB), fundada em 1930, é a maior denominação evangélica do Brasil e uma das maiores do mundo. Sua teologia é baseada nas Escrituras e no **Credo das Assembleias de Deus**, que afirma as doutrinas fundamentais do pentecostalismo clássico.`,
      },
      {
        id: "1.2",
        title: "Credo e Declaração de Fé das Assembleias de Deus",
        content: `### As Verdades Fundamentais das Assembleias de Deus

O Credo das Assembleias de Deus, conforme adotado pela CGADB, declara as seguintes doutrinas fundamentais:

#### 1. As Escrituras Sagradas
A Bíblia é a Palavra de Deus, inspirada verbalmente, infalível e inerrante — a regra suprema de fé e prática.
- **2 Timóteo 3:16** — *"Toda a Escritura é divinamente inspirada"*

#### 2. O Deus Único e Verdadeiro
Cremos em um só Deus, eternamente existente em três pessoas: Pai, Filho e Espírito Santo.
- **Deuteronômio 6:4** — *"O Senhor nosso Deus é o único Senhor"*

#### 3. O Senhor Jesus Cristo
Sua divindade, nascimento virginal, vida sem pecado, morte vicária, ressurreição corporal, ascensão e volta.
- **João 1:1,14** — *"O Verbo era Deus... e o Verbo se fez carne"*

#### 4. A Queda do Homem
O homem foi criado bom, mas pela transgressão voluntária caiu em pecado.
- **Romanos 3:23** — *"Todos pecaram e destituídos estão da glória de Deus"*

#### 5. A Salvação
Pela graça, mediante a fé no sacrifício de Cristo.
- **Efésios 2:8-9** — *"Pela graça sois salvos, mediante a fé"*

#### 6. O Batismo no Espírito Santo
Experiência subsequente à salvação, com a evidência inicial de falar em línguas.
- **Atos 2:4; 10:46; 19:6**

#### 7. A Igreja
O Corpo de Cristo, habitação de Deus pelo Espírito.

#### 8. A Segunda Vinda de Cristo
Arrebatamento pré-tribulacional da Igreja e volta gloriosa para reinar.`,
      },
      {
        id: "1.3",
        title: "Metodologia do Estudo Teológico",
        content: `### Como Estudar Teologia na Perspectiva Pentecostal

#### Princípios Metodológicos

1. **Primazia das Escrituras** — A Bíblia é a fonte primária e autoridade final
2. **Iluminação do Espírito** — O Espírito Santo guia na compreensão da Palavra (João 16:13)
3. **Experiência e Palavra** — A experiência deve ser avaliada à luz das Escrituras, nunca o contrário
4. **Comunidade de fé** — A teologia é feita dentro da comunidade da Igreja

#### Ferramentas de Estudo
- **Exegese** — Análise do texto bíblico nos idiomas originais (hebraico e grego)
- **Hermenêutica** — Interpretação correta do texto em seu contexto
- **Teologia Bíblica** — Estudo dos temas bíblicos em seu desenvolvimento canônico
- **Teologia Sistemática** — Organização das doutrinas em sistema coerente

#### O Obreiro Aprovado
**2 Timóteo 2:15** — *"Procura apresentar-te a Deus aprovado, como obreiro que não tem de que se envergonhar, que maneja bem a palavra da verdade."*

A CGADB incentiva seus ministros e obreiros a buscar formação teológica sólida, unindo **conhecimento acadêmico** com **experiência espiritual**.`,
      },
    ],
  },
  {
    id: 2,
    title: "Bibliologia e Hermenêutica Pentecostal",
    lessons: [
      {
        id: "2.1",
        title: "Bibliologia — A Doutrina das Escrituras",
        content: `### A Bíblia: Palavra de Deus

#### Inspiração das Escrituras
A doutrina da **inspiração verbal e plenária** afirma que cada palavra da Escritura original foi inspirada por Deus.

- **2 Pedro 1:21** — *"Homens santos de Deus falaram inspirados pelo Espírito Santo"*
- **2 Timóteo 3:16** — *"Toda a Escritura é divinamente inspirada e proveitosa"*

#### Inerrância
Os manuscritos originais são isentos de erro em tudo o que afirmam.

#### Suficiência
A Bíblia contém tudo que é necessário para a fé e a prática cristã.
- **Salmo 119:105** — *"Lâmpada para os meus pés é a tua Palavra"*

#### O Cânon Bíblico
- **Antigo Testamento** — 39 livros (Pentateuco, Históricos, Poéticos, Profetas)
- **Novo Testamento** — 27 livros (Evangelhos, Atos, Epístolas, Apocalipse)
- As Assembleias de Deus **não aceitam** os livros apócrifos/deuterocanônicos como Escritura inspirada

#### Formação do Cânon
- Critérios: autoria apostólica, ortodoxia, universalidade, inspiração reconhecida
- **Isaías 40:8** — *"A palavra do nosso Deus subsiste eternamente"*`,
      },
      {
        id: "2.2",
        title: "Hermenêutica Pentecostal",
        content: `### Interpretação Bíblica na Perspectiva Pentecostal

#### Princípios Hermenêuticos Fundamentais

1. **Interpretação Literal** — Quando o sentido literal faz sentido, não busque outro sentido
2. **Contexto** — Toda passagem deve ser lida em seu contexto imediato, do livro e de toda a Bíblia
3. **Analogia da Fé** — A Escritura interpreta a Escritura
4. **Propósito do Autor** — Buscar a intenção original do autor humano e divino
5. **Gênero Literário** — Reconhecer poesia, narrativa, profecia, epístola, apocalíptica

#### A Hermenêutica Pentecostal Distintiva

Os pentecostais reconhecem que os textos narrativos de **Atos dos Apóstolos** têm valor **normativo** (e não apenas descritivo) para a experiência cristã:

- Os relatos do batismo no Espírito Santo em Atos são **padrão** para a Igreja hoje
- A experiência de línguas é **normativa**, não excepcional
- Os sinais e prodígios fazem parte da **vida normal** da Igreja

#### Cuidados Hermenêuticos
- Não isolar versículos do contexto
- Não criar doutrina a partir de um único texto
- Distinguir entre **princípios permanentes** e **práticas culturais**
- **Neemias 8:8** — *"Liam no livro... e explicavam o sentido, de modo que se entendesse a leitura"*`,
      },
    ],
  },
  {
    id: 3,
    title: "Teologia Própria e Cristologia",
    lessons: [
      {
        id: "3.1",
        title: "A Doutrina de Deus",
        content: `### Teologia Própria — O Estudo de Deus

#### A Existência de Deus
As Assembleias de Deus afirmam a existência de um Deus pessoal, criador e sustentador de todas as coisas.

**Argumentos para a existência de Deus:**
1. **Cosmológico** — Todo efeito tem uma causa; o universo teve uma causa primeira
2. **Teleológico** — O design inteligente aponta para um Designer
3. **Moral** — A lei moral aponta para um Legislador
4. **Ontológico** — O conceito de um Ser perfeito implica Sua existência

#### Os Atributos de Deus

**Atributos Incomunicáveis (exclusivos de Deus):**
- **Aseidade** — Deus existe por Si mesmo (Êxodo 3:14 — *"EU SOU O QUE SOU"*)
- **Imutabilidade** — Deus não muda (Malaquias 3:6)
- **Eternidade** — Sem início e sem fim (Salmo 90:2)
- **Onipresença** — Presente em toda parte (Salmo 139:7-10)
- **Onisciência** — Conhece todas as coisas (1 João 3:20)
- **Onipotência** — Todo-poderoso (Apocalipse 19:6)

**Atributos Comunicáveis (refletidos em nós):**
- Amor, Santidade, Justiça, Bondade, Misericórdia, Graça

#### A Santíssima Trindade
Um só Deus em três Pessoas co-eternas e co-iguais: Pai, Filho e Espírito Santo.
- **Mateus 28:19** — Batismo no nome do Pai, do Filho e do Espírito Santo
- **2 Coríntios 13:13** — A bênção trinitária`,
      },
      {
        id: "3.2",
        title: "Cristologia — A Pessoa de Cristo",
        content: `### Jesus Cristo: Verdadeiro Deus e Verdadeiro Homem

#### A Divindade de Cristo
- **João 1:1** — *"No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus"*
- **Colossenses 2:9** — *"Nele habita corporalmente toda a plenitude da Divindade"*
- **Hebreus 1:3** — *"A expressa imagem da sua pessoa"*
- **Filipenses 2:6** — *"Sendo em forma de Deus, não teve por usurpação ser igual a Deus"*

#### A Humanidade de Cristo
- **Nascimento virginal** — Concebido pelo Espírito Santo, nascido da virgem Maria (Mateus 1:18-23)
- **Vida sem pecado** — Tentado em tudo, mas sem pecado (Hebreus 4:15)
- **Crescimento real** — Crescia em sabedoria e estatura (Lucas 2:52)

#### A União Hipostática
Duas naturezas (divina e humana) em uma só Pessoa, sem confusão, mudança, divisão ou separação.

#### A Obra Redentora
1. **Profeta** — Revelou a vontade de Deus (Deuteronômio 18:15)
2. **Sacerdote** — Ofereceu-Se como sacrifício perfeito (Hebreus 7:27)
3. **Rei** — Reina sobre Seu povo e voltará em glória (Apocalipse 19:16)

#### A Expiação Substitutiva
Cristo morreu **em nosso lugar**, carregando nossos pecados na cruz.
- **Isaías 53:5** — *"Ele foi ferido pelas nossas transgressões"*
- **Romanos 5:8** — *"Cristo morreu por nós, sendo nós ainda pecadores"*
- **1 Pedro 2:24** — *"Levando ele mesmo em seu corpo os nossos pecados sobre o madeiro"*`,
      },
      {
        id: "3.3",
        title: "Ressurreição e Ascensão de Cristo",
        content: `### A Vitória de Cristo sobre a Morte

#### A Ressurreição Corporal
As Assembleias de Deus confessam a ressurreição **literal, corporal e histórica** de Jesus Cristo.

- **1 Coríntios 15:3-4** — *"Cristo morreu... foi sepultado... ressuscitou ao terceiro dia"*
- **Lucas 24:39** — *"Vede as minhas mãos e os meus pés, que sou eu mesmo"*
- **Romanos 1:4** — *"Declarado Filho de Deus com poder... pela ressurreição dos mortos"*

#### Evidências da Ressurreição
1. O túmulo vazio
2. As aparições pós-ressurreição (mais de 500 testemunhas — 1 Coríntios 15:6)
3. A transformação dos discípulos
4. O surgimento da Igreja

#### Importância Teológica
- Prova da divindade de Cristo
- Garantia da nossa justificação (Romanos 4:25)
- Promessa da nossa própria ressurreição (1 Coríntios 15:20-23)
- Vitória sobre Satanás, pecado e morte (Colossenses 2:15)

#### A Ascensão
- **Atos 1:9-11** — Jesus subiu ao céu e voltará da mesma forma
- Está **assentado à destra de Deus** (Hebreus 1:3)
- Exerce ministério de **intercessão** por nós (Hebreus 7:25)
- **Enviou o Espírito Santo** após Sua ascensão (João 16:7; Atos 2:33)`,
      },
    ],
  },
  {
    id: 4,
    title: "Pneumatologia — O Espírito Santo",
    lessons: [
      {
        id: "4.1",
        title: "A Pessoa do Espírito Santo",
        content: `### O Espírito Santo: A Terceira Pessoa da Trindade

Esta é uma das doutrinas mais importantes e distintivas da fé pentecostal conforme a CGADB.

#### Personalidade do Espírito Santo
O Espírito Santo **não é uma força impessoal**, mas uma Pessoa divina:
- **Ele ensina** (João 14:26)
- **Ele testifica** (João 15:26)
- **Ele convence** (João 16:8)
- **Ele guia** (Romanos 8:14)
- **Ele intercede** (Romanos 8:26)
- **Ele pode ser entristecido** (Efésios 4:30)
- **Ele pode ser resistido** (Atos 7:51)
- **Ele distribui dons** (1 Coríntios 12:11)

#### Divindade do Espírito Santo
- Chamado de **Deus** (Atos 5:3-4)
- Possui **atributos divinos**: onipresença (Salmo 139:7), onisciência (1 Coríntios 2:10-11), eternidade (Hebreus 9:14)
- Participou da **criação** (Gênesis 1:2)
- Participou da **ressurreição** de Cristo (Romanos 8:11)

#### Obra do Espírito no Antigo Testamento
- Criação (Gênesis 1:2)
- Capacitação de líderes (Juízes 6:34 — Gideão; 1 Samuel 16:13 — Davi)
- Inspiração dos profetas (2 Pedro 1:21)
- **Diferença fundamental:** No AT, o Espírito vinha **sobre** pessoas específicas; no NT, habita **em** todos os crentes (João 14:17)`,
      },
      {
        id: "4.2",
        title: "O Batismo no Espírito Santo",
        content: `### A Doutrina Distintiva do Pentecostalismo

#### Definição (conforme CGADB)
O Batismo no Espírito Santo é uma **experiência subsequente à salvação**, um revestimento de poder para o serviço cristão, cuja **evidência física inicial** é o falar em outras línguas conforme o Espírito concede.

#### Base Bíblica
- **Joel 2:28-29** — A promessa do derramamento do Espírito
- **Lucas 24:49** — *"Ficai na cidade até que do alto sejais revestidos de poder"*
- **Atos 1:4-5,8** — *"Sereis batizados com o Espírito Santo... recebereis poder"*
- **Atos 2:1-4** — O Dia de Pentecostes: **todos falaram em línguas**

#### Os Cinco Relatos em Atos
1. **Atos 2:4** — Pentecostes em Jerusalém — *falaram em outras línguas*
2. **Atos 8:14-17** — Samaritanos — evidência implícita (Simão "viu")
3. **Atos 9:17** — Saulo de Tarso — *"para que sejas cheio do Espírito"*
4. **Atos 10:44-46** — Casa de Cornélio — *"falavam em línguas e magnificavam a Deus"*
5. **Atos 19:6** — Éfeso — *"falavam em línguas e profetizavam"*

#### Distinção Importante
- **Regeneração** — O Espírito habita no crente na conversão (Romanos 8:9)
- **Batismo no Espírito** — Revestimento de poder **após** a conversão (Atos 1:8)
- Não é condição para salvação, mas é **promessa para todos os crentes** (Atos 2:39)

#### Como Receber
- Com fé (Gálatas 3:14)
- Com oração (Lucas 11:13)
- Com desejo sincero (João 7:37-39)`,
      },
      {
        id: "4.3",
        title: "Os Dons Espirituais",
        content: `### Os Dons do Espírito Santo (1 Coríntios 12:4-11)

As Assembleias de Deus creem na **atualidade de todos os dons espirituais**, rejeitando o cessacionismo.

#### Classificação dos Nove Dons

**Dons de Revelação (saber):**
1. **Palavra de Sabedoria** (*lógos sophías*) — Revelação sobrenatural de propósito e plano divino
2. **Palavra de Conhecimento** (*lógos gnṓseōs*) — Revelação sobrenatural de fatos desconhecidos
3. **Discernimento de Espíritos** (*diakríseis pneumátōn*) — Capacidade de distinguir a fonte espiritual

**Dons de Poder (agir):**
4. **Fé** (*pístis*) — Fé sobrenatural para o impossível
5. **Dons de Cura** (*charísmata iamátōn*) — Cura sobrenatural de enfermidades
6. **Operação de Milagres** (*energḗmata dynámeōn*) — Atos sobrenaturais de poder

**Dons de Comunicação (falar):**
7. **Profecia** (*prophēteía*) — Mensagem direta de Deus para edificação, exortação e consolação (1 Coríntios 14:3)
8. **Variedade de Línguas** (*génē glōssōn*) — Falar em idiomas não aprendidos pelo Espírito
9. **Interpretação de Línguas** (*hermēneía glōssōn*) — Interpretação sobrenatural das línguas

#### Regulamento dos Dons no Culto
- **1 Coríntios 14:26** — *"Faça-se tudo para edificação"*
- **1 Coríntios 14:33** — *"Deus não é Deus de confusão"*
- **1 Coríntios 14:40** — *"Tudo se faça com decência e ordem"*

#### O Fruto do Espírito (Gálatas 5:22-23)
Os dons sem o fruto são ineficazes. O amor é o **caminho mais excelente** (1 Coríntios 13).
- Amor, gozo, paz, longanimidade, benignidade, bondade, fé, mansidão, temperança`,
      },
    ],
  },
  {
    id: 5,
    title: "Soteriologia — Doutrina da Salvação",
    lessons: [
      {
        id: "5.1",
        title: "A Queda e a Necessidade da Salvação",
        content: `### Hamartiologia — A Doutrina do Pecado

#### A Criação e a Queda
- Deus criou o homem **bom e reto** (Gênesis 1:31; Eclesiastes 7:29)
- Pela **desobediência voluntária**, Adão e Eva caíram (Gênesis 3)
- O pecado trouxe **morte espiritual e física** (Romanos 5:12)

#### A Natureza do Pecado
- **Pecado original** — Toda a humanidade herdou a natureza pecaminosa de Adão
- **Romanos 3:23** — *"Todos pecaram e destituídos estão da glória de Deus"*
- **Romanos 6:23** — *"O salário do pecado é a morte"*
- **Isaías 59:2** — O pecado separa o homem de Deus

#### A Incapacidade Humana
O homem, por si mesmo, **não pode** salvar-se:
- **Efésios 2:1** — *"Estáveis mortos em ofensas e pecados"*
- **Jeremias 13:23** — *"Pode o etíope mudar a sua pele?"*
- **João 15:5** — *"Sem mim nada podeis fazer"*

#### A Graça Preveniente
Deus, em Sua graça, age **antes** da resposta humana, atraindo o pecador:
- **João 6:44** — *"Ninguém pode vir a mim, se o Pai... não o trouxer"*
- **Romanos 2:4** — *"A benignidade de Deus te conduz ao arrependimento"*`,
      },
      {
        id: "5.2",
        title: "Justificação, Regeneração e Santificação",
        content: `### O Processo da Salvação

#### Arrependimento (*metánoia*)
Mudança radical de mente e direção, voltando-se do pecado para Deus.
- **Atos 3:19** — *"Arrependei-vos e convertei-vos"*
- **Lucas 13:3** — *"Se não vos arrependerdes, todos igualmente perecereis"*

#### Fé Salvadora
Confiança pessoal em Cristo e Sua obra consumada na cruz.
- **Efésios 2:8-9** — *"Pela graça sois salvos, mediante a fé... dom de Deus"*
- **Romanos 10:9-10** — Confissão e crença de coração

#### Justificação
Ato judicial de Deus que **declara justo** o pecador com base na obra de Cristo.
- **Romanos 5:1** — *"Justificados pela fé, temos paz com Deus"*
- **Romanos 3:24** — *"Justificados gratuitamente pela sua graça"*

#### Regeneração (Novo Nascimento)
Obra sobrenatural do Espírito que dá **nova vida** ao crente.
- **João 3:3,5** — *"Necessário vos é nascer de novo"*
- **Tito 3:5** — *"Lavagem da regeneração e da renovação do Espírito Santo"*
- **2 Coríntios 5:17** — *"Se alguém está em Cristo, nova criatura é"*

#### Santificação
Processo contínuo de separação do pecado e consagração a Deus.
- **1 Tessalonicenses 4:3** — *"Esta é a vontade de Deus, a vossa santificação"*
- **Hebreus 12:14** — *"Segui a santificação, sem a qual ninguém verá o Senhor"*
- As Assembleias de Deus enfatizam a **santificação progressiva** como evidência da vida cristã genuína

#### Segurança do Crente
A posição da CGADB afirma que o crente pode, por escolha voluntária e persistência no pecado, **perder a salvação** (posição arminiana):
- **Hebreus 6:4-6** — Advertência contra a apostasia
- **2 Pedro 2:20-21** — O perigo de voltar atrás
- Porém, Deus **guarda** o crente fiel (Judas 24; João 10:28-29)`,
      },
    ],
  },
  {
    id: 6,
    title: "Leitura Pentecostal de Atos dos Apóstolos",
    lessons: [
      {
        id: "6.1",
        title: "O Livro de Atos como Modelo para a Igreja",
        content: `### Atos dos Apóstolos: O Manual Pentecostal

#### Autoria e Propósito
- **Autor:** Lucas, médico e companheiro de Paulo
- **Propósito:** Narrar a expansão da Igreja pelo poder do Espírito Santo
- **Tema central:** *"Recebereis poder"* (Atos 1:8)

#### A Leitura Pentecostal de Atos
Para os pentecostais, Atos não é apenas **descritivo** (conta o que aconteceu), mas também **normativo** (estabelece padrão para a Igreja hoje).

#### O Modelo da Igreja Primitiva
- **Atos 2:42-47** — As quatro marcas da Igreja:
  1. **Doutrina dos Apóstolos** — Ensino bíblico sólido
  2. **Comunhão** — Vida em comunidade
  3. **Partir do Pão** — Santa Ceia e convívio
  4. **Oração** — Busca constante a Deus

#### O Dia de Pentecostes (Atos 2)
- Cumprimento da promessa de Joel 2
- Nascimento da Igreja do Novo Testamento
- O Espírito capacitou os discípulos para testemunho mundial
- **120 no cenáculo** → **3.000 convertidos** no primeiro sermão de Pedro

#### A Expansão Missionária
- Jerusalém → Judeia → Samaria → Confins da Terra (Atos 1:8)
- A Igreja crescia porque o Espírito **confirmava a Palavra com sinais** (Marcos 16:20)`,
      },
      {
        id: "6.2",
        title: "Os Avivamentos em Atos",
        content: `### Padrões de Avivamento no Livro de Atos

#### Pentecostes — Atos 2
- **Circunstância:** Unanimidade em oração (Atos 1:14)
- **Manifestação:** Vento, fogo, línguas
- **Resultado:** 3.000 conversões, sinais e maravilhas

#### Samaria — Atos 8
- **Pregador:** Filipe, o evangelista
- **Manifestação:** Curas, libertações, grande alegria
- **Complemento:** Pedro e João impõem as mãos → recebem o Espírito Santo (Atos 8:17)

#### Casa de Cornélio — Atos 10
- **Significado:** O Evangelho alcança os gentios
- **Manifestação:** O Espírito caiu sobre todos que ouviam; falaram em línguas (Atos 10:44-46)
- **Lição:** Deus não faz acepção de pessoas

#### Éfeso — Atos 19
- **Pregador:** Paulo
- **Pergunta chave:** *"Recebestes o Espírito Santo quando crestes?"* (Atos 19:2)
- **Resultado:** Imposição de mãos → falaram em línguas e profetizaram

#### Princípios para Avivamento Hoje
1. Oração unânime e perseverante
2. Pregação fiel da Palavra
3. Abertura para a ação sobrenatural do Espírito
4. Obediência à direção divina
5. **Atos 4:31** — *"Tendo eles orado, moveu-se o lugar... e todos foram cheios do Espírito Santo"*`,
      },
    ],
  },
  {
    id: 7,
    title: "Eclesiologia e Ordenanças",
    lessons: [
      {
        id: "7.1",
        title: "A Doutrina da Igreja",
        content: `### Eclesiologia na Perspectiva Assembleiana

#### Definição
A Igreja (*ekklēsía* — "chamados para fora") é a comunidade dos salvos por Cristo, o Corpo de Cristo na terra.

#### Igreja Local e Igreja Universal
- **Igreja Universal** — Todos os salvos de todos os tempos e lugares
- **Igreja Local** — Congregação visível de crentes em determinado lugar
- As Assembleias de Deus valorizam grandemente a **igreja local** como expressão visível do Reino

#### Imagens Bíblicas da Igreja
- **Corpo de Cristo** (1 Coríntios 12:27)
- **Templo do Espírito Santo** (1 Coríntios 3:16)
- **Noiva de Cristo** (Efésios 5:25-27)
- **Coluna e firmeza da verdade** (1 Timóteo 3:15)

#### Governo da Igreja nas Assembleias de Deus
O modelo da CGADB é **congregacional com liderança pastoral**:
- O **pastor** preside a igreja local
- A **assembleia** de membros participa das decisões importantes
- Os **presbíteros e diáconos** auxiliam no governo
- A **Convenção** (CGADB) mantém unidade doutrinária e administrativa

#### Ministério Quíntuplo (Efésios 4:11)
- Apóstolos, Profetas, Evangelistas, Pastores e Mestres
- Dados por Cristo para **aperfeiçoar os santos** e **edificar o Corpo**`,
      },
      {
        id: "7.2",
        title: "As Ordenanças da Igreja",
        content: `### Batismo em Águas e Santa Ceia

As Assembleias de Deus reconhecem **duas ordenanças** instituídas por Cristo:

#### 1. Batismo em Águas
- **Modo:** Por imersão (*baptízō* = mergulhar)
- **Fórmula:** Em nome do Pai, do Filho e do Espírito Santo (Mateus 28:19)
- **Significado:** Símbolo da morte, sepultamento e ressurreição com Cristo (Romanos 6:3-4)
- **Candidatos:** Somente os que **creram** e se arrependeram (Atos 2:38)
- **Não é salvífico**, mas é mandamento de Cristo (Marcos 16:16)

#### 2. Santa Ceia do Senhor
- **Elementos:** Pão (sem fermento) e vinho (suco de uva)
- **Significado:** Memorial da morte de Cristo (1 Coríntios 11:24-25)
- **Frequência:** Regularmente, conforme decisão da igreja local
- **Participantes:** Crentes batizados que examinaram a si mesmos (1 Coríntios 11:28)
- **Advertência:** Quem participa indignamente come e bebe juízo para si (1 Coríntios 11:29)

#### Lava-pés
Algumas igrejas das Assembleias de Deus praticam o **lava-pés** como terceira ordenança (João 13:14-15), embora não seja consenso em toda a CGADB.

#### Distinção Importante
As Assembleias de Deus rejeitam a **transubstanciação** (católica) e a **consubstanciação** (luterana). Os elementos são **simbólicos/memoriais**.`,
      },
    ],
  },
  {
    id: 8,
    title: "Escatologia — As Últimas Coisas",
    lessons: [
      {
        id: "8.1",
        title: "A Segunda Vinda de Cristo",
        content: `### Escatologia Pentecostal (Posição da CGADB)

As Assembleias de Deus adotam a posição **pré-milenista** e **pré-tribulacionista**.

#### O Arrebatamento da Igreja
Cristo virá **antes** da Grande Tribulação para buscar Sua Igreja.
- **1 Tessalonicenses 4:16-17** — *"O Senhor mesmo descerá do céu... e os mortos em Cristo ressuscitarão primeiro; depois nós, os que ficarmos vivos, seremos arrebatados"*
- **João 14:3** — *"Virei outra vez e vos levarei para mim mesmo"*
- **1 Coríntios 15:51-52** — *"Num momento, num abrir e fechar de olhos"*
- Evento **iminente** — pode acontecer a qualquer momento

#### A Grande Tribulação
Período de 7 anos de juízo sobre a terra após o arrebatamento.
- **Daniel 9:27** — A "semana" final de Daniel
- **Mateus 24:21** — *"Haverá então grande aflição, como nunca houve"*
- **Apocalipse 6-19** — Os selos, trombetas e taças do juízo divino
- Surgimento do **Anticristo** (2 Tessalonicenses 2:3-4)

#### A Volta Gloriosa
Após a tribulação, Cristo volta **visivelmente** com Sua Igreja.
- **Apocalipse 19:11-16** — O Rei dos reis e Senhor dos senhores
- **Zacarias 14:4** — Seus pés tocarão o Monte das Oliveiras

#### O Milênio
Reinado literal de 1.000 anos de Cristo na terra.
- **Apocalipse 20:4-6** — Os santos reinarão com Cristo
- Cumprimento das promessas feitas a Israel
- Satanás será preso durante este período`,
      },
      {
        id: "8.2",
        title: "Juízo Final e Estado Eterno",
        content: `### Os Eventos Finais

#### O Tribunal de Cristo
Para os **crentes** — julgamento de obras para recompensa (não para salvação).
- **2 Coríntios 5:10** — *"Todos devemos comparecer ante o tribunal de Cristo"*
- **1 Coríntios 3:12-15** — Obras de ouro, prata, pedras preciosas vs. madeira, feno, palha

#### O Juízo Final (Grande Trono Branco)
Para os **ímpios** — julgamento final antes do estado eterno.
- **Apocalipse 20:11-15** — *"Quem não foi achado escrito no livro da vida foi lançado no lago de fogo"*

#### O Estado Eterno

**Para os salvos — Novos Céus e Nova Terra:**
- **Apocalipse 21:1-4** — *"Eis que faço novas todas as coisas"*
- Sem morte, sem dor, sem pranto
- A Nova Jerusalém desce do céu (Apocalipse 21:10-27)
- **Comunhão eterna** com Deus

**Para os perdidos — Condenação eterna:**
- As Assembleias de Deus creem no **inferno literal** como lugar de tormento eterno
- **Mateus 25:46** — *"Irão estes para o tormento eterno, mas os justos para a vida eterna"*
- **Apocalipse 20:10** — O lago de fogo

#### A Esperança Cristã
- **Tito 2:13** — *"Aguardando a bem-aventurada esperança e o aparecimento da glória do grande Deus e nosso Senhor Jesus Cristo"*
- A escatologia pentecostal produz **urgência evangelística** e **santidade de vida**`,
      },
    ],
  },
  {
    id: 9,
    title: "História do Pentecostalismo",
    lessons: [
      {
        id: "9.1",
        title: "Origens do Movimento Pentecostal",
        content: `### Do Século XIX ao Avivamento da Rua Azusa

#### Antecedentes Históricos
- **Movimentos de santidade** do século XIX (John Wesley, Charles Finney)
- **Charles Parham** (1901) — Escola Bíblica em Topeka, Kansas: Agnes Ozman fala em línguas
- Parham formula a doutrina das **línguas como evidência inicial** do batismo no Espírito

#### O Avivamento da Rua Azusa (1906-1909)
- **William J. Seymour** — Pastor afro-americano, aluno de Parham
- **312 Azusa Street**, Los Angeles, Califórnia
- Características:
  - Cultos diários, quase ininterruptos
  - Manifestações do Espírito: línguas, curas, profecias
  - **Integração racial** — negros, brancos, latinos adorando juntos
  - Missionários enviados ao mundo inteiro

#### Expansão Mundial
- O movimento se espalhou rapidamente por todos os continentes
- **1910-1920** — Chegada às principais nações do mundo
- Formação das primeiras denominações pentecostais:
  - Assemblies of God (EUA, 1914)
  - Igreja do Evangelho Quadrangular
  - Igreja de Deus em Cristo`,
      },
      {
        id: "9.2",
        title: "As Assembleias de Deus no Brasil",
        content: `### A História da Maior Denominação Evangélica do Brasil

#### Os Fundadores
- **Daniel Berg** (1884-1963) — Sueco, metalúrgico
- **Gunnar Vingren** (1879-1933) — Sueco, pastor batista
- Ambos receberam direção profética para ir a um lugar chamado **"Pará"**

#### A Fundação (1911)
- **18 de junho de 1911** — Fundação em **Belém do Pará**
- Inicialmente chamada **"Missão de Fé Apostólica"**
- Nome "Assembleia de Deus" adotado em **1918**
- Começou na **Igreja Batista** de Belém, de onde foram expulsos por pregarem o batismo no Espírito Santo

#### Crescimento e Expansão
- **1930** — Fundação da **CGADB** (Convenção Geral das Assembleias de Deus no Brasil)
- **1940** — Fundação da **CPAD** (Casa Publicadora das Assembleias de Deus)
- Publicação das revistas da **Escola Bíblica Dominical** (EBD)
- Crescimento exponencial em todo o território nacional

#### A CGADB Hoje
- Maior denominação evangélica do Brasil
- Dezenas de milhões de membros
- Presente em todos os municípios brasileiros
- Estrutura: igrejas locais → convenções estaduais → CGADB
- Publicações oficiais pela CPAD
- **Lema:** Fidelidade às Escrituras e ao Pentecostalismo Clássico`,
      },
    ],
  },
  {
    id: 10,
    title: "Homilética e Prática Ministerial",
    lessons: [
      {
        id: "10.1",
        title: "Homilética — A Arte de Pregar",
        content: `### Pregação Pentecostal com Excelência

#### O que é Homilética?
A ciência e arte de preparar e apresentar sermões bíblicos.

#### Tipos de Sermão
1. **Temático** — Baseado em um tema com textos diversos
2. **Textual** — Baseado em um texto curto, seguindo suas divisões naturais
3. **Expositivo** — Exposição detalhada de uma passagem extensa

#### Estrutura do Sermão
1. **Introdução** — Captar atenção, apresentar o tema
2. **Proposição** — A ideia central em uma frase
3. **Corpo** — 2 a 4 pontos principais com sub-pontos
4. **Ilustrações** — Histórias, exemplos, analogias
5. **Aplicação** — O que o ouvinte deve fazer
6. **Conclusão** — Resumo e apelo

#### A Pregação Pentecostal
- Começa com **oração e jejum**
- Baseia-se na **unção do Espírito** (1 João 2:27)
- Combina **preparo intelectual** com **dependência espiritual**
- Não substitui o estudo pela "unção", nem a unção pelo estudo
- **1 Coríntios 2:4** — *"A minha pregação não consistiu em palavras persuasivas de sabedoria humana, mas em demonstração do Espírito e de poder"*

#### Princípios Éticos do Pregador
- Integridade (viver o que prega)
- Fidelidade ao texto bíblico
- Respeito ao rebanho
- Humildade e dependência de Deus`,
      },
      {
        id: "10.2",
        title: "Teologia Pastoral e Liderança",
        content: `### O Ministério Pastoral na Assembleia de Deus

#### Requisitos Bíblicos (1 Timóteo 3:1-7; Tito 1:5-9)
- Irrepreensível, marido de uma mulher
- Temperante, sóbrio, ordeiro
- Apto para ensinar
- Não dado ao vinho, nem violento
- Hospitaleiro, amigo do bem
- Justo, santo, temperante
- **Governar bem a própria casa**

#### Hierarquia Ministerial na CGADB
1. **Diácono** — Servo da igreja (Atos 6:1-6)
2. **Presbítero** — Auxiliar do pastor na liderança espiritual
3. **Evangelista** — Vocacionado para ganhar almas
4. **Pastor** — Líder espiritual da congregação
5. **Missionário** — Enviado para campos novos

#### A Escola Bíblica Dominical (EBD)
- Pilar fundamental das Assembleias de Deus
- Ensino sistemático da Palavra para todas as idades
- Revistas publicadas pela CPAD com base no currículo da CGADB
- **Oséias 4:6** — *"O meu povo foi destruído por falta de conhecimento"*

#### Ética e Costumes
As Assembleias de Deus mantêm posições sobre:
- Santidade na aparência e conduta
- Família cristã tradicional
- Separação do mundanismo
- Compromisso com a igreja local
- **Romanos 12:2** — *"Não vos conformeis com este mundo, mas transformai-vos pela renovação da vossa mente"*`,
      },
    ],
  },
];

type ChatMsg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/theology-chat`;

const CursoTeologia = () => {
  const [activeModule, setActiveModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("theology-completed") || "[]"); } catch { return []; }
  });
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [expandedModule, setExpandedModule] = useState<number | null>(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const currentModule = modules[activeModule];
  const currentLesson = currentModule.lessons[activeLesson];

  const toggleComplete = (lessonId: string) => {
    const updated = completedLessons.includes(lessonId)
      ? completedLessons.filter((id) => id !== lessonId)
      : [...completedLessons, lessonId];
    setCompletedLessons(updated);
    localStorage.setItem("theology-completed", JSON.stringify(updated));
  };

  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);
  const progress = Math.round((completedLessons.length / totalLessons) * 100);

  const sendChat = async () => {
    const text = chatInput.trim();
    if (!text || chatLoading) return;
    const userMsg: ChatMsg = { role: "user", content: text };
    const allMessages = [...chatMessages, userMsg];
    setChatMessages(allMessages);
    setChatInput("");
    setChatLoading(true);

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: allMessages,
          context: `Módulo atual: ${currentModule.title} — Aula: ${currentLesson.title}. Curso baseado na CGADB (Convenção Geral das Assembleias de Deus no Brasil).`,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Erro desconhecido" }));
        throw new Error(err.error || `Erro ${resp.status}`);
      }

      if (!resp.body) throw new Error("Sem resposta");
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) {
              assistantSoFar += c;
              setChatMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch { buf = line + "\n" + buf; break; }
        }
      }
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
        <Badge variant="secondary" className="mb-3 text-xs">Baseado na grade da CGADB / FAECAD / CPAD</Badge>
        <h1 className="font-serif text-4xl font-bold mb-2">
          Curso de <span className="text-gradient-gold">Teologia</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Formação teológica completa na perspectiva pentecostal das Assembleias de Deus, com suporte de IA para tirar dúvidas.
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <div className="h-2 w-48 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-gradient-gold transition-all" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-sm text-muted-foreground font-medium">{completedLessons.length}/{totalLessons} aulas • {progress}%</span>
        </div>
      </motion.div>

      <Tabs defaultValue="course" className="max-w-6xl mx-auto">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
          <TabsTrigger value="course" className="gap-2"><GraduationCap className="h-4 w-4" /> Aulas</TabsTrigger>
          <TabsTrigger value="chat" className="gap-2"><MessageCircle className="h-4 w-4" /> Tirar Dúvidas</TabsTrigger>
        </TabsList>

        <TabsContent value="course">
          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            <Card className="border-border/50 h-fit lg:sticky lg:top-20">
              <CardContent className="p-3">
                <ScrollArea className="max-h-[70vh]">
                  {modules.map((mod, mi) => {
                    const modCompleted = mod.lessons.filter((l) => completedLessons.includes(l.id)).length;
                    return (
                      <div key={mod.id}>
                        <button
                          onClick={() => setExpandedModule(expandedModule === mi ? null : mi)}
                          className={cn(
                            "w-full flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-semibold transition-colors text-left gap-1",
                            activeModule === mi ? "bg-accent text-accent-foreground" : "hover:bg-muted text-foreground"
                          )}
                        >
                          <span className="flex items-center gap-2 min-w-0">
                            <BookOpen className="h-4 w-4 shrink-0" />
                            <span className="truncate text-xs">{mod.id}. {mod.title}</span>
                          </span>
                          <span className="flex items-center gap-1 shrink-0">
                            <span className="text-[10px] text-muted-foreground">{modCompleted}/{mod.lessons.length}</span>
                            <ChevronDown className={cn("h-3 w-3 transition-transform", expandedModule === mi && "rotate-180")} />
                          </span>
                        </button>
                        {expandedModule === mi && (
                          <div className="ml-4 border-l border-border pl-2 mb-1">
                            {mod.lessons.map((les, li) => (
                              <button
                                key={les.id}
                                onClick={() => { setActiveModule(mi); setActiveLesson(li); }}
                                className={cn(
                                  "w-full flex items-center gap-2 rounded-md px-3 py-1.5 text-xs transition-colors text-left",
                                  activeModule === mi && activeLesson === li ? "bg-accent/60 text-accent-foreground" : "hover:bg-muted/50 text-muted-foreground"
                                )}
                              >
                                {completedLessons.includes(les.id)
                                  ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                                  : <Lock className="h-3.5 w-3.5 shrink-0 opacity-40" />}
                                <span className="truncate">{les.title}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1 flex-wrap">
                  <Badge variant="secondary" className="text-xs">Módulo {currentModule.id}</Badge>
                  <ChevronRight className="h-3 w-3" />
                  <span>{currentModule.title}</span>
                  <ChevronRight className="h-3 w-3" />
                  <span>Aula {activeLesson + 1}</span>
                </div>
                <h2 className="font-serif text-2xl font-bold mb-6">{currentLesson.title}</h2>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button
                    onClick={() => toggleComplete(currentLesson.id)}
                    variant={completedLessons.includes(currentLesson.id) ? "default" : "outline"}
                    className={cn("gap-2", completedLessons.includes(currentLesson.id) && "bg-green-600 hover:bg-green-700")}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {completedLessons.includes(currentLesson.id) ? "Concluída" : "Marcar como Concluída"}
                  </Button>

                  {activeLesson < currentModule.lessons.length - 1 && (
                    <Button variant="outline" onClick={() => setActiveLesson(activeLesson + 1)} className="gap-2">
                      Próxima Aula <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                  {activeLesson === currentModule.lessons.length - 1 && activeModule < modules.length - 1 && (
                    <Button variant="outline" onClick={() => { setActiveModule(activeModule + 1); setActiveLesson(0); setExpandedModule(activeModule + 1); }} className="gap-2">
                      Próximo Módulo <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chat">
          <Card className="border-border/50 max-w-3xl mx-auto">
            <CardContent className="p-0 flex flex-col" style={{ height: "70vh" }}>
              <div className="border-b border-border px-4 py-3 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-accent" />
                <span className="font-serif font-semibold">Assistente Teológico</span>
                <span className="text-xs text-muted-foreground ml-auto">Perspectiva pentecostal — CGADB</span>
              </div>

              <ScrollArea className="flex-1 px-4 py-4">
                {chatMessages.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm mt-16">
                    <GraduationCap className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="font-serif text-base">Faça sua pergunta teológica</p>
                    <p className="mt-1 text-xs">Ex: "O que é o batismo no Espírito Santo?" ou "Explique os dons de 1 Coríntios 12"</p>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={cn("mb-4 flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                    <div className={cn("max-w-[85%] rounded-2xl px-4 py-3 text-sm", msg.role === "user" ? "bg-accent text-accent-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm")}>
                      {msg.role === "assistant" ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : msg.content}
                    </div>
                  </div>
                ))}
                {chatLoading && chatMessages[chatMessages.length - 1]?.role !== "assistant" && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </ScrollArea>

              <div className="border-t border-border p-3 flex gap-2">
                <Textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Digite sua dúvida teológica..."
                  className="min-h-[44px] max-h-[120px] resize-none"
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); } }}
                />
                <Button onClick={sendChat} disabled={chatLoading || !chatInput.trim()} size="icon" className="shrink-0 bg-gradient-gold text-background hover:opacity-90">
                  {chatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CursoTeologia;
