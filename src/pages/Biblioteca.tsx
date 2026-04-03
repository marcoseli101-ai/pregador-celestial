import { useState } from "react";
import { AnimatedPage, AnimatedSection } from "@/components/AnimatedSection";
import { Link, useSearchParams } from "react-router-dom";
import { FileText, Search, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ContentActions } from "@/components/ContentActions";

const categories = [
  "Todos", "Avivamento", "Fé", "Santidade", "Salvação", "Arrependimento",
  "Espírito Santo", "Escatologia", "Cruzada", "Páscoa", "Natal", "Oração", "Graça"
];

const sermons = [
  {
    title: "O Fogo do Avivamento",
    theme: "Avivamento",
    verse: "Atos 2:1-4",
    content: `INTRODUÇÃO
O avivamento não é um evento humano, mas uma intervenção divina. Quando Deus derrama o Seu Espírito, nenhuma estrutura religiosa consegue contê-lo. O livro de Atos nos mostra que o avivamento genuíno começa com oração, produz transformação e resulta em evangelização.

"Ao cumprir-se o dia de Pentecostes, estavam todos reunidos no mesmo lugar; de repente, veio do céu um som, como de um vento impetuoso, e encheu toda a casa onde estavam assentados. E apareceram, distribuídas entre eles, línguas, como de fogo, e pousou uma sobre cada um deles. Todos ficaram cheios do Espírito Santo e passaram a falar em outras línguas, segundo o Espírito lhes concedia que falassem." (Atos 2:1-4)

DESENVOLVIMENTO

1. O Avivamento Começa com Unanimidade (Atos 2:1)
Os discípulos estavam "reunidos no mesmo lugar", em um só propósito. O avivamento não vem onde há divisão. Jesus havia orado pela unidade dos Seus seguidores (João 17:21). A igreja primitiva perseverava unânime em oração (Atos 1:14). Quando há concordância no Espírito, Deus se manifesta poderosamente (Mateus 18:19-20).

2. O Avivamento é Sobrenatural (Atos 2:2-3)
O som como de vento impetuoso e as línguas como de fogo não foram fabricados por mãos humanas. O profeta Ezequiel viu o Espírito como vento que dá vida aos ossos secos (Ezequiel 37:9-10). João Batista profetizou: "Ele vos batizará com o Espírito Santo e com fogo" (Mateus 3:11). O fogo de Deus purifica (Malaquias 3:2-3), ilumina (Salmos 119:105) e consome o sacrifício (1 Reis 18:38).

3. O Avivamento Produz Ousadia (Atos 2:14-36)
Pedro, que havia negado Jesus três vezes (Lucas 22:54-62), agora prega com ousadia diante de milhares. O Espírito Santo transforma covardes em valentes (2 Timóteo 1:7). A Palavra de Deus se torna fogo nos lábios do pregador (Jeremias 20:9; 23:29).

4. O Avivamento Gera Conversões (Atos 2:37-41)
Quase três mil almas se converteram naquele dia. O avivamento genuíno sempre resulta em arrependimento (2 Crônicas 7:14) e transformação de vidas (2 Coríntios 5:17). Onde o Espírito opera, há fruto que permanece (João 15:16).

CONCLUSÃO
O Deus do Pentecostes é o mesmo hoje (Hebreus 13:8). Ele prometeu: "Derramarei o meu Espírito sobre toda a carne" (Joel 2:28). O avivamento está disponível para todo aquele que busca a Deus de todo o coração (Jeremias 29:13). A igreja precisa voltar ao cenáculo, voltar à oração fervorosa, voltar à dependência total do Espírito Santo. O fogo do avivamento não se apagou — ele aguarda corações famintos e sedentos pela presença de Deus (Mateus 5:6).`
  },
  {
    title: "A Fé que Move Montanhas",
    theme: "Fé",
    verse: "Mateus 17:20",
    content: `INTRODUÇÃO
A fé é o fundamento da vida cristã. Sem ela, é impossível agradar a Deus (Hebreus 11:6). Jesus ensinou que uma fé genuína, ainda que pequena como um grão de mostarda, tem poder para mover montanhas. Mas o que significa, na prática, ter essa fé que transforma o impossível em realidade?

"Ele lhes respondeu: Por causa da pequenez da vossa fé. Pois em verdade vos digo que, se tiverdes fé como um grão de mostarda, direis a este monte: Passa daqui para acolá, e ele passará. Nada vos será impossível." (Mateus 17:20)

DESENVOLVIMENTO

1. A Fé Não Depende do Tamanho, Mas da Fonte (Mateus 17:20)
Jesus não disse que precisamos de muita fé, mas de fé verdadeira. O grão de mostarda é a menor das sementes, mas produz uma grande árvore (Mateus 13:31-32). A fé eficaz não está na quantidade, mas na qualidade — está fundamentada em quem é Deus, não em nossas capacidades (Efésios 2:8-9). Abraão creu contra toda esperança e foi justificado (Romanos 4:18-22).

2. A Fé Opera Através da Palavra de Deus (Romanos 10:17)
"A fé vem pelo ouvir, e o ouvir pela Palavra de Cristo." A fé bíblica não é pensamento positivo nem autoconfiança. Ela nasce da revelação de Deus em Sua Palavra. Josué venceu porque meditou na Lei dia e noite (Josué 1:8). A mulher com fluxo de sangue ouviu falar de Jesus e creu (Marcos 5:25-34). A fé de Daniel nos leões veio de sua intimidade com Deus através da oração e da Palavra (Daniel 6:10, 23).

3. A Fé é Provada e Fortalecida nas Tribulações (Tiago 1:2-4)
"Meus irmãos, tende por motivo de toda alegria o passardes por várias provações, sabendo que a provação da vossa fé produz perseverança." A fé de Abraão foi provada no Monte Moriá (Gênesis 22:1-14). A fé de Jó foi provada no sofrimento extremo (Jó 1:20-22; 19:25-27). A fé dos três hebreus foi provada na fornalha ardente (Daniel 3:16-18, 25). Pedro ensina que a prova da fé é mais preciosa que o ouro (1 Pedro 1:6-7).

4. A Fé Verdadeira Produz Obras (Tiago 2:17-26)
"A fé, se não tiver obras, por si só está morta." Raabe demonstrou fé escondendo os espias (Josué 2:1-21; Hebreus 11:31). Noé demonstrou fé construindo a arca (Gênesis 6:13-22; Hebreus 11:7). A fé que agrada a Deus se manifesta em obediência prática, amor ao próximo e perseverança até o fim (Gálatas 5:6).

CONCLUSÃO
As montanhas da sua vida — enfermidade, crise financeira, problemas familiares, vícios — podem ser removidas pela fé em Deus. Jesus disse: "Tudo é possível ao que crê" (Marcos 9:23). Não olhe para o tamanho do problema, olhe para o tamanho do seu Deus (Isaías 40:28-31). Declare como Paulo: "Tudo posso naquele que me fortalece" (Filipenses 4:13). Confie nas promessas de Deus, pois "nenhuma palavra de Deus jamais deixará de se cumprir" (Lucas 1:37).`
  },
  {
    title: "Santidade: O Caminho Estreito",
    theme: "Santidade",
    verse: "1 Pedro 1:15-16",
    content: `INTRODUÇÃO
Vivemos em uma era onde os padrões morais são relativizados e a santidade é considerada ultrapassada. Mas a Palavra de Deus é clara: "Sede santos, porque eu sou santo" (1 Pedro 1:16). A santidade não é uma opção para o cristão — é um mandamento divino e o caminho que conduz à vida eterna.

"Pelo contrário, segundo é santo aquele que vos chamou, tornai-vos santos também vós mesmos em todo o vosso procedimento, porque escrito está: Sede santos, porque eu sou santo." (1 Pedro 1:15-16)

DESENVOLVIMENTO

1. A Santidade é a Natureza de Deus (Isaías 6:1-3)
Quando Isaías teve a visão do trono de Deus, os serafins proclamavam: "Santo, Santo, Santo é o Senhor dos Exércitos." A santidade é o atributo central de Deus — Ele é absolutamente separado do pecado (Habacuque 1:13). Deus nos chama à santidade porque deseja que reflitamos Seu caráter (Efésios 5:1). Somos chamados para ser "participantes da natureza divina" (2 Pedro 1:4).

2. A Santidade Exige Separação do Pecado (2 Coríntios 6:14-18)
"Saí do meio deles e apartai-vos, diz o Senhor." Santificação significa ser separado para Deus. José fugiu do pecado na casa de Potifar (Gênesis 39:7-12). Daniel recusou contaminar-se com as iguarias do rei (Daniel 1:8). Paulo exorta: "Não vos conformeis com este mundo" (Romanos 12:2). Jesus ensinou que o caminho estreito é o que conduz à vida (Mateus 7:13-14).

3. A Santidade é Obra do Espírito Santo em Nós (Gálatas 5:16-25)
"Andai no Espírito e jamais satisfareis à concupiscência da carne." A santificação não é alcançada por esforço humano apenas, mas pelo poder do Espírito Santo que opera em nós (Filipenses 2:13). O fruto do Espírito — amor, alegria, paz, paciência, benignidade, bondade, fidelidade, mansidão, domínio próprio — é a evidência da vida santa (Gálatas 5:22-23). Jesus prometeu: "Conhecereis a verdade, e a verdade vos libertará" (João 8:32).

4. A Santidade Tem um Propósito Eterno (Hebreus 12:14)
"Segui a paz com todos e a santificação, sem a qual ninguém verá o Senhor." A santidade nos prepara para a eternidade com Deus. A noiva de Cristo deve se apresentar sem mácula nem ruga (Efésios 5:27). No céu, nada impuro entrará (Apocalipse 21:27). Paulo corria a carreira com disciplina para alcançar o prêmio celestial (1 Coríntios 9:24-27; 2 Timóteo 4:7-8).

CONCLUSÃO
A santidade não é legalismo nem religiosidade vazia — é um relacionamento profundo com o Deus Santo que nos transforma de glória em glória (2 Coríntios 3:18). O preço foi pago na cruz por Jesus Cristo, que "se entregou por nós para nos remir de toda iniquidade e purificar para si mesmo um povo exclusivamente seu, zeloso de boas obras" (Tito 2:14). Decida hoje andar pelo caminho estreito. O mundo oferece prazeres passageiros, mas Deus oferece gozo eterno na Sua presença (Salmos 16:11).`
  },
  {
    title: "A Cruz e a Salvação",
    theme: "Salvação",
    verse: "João 3:16",
    content: `INTRODUÇÃO
A cruz é o centro da fé cristã. Nela, o amor de Deus se manifestou de forma suprema. A salvação não é conquista humana, mas dádiva divina. Nesta mensagem, contemplaremos a profundidade do plano redentor de Deus revelado na cruz do Calvário.

"Porque Deus amou ao mundo de tal maneira que deu o seu Filho unigênito, para que todo o que nele crê não pereça, mas tenha a vida eterna." (João 3:16)

DESENVOLVIMENTO

1. A Necessidade da Salvação: O Homem Perdido (Romanos 3:23)
"Pois todos pecaram e carecem da glória de Deus." Desde a queda de Adão (Gênesis 3:1-24), toda a humanidade está debaixo do pecado. A consequência do pecado é a morte espiritual (Romanos 6:23). O profeta Isaías declarou: "Todos nós andávamos desgarrados como ovelhas" (Isaías 53:6). Nenhuma obra humana pode salvar — "pela graça sois salvos, mediante a fé; e isto não vem de vós; é dom de Deus" (Efésios 2:8-9).

2. O Plano da Salvação: O Cordeiro de Deus (João 1:29)
"Eis o Cordeiro de Deus, que tira o pecado do mundo!" Desde o Antigo Testamento, Deus apontava para o sacrifício perfeito. O cordeiro pascal no Egito prefigurava Cristo (Êxodo 12:1-13). Isaías profetizou: "Ele foi traspassado pelas nossas transgressões e moído pelas nossas iniquidades" (Isaías 53:5). Jesus é o cumprimento de toda profecia messiânica (Lucas 24:44). Ele é o "único mediador entre Deus e os homens" (1 Timóteo 2:5).

3. O Preço da Salvação: O Sangue de Cristo (1 Pedro 1:18-19)
"Sabendo que não foi mediante coisas corruptíveis, como prata ou ouro, que fostes resgatados, mas pelo precioso sangue, como de cordeiro sem defeito e sem mácula, o sangue de Cristo." Na cruz, Jesus levou sobre si os nossos pecados (1 Pedro 2:24). Ele foi feito pecado por nós (2 Coríntios 5:21). O véu do templo se rasgou, abrindo acesso direto a Deus (Mateus 27:51; Hebreus 10:19-22). "Sem derramamento de sangue, não há remissão de pecados" (Hebreus 9:22).

4. O Resultado da Salvação: Nova Criatura (2 Coríntios 5:17)
"Se alguém está em Cristo, é nova criatura; as coisas antigas já passaram; eis que se fizeram novas." A salvação produz perdão total (Salmos 103:12), justificação diante de Deus (Romanos 5:1), adoção como filhos (Gálatas 4:4-7), selamento com o Espírito Santo (Efésios 1:13-14) e garantia de vida eterna (João 10:27-29).

CONCLUSÃO
A cruz não foi um acidente da história — foi o plano eterno de Deus para resgatar a humanidade (Atos 2:23; Apocalipse 13:8). Jesus disse: "Está consumado!" (João 19:30) — a obra da salvação está completa. Não há outro nome debaixo do céu pelo qual importa que sejamos salvos (Atos 4:12). Hoje é o dia da salvação (2 Coríntios 6:2). Se você confessar com a boca que Jesus é Senhor e crer no coração que Deus o ressuscitou dentre os mortos, será salvo (Romanos 10:9-10). A cruz é convite, é amor, é esperança — aceite-a hoje.`
  },
  {
    title: "Volta ao Primeiro Amor",
    theme: "Arrependimento",
    verse: "Apocalipse 2:4-5",
    content: `INTRODUÇÃO
A carta à igreja de Éfeso é um alerta para toda geração de cristãos. Uma igreja que tinha tudo — doutrina correta, perseverança, discernimento — mas havia perdido o essencial: o primeiro amor. Esta mensagem é um chamado urgente ao arrependimento e ao retorno apaixonado à presença de Deus.

"Tenho, porém, contra ti que abandonaste o teu primeiro amor. Lembra-te, pois, de onde caíste, arrepende-te e volta à prática das primeiras obras." (Apocalipse 2:4-5)

DESENVOLVIMENTO

1. O Diagnóstico Divino: O Amor Esfriou (Apocalipse 2:4)
Jesus reconhece as obras, o trabalho e a perseverança da igreja de Éfeso (Apocalipse 2:2-3), mas identifica uma falha fatal: "Abandonaste o teu primeiro amor." O ativismo religioso sem paixão por Cristo é vazio (1 Coríntios 13:1-3). Jesus profetizou que nos últimos tempos "o amor de muitos esfriará" (Mateus 24:12). Israel também abandonou seu primeiro amor: "Lembro-me de ti, da tua afeição quando noiva, do teu amor durante o noivado" (Jeremias 2:2).

2. O Chamado ao Arrependimento: Lembra-te e Arrepende-te (Apocalipse 2:5)
Jesus dá três imperativos: lembra-te, arrepende-te e volta. Lembrar-se é reconhecer de onde caiu — como o filho pródigo que "caiu em si" (Lucas 15:17). Arrepender-se é mudar de direção, é a metanoia — uma mudança radical de mente e coração (Atos 3:19). Deus promete: "Se o meu povo, que se chama pelo meu nome, se humilhar, orar e me buscar, e se converter dos seus maus caminhos, então eu ouvirei dos céus, perdoarei os seus pecados e sararei a sua terra" (2 Crônicas 7:14).

3. As Consequências da Impenitência (Apocalipse 2:5b)
"Se não, venho a ti e moverei do seu lugar o teu candelabro." O candelabro representa a presença e o testemunho da igreja. Uma igreja sem o primeiro amor perde sua luz (Mateus 5:14-16). Sansão perdeu a força do Espírito e "não sabia que o Senhor já se tinha retirado dele" (Juízes 16:20). Saul perdeu o reino por causa da desobediência (1 Samuel 15:22-23). O arrependimento não é opcional — é urgente.

4. A Restauração é Possível: Volta às Primeiras Obras (Apocalipse 2:5c)
Deus é o Deus da restauração. Ele promete: "Restituir-vos-ei os anos que foram consumidos" (Joel 2:25). Davi, após o pecado, clamou: "Cria em mim um coração puro e renova dentro em mim um espírito inabalável" (Salmos 51:10). Pedro foi restaurado após negar Jesus três vezes (João 21:15-17). O Senhor convida: "Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei" (Mateus 11:28).

CONCLUSÃO
O primeiro amor não é apenas emoção — é devoção, é prioridade, é intimidade com Cristo acima de tudo. Jesus está à porta e bate (Apocalipse 3:20). Ele não desistiu de você. O caminho de volta começa com humildade, arrependimento e rendição total. Como Davi, ore: "Restitui-me a alegria da tua salvação" (Salmos 51:12). Não permita que o candelabro da sua vida se apague. Volte ao primeiro amor — Cristo te espera de braços abertos, assim como o pai esperou o filho pródigo (Lucas 15:20).`
  },
  {
    title: "O Consolador Prometido",
    theme: "Espírito Santo",
    verse: "João 14:16-17",
    content: `INTRODUÇÃO
Na véspera da Sua crucificação, Jesus fez uma promessa extraordinária aos Seus discípulos: Ele não os deixaria órfãos. Enviaria outro Consolador — o Espírito Santo — que estaria com eles para sempre. Esta promessa se cumpriu no Pentecostes e continua se cumprindo na vida de cada crente até os dias de hoje.

"E eu rogarei ao Pai, e ele vos dará outro Consolador, a fim de que esteja para sempre convosco, o Espírito da verdade, que o mundo não pode receber, porque não o vê, nem o conhece; vós o conheceis, porque ele habita convosco e estará em vós." (João 14:16-17)

DESENVOLVIMENTO

1. O Espírito Santo é uma Pessoa Divina (Atos 5:3-4)
O Espírito Santo não é uma força impessoal — Ele é Deus. Pedro disse a Ananias: "Por que encheu Satanás o teu coração, para que mentisses ao Espírito Santo? Não mentiste aos homens, mas a Deus" (Atos 5:3-4). Ele tem personalidade: fala (Atos 13:2), ensina (João 14:26), guia (Romanos 8:14), intercede (Romanos 8:26-27), pode ser entristecido (Efésios 4:30) e resistido (Atos 7:51). Ele é a terceira Pessoa da Trindade, co-igual ao Pai e ao Filho (Mateus 28:19; 2 Coríntios 13:13).

2. O Espírito Santo Consola e Fortalece (Atos 9:31)
A palavra grega "Parakletos" significa "chamado para estar ao lado" — Consolador, Advogado, Ajudador. Ele consola nos momentos de dor (2 Coríntios 1:3-4), fortalece na fraqueza (Efésios 3:16), dá paz em meio à tempestade (Gálatas 5:22) e nos capacita para enfrentar toda adversidade (Zacarias 4:6). Elias, esgotado e deprimido, foi restaurado pelo toque de Deus (1 Reis 19:4-8).

3. O Espírito Santo Revela a Verdade (João 16:13)
"Quando vier, porém, o Espírito da verdade, ele vos guiará a toda a verdade." O Espírito Santo ilumina as Escrituras (1 Coríntios 2:10-12), convence o mundo do pecado, da justiça e do juízo (João 16:8), revela o futuro (João 16:13), e glorifica a Cristo (João 16:14). Paulo declara: "As coisas que os olhos não viram, nem os ouvidos ouviram, Deus no-las revelou pelo Espírito" (1 Coríntios 2:9-10).

4. O Espírito Santo Capacita para o Serviço (Atos 1:8)
"Recebereis poder, ao descer sobre vós o Espírito Santo, e sereis minhas testemunhas." O Espírito concede dons espirituais para edificação da Igreja (1 Coríntios 12:4-11): sabedoria, conhecimento, fé, curas, milagres, profecia, discernimento, línguas e interpretação. Ele capacitou Bezalel para a obra do tabernáculo (Êxodo 31:2-5), deu ousadia aos apóstolos (Atos 4:31), e continua operando sinais e maravilhas na Igreja (Hebreus 2:4).

CONCLUSÃO
O Espírito Santo é o maior presente que Jesus deixou para a Sua Igreja. Ele é o penhor da nossa herança eterna (Efésios 1:13-14), o selo da nossa salvação, e a garantia de que não estamos sozinhos. Paulo exorta: "Enchei-vos do Espírito" (Efésios 5:18). Não se contente com uma vida cristã morna e sem poder. Busque a plenitude do Espírito Santo, permita que Ele dirija seus passos, console seu coração e use você como instrumento nas mãos de Deus. O Consolador está aqui — abra seu coração e receba-O hoje (Lucas 11:13).`
  },
];

