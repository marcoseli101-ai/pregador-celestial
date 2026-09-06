-- ============================================================
-- SCHEMA: Página "Bíblia" — Pregador.site
-- Rodar via Supabase SQL Editor ou migration da Lovable
-- ============================================================

-- Cache de explicações ("Me Explica") — chave única por
-- versículo + tradução, resposta IGUAL para todos os usuários.
create table if not exists bible_verse_explanations (
  ref_key text primary key,
  translation_code text not null,
  title text not null,
  resumo text not null default '',
  contexto_imediato text not null default '',
  observacoes_linguisticas text not null default '',
  referencias_cruzadas text not null default '',
  aplicacao_pratica text not null default '',
  fontes_para_estudo jsonb not null default '[]',
  formatted text not null default '',
  created_at timestamptz not null default now()
);

-- Cache de referências cruzadas
create table if not exists bible_cross_references (
  ref_key text primary key,
  "references" jsonb not null default '[]',
  created_at timestamptz not null default now()
);

-- Cache de temas sugeridos
create table if not exists bible_theme_suggestions (
  ref_key text primary key,
  themes jsonb not null default '[]',
  created_at timestamptz not null default now()
);

-- Marcações (highlights) — dado pessoal do usuário
create table if not exists bible_user_highlights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book text not null,
  chapter int not null,
  verse int not null,
  verse_end int,
  translation_code text not null,
  color text not null,
  created_at timestamptz not null default now(),
  unique (user_id, book, chapter, verse, translation_code)
);

-- Anotações pessoais
create table if not exists bible_user_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book text not null,
  chapter int not null,
  verse int not null,
  verse_end int,
  translation_code text not null,
  note_text text not null,
  updated_at timestamptz not null default now(),
  unique (user_id, book, chapter, verse, translation_code)
);

-- Controle de notificação de novidades: quais anúncios cada
-- usuário já viu (para não repetir o banner).
create table if not exists app_seen_announcements (
  user_id uuid not null references auth.users(id) on delete cascade,
  announcement_id text not null,
  seen_at timestamptz not null default now(),
  primary key (user_id, announcement_id)
);

-- RLS: dados pessoais (highlights, notes, seen_announcements) só
-- visíveis/editáveis pelo próprio usuário. Caches de conteúdo
-- teológico são públicos para leitura (SELECT), só a Edge Function
-- (via service role) escreve.
alter table bible_user_highlights enable row level security;
alter table bible_user_notes enable row level security;
alter table app_seen_announcements enable row level security;

create policy "own highlights" on bible_user_highlights
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own notes" on bible_user_notes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own seen announcements" on app_seen_announcements
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table bible_verse_explanations enable row level security;
alter table bible_cross_references enable row level security;
alter table bible_theme_suggestions enable row level security;

create policy "public read explanations" on bible_verse_explanations
  for select using (true);
create policy "public read cross references" on bible_cross_references
  for select using (true);
create policy "public read themes" on bible_theme_suggestions
  for select using (true);
