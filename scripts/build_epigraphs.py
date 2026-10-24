import urllib.request
import urllib.parse
import json
import time
import re
import os

EN_TO_PT_BOOKS = {
    "Genesis": "Gênesis",
    "Exodus": "Êxodo",
    "Leviticus": "Levítico",
    "Numbers": "Números",
    "Deuteronomy": "Deuteronômio",
    "Joshua": "Josué",
    "Judges": "Juízes",
    "Ruth": "Rute",
    "1 Samuel": "1 Samuel",
    "2 Samuel": "2 Samuel",
    "1 Kings": "1 Reis",
    "2 Kings": "2 Reis",
    "1 Chronicles": "1 Crônicas",
    "2 Chronicles": "2 Crônicas",
    "Ezra": "Esdras",
    "Nehemiah": "Neemias",
    "Esther": "Ester",
    "Job": "Jó",
    "Psalms": "Salmos",
    "Proverbs": "Provérbios",
    "Ecclesiastes": "Eclesiastes",
    "Song of Solomon": "Cantares",
    "Isaiah": "Isaías",
    "Jeremiah": "Jeremias",
    "Lamentations": "Lamentações",
    "Ezekiel": "Ezequiel",
    "Daniel": "Daniel",
    "Hosea": "Oséias",
    "Joel": "Joel",
    "Amos": "Amós",
    "Obadiah": "Obadias",
    "Jonah": "Jonas",
    "Micah": "Miquéias",
    "Nahum": "Naum",
    "Habakkuk": "Habacuque",
    "Zephaniah": "Sofonias",
    "Haggai": "Ageu",
    "Zechariah": "Zacarias",
    "Malachi": "Malaquias",
    "Matthew": "Mateus",
    "Mark": "Marcos",
    "Luke": "Lucas",
    "John": "João",
    "Acts": "Atos",
    "Romans": "Romanos",
    "1 Corinthians": "1 Coríntios",
    "2 Corinthians": "2 Coríntios",
    "Galatians": "Gálatas",
    "Ephesians": "Efésios",
    "Philippians": "Filipenses",
    "Colossians": "Colossenses",
    "1 Thessalonians": "1 Tessalonicenses",
    "2 Thessalonians": "2 Tessalonicenses",
    "1 Timothy": "1 Timóteo",
    "2 Timothy": "2 Timóteo",
    "Titus": "Tito",
    "Philemon": "Filemom",
    "Hebrews": "Hebreus",
    "James": "Tiago",
    "1 Peter": "1 Pedro",
    "2 Peter": "2 Pedro",
    "1 John": "1 João",
    "2 John": "2 João",
    "3 John": "3 João",
    "Jude": "Judas",
    "Revelation": "Apocalipse",
}