const SermonCard = ({ sermon: s }: { sermon: typeof sermons[number] }) => {
  const [expanded, setExpanded] = useState(false);
  const preview = s.content.split("\n").slice(0, 3).join(" ").slice(0, 150) + "...";

  return (
    <Card className="hover:shadow-celestial hover:border-celestial/30 transition-all">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-gold">
            <FileText className="h-5 w-5 text-background" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">{s.theme}</span>
            <h3 className="font-serif text-lg font-semibold mt-1">{s.title}</h3>
            <p className="text-xs text-muted-foreground mt-1 font-medium">{s.verse}</p>
          </div>
        </div>

        {!expanded && (
          <p className="text-sm text-muted-foreground mt-4">{preview}</p>
        )}

        {expanded && (
          <div className="mt-4 prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm text-foreground leading-relaxed">
            {s.content}
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="gap-1.5 text-muted-foreground">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {expanded ? "Recolher" : "Ler completo"}
          </Button>
          <ContentActions
            content={`${s.title}\nTema: ${s.theme}\nTexto Base: ${s.verse}\n\n${s.content}`}
            title={s.title}
            contentType="biblioteca"
            compact
          />
        </div>
      </CardContent>
    </Card>
  );
};

const Biblioteca = () => {
  const [searchParams] = useSearchParams();
  const activeTema = searchParams.get("tema") || "todos";

  return (
    <AnimatedPage className="container py-12">
      <AnimatedSection className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-bold mb-2">Biblioteca de <span className="text-gradient-gold">Mensagens</span></h1>
        <p className="text-muted-foreground">Pregações organizadas por temas com texto base, esboço e aplicação prática.</p>
      </AnimatedSection>

      <div className="mx-auto max-w-xl mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Buscar por tema ou título..." className="w-full rounded-lg border border-input bg-background px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((c) => (
          <Link key={c} to={c === "Todos" ? "/biblioteca" : `/biblioteca?tema=${c.toLowerCase()}`}>
            <span className={cn(
              "inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium transition-all cursor-pointer",
              activeTema === c.toLowerCase() || (c === "Todos" && activeTema === "todos")
                ? "bg-accent text-accent-foreground border-accent"
                : "border-border hover:bg-muted"
            )}>
              {c}
            </span>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {sermons.map((s) => (
          <SermonCard key={s.title} sermon={s} />
        ))}
      </div>
    </div>
  );
};

export default Biblioteca;
