import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, GraduationCap, ChevronRight, CheckCircle2, Lock, MessageCircle, Send, Loader2, ChevronDown, Play, FileText, Video, Download, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";

/* ══════════════════════════════════════════════════════════════
   GRADE CURRICULAR — Baseada na CGADB / FAECAD / CPAD
   Convenção Geral das Assembleias de Deus no Brasil
   ══════════════════════════════════════════════════════════════ */

type Material = { title: string; type: string; description: string; content: string };
type Lesson = {
  id: string;
  title: string;
  content: string;
  videoSearch: string;
  videoTitle: string;
  materials: Material[];
};

const modules: { id: number; title: string; lessons: Lesson[] }[] = [
  {
    id: 1,
    title: "Prolegômenos à Teologia Pentecostal",
    lessons: [
      {
        id: "1.1",
        title: "Introdução à Teologia Pentecostal",
        videoSearch: "teologia pentecostal introdução assembleia de Deus CGADB",
        videoTitle: "Introdução à Teologia Pentecostal",
        materials: [
          { title: "Apostila: Fundamentos da Teologia Pentecostal", type: "PDF", description: "Material base com os conceitos fundamentais da teologia pentecostal clássica.", content: "FUNDAMENTOS DA TEOLOGIA PENTECOSTAL\n\n1. DEFINIÇÃO\nA Teologia Pentecostal é o ramo da teologia cristã que enfatiza a experiência pessoal com o Espírito Santo, os dons espirituais e a atualidade dos sinais e maravilhas.\n\n2. CARACTERÍSTICAS DISTINTIVAS\n- Experiência do Espírito como central\n- Batismo no Espírito Santo subsequente à conversão\n- Evidência inicial de falar em outras línguas (Atos 2:4)\n- Atualidade de todos os dons espirituais\n- Cura divina\n- Segunda vinda iminente de Cristo\n\n3. BASE BÍBLICA\n- Joel 2:28-29\n- Atos 1:8\n- Atos 2:4\n- 1 Coríntios 12:4-11\n\n4. A CGADB\nFundada em 1930, a Convenção Geral das Assembleias de Deus no Brasil é a maior denominação evangélica do Brasil." },
          { title: "Credo das Assembleias de Deus (CGADB)", type: "DOC", description: "Documento oficial com as doutrinas fundamentais da denominação.", content: "CREDO DAS ASSEMBLEIAS DE DEUS\n\n1. Cremos em um só Deus, eternamente existente em três pessoas: Pai, Filho e Espírito Santo (Dt 6:4; Mt 28:19).\n\n2. Cremos na inspiração verbal e plenária da Bíblia Sagrada, única regra infalível de fé e prática (2 Tm 3:16).\n\n3. Cremos na divindade, nascimento virginal, vida sem pecado, morte vicária, ressurreição corporal, ascensão e segunda vinda de Jesus Cristo (Jo 1:1; Mt 1:23).\n\n4. Cremos na pecaminosidade do homem que o destituiu da glória de Deus e na necessidade de arrependimento e fé em Cristo (Rm 3:23).\n\n5. Cremos na salvação pela graça mediante a fé em Jesus Cristo (Ef 2:8-9).\n\n6. Cremos no batismo no Espírito Santo, com evidência inicial de falar em outras línguas (At 2:4).\n\n7. Cremos na segunda vinda pré-milenial de Cristo: arrebatamento da Igreja e reinado milenar.\n\n8. Cremos no juízo final: vida eterna para os salvos e perdição eterna para os ímpios." },
          { title: "O que é Pentecostalismo? — Artigo CPAD", type: "Artigo", description: "Artigo sobre as raízes e características do movimento pentecostal.", content: "O QUE É PENTECOSTALISMO?\n\nO Pentecostalismo é um movimento cristão que surgiu no início do século XX, enfatizando a experiência pessoal com o Espírito Santo e a atualidade dos dons espirituais descritos no Novo Testamento.\n\nORIGENS\nO movimento teve início em 1901 com Charles Parham em Topeka, Kansas, e ganhou força mundial com o avivamento da Rua Azusa em Los Angeles (1906-1909), liderado por William J. Seymour.\n\nCARACTERÍSTICAS\n- Ênfase na experiência com o Espírito Santo\n- Batismo no Espírito Santo com evidência de línguas\n- Cura divina e milagres\n- Evangelismo fervoroso\n- Adoração expressiva\n\nNO BRASIL\nChegou em 1911 com os missionários suecos Daniel Berg e Gunnar Vingren, que fundaram as Assembleias de Deus em Belém do Pará." },
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
        videoSearch: "declaração de fé assembleias de Deus CGADB doutrinas",
        videoTitle: "Declaração de Fé das Assembleias de Deus",
        materials: [
          { title: "Declaração de Fé da CGADB — Texto Completo", type: "PDF", description: "Documento oficial com todos os artigos de fé da CGADB.", content: "DECLARAÇÃO DE FÉ DA CGADB\n\nARTIGO 1 — DAS ESCRITURAS SAGRADAS\nA Bíblia é a Palavra de Deus, inspirada verbalmente, infalível e inerrante — a regra suprema de fé e prática (2 Tm 3:16; 2 Pe 1:21).\n\nARTIGO 2 — DE DEUS\nCremos em um só Deus, eternamente existente em três pessoas: Pai, Filho e Espírito Santo (Dt 6:4; Mt 28:19; 2 Co 13:13).\n\nARTIGO 3 — DO SENHOR JESUS CRISTO\nSua divindade, nascimento virginal, vida sem pecado, morte vicária, ressurreição corporal, ascensão ao céu e segunda vinda pessoal (Jo 1:1,14; Mt 1:23; Hb 4:15).\n\nARTIGO 4 — DA QUEDA DO HOMEM\nO homem foi criado bom, mas pela transgressão voluntária caiu em pecado (Gn 3; Rm 3:23; Rm 5:12).\n\nARTIGO 5 — DA SALVAÇÃO\nPela graça, mediante a fé no sacrifício de Cristo (Ef 2:8-9; Rm 10:9-10).\n\nARTIGO 6 — DO BATISMO NO ESPÍRITO SANTO\nExperiência subsequente à salvação, com evidência inicial de falar em línguas (At 2:4; At 10:46; At 19:6).\n\nARTIGO 7 — DA IGREJA\nO Corpo de Cristo, habitação de Deus pelo Espírito (1 Co 12:27; Ef 2:22).\n\nARTIGO 8 — DA SEGUNDA VINDA\nArrebatamento pré-tribulacional da Igreja e volta gloriosa para reinar (1 Ts 4:16-17; Ap 19:11-16)." },
          { title: "Estudo Comparativo: Credos Cristãos Históricos", type: "Artigo", description: "Comparação entre o credo assembleiano e os credos apostólico, niceno e atanasiano.", content: "ESTUDO COMPARATIVO: CREDOS CRISTÃOS HISTÓRICOS\n\n1. CREDO APOSTÓLICO (séc. II)\nResumo das crenças fundamentais: Deus Pai criador, Jesus Cristo Filho, Espírito Santo, Igreja, ressurreição, vida eterna.\n\n2. CREDO NICENO (325 d.C.)\nReafirma a divindade de Cristo contra o arianismo: 'Deus de Deus, Luz de Luz, Deus verdadeiro de Deus verdadeiro'.\n\n3. CREDO ATANASIANO (séc. V)\nElabora a doutrina da Trindade com mais detalhes.\n\n4. CREDO DAS ASSEMBLEIAS DE DEUS\nIncorpora os elementos dos credos históricos e acrescenta:\n- Batismo no Espírito Santo com evidência de línguas\n- Atualidade dos dons espirituais\n- Arrebatamento pré-tribulacional\n- Cura divina\n\nSEMELHANÇAS: Todos afirmam a Trindade, divindade de Cristo, salvação pela graça.\nDIFERENÇAS: O credo assembleiano é o único que afirma explicitamente o batismo no Espírito Santo e os dons." },
        ],
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
        videoSearch: "como estudar teologia metodologia estudo bíblico pentecostal",
        videoTitle: "Como Estudar Teologia — Metodologia",
        materials: [
          { title: "Guia de Estudo: Ferramentas de Pesquisa Bíblica", type: "PDF", description: "Manual prático com métodos e ferramentas para o estudo teológico.", content: "GUIA DE FERRAMENTAS DE PESQUISA BÍBLICA\n\n1. CONCORDÂNCIA BÍBLICA\nFerramenta que lista todas as ocorrências de uma palavra na Bíblia. Essencial para estudos temáticos.\n\n2. DICIONÁRIO BÍBLICO\nDefine termos, nomes, lugares e conceitos bíblicos. Recomendados: Dicionário Vine, CPAD.\n\n3. COMENTÁRIOS BÍBLICOS\nExplicações verso a verso. Recomendados: Comentário Bíblico Beacon, Matthew Henry.\n\n4. ATLAS BÍBLICO\nMapas e geografia dos tempos bíblicos.\n\n5. BÍBLIAS DE ESTUDO\nBíblia de Estudo Pentecostal, Bíblia de Aplicação Pessoal.\n\n6. MÉTODOS DE ESTUDO\n- Estudo por livro\n- Estudo por tema\n- Estudo por personagem\n- Estudo devocional\n- Estudo por palavra-chave\n\n7. DICAS PRÁTICAS\n- Ore antes de estudar\n- Leia o contexto completo\n- Compare diferentes traduções\n- Anote suas descobertas\n- Aplique o que aprendeu" },
          { title: "Bibliografia Recomendada — Teologia Pentecostal", type: "Lista", description: "Lista de livros essenciais da CPAD e outros autores pentecostais.", content: "BIBLIOGRAFIA RECOMENDADA\n\nTEOLOGIA SISTEMÁTICA\n- Teologia Sistemática Pentecostal (Stanley Horton) — CPAD\n- Conhecendo as Doutrinas da Bíblia (Myer Pearlman) — CPAD\n- Doutrinas Bíblicas (P.C. Nelson) — CPAD\n\nBIBLIOLOGIA\n- Manual de Hermenêutica (E. Lund & P.C. Nelson)\n- Entendes o que Lês? (Gordon Fee & Douglas Stuart)\n\nPNEUMATOLOGIA\n- O Espírito Santo na Bíblia (Stanley Horton)\n- Batismo no Espírito Santo (Severino Pedro da Silva)\n\nESCATOLOGIA\n- Daniel e Apocalipse (Severino Pedro da Silva)\n- Escatologia: Doutrina das Últimas Coisas (Claudionor de Andrade)\n\nHISTÓRIA\n- História das Assembleias de Deus no Brasil (Emílio Conde)\n- O Diário do Pioneiro (Gunnar Vingren)\n\nHOMILÉTICA\n- Homilética: Da Pesquisa ao Púlpito (Claudionor de Andrade)\n- Manual do Pregador Eficaz (CPAD)" },
        ],
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
        videoSearch: "bibliologia doutrina das escrituras inspiração bíblia aula teologia",
        videoTitle: "Bibliologia — A Doutrina das Escrituras",
        materials: [
          { title: "Apostila: Bibliologia Completa", type: "PDF", description: "Estudo aprofundado sobre inspiração, inerrância e cânon bíblico.", content: "APOSTILA DE BIBLIOLOGIA\n\n1. INSPIRAÇÃO DAS ESCRITURAS\nDefinição: Deus dirigiu os autores humanos de modo que, usando suas próprias personalidades e estilos, registraram Sua mensagem sem erro.\n- Inspiração Verbal: Cada palavra foi inspirada\n- Inspiração Plenária: Toda a Escritura foi inspirada\n- 2 Timóteo 3:16; 2 Pedro 1:21\n\n2. INERRÂNCIA\nOs manuscritos originais são isentos de erro em tudo o que afirmam.\n\n3. SUFICIÊNCIA\nA Bíblia contém tudo que é necessário para a fé e prática cristã.\n\n4. CÂNON BÍBLICO\n- Antigo Testamento: 39 livros\n  - Pentateuco (5): Gênesis a Deuteronômio\n  - Históricos (12): Josué a Ester\n  - Poéticos (5): Jó a Cantares\n  - Profetas Maiores (5): Isaías a Daniel\n  - Profetas Menores (12): Oséias a Malaquias\n- Novo Testamento: 27 livros\n  - Evangelhos (4), Atos (1), Epístolas (21), Apocalipse (1)\n\n5. POSIÇÃO DAS ASSEMBLEIAS DE DEUS\nAs AD não aceitam os livros apócrifos/deuterocanônicos como Escritura inspirada." },
          { title: "Tabela do Cânon Bíblico", type: "Infográfico", description: "Quadro comparativo dos 66 livros com autoria e data.", content: "TABELA DO CÂNON BÍBLICO — 66 LIVROS\n\nANTIGO TESTAMENTO (39 livros)\n\nPENTATEUCO:\nGênesis — Moisés — c. 1450 a.C.\nÊxodo — Moisés — c. 1450 a.C.\nLevítico — Moisés — c. 1450 a.C.\nNúmeros — Moisés — c. 1450 a.C.\nDeuteronômio — Moisés — c. 1410 a.C.\n\nHISTÓRICOS:\nJosué — Josué — c. 1400 a.C.\nJuízes — Samuel — c. 1050 a.C.\nRute — Samuel — c. 1050 a.C.\n1-2 Samuel — Samuel/Natã/Gade — c. 1000 a.C.\n1-2 Reis — Jeremias — c. 560 a.C.\n1-2 Crônicas — Esdras — c. 450 a.C.\nEsdras — Esdras — c. 450 a.C.\nNeemias — Neemias — c. 430 a.C.\nEster — Desconhecido — c. 470 a.C.\n\nNOVO TESTAMENTO (27 livros)\nMateus — Mateus — c. 60 d.C.\nMarcos — Marcos — c. 55 d.C.\nLucas — Lucas — c. 60 d.C.\nJoão — João — c. 90 d.C.\nAtos — Lucas — c. 62 d.C.\nRomanos a Filemom — Paulo\nHebreus — Desconhecido\nTiago — Tiago — c. 49 d.C.\n1-2 Pedro — Pedro\n1-3 João — João\nJudas — Judas\nApocalipse — João — c. 95 d.C." },
        ],
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
        videoSearch: "hermenêutica bíblica interpretação pentecostal como interpretar a bíblia",
        videoTitle: "Hermenêutica — Interpretação Bíblica",
        materials: [
          { title: "Manual de Hermenêutica Pentecostal", type: "PDF", description: "Guia prático de interpretação bíblica na perspectiva assembleiana.", content: "MANUAL DE HERMENÊUTICA PENTECOSTAL\n\n1. PRINCÍPIOS FUNDAMENTAIS\n- Interpretação Literal: Quando o sentido literal faz sentido, não busque outro sentido\n- Contexto: Toda passagem deve ser lida em seu contexto\n- Analogia da Fé: A Escritura interpreta a Escritura\n- Propósito do Autor: Buscar a intenção original\n- Gênero Literário: Reconhecer poesia, narrativa, profecia, epístola, apocalíptica\n\n2. HERMENÊUTICA PENTECOSTAL DISTINTIVA\nOs pentecostais reconhecem que os textos narrativos de Atos têm valor normativo:\n- Os relatos do batismo no Espírito são padrão para hoje\n- A experiência de línguas é normativa\n- Os sinais e prodígios fazem parte da vida normal da Igreja\n\n3. CUIDADOS\n- Não isolar versículos do contexto\n- Não criar doutrina a partir de um único texto\n- Distinguir princípios permanentes de práticas culturais\n\n4. EXERCÍCIO PRÁTICO\nAnalise Atos 2:1-4 seguindo os princípios acima." },
          { title: "Exercícios de Exegese Bíblica", type: "Atividade", description: "Exercícios práticos para aplicar os princípios hermenêuticos estudados.", content: "EXERCÍCIOS DE EXEGESE BÍBLICA\n\nEXERCÍCIO 1 — ANÁLISE CONTEXTUAL\nTexto: Atos 2:1-4\na) Qual é o contexto histórico?\nb) Quem são os personagens?\nc) Qual é o evento central?\nd) Como isso se conecta com Atos 1:8?\n\nEXERCÍCIO 2 — ESTUDO DE PALAVRAS\nEstude a palavra 'batismo' (baptizo) no NT:\na) Quantas vezes aparece?\nb) Em quantos contextos diferentes?\nc) O que significa no grego original?\n\nEXERCÍCIO 3 — ANALOGIA DA FÉ\nCompare os cinco relatos de batismo no Espírito em Atos:\n- Atos 2:4\n- Atos 8:14-17\n- Atos 9:17\n- Atos 10:44-46\n- Atos 19:6\nPergunta: Qual é o elemento comum?\n\nEXERCÍCIO 4 — APLICAÇÃO\nTexto: 1 Coríntios 14:1-5\na) O que Paulo ensina sobre profecia e línguas?\nb) Como aplicar isso ao culto hoje?" },
        ],
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
        videoSearch: "atributos de Deus teologia própria trindade aula teologia",
        videoTitle: "Teologia Própria — Os Atributos de Deus",
        materials: [
          { title: "Apostila: Atributos de Deus", type: "PDF", description: "Estudo sistemático dos atributos comunicáveis e incomunicáveis de Deus.", content: "APOSTILA: OS ATRIBUTOS DE DEUS\n\nATRIBUTOS INCOMUNICÁVEIS (exclusivos de Deus)\n- Aseidade: Deus existe por Si mesmo (Êx 3:14)\n- Imutabilidade: Deus não muda (Ml 3:6)\n- Eternidade: Sem início e sem fim (Sl 90:2)\n- Onipresença: Presente em toda parte (Sl 139:7-10)\n- Onisciência: Conhece todas as coisas (1 Jo 3:20)\n- Onipotência: Todo-poderoso (Ap 19:6)\n\nATRIBUTOS COMUNICÁVEIS (refletidos em nós)\n- Amor (1 Jo 4:8)\n- Santidade (Is 6:3)\n- Justiça (Sl 89:14)\n- Bondade (Sl 34:8)\n- Misericórdia (Lm 3:22-23)\n- Graça (Ef 2:8)\n\nA SANTÍSSIMA TRINDADE\nUm só Deus em três Pessoas co-eternas e co-iguais:\n- Pai, Filho e Espírito Santo\n- Mt 28:19; 2 Co 13:13\n- Cada Pessoa é plenamente Deus\n- Há um só Deus (Dt 6:4)" },
          { title: "Quadro Sinótico: A Trindade nas Escrituras", type: "Infográfico", description: "Referências bíblicas organizadas sobre a doutrina da Trindade.", content: "A TRINDADE NAS ESCRITURAS\n\nO PAI É DEUS:\n- 1 Pedro 1:2\n- João 6:27\n- 1 Coríntios 8:6\n\nO FILHO É DEUS:\n- João 1:1 — 'O Verbo era Deus'\n- Colossenses 2:9 — 'Nele habita toda a plenitude da Divindade'\n- Hebreus 1:8 — 'O teu trono, ó Deus, é para todo o sempre'\n- Tito 2:13 — 'Nosso grande Deus e Salvador Jesus Cristo'\n\nO ESPÍRITO SANTO É DEUS:\n- Atos 5:3-4 — Mentir ao Espírito = mentir a Deus\n- 1 Coríntios 3:16 — Templo de Deus = Templo do Espírito\n- Hebreus 9:14 — Espírito eterno\n\nAS TRÊS PESSOAS JUNTAS:\n- Batismo de Jesus (Mt 3:16-17)\n- Grande Comissão (Mt 28:19)\n- Bênção Apostólica (2 Co 13:13)\n- Efésios 4:4-6\n\nNÃO É: Triteísmo (três deuses), Modalismo (um Deus em três modos)" },
        ],
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
        videoSearch: "cristologia pessoa de Cristo divindade humanidade aula teologia",
        videoTitle: "Cristologia — Quem é Jesus Cristo?",
        materials: [
          { title: "Apostila: Cristologia Completa", type: "PDF", description: "Estudo sobre a pessoa e obra de Cristo na perspectiva pentecostal.", content: "APOSTILA DE CRISTOLOGIA\n\n1. DIVINDADE DE CRISTO\n- João 1:1 — O Verbo era Deus\n- Colossenses 2:9 — Toda a plenitude da Divindade\n- Hebreus 1:3 — A expressa imagem de Deus\n\n2. HUMANIDADE DE CRISTO\n- Nascimento virginal (Mt 1:18-23)\n- Vida sem pecado (Hb 4:15)\n- Crescimento real (Lc 2:52)\n\n3. UNIÃO HIPOSTÁTICA\nDuas naturezas (divina e humana) em uma só Pessoa.\n\n4. OBRA REDENTORA — Tríplice Ofício\n- Profeta: Revelou a vontade de Deus\n- Sacerdote: Ofereceu-Se como sacrifício\n- Rei: Reina sobre Seu povo\n\n5. EXPIAÇÃO SUBSTITUTIVA\nCristo morreu em nosso lugar (Is 53:5; Rm 5:8; 1 Pe 2:24).\n\n6. RESSURREIÇÃO CORPORAL\n- Túmulo vazio\n- Aparições pós-ressurreição\n- Prova da divindade (Rm 1:4)\n\n7. ASCENSÃO E INTERCESSÃO\n- Assentado à destra de Deus (Hb 1:3)\n- Intercede por nós (Hb 7:25)" },
          { title: "Profecias Messiânicas Cumpridas", type: "Tabela", description: "Lista de profecias do AT cumpridas em Jesus Cristo.", content: "PROFECIAS MESSIÂNICAS CUMPRIDAS EM JESUS CRISTO\n\nPROFECIA → CUMPRIMENTO\n\n1. Nascido de uma virgem\nIs 7:14 → Mt 1:18-23\n\n2. Nascido em Belém\nMq 5:2 → Mt 2:1\n\n3. Da tribo de Judá\nGn 49:10 → Mt 1:2-3\n\n4. Da linhagem de Davi\n2 Sm 7:12-13 → Mt 1:1\n\n5. Entrada triunfal em Jerusalém\nZc 9:9 → Mt 21:1-11\n\n6. Traído por 30 moedas\nZc 11:12-13 → Mt 26:14-16\n\n7. Crucificado\nSl 22:16 → Jo 19:18\n\n8. Mãos e pés traspassados\nSl 22:16 → Jo 20:25\n\n9. Lançaram sortes sobre suas vestes\nSl 22:18 → Jo 19:23-24\n\n10. Nenhum osso quebrado\nSl 34:20 → Jo 19:33-36\n\n11. Sepultado com o rico\nIs 53:9 → Mt 27:57-60\n\n12. Ressurreição\nSl 16:10 → At 2:31-32\n\nTotal: mais de 300 profecias cumpridas!" },
        ],
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
        videoSearch: "ressurreição de Cristo evidências históricas ascensão teologia",
        videoTitle: "A Ressurreição de Cristo — Evidências",
        materials: [
          { title: "Estudo: Evidências Históricas da Ressurreição", type: "PDF", description: "Análise das evidências históricas e bíblicas da ressurreição corporal de Cristo.", content: "EVIDÊNCIAS HISTÓRICAS DA RESSURREIÇÃO\n\n1. O TÚMULO VAZIO\n- Os guardas romanos confirmaram\n- Os líderes judeus não negaram o túmulo vazio\n- Explicações alternativas falham\n\n2. APARIÇÕES PÓS-RESSURREIÇÃO\n- Maria Madalena (Jo 20:14-18)\n- Discípulos no cenáculo (Jo 20:19-23)\n- Tomé (Jo 20:26-29)\n- Mais de 500 irmãos (1 Co 15:6)\n- Tiago (1 Co 15:7)\n- Paulo (1 Co 15:8)\n\n3. TRANSFORMAÇÃO DOS DISCÍPULOS\n- De medrosos a corajosos\n- Dispostos a morrer pelo testemunho\n- Impossível explicar sem a ressurreição real\n\n4. SURGIMENTO DA IGREJA\n- Nasceu do testemunho da ressurreição\n- Cresceu apesar da perseguição\n\n5. IMPORTÂNCIA TEOLÓGICA\n- Prova da divindade de Cristo (Rm 1:4)\n- Garantia da justificação (Rm 4:25)\n- Promessa da nossa ressurreição (1 Co 15:20-23)\n- Vitória sobre Satanás, pecado e morte (Cl 2:15)" },
        ],
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
        videoSearch: "pessoa do Espírito Santo pneumatologia pentecostal aula",
        videoTitle: "Pneumatologia — A Pessoa do Espírito Santo",
        materials: [
          { title: "Apostila: Pneumatologia Pentecostal", type: "PDF", description: "Estudo completo sobre a pessoa e obra do Espírito Santo.", content: "APOSTILA DE PNEUMATOLOGIA PENTECOSTAL\n\n1. PERSONALIDADE DO ESPÍRITO SANTO\nO Espírito Santo não é uma força impessoal, mas uma Pessoa divina:\n- Ele ensina (Jo 14:26)\n- Ele testifica (Jo 15:26)\n- Ele convence (Jo 16:8)\n- Ele guia (Rm 8:14)\n- Ele intercede (Rm 8:26)\n- Pode ser entristecido (Ef 4:30)\n- Pode ser resistido (At 7:51)\n\n2. DIVINDADE DO ESPÍRITO SANTO\n- Chamado de Deus (At 5:3-4)\n- Atributos divinos: onipresença, onisciência, eternidade\n- Participou da criação (Gn 1:2)\n- Participou da ressurreição (Rm 8:11)\n\n3. OBRA NO ANTIGO TESTAMENTO\n- Criação (Gn 1:2)\n- Capacitação de líderes\n- Inspiração dos profetas\n- Diferença: no AT vinha SOBRE; no NT habita EM todos os crentes\n\n4. OBRA NO NOVO TESTAMENTO\n- Regeneração\n- Habitação no crente\n- Batismo no Espírito Santo\n- Dons espirituais\n- Fruto do Espírito" },
          { title: "O Espírito Santo no AT e NT — Quadro Comparativo", type: "Infográfico", description: "Comparação da atuação do Espírito nos dois testamentos.", content: "O ESPÍRITO SANTO: AT vs NT\n\nANTIGO TESTAMENTO:\n- Atuação SELETIVA (sobre pessoas específicas)\n- Capacitação TEMPORÁRIA (vinha e ia)\n- Exemplos: Sansão, Davi, profetas\n- Gn 1:2 — Criação\n- Jz 6:34 — Gideão revestido\n- 1 Sm 16:13 — Davi ungido\n- Is 61:1 — Unção profética\n\nNOVO TESTAMENTO:\n- Atuação UNIVERSAL (sobre toda carne — Jl 2:28)\n- Habitação PERMANENTE (Jo 14:16-17)\n- Disponível para TODOS os crentes\n- At 2:4 — Pentecostes\n- Rm 8:9 — Habita em todo crente\n- 1 Co 12:7 — Dons a cada um\n- Gl 5:22-23 — Fruto do Espírito\n\nMUDANÇA FUNDAMENTAL:\n'Ele habita CONVOSCO e estará EM vós' (Jo 14:17)\n\nO derramamento do Espírito no Pentecostes inaugurou uma nova era na relação entre Deus e Seu povo." },
        ],
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
        videoSearch: "batismo no Espírito Santo assembleia de Deus evidência línguas CGADB",
        videoTitle: "Batismo no Espírito Santo — Doutrina CGADB",
        materials: [
          { title: "Estudo: Os 5 Relatos do Batismo em Atos", type: "PDF", description: "Análise exegética detalhada dos cinco relatos de batismo no Espírito em Atos.", content: "OS 5 RELATOS DO BATISMO NO ESPÍRITO SANTO EM ATOS\n\n1. PENTECOSTES — ATOS 2:1-4\nLocal: Jerusalém\nRecipientes: Os 120 discípulos\nEvidência: 'Começaram a falar em outras línguas' (v.4)\nResultado: 3.000 conversões\n\n2. SAMARIA — ATOS 8:14-17\nLocal: Samaria\nRecipientes: Samaritanos convertidos\nEvidência: Implícita (Simão 'viu' algo extraordinário — v.18)\nContexto: Pedro e João impõem as mãos\n\n3. SAULO DE TARSO — ATOS 9:17\nLocal: Damasco\nRecipiente: Saulo (Paulo)\nEvidência: 'Para que sejas cheio do Espírito Santo'\nNota: Paulo afirma falar em línguas (1 Co 14:18)\n\n4. CASA DE CORNÉLIO — ATOS 10:44-46\nLocal: Cesareia\nRecipientes: Gentios (casa de Cornélio)\nEvidência: 'Falavam em línguas e magnificavam a Deus' (v.46)\nSignificado: O Espírito também é para os gentios\n\n5. ÉFESO — ATOS 19:1-6\nLocal: Éfeso\nRecipientes: 12 discípulos de João Batista\nEvidência: 'Falavam em línguas e profetizavam' (v.6)\nContexto: Paulo impõe as mãos\n\nCONCLUSÃO: O padrão bíblico confirma as línguas como evidência do batismo no Espírito Santo." },
          { title: "Testemunhos de Batismo no Espírito Santo", type: "Artigo", description: "Coletânea de testemunhos históricos e contemporâneos.", content: "TESTEMUNHOS HISTÓRICOS DO BATISMO NO ESPÍRITO SANTO\n\n1. GUNNAR VINGREN (1879-1933)\nFundador das AD no Brasil: 'Senti o poder de Deus me envolver completamente e comecei a falar em outras línguas pelo Espírito Santo. Foi a experiência mais gloriosa da minha vida.'\n\n2. DANIEL BERG (1884-1963)\nCo-fundador das AD: Recebeu o batismo no Espírito em uma conferência em Chicago, 1909, falando em línguas desconhecidas.\n\n3. WILLIAM J. SEYMOUR (1870-1922)\nLíder do Avivamento da Rua Azusa: 'O Espírito Santo caiu sobre nós e começamos a falar em línguas como no dia de Pentecostes.'\n\n4. AGNES OZMAN (1870-1937)\nPrimeira pessoa do movimento pentecostal moderno a falar em línguas (1º de janeiro de 1901, Topeka, Kansas).\n\nORIENTAÇÕES PARA BUSCAR O BATISMO:\n- Ore com fé (Lc 11:13)\n- Tenha desejo sincero (Jo 7:37-39)\n- Creia na promessa (Gl 3:14)\n- Busque em comunidade (At 2:1)" },
        ],
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
        videoSearch: "9 dons do Espírito Santo 1 Coríntios 12 pentecostal aula",
        videoTitle: "Os 9 Dons do Espírito Santo",
        materials: [
          { title: "Apostila: Os Dons Espirituais — 1 Coríntios 12", type: "PDF", description: "Estudo detalhado de cada um dos nove dons espirituais.", content: "OS 9 DONS DO ESPÍRITO SANTO (1 Co 12:4-11)\n\nDONS DE REVELAÇÃO (saber):\n1. PALAVRA DE SABEDORIA (logos sophias)\nRevelação sobrenatural de propósito e plano divino para situações específicas.\n\n2. PALAVRA DE CONHECIMENTO (logos gnoseos)\nRevelação sobrenatural de fatos desconhecidos pelo ser humano.\n\n3. DISCERNIMENTO DE ESPÍRITOS (diakriseis pneumaton)\nCapacidade sobrenatural de distinguir a fonte espiritual de uma manifestação.\n\nDONS DE PODER (agir):\n4. FÉ (pistis)\nFé sobrenatural para crer no impossível em situações específicas.\n\n5. DONS DE CURA (charismata iamaton)\nCura sobrenatural de enfermidades sem meios naturais.\n\n6. OPERAÇÃO DE MILAGRES (energemata dynameon)\nAtos sobrenaturais de poder que alteram a ordem natural.\n\nDONS DE COMUNICAÇÃO (falar):\n7. PROFECIA (propheteia)\nMensagem de Deus para edificação, exortação e consolação (1 Co 14:3).\n\n8. VARIEDADE DE LÍNGUAS (gene glosson)\nFalar em idiomas não aprendidos pelo Espírito Santo.\n\n9. INTERPRETAÇÃO DE LÍNGUAS (hermeneia glosson)\nInterpretação sobrenatural das línguas faladas no culto." },
          { title: "Dons vs. Fruto do Espírito — Comparativo", type: "Infográfico", description: "Diferença entre dons espirituais e o fruto do Espírito.", content: "DONS vs FRUTO DO ESPÍRITO\n\nDONS DO ESPÍRITO (1 Co 12):\n- São CAPACIDADES sobrenaturais\n- Distribuídos INDIVIDUALMENTE conforme o Espírito quer\n- Para SERVIÇO e edificação da Igreja\n- Podem ser exercidos por crentes imaturos (Corinto)\n- Não indicam maturidade espiritual\n- São 9 dons listados em 1 Coríntios 12\n\nFRUTO DO ESPÍRITO (Gl 5:22-23):\n- É CARÁTER cristão\n- Esperado de TODOS os crentes\n- Para VIDA PESSOAL e testemunho\n- Indica maturidade espiritual\n- Cresce progressivamente\n- É UM fruto com 9 aspectos:\n  1. Amor\n  2. Gozo (alegria)\n  3. Paz\n  4. Longanimidade (paciência)\n  5. Benignidade\n  6. Bondade\n  7. Fé (fidelidade)\n  8. Mansidão\n  9. Temperança (domínio próprio)\n\nO CAMINHO MAIS EXCELENTE:\n1 Coríntios 13 — O amor é superior aos dons.\nDons SEM fruto = 'metal que soa ou sino que retine' (1 Co 13:1)" },
        ],
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
        videoSearch: "hamartiologia doutrina do pecado queda Adão salvação teologia",
        videoTitle: "Hamartiologia — A Doutrina do Pecado",
        materials: [
          { title: "Apostila: Soteriologia Arminiana", type: "PDF", description: "Estudo da doutrina da salvação na perspectiva arminiana das Assembleias de Deus.", content: "SOTERIOLOGIA ARMINIANA\n\nPOSIÇÃO DAS ASSEMBLEIAS DE DEUS\nAs AD seguem a soteriologia arminiana, que afirma:\n\n1. GRAÇA PREVENIENTE\nDeus age antes da resposta humana, capacitando o pecador a responder ao Evangelho (Jo 6:44; Rm 2:4).\n\n2. LIVRE-ARBÍTRIO\nO homem pode aceitar ou rejeitar a salvação. A graça é resistível.\n\n3. EXPIAÇÃO UNIVERSAL\nCristo morreu por TODOS os homens, não apenas pelos eleitos (Jo 3:16; 1 Jo 2:2; 2 Pe 3:9).\n\n4. POSSIBILIDADE DE APOSTASIA\nO crente pode, por escolha voluntária e persistência no pecado, perder a salvação (Hb 6:4-6; 2 Pe 2:20-21).\n\nCOMPARAÇÃO COM O CALVINISMO:\n- Calvinismo: Eleição incondicional | Arminianismo: Eleição condicional (baseada na presciência)\n- Calvinismo: Expiação limitada | Arminianismo: Expiação universal\n- Calvinismo: Graça irresistível | Arminianismo: Graça resistível\n- Calvinismo: Perseverança dos santos | Arminianismo: Possibilidade de apostasia" },
          { title: "Calvinismo vs Arminianismo — Comparativo", type: "Tabela", description: "Comparação didática entre as duas posições teológicas.", content: "CALVINISMO vs ARMINIANISMO\n\n1. DEPRAVAÇÃO TOTAL\nCalvinismo: O homem é totalmente incapaz de buscar Deus\nArminianismo: O homem é depravado, mas a graça preveniente capacita a responder\n\n2. ELEIÇÃO\nCalvinismo: INCONDICIONAL — Deus escolhe sem considerar a fé prevista\nArminianismo: CONDICIONAL — Deus elege com base na presciência da fé (Rm 8:29)\n\n3. EXPIAÇÃO\nCalvinismo: LIMITADA — Cristo morreu apenas pelos eleitos\nArminianismo: UNIVERSAL — Cristo morreu por todos (Jo 3:16; 1 Jo 2:2)\n\n4. GRAÇA\nCalvinismo: IRRESISTÍVEL — O eleito não pode resistir\nArminianismo: RESISTÍVEL — O homem pode rejeitar (At 7:51)\n\n5. PERSEVERANÇA\nCalvinismo: PERSEVERANÇA DOS SANTOS — Impossível perder a salvação\nArminianismo: POSSIBILIDADE DE APOSTASIA — O crente pode cair (Hb 6:4-6)\n\nPOSIÇÃO DA CGADB:\nSegue o Arminianismo, enfatizando o livre-arbítrio e a responsabilidade humana na salvação." },
        ],
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
        videoSearch: "justificação santificação regeneração processo salvação teologia",
        videoTitle: "Justificação e Santificação — Estudo Completo",
        materials: [
          { title: "Mapa Conceitual: O Processo da Salvação", type: "Infográfico", description: "Diagrama visual do caminho da salvação: convicção → arrependimento → fé → justificação → santificação → glorificação.", content: "O PROCESSO DA SALVAÇÃO\n\n1. CONVICÇÃO DO PECADO\nO Espírito Santo convence o pecador (Jo 16:8)\n↓\n2. ARREPENDIMENTO (metanoia)\nMudança de mente e direção (At 3:19; Lc 13:3)\n↓\n3. FÉ SALVADORA\nConfiança pessoal em Cristo (Ef 2:8-9; Rm 10:9-10)\n↓\n4. JUSTIFICAÇÃO\nAto judicial de Deus que declara justo o pecador (Rm 5:1; Rm 3:24)\n↓\n5. REGENERAÇÃO (Novo Nascimento)\nNova vida pelo Espírito (Jo 3:3,5; Tt 3:5; 2 Co 5:17)\n↓\n6. SANTIFICAÇÃO\nProcesso contínuo de separação do pecado (1 Ts 4:3; Hb 12:14)\nInclui: Batismo no Espírito Santo como revestimento de poder\n↓\n7. GLORIFICAÇÃO\nEstado final na eternidade com Cristo (Rm 8:30; Fp 3:21)\n\nNOTA: As AD enfatizam que a santificação é PROGRESSIVA e que o crente deve perseverar até o fim." },
        ],
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
        videoSearch: "Atos dos Apóstolos livro visão panorâmica igreja primitiva pentecostal",
        videoTitle: "Atos dos Apóstolos — Visão Panorâmica",
        materials: [
          { title: "Apostila: Atos dos Apóstolos — Leitura Pentecostal", type: "PDF", description: "Estudo do livro de Atos com ênfase na perspectiva pentecostal.", content: "ATOS DOS APÓSTOLOS — LEITURA PENTECOSTAL\n\n1. AUTORIA E PROPÓSITO\nAutor: Lucas, médico e companheiro de Paulo\nPropósito: Narrar a expansão da Igreja pelo poder do Espírito Santo\nTema central: 'Recebereis poder' (At 1:8)\n\n2. ESTRUTURA DO LIVRO\n- At 1-7: A Igreja em Jerusalém\n- At 8-12: Expansão para Judeia e Samaria\n- At 13-28: Missões aos confins da terra\n\n3. LEITURA PENTECOSTAL\nPara os pentecostais, Atos é NORMATIVO (padrão para hoje), não apenas descritivo.\n\n4. MODELO DA IGREJA PRIMITIVA (At 2:42-47)\n- Doutrina dos Apóstolos\n- Comunhão\n- Partir do Pão\n- Oração\n\n5. O DIA DE PENTECOSTES (At 2)\n- Cumprimento de Joel 2\n- Nascimento da Igreja do NT\n- 120 no cenáculo → 3.000 convertidos\n\n6. EXPANSÃO MISSIONÁRIA\nJerusalém → Judeia → Samaria → Confins da Terra (At 1:8)" },
          { title: "Mapa das Viagens Missionárias de Paulo", type: "Mapa", description: "Mapa ilustrado das três viagens missionárias do apóstolo Paulo.", content: "AS VIAGENS MISSIONÁRIAS DE PAULO\n\n1ª VIAGEM (At 13-14) — c. 47-48 d.C.\nAntioquia → Chipre (Salamina, Pafos) → Ásia Menor (Perge, Antioquia da Pisídia, Icônio, Listra, Derbe) → retorno a Antioquia\nCompanheiros: Barnabé e João Marcos\nDestaques: Conversão do procônsul Sérgio Paulo, apedrejamento em Listra\n\n2ª VIAGEM (At 15:36-18:22) — c. 49-52 d.C.\nAntioquia → Síria → Cilícia → Licaônia → Frígia → Galácia → Trôade → Macedônia (Filipos, Tessalônica, Bereia) → Grécia (Atenas, Corinto) → Éfeso → Cesareia → Jerusalém → Antioquia\nCompanheiros: Silas, Timóteo, Lucas\nDestaques: Visão do homem macedônio, conversão de Lídia, terremoto na prisão de Filipos\n\n3ª VIAGEM (At 18:23-21:17) — c. 53-57 d.C.\nAntioquia → Galácia → Frígia → Éfeso (3 anos) → Macedônia → Grécia → Trôade → Mileto → Cesareia → Jerusalém\nDestaques: Avivamento em Éfeso, queima de livros de magia, despedida dos presbíteros de Éfeso" },
        ],
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
        videoSearch: "avivamentos livro de Atos pentecostes Samaria Cornélio Éfeso",
        videoTitle: "Avivamentos no Livro de Atos",
        materials: [
          { title: "Cronologia dos Avivamentos em Atos", type: "Tabela", description: "Quadro cronológico dos principais avivamentos narrados em Atos.", content: "CRONOLOGIA DOS AVIVAMENTOS EM ATOS\n\nANO | LOCAL | REFERÊNCIA | MANIFESTAÇÃO | RESULTADO\n\n30 d.C. | Jerusalém | At 2:1-4 | Vento, fogo, línguas | 3.000 conversões\n30 d.C. | Jerusalém | At 4:31 | Lugar tremeu, cheios do ES | Ousadia para pregar\n35 d.C. | Samaria | At 8:5-8 | Curas, libertações | Grande alegria\n35 d.C. | Samaria | At 8:14-17 | Imposição de mãos | Receberam o ES\n37 d.C. | Cesareia | At 10:44-46 | ES caiu sobre todos | Falaram em línguas\n40 d.C. | Antioquia | At 11:21 | Pregação | Grande número creu\n50 d.C. | Filipos | At 16:25-34 | Terremoto | Carcereiro convertido\n52 d.C. | Éfeso | At 19:1-6 | Imposição de mãos | Línguas e profecia\n52 d.C. | Éfeso | At 19:11-20 | Milagres extraordinários | Queima de livros, Palavra cresceu\n\nPADRÃO: Oração → Derramamento do Espírito → Sinais → Conversões → Crescimento" },
          { title: "Princípios para o Avivamento Hoje", type: "Artigo", description: "Reflexão sobre como aplicar os princípios de avivamento à igreja contemporânea.", content: "PRINCÍPIOS PARA O AVIVAMENTO HOJE\n\n1. ORAÇÃO UNÂNIME E PERSEVERANTE\n'Todos estes perseveravam unanimemente em oração' (At 1:14)\nAplicação: Cultos de oração, vigílias, clamor coletivo\n\n2. PREGAÇÃO FIEL DA PALAVRA\n'Pedro, pondo-se em pé com os onze, levantou a voz' (At 2:14)\nAplicação: Pregar Cristo crucificado e ressuscitado\n\n3. ABERTURA PARA A AÇÃO SOBRENATURAL\n'Muitas maravilhas e sinais se faziam pelos apóstolos' (At 2:43)\nAplicação: Não limitar a ação do Espírito Santo\n\n4. OBEDIÊNCIA À DIREÇÃO DIVINA\n'O Espírito Santo disse: Apartai-me a Barnabé e Saulo' (At 13:2)\nAplicação: Sensibilidade à voz do Espírito\n\n5. SANTIDADE DE VIDA\n'Veio grande temor sobre toda a igreja' (At 5:11)\nAplicação: Temor do Senhor e integridade\n\nCONCLUSÃO:\nO avivamento não é fabricado pelo homem, mas concedido por Deus em resposta à oração, obediência e fidelidade à Sua Palavra." },
        ],
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
        videoSearch: "eclesiologia doutrina da igreja assembleia de Deus governo",
        videoTitle: "Eclesiologia — O que é a Igreja?",
        materials: [
          { title: "Apostila: Eclesiologia Assembleiana", type: "PDF", description: "Estudo sobre a natureza, missão e governo da Igreja na perspectiva da CGADB.", content: "ECLESIOLOGIA ASSEMBLEIANA\n\n1. DEFINIÇÃO\nA Igreja (ekklesia = 'chamados para fora') é a comunidade dos salvos por Cristo.\n\n2. IGREJA LOCAL E UNIVERSAL\n- Universal: Todos os salvos de todos os tempos\n- Local: Congregação visível em determinado lugar\n\n3. IMAGENS BÍBLICAS\n- Corpo de Cristo (1 Co 12:27)\n- Templo do Espírito Santo (1 Co 3:16)\n- Noiva de Cristo (Ef 5:25-27)\n- Coluna e firmeza da verdade (1 Tm 3:15)\n\n4. GOVERNO NAS AD\nModelo congregacional com liderança pastoral:\n- Pastor preside a igreja local\n- Assembleia participa das decisões\n- Presbíteros e diáconos auxiliam\n- CGADB mantém unidade\n\n5. MINISTÉRIO QUÍNTUPLO (Ef 4:11)\nApóstolos, Profetas, Evangelistas, Pastores e Mestres" },
          { title: "Estrutura Organizacional da CGADB", type: "Organograma", description: "Diagrama da estrutura hierárquica das Assembleias de Deus no Brasil.", content: "ESTRUTURA ORGANIZACIONAL DA CGADB\n\nNÍVEL NACIONAL:\nCGADB (Convenção Geral das Assembleias de Deus no Brasil)\n- Presidente da CGADB\n- Mesa Diretora\n- Assembleia Geral (AGO/AGE)\n- CPAD (Casa Publicadora)\n↓\nNÍVEL ESTADUAL:\nConvenções Estaduais\n- Presidente da Convenção Estadual\n- Mesa Diretora Estadual\n- Assembleia dos Ministros\n↓\nNÍVEL REGIONAL:\nPresbitérios / Campos\n- Presbítero Regional\n↓\nNÍVEL LOCAL:\nIgreja Local (Sede)\n- Pastor Presidente\n- Presbíteros\n- Diáconos\n- Congregações (igrejas filhas)\n  - Dirigente/Evangelista\n\nMINISTÉRIO:\n1. Diácono\n2. Presbítero\n3. Evangelista\n4. Pastor\n5. Missionário\n\nÓRGÃOS DE APOIO:\n- Departamento de Missões\n- Departamento de Educação Cristã\n- Departamento de Juventude\n- Departamento de Senhoras\n- Escola Bíblica Dominical" },
        ],
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
        videoSearch: "batismo por imersão santa ceia ordenanças igreja assembleia de Deus",
        videoTitle: "Batismo e Santa Ceia — Ordenanças",
        materials: [
          { title: "Estudo: Batismo por Imersão — Base Bíblica", type: "PDF", description: "Defesa bíblica do batismo por imersão como praticado pelas Assembleias de Deus.", content: "BATISMO POR IMERSÃO — BASE BÍBLICA\n\n1. SIGNIFICADO DA PALAVRA\nbaptizo (grego) = mergulhar, imergir, submergir\n\n2. EXEMPLOS BÍBLICOS\n- Jesus foi batizado no rio Jordão (Mt 3:13-17) — 'saiu da água'\n- Filipe e o eunuco: 'desceram ambos à água' (At 8:38-39)\n\n3. SIMBOLISMO\n- Morte: imersão na água = sepultamento com Cristo\n- Sepultamento: ficar debaixo da água\n- Ressurreição: sair da água = nova vida\n- Romanos 6:3-4\n\n4. FÓRMULA\n'Em nome do Pai, do Filho e do Espírito Santo' (Mt 28:19)\n\n5. CANDIDATOS\nSomente os que creram e se arrependeram (At 2:38)\nNão se batiza crianças que não podem exercer fé\n\n6. NÃO É SALVÍFICO\nO batismo é mandamento de Cristo, mas não é condição para salvação (o ladrão na cruz foi salvo sem batismo — Lc 23:43)" },
          { title: "Liturgia da Santa Ceia — Modelo CGADB", type: "DOC", description: "Roteiro litúrgico para celebração da Santa Ceia.", content: "LITURGIA DA SANTA CEIA — MODELO CGADB\n\n1. ABERTURA\n- Hino congregacional\n- Oração de invocação\n- Leitura de 1 Coríntios 11:23-29\n\n2. MEDITAÇÃO\n- Breve mensagem sobre o significado da Ceia\n- Momento de auto-exame (1 Co 11:28)\n- Oração silenciosa\n\n3. DISTRIBUIÇÃO DO PÃO\n- Pastor abençoa o pão\n- 'Isto é o meu corpo que por vós é dado' (Lc 22:19)\n- Diáconos distribuem\n- Todos comem juntos\n\n4. DISTRIBUIÇÃO DO CÁLICE\n- Pastor abençoa o cálice (suco de uva)\n- 'Este cálice é o novo testamento no meu sangue' (Lc 22:20)\n- Diáconos distribuem\n- Todos bebem juntos\n\n5. ENCERRAMENTO\n- Hino final\n- Oração de agradecimento\n- Bênção pastoral\n\nOBSERVAÇÕES:\n- Elementos: pão sem fermento e suco de uva\n- Significado: memorial (não transubstanciação)\n- Participantes: crentes batizados" },
        ],
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
        videoSearch: "escatologia segunda vinda Cristo arrebatamento pré-milenismo assembleia de Deus",
        videoTitle: "Escatologia — A Segunda Vinda de Cristo",
        materials: [
          { title: "Apostila: Escatologia Pré-Milenista", type: "PDF", description: "Estudo detalhado da posição escatológica oficial da CGADB.", content: "ESCATOLOGIA PRÉ-MILENISTA (Posição da CGADB)\n\n1. ARREBATAMENTO DA IGREJA\nCristo virá ANTES da Grande Tribulação para buscar Sua Igreja.\n- 1 Ts 4:16-17 — Arrebatamento dos crentes\n- Jo 14:3 — 'Virei outra vez'\n- 1 Co 15:51-52 — 'Num abrir e fechar de olhos'\n- Evento IMINENTE\n\n2. GRANDE TRIBULAÇÃO (7 anos)\n- Daniel 9:27 — A semana final\n- Mt 24:21 — Grande aflição\n- Ap 6-19 — Selos, trombetas e taças\n- Surgimento do Anticristo (2 Ts 2:3-4)\n\n3. VOLTA GLORIOSA\nCristo volta visivelmente com Sua Igreja (Ap 19:11-16).\n\n4. MILÊNIO (1.000 anos)\nReinado literal de Cristo na terra (Ap 20:4-6).\n\n5. JUÍZO FINAL\n- Tribunal de Cristo para crentes (2 Co 5:10)\n- Grande Trono Branco para ímpios (Ap 20:11-15)\n\n6. ESTADO ETERNO\n- Novos Céus e Nova Terra (Ap 21:1-4)\n- Inferno literal para os perdidos (Mt 25:46)" },
          { title: "Linha do Tempo Escatológica", type: "Infográfico", description: "Diagrama visual: Arrebatamento → Tribulação → Milênio → Juízo Final → Eternidade.", content: "LINHA DO TEMPO ESCATOLÓGICA (Visão Pré-Milenista Pré-Tribulacionista)\n\nERA DA IGREJA (Atual)\n↓\nARREBATAMENTO (1 Ts 4:16-17)\n- Cristo vem nos ares\n- Mortos em Cristo ressuscitam\n- Vivos são transformados\n- Igreja sobe ao encontro do Senhor\n↓ (simultaneamente na terra)\nGRANDE TRIBULAÇÃO (7 anos)\n- 1ª metade (3,5 anos): Falsa paz do Anticristo\n- 2ª metade (3,5 anos): Grande Tribulação propriamente dita\n- Selos, Trombetas, Taças (Apocalipse 6-19)\n- Batalha do Armagedom\n↓ (no céu)\nTRIBUNAL DE CRISTO (2 Co 5:10)\n- Julgamento de obras dos crentes para recompensa\nBODAS DO CORDEIRO (Ap 19:7-9)\n↓\nVOLTA GLORIOSA (Ap 19:11-16)\n- Cristo volta com a Igreja\n- Derrota do Anticristo\n- Satanás preso\n↓\nMILÊNIO — 1.000 anos (Ap 20:4-6)\n↓\nSOLTURA DE SATANÁS → Derrota final\n↓\nJUÍZO DO GRANDE TRONO BRANCO (Ap 20:11-15)\n↓\nESTADO ETERNO\n- Novos Céus e Nova Terra (Ap 21-22)\n- Comunhão eterna com Deus" },
          { title: "Tabela: Comparação das Posições Escatológicas", type: "Tabela", description: "Pré-milenismo vs. Amilenismo vs. Pós-milenismo.", content: "COMPARAÇÃO DAS POSIÇÕES ESCATOLÓGICAS\n\nPRÉ-MILENISMO (Posição da CGADB):\n- Milênio: Literal, 1.000 anos após a volta de Cristo\n- Arrebatamento: Antes da Tribulação (pré-tribulacionista)\n- Tribulação: Literal, 7 anos\n- Israel: Tem papel futuro no plano de Deus\n- Interpretação: Literal do Apocalipse\n\nAMILENISMO:\n- Milênio: Simbólico, é a era atual da Igreja\n- Arrebatamento: Na volta de Cristo (um único evento)\n- Tribulação: Simbólica ou presente\n- Israel: A Igreja é o novo Israel\n- Interpretação: Alegórica do Apocalipse\n\nPÓS-MILENISMO:\n- Milênio: Período de prosperidade antes da volta de Cristo\n- Arrebatamento: Na volta de Cristo\n- Tribulação: Passada ou simbólica\n- Israel: A Igreja substitui Israel\n- Interpretação: Otimista sobre o futuro\n\nPOR QUE AS AD SÃO PRÉ-MILENISTAS?\n- Interpretação literal das profecias\n- Distinção entre Israel e Igreja\n- Iminência do arrebatamento gera urgência evangelística" },
        ],
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
        videoSearch: "juízo final trono branco céu inferno eternidade escatologia bíblica",
        videoTitle: "O Juízo Final e a Eternidade",
        materials: [
          { title: "Estudo: Céu e Inferno nas Escrituras", type: "PDF", description: "Análise bíblica sobre o destino eterno dos salvos e dos perdidos.", content: "CÉU E INFERNO NAS ESCRITURAS\n\n1. O CÉU\n- Morada de Deus (Mt 6:9)\n- Lugar preparado por Cristo (Jo 14:2-3)\n- Novos Céus e Nova Terra (Ap 21:1-4)\n- Sem morte, dor, pranto ou clamor\n- Nova Jerusalém desce do céu (Ap 21:10-27)\n- Comunhão eterna com Deus (Ap 22:3-5)\n\n2. O INFERNO\nAs Assembleias de Deus creem no inferno LITERAL:\n- Geena: lugar de tormento eterno (Mt 10:28)\n- Lago de fogo (Ap 20:10,14-15)\n- Preparado para o diabo e seus anjos (Mt 25:41)\n- Tormento ETERNO (Mt 25:46)\n- Trevas exteriores (Mt 8:12)\n\n3. ESTADO INTERMEDIÁRIO\n- Os salvos que morrem vão para o Paraíso (Lc 23:43; Fp 1:23; 2 Co 5:8)\n- Os ímpios vão para o Hades, aguardando o juízo (Lc 16:23)\n\n4. RESSURREIÇÃO\n- Dos salvos: para a vida eterna (Jo 5:29a)\n- Dos ímpios: para a condenação (Jo 5:29b)\n\n5. ESPERANÇA CRISTÃ\n'Aguardando a bem-aventurada esperança' (Tt 2:13)" },
        ],
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
        videoSearch: "história pentecostalismo rua Azusa William Seymour Charles Parham origens",
        videoTitle: "História do Pentecostalismo — Origens",
        materials: [
          { title: "Apostila: História do Movimento Pentecostal", type: "PDF", description: "Do avivamento de Topeka à Rua Azusa e a expansão mundial.", content: "HISTÓRIA DO MOVIMENTO PENTECOSTAL\n\n1. ANTECEDENTES (Séc. XIX)\n- Movimentos de santidade (John Wesley, Charles Finney)\n- Ênfase na segunda bênção e santificação\n- Anseio por um reavivamento espiritual\n\n2. TOPEKA, KANSAS (1901)\n- Charles F. Parham, fundador da Escola Bíblica Bethel\n- Agnes Ozman fala em línguas em 1º de janeiro de 1901\n- Parham formula a doutrina: línguas = evidência inicial do batismo no ES\n\n3. RUA AZUSA, LOS ANGELES (1906-1909)\n- William J. Seymour, pastor afro-americano, aluno de Parham\n- 312 Azusa Street, Los Angeles\n- Cultos diários quase ininterruptos\n- Manifestações: línguas, curas, profecias\n- Integração racial revolucionária\n- Missionários enviados ao mundo inteiro\n\n4. EXPANSÃO MUNDIAL (1910-1930)\n- O movimento se espalhou por todos os continentes\n- Formação das primeiras denominações:\n  - Assemblies of God (EUA, 1914)\n  - Igreja do Evangelho Quadrangular\n  - Igreja de Deus em Cristo\n  - Assembleias de Deus no Brasil (1911)" },
          { title: "Linha do Tempo: Marcos do Pentecostalismo", type: "Infográfico", description: "1901 → Topeka | 1906 → Azusa | 1911 → Belém do Pará | 1914 → AG (EUA) | 1930 → CGADB.", content: "LINHA DO TEMPO DO PENTECOSTALISMO\n\n1901 — TOPEKA, KANSAS\nAgnes Ozman fala em línguas na Escola Bíblica de Charles Parham.\n\n1906 — RUA AZUSA, LOS ANGELES\nWilliam Seymour inicia o avivamento na Rua Azusa.\n\n1906-1909 — EXPANSÃO A PARTIR DE AZUSA\nMissionários são enviados a dezenas de países.\n\n1910 — CHEGADA À ESCANDINÁVIA\nMovimento pentecostal chega à Suécia (onde estavam Berg e Vingren).\n\n1911 — BELÉM DO PARÁ, BRASIL\n18 de junho: Daniel Berg e Gunnar Vingren fundam as Assembleias de Deus.\n\n1914 — HOT SPRINGS, ARKANSAS\nFundação das Assemblies of God (EUA).\n\n1918 — MUDANÇA DE NOME\nDe 'Missão de Fé Apostólica' para 'Assembleia de Deus' no Brasil.\n\n1930 — NATAL, RN\nFundação da CGADB (Convenção Geral das Assembleias de Deus no Brasil).\n\n1940 — RIO DE JANEIRO\nFundação da CPAD (Casa Publicadora das Assembleias de Deus).\n\n1950-HOJE — CRESCIMENTO EXPONENCIAL\nAs AD se tornam a maior denominação evangélica do Brasil." },
        ],
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
        videoSearch: "história assembleias de Deus Brasil Daniel Berg Gunnar Vingren fundação",
        videoTitle: "História das Assembleias de Deus no Brasil",
        materials: [
          { title: "Biografia: Daniel Berg e Gunnar Vingren", type: "PDF", description: "Vida e obra dos fundadores das Assembleias de Deus no Brasil.", content: "DANIEL BERG E GUNNAR VINGREN\n\nDANIEL BERG (1884-1963)\n- Nascido em Vargön, Suécia\n- Profissão: metalúrgico/fundidor\n- Converteu-se nos EUA\n- Recebeu o batismo no Espírito Santo em Chicago (1909)\n- Recebeu profecia sobre 'Pará' em uma conferência\n- Chegou a Belém do Pará em 19/11/1910\n- Trabalhou como fundidor enquanto evangelizava\n- Conhecido por sua simplicidade e dedicação\n- Faleceu em 1963 no Brasil\n\nGUNNAR VINGREN (1879-1933)\n- Nascido em Östra Husby, Suécia\n- Profissão: pastor batista\n- Emigrou para os EUA\n- Recebeu o batismo no Espírito Santo\n- Profecia de Adolfo Uldin: 'Ide a Pará'\n- Chegou a Belém com Daniel Berg em 19/11/1910\n- Estudou português rapidamente\n- Pregou na Igreja Batista de Belém\n- Expulso junto com 17 batistas que receberam o ES\n- Fundou a 'Missão de Fé Apostólica' em 18/06/1911\n- Registrou tudo no 'Diário do Pioneiro'\n- Faleceu em 1933 na Suécia\n\nLEGADO:\nFundaram a maior denominação evangélica do Brasil." },
          { title: "Cronologia das Assembleias de Deus no Brasil", type: "Tabela", description: "Principais marcos históricos de 1911 até os dias atuais.", content: "CRONOLOGIA DAS ASSEMBLEIAS DE DEUS NO BRASIL\n\n1910 — Chegada de Berg e Vingren a Belém do Pará (19/11)\n1911 — Fundação da 'Missão de Fé Apostólica' (18/06)\n1911 — Primeiros batismos no Espírito Santo em Belém\n1914 — Expansão para o Nordeste\n1918 — Nome 'Assembleia de Deus' adotado oficialmente\n1920 — Chegada ao Sudeste (Rio de Janeiro, São Paulo)\n1924 — Primeiro jornal: 'Boa Semente'\n1930 — Fundação da CGADB em Natal/RN\n1933 — Falecimento de Gunnar Vingren na Suécia\n1940 — Fundação da CPAD no Rio de Janeiro\n1941 — Início das revistas da EBD\n1950 — Início do programa 'Voz das Assembleias de Deus' no rádio\n1960 — Crescimento acelerado em todo o Brasil\n1963 — Falecimento de Daniel Berg no Brasil\n1970 — Expansão para todas as capitais\n1980 — Presença em todos os estados\n1990 — Início da presença na TV\n2000 — Dezenas de milhões de membros\n2010 — Centenário das AD no Brasil\nHOJE — Maior denominação evangélica do Brasil e uma das maiores do mundo" },
          { title: "O Diário do Pioneiro — Gunnar Vingren", type: "Artigo", description: "Trechos selecionados do diário de Gunnar Vingren sobre os primeiros anos em Belém.", content: "TRECHOS DO DIÁRIO DO PIONEIRO — GUNNAR VINGREN\n\n19 de novembro de 1910:\n'Chegamos a Belém do Pará. O calor é intenso. Não conhecemos ninguém aqui, mas o Senhor nos guia. Daniel e eu temos certeza de que Deus nos chamou para esta terra.'\n\nDezembro de 1910:\n'Começamos a frequentar a Igreja Batista. Estou estudando português dia e noite. O Senhor tem sido fiel em nos sustentar.'\n\nJaneiro de 1911:\n'Algumas pessoas na igreja batista começaram a buscar o batismo no Espírito Santo. A irmã Celina de Albuquerque foi a primeira brasileira a receber o batismo, falando em outras línguas.'\n\n18 de junho de 1911:\n'Fomos expulsos da igreja batista junto com 17 irmãos que receberam o Espírito Santo. Hoje fundamos nossa própria congregação. Deus está conosco!'\n\n1912:\n'O trabalho cresce. Muitas curas e milagres acontecem. O povo está faminto pela Palavra de Deus e pelo poder do Espírito Santo.'\n\nNOTA: O Diário do Pioneiro, publicado pela CPAD, é uma das fontes mais importantes para a história das AD no Brasil." },
        ],
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
        videoSearch: "homilética como preparar sermão pregação bíblica pentecostal",
        videoTitle: "Homilética — Como Preparar Sermões",
        materials: [
          { title: "Apostila: Homilética Pentecostal", type: "PDF", description: "Guia completo para preparação e apresentação de sermões bíblicos.", content: "APOSTILA DE HOMILÉTICA PENTECOSTAL\n\n1. DEFINIÇÃO\nHomilética é a ciência e arte de preparar e apresentar sermões bíblicos.\n\n2. TIPOS DE SERMÃO\na) TEMÁTICO: Baseado em um tema com textos diversos\nb) TEXTUAL: Baseado em um texto curto, seguindo suas divisões naturais\nc) EXPOSITIVO: Exposição detalhada de uma passagem extensa\n\n3. ESTRUTURA DO SERMÃO\n1. Introdução — Captar atenção, apresentar o tema\n2. Proposição — A ideia central em uma frase\n3. Corpo — 2 a 4 pontos principais com sub-pontos\n4. Ilustrações — Histórias, exemplos, analogias\n5. Aplicação — O que o ouvinte deve fazer\n6. Conclusão — Resumo e apelo\n\n4. A PREGAÇÃO PENTECOSTAL\n- Começa com oração e jejum\n- Unção do Espírito (1 Jo 2:27)\n- Combina preparo intelectual com dependência espiritual\n- 1 Co 2:4 — 'Demonstração do Espírito e de poder'\n\n5. PRINCÍPIOS ÉTICOS\n- Integridade (viver o que prega)\n- Fidelidade ao texto bíblico\n- Respeito ao rebanho\n- Humildade e dependência de Deus" },
          { title: "Modelo de Esboço de Sermão", type: "DOC", description: "Template prático para estruturar seus sermões (temático, textual e expositivo).", content: "MODELO DE ESBOÇO DE SERMÃO\n\nTÍTULO: ___________________\nTEXTO BASE: _______________\nTIPO: ( ) Temático ( ) Textual ( ) Expositivo\nOBJETIVO: _________________\n\nI. INTRODUÇÃO\n- Ilustração ou pergunta inicial:\n- Contextualização do texto:\n- Proposição (ideia central):\n\nII. DESENVOLVIMENTO\n\nPonto 1: ___________________\n- Sub-ponto a:\n- Sub-ponto b:\n- Versículo de apoio:\n- Ilustração:\n\nPonto 2: ___________________\n- Sub-ponto a:\n- Sub-ponto b:\n- Versículo de apoio:\n- Ilustração:\n\nPonto 3: ___________________\n- Sub-ponto a:\n- Sub-ponto b:\n- Versículo de apoio:\n- Ilustração:\n\nIII. APLICAÇÃO\n- O que o ouvinte deve fazer?\n- Como aplicar no dia a dia?\n\nIV. CONCLUSÃO\n- Resumo dos pontos principais:\n- Apelo final:\n- Oração:\n\nTEMPO ESTIMADO: ___ minutos\nPÚBLICO-ALVO: ___________" },
          { title: "10 Dicas para Pregar com Unção e Preparo", type: "Artigo", description: "Orientações práticas combinando estudo e dependência do Espírito.", content: "10 DICAS PARA PREGAR COM UNÇÃO E PREPARO\n\n1. ORE ANTES DE ESTUDAR\nPeça ao Espírito Santo que ilumine sua mente (Jo 16:13).\n\n2. ESTUDE O TEXTO NO CONTEXTO\nLeia os capítulos antes e depois. Entenda o contexto histórico e literário.\n\n3. USE FERRAMENTAS DE ESTUDO\nComentários bíblicos, dicionários, concordâncias. A CPAD tem excelentes materiais.\n\n4. PREPARE UM ESBOÇO CLARO\nIntrodução, 2-3 pontos principais, aplicação e conclusão.\n\n5. ILUSTRE COM SABEDORIA\nUse histórias, exemplos do cotidiano. Evite histórias pessoais demais.\n\n6. APLIQUE O TEXTO À VIDA\nO sermão deve mudar vidas, não apenas informar.\n\n7. PRATIQUE A ENTREGA\nEnsaie em voz alta. Cuide do tom, ritmo e pausas.\n\n8. DEPENDA DO ESPÍRITO\nEsteja aberto para o Espírito mudar sua direção durante a pregação.\n\n9. SEJA FIEL AO TEXTO\nNão force o texto a dizer o que você quer. Deixe a Bíblia falar.\n\n10. VIVA O QUE PREGA\nA maior pregação é o exemplo. 'Sê o exemplo dos fiéis' (1 Tm 4:12)." },
        ],
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
        videoSearch: "teologia pastoral liderança cristã ministério obreiro assembleia de Deus",
        videoTitle: "Teologia Pastoral — Liderança Cristã",
        materials: [
          { title: "Apostila: Teologia Pastoral", type: "PDF", description: "Estudo sobre requisitos, responsabilidades e ética do ministério pastoral.", content: "APOSTILA DE TEOLOGIA PASTORAL\n\n1. REQUISITOS BÍBLICOS (1 Tm 3:1-7; Tt 1:5-9)\n- Irrepreensível\n- Marido de uma mulher\n- Temperante, sóbrio, ordeiro\n- Apto para ensinar\n- Não dado ao vinho\n- Não violento, mas moderado\n- Hospitaleiro\n- Governar bem a própria casa\n\n2. RESPONSABILIDADES DO PASTOR\n- Apascentar o rebanho (1 Pe 5:2)\n- Ensinar a Palavra (2 Tm 4:2)\n- Visitar os enfermos (Tg 5:14)\n- Aconselhar (Pv 11:14)\n- Administrar a igreja\n- Ser exemplo (1 Tm 4:12)\n\n3. HIERARQUIA MINISTERIAL NA CGADB\n1. Diácono — Servo (At 6:1-6)\n2. Presbítero — Auxiliar na liderança\n3. Evangelista — Ganhar almas\n4. Pastor — Líder espiritual\n5. Missionário — Campos novos\n\n4. A EBD\n- Pilar das Assembleias de Deus\n- Ensino sistemático para todas as idades\n- Revistas da CPAD\n\n5. ÉTICA MINISTERIAL\n- Santidade de vida\n- Fidelidade conjugal\n- Transparência financeira\n- Respeito à hierarquia denominacional" },
          { title: "Manual do Obreiro — CGADB", type: "DOC", description: "Orientações oficiais para obreiros das Assembleias de Deus.", content: "MANUAL DO OBREIRO — ORIENTAÇÕES CGADB\n\n1. VOCAÇÃO MINISTERIAL\nO chamado deve ser confirmado pela igreja local e pela convenção.\n'Ninguém toma para si esta honra, senão o que é chamado por Deus' (Hb 5:4)\n\n2. FORMAÇÃO\n- Curso de obreiros na igreja local\n- Seminário teológico reconhecido\n- Estudo contínuo da Palavra\n- Participação na EBD como aluno e professor\n\n3. CONDUTA\n- Vida devocional diária\n- Fidelidade à doutrina pentecostal\n- Submissão à liderança\n- Ética no trato com as finanças da igreja\n- Prudência no aconselhamento\n\n4. LITURGIA\n- Culto de adoração\n- Escola Bíblica Dominical\n- Culto de oração e ensino\n- Celebração da Santa Ceia\n- Batismo em águas\n- Apresentação de crianças\n- Casamentos e funerais\n\n5. DISCIPLINA\n- Processo disciplinar conforme o regimento interno\n- Restauração do caído\n- Zelo pela santidade da igreja" },
          { title: "A EBD como Pilar da Igreja Local", type: "Artigo", description: "Importância e organização da Escola Bíblica Dominical nas Assembleias de Deus.", content: "A EBD COMO PILAR DA IGREJA LOCAL\n\n1. HISTÓRIA DA EBD\n- Originou-se na Inglaterra (Robert Raikes, 1780)\n- Chegou ao Brasil no século XIX\n- As AD adotaram desde o início como ferramenta central\n\n2. IMPORTÂNCIA\n- Principal meio de ensino bíblico sistemático\n- Formação de líderes e obreiros\n- Integração dos membros\n- Crescimento espiritual da igreja\n- Oséias 4:6 — 'O meu povo foi destruído por falta de conhecimento'\n\n3. ESTRUTURA\n- Superintendente da EBD\n- Professores por faixa etária\n- Classes: crianças, adolescentes, jovens, adultos\n- Material: Revistas CPAD (Lições Bíblicas)\n- Duração: 1 hora (geralmente aos domingos pela manhã)\n\n4. COMO ORGANIZAR\n- Escolher professores vocacionados e preparados\n- Garantir material para todos os alunos\n- Promover treinamento de professores\n- Incentivar a frequência\n- Realizar programas especiais (mês da EBD)\n\n5. A EBD E O CRESCIMENTO DA IGREJA\nIgrejas com EBD forte tendem a ser mais saudáveis, com membros mais comprometidos e fundamentados na Palavra." },
        ],
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
  const [showVideo, setShowVideo] = useState(false);
  const [materialModal, setMaterialModal] = useState<Material | null>(null);
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

  const downloadMaterialPDF = (mat: Material) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - margin * 2;
      
      doc.setFontSize(16);
      doc.text(mat.title, margin, 25);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Tipo: ${mat.type} | Curso de Teologia — CGADB`, margin, 33);
      
      doc.setDrawColor(200);
      doc.line(margin, 36, pageWidth - margin, 36);
      
      doc.setFontSize(11);
      doc.setTextColor(0);
      const lines = doc.splitTextToSize(mat.content, maxWidth);
      let y = 44;
      for (const line of lines) {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, margin, y);
        y += 6;
      }
      
      doc.save(`${mat.title.replace(/[^a-zA-Z0-9À-ÿ\s]/g, '').replace(/\s+/g, '_')}.pdf`);
      toast({ title: "PDF baixado!", description: mat.title });
    } catch {
      toast({ title: "Erro ao gerar PDF", variant: "destructive" });
    }
  };

  const getVideoEmbedUrl = (searchQuery: string) => {
    const encoded = encodeURIComponent(searchQuery);
    return `https://www.youtube.com/embed?listType=search&list=${encoded}`;
  };

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

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf": return "bg-destructive/10 text-destructive";
      case "doc": return "bg-primary/10 text-primary";
      case "infográfico": case "tabela": case "mapa": case "organograma": return "bg-accent/80 text-accent-foreground";
      case "artigo": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
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
          Formação teológica completa na perspectiva pentecostal das Assembleias de Deus, com vídeo aulas e suporte de IA.
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <div className="h-2 w-48 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-gradient-gold transition-all" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-sm text-muted-foreground font-medium">{completedLessons.length}/{totalLessons} aulas • {progress}%</span>
        </div>
      </motion.div>

      <Tabs defaultValue="course" className="max-w-6xl mx-auto">
        <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-6">
          <TabsTrigger value="course" className="gap-2"><GraduationCap className="h-4 w-4" /> Aulas</TabsTrigger>
          <TabsTrigger value="materials" className="gap-2"><FileText className="h-4 w-4" /> Material de Apoio</TabsTrigger>
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
                                onClick={() => { setActiveModule(mi); setActiveLesson(li); setShowVideo(false); }}
                                className={cn(
                                  "w-full flex items-center gap-2 rounded-md px-3 py-1.5 text-xs transition-colors text-left",
                                  activeModule === mi && activeLesson === li ? "bg-accent/60 text-accent-foreground" : "hover:bg-muted/50 text-muted-foreground"
                                )}
                              >
                                {completedLessons.includes(les.id)
                                  ? <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
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
                <h2 className="font-serif text-2xl font-bold mb-4">{currentLesson.title}</h2>

                {/* Video Section */}
                <div className="mb-6">
                  {showVideo ? (
                    <div className="rounded-xl overflow-hidden border border-border bg-black aspect-video">
                      <iframe
                        src={getVideoEmbedUrl(currentLesson.videoSearch)}
                        title={currentLesson.videoTitle}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowVideo(true)}
                      className="w-full rounded-xl border border-border bg-muted/50 hover:bg-muted transition-colors p-6 flex items-center gap-4 group"
                    >
                      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                        <Play className="h-7 w-7 text-primary ml-0.5" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-foreground flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          Vídeo Aula
                        </p>
                        <p className="text-sm text-muted-foreground">{currentLesson.videoTitle}</p>
                      </div>
                    </button>
                  )}
                </div>

                {/* Lesson Content */}
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
                </div>

                {/* Materials for current lesson (compact) */}
                {currentLesson.materials.length > 0 && (
                  <div className="mt-8 border-t border-border pt-6">
                    <h3 className="font-serif text-lg font-semibold mb-3 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Material de Apoio desta Aula
                    </h3>
                    <div className="grid gap-2">
                      {currentLesson.materials.map((mat, i) => (
                        <div key={i} className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/30 p-3">
                          <Badge className={cn("text-[10px] shrink-0 mt-0.5", getTypeColor(mat.type))}>{mat.type}</Badge>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground">{mat.title}</p>
                            <p className="text-xs text-muted-foreground">{mat.description}</p>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1" onClick={() => setMaterialModal(mat)}>
                              <Eye className="h-3 w-3" /> Ver
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1" onClick={() => downloadMaterialPDF(mat)}>
                              <Download className="h-3 w-3" /> PDF
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button
                    onClick={() => toggleComplete(currentLesson.id)}
                    variant={completedLessons.includes(currentLesson.id) ? "default" : "outline"}
                    className={cn("gap-2", completedLessons.includes(currentLesson.id) && "bg-primary hover:bg-primary/90")}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {completedLessons.includes(currentLesson.id) ? "Concluída" : "Marcar como Concluída"}
                  </Button>

                  {activeLesson < currentModule.lessons.length - 1 && (
                    <Button variant="outline" onClick={() => { setActiveLesson(activeLesson + 1); setShowVideo(false); }} className="gap-2">
                      Próxima Aula <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                  {activeLesson === currentModule.lessons.length - 1 && activeModule < modules.length - 1 && (
                    <Button variant="outline" onClick={() => { setActiveModule(activeModule + 1); setActiveLesson(0); setExpandedModule(activeModule + 1); setShowVideo(false); }} className="gap-2">
                      Próximo Módulo <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Materials Tab */}
        <TabsContent value="materials">
          <div className="max-w-4xl mx-auto space-y-6">
            {modules.map((mod) => (
              <Card key={mod.id} className="border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-serif text-lg font-bold mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Módulo {mod.id}: {mod.title}
                  </h3>
                  <div className="space-y-4">
                    {mod.lessons.map((les) => (
                      <div key={les.id}>
                        <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                          <Video className="h-4 w-4 text-muted-foreground" />
                          {les.title}
                        </p>

                        {/* Video link */}
                        <div className="ml-6 mb-2">
                          <button
                            onClick={() => {
                              const mi = modules.findIndex(m => m.id === mod.id);
                              const li = mod.lessons.findIndex(l => l.id === les.id);
                              setActiveModule(mi);
                              setActiveLesson(li);
                              setShowVideo(true);
                              setExpandedModule(mi);
                              const tabEl = document.querySelector('[data-value="course"]') as HTMLButtonElement | null;
                              tabEl?.click();
                            }}
                            className="text-xs text-primary hover:underline flex items-center gap-1 mb-2"
                          >
                            <Play className="h-3 w-3" /> Assistir Vídeo Aula: {les.videoTitle}
                          </button>
                        </div>

                        {/* Materials */}
                        <div className="ml-6 grid gap-2">
                          {les.materials.map((mat, i) => (
                            <div key={i} className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/30 p-3">
                              <Badge className={cn("text-[10px] shrink-0 mt-0.5", getTypeColor(mat.type))}>{mat.type}</Badge>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-foreground">{mat.title}</p>
                                <p className="text-xs text-muted-foreground">{mat.description}</p>
                              </div>
                              <div className="flex gap-1 shrink-0">
                                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1" onClick={() => setMaterialModal(mat)}>
                                  <Eye className="h-3 w-3" /> Ver
                                </Button>
                                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1" onClick={() => downloadMaterialPDF(mat)}>
                                  <Download className="h-3 w-3" /> PDF
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
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

      {/* Material Modal */}
      <Dialog open={!!materialModal} onOpenChange={() => setMaterialModal(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {materialModal?.title}
            </DialogTitle>
          </DialogHeader>
          {materialModal && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={cn("text-xs", getTypeColor(materialModal.type))}>{materialModal.type}</Badge>
                <span className="text-xs text-muted-foreground">{materialModal.description}</span>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                <pre className="whitespace-pre-wrap text-sm text-foreground font-sans leading-relaxed">
                  {materialModal.content}
                </pre>
              </div>
              <Button onClick={() => downloadMaterialPDF(materialModal)} className="gap-2">
                <Download className="h-4 w-4" /> Baixar como PDF
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CursoTeologia;