PSALM_TITLES = {
    1: "A felicidade dos justos e o castigo dos ímpios",
    2: "O reino soberano do Ungido do Senhor",
    3: "Oração matutina de confiança em Deus",
    4: "Oração vespertina de paz e segurança",
    5: "Oração pedindo orientação e proteção contra os ímpios",
    6: "Oração de um enfermo pedindo a misericórdia de Deus",
    7: "Oração do justo que confia na justiça de Deus",
    8: "A glória do Criador e a dignidade do homem",
    9: "Ação de graças pela justiça de Deus contra os opressores",
    10: "Oração pelo livramento dos pobres e abatidos",
    11: "O Senhor é o refúgio do justo",
    12: "Oração contra a falsidade e os homens ímpios",
    13: "Até quando, Senhor? Da angústia à confiança",
    14: "A loucura e a corrupção do ateísmo prático",
    15: "Quem habitará no santuário do Senhor?",
    16: "A herança gloriosa dos servos de Deus",
    17: "Oração por livramento e justiça",
    18: "Hino de louvor e gratidão pelas vitórias concedidas por Deus",
    19: "A glória de Deus na criação e a perfeição da Sua Palavra",
    20: "Oração pelo rei e pelo triunfo em tempo de batalha",
    21: "Ação de graças pela vitória concedida pelo Senhor",
    22: "O sofrimento do Justo e o triunfo do reino messiânico",
    23: "O Senhor é o meu pastor; nada me faltará",
    24: "O Rei da Glória e o Criador de toda a terra",
    25: "Oração por perdão, guia e proteção",
    26: "Declaração de integridade e confiança no Senhor",
    27: "O Senhor é a minha luz e a minha salvação",
    28: "Súplica por socorro e louvor pela resposta divina",
    29: "A majestade e o poder soberano da voz do Senhor",
    30: "Ação de graças pelo livramento da morte",
    31: "Nas tuas mãos entrego o meu espírito",
    32: "A bênção do perdão dos pecados e a alegria da justificação",
    33: "Louvor à soberania, bondade e fidelidade do Criador",
    34: "Provai e vede que o Senhor é bom: louvor pelo livramento",
    35: "Súplica de livramento contra os perseguidores",
    36: "A maldade humana e a infinita misericórdia de Deus",
    37: "Não te indignes por causa dos malfeitores: confia no Senhor",
    38: "Oração penitente de um pecador aflito",
    39: "A brevidade da vida humana e a oração por socorro",
    40: "Esperei com paciência no Senhor: louvor e obediência",
    41: "Bem-aventurado aquele que acode ao necessitado",
    42: "Como a corça suspira pelas correntes das águas: sede de Deus",
    43: "Envia a tua luz e a tua verdade para me guiar",
    44: "Lamento nacional e apelo pela redenção de Deus",
    45: "O cântico das núpcias reais e a beleza do Rei eterno",
    46: "Deus é o nosso refúgio e fortaleza, socorro bem presente",
    47: "O Senhor é o grande Rei sobre toda a terra",
    48: "A glória e a segurança de Sião, a cidade do grande Rei",
    49: "A ilusão e a vaidade das riquezas terrenas",
    50: "O julgamento do Deus verdadeiro sobre o culto formal",
    51: "Cria em mim, ó Deus, um coração puro: a oração de Davi",
    52: "A futilidade da vanglória do homem mau",
    53: "A insensatez do homem sem Deus",
    54: "Salva-me, ó Deus, pelo teu nome poderoso",
    55: "Lamento contra a traição de um amigo íntimo",
    56: "Em Deus ponho a minha confiança; não temerei o que o homem me possa fazer",
    57: "À sombra das tuas asas me refugiarei até que passem as calamidades",
    58: "Repreensão contra os juízes corruptos da terra",
    59: "Oração por livramento contra inimigos sanguinários",
    60: "Lamento em tempo de derrota militar e súplica de restauração",
    61: "Leva-me para a rocha que é mais alta do que eu",
    62: "Somente em Deus descansa a minha alma",
    63: "A tua graça é melhor do que a vida: sede de Deus no deserto",
    64: "Proteção contra os conspiradores ocultos",
    65: "O louvor a Deus que ouve a oração e abençoa a colheita",
    66: "Aclamai a Deus com brados de júbilo: testemunho das Suas maravilhas",
    67: "Que todos os povos te louvem, ó Deus: bênção às nações",
    68: "Levanta-te, ó Deus, e sejam dispersos os teus inimigos",
    69: "Salva-me, ó Deus, porque as águas me sobem até à alma",
    70: "Apressa-te, ó Deus, em me livrar",
    71: "Em ti, Senhor, confio na minha velhice",
    72: "O reinado justo, próspero e eterno do Messias",
    73: "A prosperidade dos ímpios e a comunhão suprema com Deus",
    74: "Lamento pela destruição do templo e súplica de socorro",
    75: "Deus é o supremo e soberano Juiz",
    76: "A majestade e o juízo invencível de Deus em Sião",
    77: "Consolo nas horas escuras através da lembrança dos feitos de Deus",
    78: "As lições da história de Israel: a infidelidade do homem e a graça divina",
    79: "Lamento pela profanação de Jerusalém",
    80: "Restaura-nos, ó Deus, e faze resplandecer o teu rosto",
    81: "Exortação ao louvor e à obediência na festa sagrada",
    82: "Deus julga os magistrados e governantes injustos",
    83: "Súplica contra a conspiração das nações inimigas",
    84: "Quão amáveis são os teus tabernáculos, Senhor dos Exércitos",
    85: "Oração pela restauração e a união da misericórdia com a verdade",
    86: "Inclina, Senhor, os teus ouvidos e responde-me: oração de Davi",
    87: "A glória de Sião, a mãe de todas as nações",
    88: "Clamor no abismo do sofrimento e da escuridão",
    89: "A fidelidade da aliança perpétua de Deus com a casa de Davi",
    90: "De eternidade a eternidade, tu és Deus: a oração de Moisés",
    91: "A segurança daquele que habita no esconderijo do Altíssimo",
    92: "Bom é louvar ao Senhor: o florescimento do justo como a palmeira",
    93: "O Senhor reina vestido de majestade eterna",
    94: "O Deus da justiça e da consolação nas aflições",
    95: "Vinde, cantemos ao Senhor: convite à adoração e advertência",
    96: "Cantai ao Senhor um cântico novo: o Rei de toda a criação",
    97: "O Senhor reina: a terra se regozije na Sua justiça",
    98: "Cantai ao Senhor porque Ele fez maravilhas",
    99: "O Senhor reina: Ele é santo e exalta a retidão",
    100: "Celebrai com júbilo ao Senhor: hino de ações de graças",
    101: "O voto de santidade e integridade do governante",
    102: "Oração do aflito e a eternidade imutável do Senhor",
    103: "Bendize, ó minha alma, ao Senhor e não te esqueças de Seus benefícios",
    104: "Hino de louvor à grandiosidade e sabedoria de Deus na criação",
    105: "A fidelidade de Deus na aliança com Abraão e na história de Israel",
    106: "A confissão dos pecados do povo e a perseverante misericórdia de Deus",
    107: "Rendei graças ao Senhor porque Ele é bom: livramentos dos remidos",
    108: "Firme está o meu coração: louvor e confiança na vitória",
    109: "Súplica contra o acusador e a traição: oração por socorro",
    110: "Disse o Senhor ao meu Senhor: o Sacerdote e Rei eterno",
    111: "Grandes são as obras do Senhor: o princípio da sabedoria é o temor a Deus",
    112: "A felicidade e as bênçãos daquele que teme ao Senhor",
    113: "Do nascer ao pôr do sol seja louvado o nome do Senhor",
    114: "O poder do Deus de Jacó na saída de Israel do Egito",
    115: "Não a nós, Senhor, mas ao teu nome dá glória",
    116: "Amo o Senhor porque Ele ouve a minha voz e as minhas súplicas",
    117: "Louvai ao Senhor, vós todas as nações: a fidelidade eterna de Deus",
    118: "Rendei graças ao Senhor: a pedra que os construtores rejeitaram",
    119: "As excelências, perfeições e maravilhas da Palavra de Deus",
    120: "Clamor pela paz no meio de homens enganadores",
    121: "Elevo os meus olhos para os montes: de onde me virá o socorro?",
    122: "Alegrei-me quando me disseram: Vamos à casa do Senhor",
    123: "Como os olhos dos servos olham para as mãos do seu senhor: misericórdia",
    124: "Se não fora o Senhor que esteve ao nosso lado: o laço quebrou-se",
    125: "Os que confiam no Senhor são como o monte de Sião",
    126: "Quando o Senhor restaurou a nossa sorte: ficamos como quem sonha",
    127: "Se o Senhor não edificar a casa, em vão trabalham os que a edificam",
    128: "Bem-aventurado aquele que teme ao Senhor e anda nos Seus caminhos",
    129: "Muitas vezes me angustiaram desde a minha mocidade: o livramento de Deus",
    130: "Das profundezas clamo a ti, Senhor: no Senhor há perdão",
    131: "O sossego e a humildade da alma como criança desmamada",
    132: "A promessa de Deus a Davi e a habitação perpétua em Sião",
    133: "Quão bom e quão suave é que os irmãos vivam em união",
    134: "Bendizei ao Senhor nas horas da noite no santuário",
    135: "Louvor à grandeza e soberania do Deus vivo sobre os ídolos das nações",
    136: "Porque a Sua misericórdia dura para sempre: a grande litania de louvor",
    137: "Junto aos rios da Babilônia nos assentamos a chorar: a memória de Sião",
    138: "Ação de graças pelo cumprimento da promessa e pela fidelidade divina",
    139: "Senhor, tu me sondas e me conheces: a onisciência e onipresença de Deus",
    140: "Livra-me, Senhor, do homem violento e perverso",
    141: "Suba a minha oração como incenso perante ti: guarda a minha boca",
    142: "Com a minha voz clamei ao Senhor: oração na caverna",
    143: "Ouve a minha oração, Senhor: ensina-me a fazer a tua vontade",
    144: "Bendito seja o Senhor, minha rocha, que adestra as minhas mãos para a peleja",
    145: "Exaltar-te-ei, ó Deus meu e Rei: louvor à bondade e ao reino eterno de Deus",
    146: "Aleluia! Não confieis em príncipes: o Deus de Jacó é o nosso refúgio",
    147: "Louvai ao Senhor: Ele edifica Jerusalém e sara os quebrantados de coração",
    148: "Louvai ao Senhor desde os céus e desde a terra: todo o cosmos o adore",
    149: "Cantai ao Senhor um cântico novo: o louvor dos santos",
    150: "Tudo o que tem fôlego louve ao Senhor: o grande final do Saltério",
}

