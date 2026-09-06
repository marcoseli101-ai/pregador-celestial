# Integração da nova página "Bíblia" — Pregador.site

## Estrutura entregue

```
bible-engine/
├── types.ts                        # tipos e interfaces
├── config/
│   ├── translations.ts             # as 13 traduções + notas de licença
│   └── theology.ts                 # mesma base doutrinária do gerador de esboços
├── core/
│   ├── verseRef.ts                 # referência de versículo + chave de cache
│   ├── bibleApiClient.ts           # busca o texto bíblico nas APIs gratuitas
│   ├── promptBuilder.ts            # prompts: explicação, referências, temas
│   ├── cache.ts                    # leitura/escrita no Supabase (cache fixo)
│   └── explanationEngine.ts        # orquestrador: cache-first, gera só se faltar
├── db/
│   └── schema.sql                  # tabelas do Supabase (rodar uma vez)
├── functions/
│   └── bible-verse-tools.ts        # Edge Function única para todas as ferramentas
├── AnnouncementBanner.tsx          # banner de novidades (React)
└── index.ts                        # exports
```

## Passo a passo

### 1. Rodar o schema do banco
Copie o conteúdo de `db/schema.sql` e rode no **Supabase SQL Editor**
(ou peça pra Lovable/Antigravity rodar como migration). Isso cria:
- `bible_verse_explanations`, `bible_cross_references`,
  `bible_theme_suggestions` — caches públicos de leitura, escritos só
  pela Edge Function;
- `bible_user_highlights`, `bible_user_notes` — dados pessoais, com
  RLS (cada usuário só vê os seus);
- `app_seen_announcements` — controla o banner de novidades.

### 2. Colar os arquivos
Cole a pasta `bible-engine/` na raiz do projeto (mesma estrutura de
subpastas), e o arquivo `functions/bible-verse-tools.ts` como
`supabase/functions/bible-verse-tools/index.ts`.

### 3. Configurar secrets
No Supabase, confirme que a Edge Function tem acesso a:
- `LOVABLE_API_KEY` (mesma chave usada no restante do site)
- `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` (para escrever no cache
  ignorando RLS — só a função usa a service role, nunca o frontend)

### 4. Renomear a página
Troque o rótulo do menu/rota de "Estudo Bíblico" para **"Bíblia"** no
frontend (`src/`).

### 5. Frontend — menu único de ferramentas
Ao selecionar um versículo, mostre um único menu com:
`Comparar` · `Me Explica` · `Referências` · `Marcar` · `Temas` · `Anotar` · `Copiar`

Cada botão chama a Edge Function `bible-verse-tools` com uma `action`
diferente, todas usando o mesmo corpo de referência:

```json
{
  "action": "explain",
  "book": "mateus",
  "bookLabel": "Mateus",
  "chapter": 22,
  "verse": 1,
  "translationCode": "ARC"
}
```

| Ferramenta | action | Observação |
|---|---|---|
| Ver versículo | `get_verse` | busca o texto puro na tradução atual |
| Comparar | `compare` | manda `compareWith: ["ARA"]` ao tocar num chip — **nunca todas de uma vez**, a menos que `compareAll: true` seja enviado por pedido explícito do usuário |
| Me Explica | `explain` | cache-first: primeira vez gera e salva, depois sempre retorna o mesmo texto salvo |
| Referências | `cross_references` | cache-first, busca em toda a Bíblia |
| Temas | `suggest_themes` | cache-first, temas específicos daquele versículo |
| Marcar | — | grava direto em `bible_user_highlights` via Supabase client (dado pessoal, sem IA) |
| Anotar | — | grava direto em `bible_user_notes` |

### 6. Banner de novidades
Importe `AnnouncementBanner` no layout principal do app (onde o
usuário autenticado já está disponível):

```tsx
import { AnnouncementBanner } from "@/bible-engine/AnnouncementBanner";

<AnnouncementBanner supabase={supabase} userId={user?.id ?? null} />
```

Ele aparece uma vez por usuário e some ao clicar em "Entendi". Para
anunciar uma futura atualização, basta trocar o `id` em
`CURRENT_ANNOUNCEMENT` (um id novo = banner aparece de novo pra todos).

## Pontos de atenção

- **Licença das traduções**: ARC, AA e KJV têm uso mais tranquilo. NVI,
  NAA, NTLH, NVT, ACF, ARA, KJA e Ave Maria pertencem a sociedades
  bíblicas/editoras — a `attributionNote` em `translations.ts` já
  identifica isso. Recomendo exibir essa atribuição de forma discreta
  perto do seletor de versão. Isso não é uma opinião jurídica formal;
  se o site crescer muito em tráfego, vale conversa direta com as
  sociedades bíblicas.
- **"Me Explica" nunca cita literalmente** obras como Dake ou Beacon —
  reflete a linha teológica delas e as lista como fonte de estudo,
  conforme `config/theology.ts` (`CITATION_POLICY`). Isso evita
  problema de direitos autorais e mantém a resposta genuinamente sua.
- **Resposta fixa por versão**: a chave de cache é
  `livro.capítulo.verso__TRADUÇÃO` — todo mundo que pedir "Me Explica"
  em Mateus 22:1 na ARC recebe exatamente o mesmo texto salvo.
- **Mesmo motor de IA do site**: as três funções de IA (explicar,
  referências, temas) usam a mesma chamada à Lovable AI Gateway (Gemini)
  que o gerador de esboços, mantendo a mesma base doutrinária
  (`THEOLOGICAL_ALIGNMENT`).
