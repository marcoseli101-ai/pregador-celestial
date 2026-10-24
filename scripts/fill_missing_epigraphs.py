import json

MISSING_TITLES = {
    ("Gênesis", 2): "O descanso de Deus no sétimo dia e o princípio da criação",
    ("Gênesis", 5): "A genealogia dos patriarcas de Adão até Noé",
    ("Gênesis", 7): "A entrada na arca e o início do grande dilúvio",
    ("Gênesis", 8): "As águas diminuem e Noé sai da arca",
    ("Gênesis", 9): "A bênção divina e a aliança do arco-íris com Noé",
    ("Gênesis", 19): "Os anjos em Sodoma e a fuga de Ló",
    ("Gênesis", 28): "Isaque abençoa Jacó e o envia a Padã-Arã",
    ("Gênesis", 30): "O nascimento dos filhos de Jacó em Padã-Arã",
    ("Gênesis", 44): "A taça de prata no saco de Benjamim e a aflição dos irmãos",
    ("Gênesis", 47): "A família de Jacó estabelece-se na fértil terra de Gósen",
    ("Gênesis", 50): "O sepultamento honroso de Jacó e a morte de José",
    ("Êxodo", 36): "A edificação do Tabernáculo e a liberalidade do povo",
    ("Levítico", 5): "As leis sobre as ofertas pelas culpas e transgressões",
    ("Levítico", 6): "As ordenanças dos sacrifícios e o ministério dos sacerdotes",
    ("Números", 24): "Balaão profetiza a glória da estrela que sairá de Jacó",
    ("Deuteronômio", 11): "A grandeza dos feitos de Deus e o chamado à fidelidade",
    ("Josué", 4): "As doze pedras memoriais erguidas na travessia do Jordão",
    ("1 Samuel", 7): "A arca em Quiriate-Jearim e a grande vitória em Mizpá",
    ("2 Samuel", 3): "A guerra entre a casa de Davi e a casa de Saul",
    ("2 Samuel", 16): "A fuga de Davi, a perfídia de Ziba e os ultrajes de Simei",
    ("2 Samuel", 17): "O conselho astuto de Aitofel e a prudência de Husai",
    ("2 Samuel", 18): "A batalha na floresta de Efraim e a morte trágica de Absalão",
    ("2 Samuel", 19): "O pranto enternecido de Davi e o seu retorno a Jerusalém",
    ("1 Reis", 16): "A sucessão dos reis de Israel e o reinado ímpio de Acabe",
    ("1 Crônicas", 20): "A tomada da cidade de Rabá e a vitória sobre os gigantes filisteus",
    ("2 Crônicas", 5): "A arca da aliança entra no Templo e a glória do Senhor enche o santuário",
    ("2 Crônicas", 11): "O reinado de Roboão e a consagração dos levitas fiéis",
    ("2 Crônicas", 12): "A invasão de Sisaque do Egito e o arrependimento de Judá",
    ("Neemias", 10): "O selamento solene do pacto de santidade com Deus",
    ("Jó", 28): "O supremo hino ao valor inestimável da sabedoria divina",
    ("Jó", 30): "O lamento comovente de Jó diante de sua humilhação presente",
    ("Jó", 31): "O testemunho solene e a declaração da integridade de Jó",
    ("Jó", 39): "A soberania de Deus revelada no cuidado às criaturas selvagens",
    ("Jó", 40): "A majestade inigualável de Deus e o poder de Beemote",
    ("Jó", 41): "A grandeza inabalável do Criador manifesta no Leviatã",
    ("Provérbios", 23): "Preceitos de sabedoria sobre prudência, pureza e moderação",
    ("Provérbios", 24): "A edificação da casa com sabedoria e a força da retidão",
    ("Provérbios", 26): "Advertências contra a insensatez, a preguiça e a intriga",
    ("Provérbios", 27): "Conselhos práticos sobre a amizade leal, a prudência e o trabalho",
    ("Provérbios", 28): "A coragem dos retos e a miséria espiritual dos ímpios",
    ("Provérbios", 29): "O discernimento na liderança e as bênçãos da submissão a Deus",
    ("Isaías", 3): "O julgamento do Senhor sobre os líderes orgulhosos de Jerusalém",
    ("Isaías", 14): "A profecia sobre a queda do rei da Babilônia e o consolo de Israel",
    ("Isaías", 16): "O lamento profético e o apelo à misericórdia para com Moabe",
    ("Isaías", 20): "O sinal profético de Isaías sobre a vergonha do Egito e da Etiópia",
    ("Isaías", 32): "O governo justo do Messias e o derramamento restaurador do Espírito",
    ("Isaías", 64): "A oração fervorosa pelo rasgar dos céus e a confissão de pecados",
    ("Jeremias", 4): "O apelo ao arrependimento interior e a visão da ruína iminente",
    ("Jeremias", 5): "A apostasia desenfreada de Judá e a necessidade do juízo",
    ("Jeremias", 6): "O cerco iminente sobre Jerusalém e o desprezo pelas veredas antigas",
    ("Jeremias", 8): "A dor profunda do profeta pela cegueira espiritual do povo",
    ("Jeremias", 9): "Lamento pelas infidelidades e a suprema glória em conhecer ao Senhor",
    ("Jeremias", 10): "O contraste radiante entre o Deus vivo e os falsos ídolos",
    ("Jeremias", 12): "A oração de Jeremias sobre a prosperidade dos injustos",
    ("Jeremias", 15): "A firmeza no chamado profético e o amparo de Deus na aflição",
    ("Jeremias", 16): "O sinal da solidão de Jeremias e a promessa do grande resgate futuro",
    ("Jeremias", 17): "A fonte das águas vivas e a cura do coração enganoso",
    ("Jeremias", 19): "A botija de barro despedaçada como sinal da ruína de Jerusalém",
    ("Jeremias", 20): "A perseguição sofrida por Jeremias e o fogo consumidor no coração",
    ("Jeremias", 22): "As sentenças proféticas sobre os reis injustos de Judá",
    ("Jeremias", 28): "O embate no templo com Hananias e o cumprimento da palavra do Senhor",
    ("Jeremias", 31): "A esperança radiante de Israel e o anúncio da Nova Aliança perpétua",
    ("Jeremias", 51): "A sentença irrevogável do Todo-Poderoso contra a Babilônia",
    ("Ezequiel", 3): "O comissionamento solene do profeta como atalaia vigilante de Israel",
    ("Zacarias", 10): "A chuva serôdia do Senhor e o fortalecimento do rebanho aflito",
    ("Malaquias", 2): "A advertência aos ministros e a repreensão à deslealdade da aliança",
    ("Malaquias", 3): "O mensageiro da aliança, o fogo purificador e os dízimos no templo",
    ("João", 19): "O julgamento perante Pilatos, a crucificação e o sepultamento de Jesus",
    ("1 Coríntios", 11): "A ordem digna no culto e a solene celebração da Ceia do Senhor",
    ("2 Coríntios", 2): "O perdão fraterno ao arrependido e o bom aroma de Cristo no mundo",
    ("Hebreus", 5): "Cristo, o Sumo Sacerdote misericordioso segundo a ordem de Melquisedeque",
}

def main():
    json_path = "src/data/bibleEpigraphs.json"
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    for (book, ch), title in MISSING_TITLES.items():
        if book not in data:
            data[book] = {}
        ch_str = str(ch)
        if ch_str not in data[book]:
            data[book][ch_str] = {}
        # Ensure verse 1 has this title if not set
        if "1" not in data[book][ch_str]:
            data[book][ch_str]["1"] = title

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    total_chapters = sum(len(chs) for chs in data.values())
    total_epigraphs = sum(sum(len(vs) for vs in chs.values()) for chs in data.values())
    print(f"Updated: {len(data)} books, {total_chapters} chapters, {total_epigraphs} epigraphs total.")

if __name__ == '__main__':
    main()