def translate_batch(batch):
    text = '\n'.join(batch)
    q = urllib.parse.quote(text)
    url = f'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q={q}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        res = urllib.request.urlopen(req, timeout=12).read().decode('utf-8')
        res_json = json.loads(res)
        translated_full = ''.join(part[0] for part in res_json[0])
        lines = [l.strip() for l in translated_full.split('\n')]
        if len(lines) == len(batch):
            return lines
    except Exception as e:
        print(f"Batch translation error: {e}")
    return None

def translate_single(text):
    q = urllib.parse.quote(text)
    url = f'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q={q}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        res = urllib.request.urlopen(req, timeout=8).read().decode('utf-8')
        res_json = json.loads(res)
        return ''.join(part[0] for part in res_json[0]).strip()
    except Exception as e:
        return text

def main():
    with open('pericopes_raw.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Total pericopes loaded: {len(data)}")

    cache_file = 'translations_cache.json'
    translations = {}
    if os.path.exists(cache_file):
        with open(cache_file, 'r', encoding='utf-8') as f:
            translations = json.load(f)
        print(f"Loaded {len(translations)} existing translations from cache.")

    # Specific biblical fixes
    translations["The Creation of the Heavens and the Earth"] = "A criação dos céus e da terra"
    translations["The Fall of Man"] = "A desobediência e a queda do homem"
    translations["The Flood"] = "O dilúvio sobre a terra"
    translations["The Noahic Covenant"] = "A aliança de Deus com Noé"
    translations["The Tower of Babel"] = "A torre de Babel e a confusão das línguas"
    translations["The Call of Abram"] = "O chamado de Abraão e a promessa de Deus"
    translations["The Faith of Abram"] = "A aliança de Deus com Abraão e a justificação pela fé"
    translations["Sodom and Gomorrah"] = "A destruição de Sodoma e Gomorra"
    translations["The Sacrifice of Isaac"] = "O sacrifício de Isaque e a provisão divina no monte"
    translations["Korah, Dathan, and Abiram"] = "A rebelião de Corá, Datã e Abirão"
    translations["The Earth Swallows and Fire Consumes"] = "A terra se abre e o fogo de Deus consome os rebeldes"
    translations["Aaron Halts the Plague"] = "A queixa do povo e a intercessão de Arão para cessar a praga"

    needed = [d['Pericope'] for d in data if d['Pericope'] not in translations and not d['Reference Start'].startswith('Psalms')]
    unique_needed = list(dict.fromkeys(needed))
    print(f"Unique pericopes needing translation: {len(unique_needed)}")

    batch_size = 35
    for i in range(0, len(unique_needed), batch_size):
        chunk = unique_needed[i:i + batch_size]
        print(f"Translating chunk {i+1} to {min(i+batch_size, len(unique_needed))} of {len(unique_needed)}...")
        translated = translate_batch(chunk)
        if translated:
            for orig, tr in zip(chunk, translated):
                translations[orig] = tr
        else:
            for orig in chunk:
                translations[orig] = translate_single(orig)
                time.sleep(0.05)

        with open(cache_file, 'w', encoding='utf-8') as f:
            json.dump(translations, f, ensure_ascii=False, indent=2)
        time.sleep(0.15)

    print("All pericopes translated!")

    # Build structured epigraph database
    # Record<bookName, Record<chapter, Record<verse, string>>>
    database = {}

    for d in data:
        ref_start = d['Reference Start']
        # e.g. "Genesis 1:1" or "1 Samuel 3:1"
        m = re.match(r'^(.*?)\s+(\d+):(\d+)$', ref_start)
        if not m:
            continue
        en_book, ch, v = m.group(1), int(m.group(2)), int(m.group(3))
        pt_book = EN_TO_PT_BOOKS.get(en_book, en_book)

        if pt_book not in database:
            database[pt_book] = {}
        if ch not in database[pt_book]:
            database[pt_book][ch] = {}

        if pt_book == "Salmos":
            continue

        raw_title = d['Pericope']
        pt_title = translations.get(raw_title, raw_title)
        database[pt_book][ch][v] = pt_title

    # Insert all 150 Psalms
    if "Salmos" not in database:
        database["Salmos"] = {}
    for ch, title in PSALM_TITLES.items():
        database["Salmos"][ch] = {1: title}

    print(f"Generated epigraphs for {len(database)} books.")
    total_chapters = sum(len(chs) for chs in database.values())
    total_epigraphs = sum(sum(len(vs) for vs in chs.values()) for chs in database.values())
    print(f"Total chapters: {total_chapters}, Total epigraphs: {total_epigraphs}")

    # Write JSON artifact
    out_json = "src/data/bibleEpigraphs.json"
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(database, f, ensure_ascii=False, indent=2)
    print(f"Saved {out_json}")

    # Write TypeScript module
    ts_content = f'''// Auto-generated comprehensive biblical epigraphs database
// Covers all 66 books of the Bible and all chapters
import epigraphsData from "./bibleEpigraphs.json";

export type EpigraphMap = Record<string, Record<string, Record<string, string>>>;

export const BIBLE_EPIGRAPHS: EpigraphMap = epigraphsData as unknown as EpigraphMap;

export function getVerseEpigraph(bookName: string, chapter: number, verse: number): string | null {{
  if (!bookName || !chapter || !verse) return null;
  const bookMap = BIBLE_EPIGRAPHS[bookName];
  if (!bookMap) return null;
  const chapterMap = bookMap[String(chapter)];
  if (!chapterMap) return null;
  return chapterMap[String(verse)] || null;
}}

export function getChapterEpigraphs(bookName: string, chapter: number): Record<number, string> {{
  if (!bookName || !chapter) return {{}};
  const bookMap = BIBLE_EPIGRAPHS[bookName];
  if (!bookMap) return {{}};
  const chapterMap = bookMap[String(chapter)];
  if (!chapterMap) return {{}};
  const result: Record<number, string> = {{}};
  for (const [vStr, title] of Object.entries(chapterMap)) {{
    result[Number(vStr)] = title;
  }}
  return result;
}}
'''
    with open("src/data/bibleEpigraphs.ts", "w", encoding="utf-8") as f:
        f.write(ts_content)
    print("Saved src/data/bibleEpigraphs.ts")

if __name__ == '__main__':
    main()
