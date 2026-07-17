-- =========================================================
-- Sistema Sim — migração 002: módulos restantes
-- Rode este arquivo no SQL Editor do Supabase (depois do schema.sql).
-- =========================================================

-- ---------- COMES E BEBES (checklist com o buffet) ----------
create table if not exists public.food_drink_checklist (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  item text not null,
  feito boolean default false,
  observacoes text,
  created_at timestamptz default now()
);
alter table public.food_drink_checklist enable row level security;
create policy "Noiva gerencia comes e bebes"
  on public.food_drink_checklist for all
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- ---------- LISTA DE PRESENTES ----------
create table if not exists public.gifts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  nome text not null,
  categoria text,
  link text,
  faixa_preco text,
  comprado_por text,
  recebido boolean default false,
  created_at timestamptz default now()
);
alter table public.gifts enable row level security;
create policy "Noiva gerencia a lista de presentes"
  on public.gifts for all
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- ---------- DECORAÇÃO (checklist + mural de inspiração) ----------
create table if not exists public.decor_checklist (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  item text not null,
  feito boolean default false,
  created_at timestamptz default now()
);
alter table public.decor_checklist enable row level security;
create policy "Noiva gerencia checklist de decoração"
  on public.decor_checklist for all
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create table if not exists public.decor_inspiration (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  image_url text not null,
  nota text,
  created_at timestamptz default now()
);
alter table public.decor_inspiration enable row level security;
create policy "Noiva gerencia mural de inspiração"
  on public.decor_inspiration for all
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- ---------- MÚSICAS E NOVAS IDEIAS ----------
create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  momento text,               -- Entrada da noiva, Alianças, 1ª dança...
  musica text not null,
  link text,
  aprovado boolean default false,
  created_at timestamptz default now()
);
alter table public.songs enable row level security;
create policy "Noiva gerencia as músicas"
  on public.songs for all
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create table if not exists public.activity_ideas (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  nome text not null,
  status text default 'Só ideia', -- Só ideia | Por que não | Bora fazer
  custo_estimado numeric,
  created_at timestamptz default now()
);
alter table public.activity_ideas enable row level security;
create policy "Noiva gerencia ideias de atividades"
  on public.activity_ideas for all
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- ---------- DOCUMENTOS ----------
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  nome text not null,
  categoria text,             -- Orçamento recebido, Contrato assinado, Documento legal...
  link text,
  observacoes text,
  created_at timestamptz default now()
);
alter table public.documents enable row level security;
create policy "Noiva gerencia documentos"
  on public.documents for all
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- ---------- DIA DO CASAMENTO (cronograma) ----------
create table if not exists public.wedding_day_schedule (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  horario text,
  o_que text not null,
  responsavel text,
  etapa text default 'Antes da cerimônia', -- Antes da cerimônia | Cerimônia | Recepção
  created_at timestamptz default now()
);
alter table public.wedding_day_schedule enable row level security;
create policy "Noiva gerencia o cronograma do dia"
  on public.wedding_day_schedule for all
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- ---------- LUA DE MEL ----------
create table if not exists public.honeymoon_itinerary (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  dia int,
  atividade text not null,
  local text,
  created_at timestamptz default now()
);
alter table public.honeymoon_itinerary enable row level security;
create policy "Noiva gerencia roteiro da lua de mel"
  on public.honeymoon_itinerary for all
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create table if not exists public.honeymoon_checklist (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  item text not null,
  feito boolean default false,
  created_at timestamptz default now()
);
alter table public.honeymoon_checklist enable row level security;
create policy "Noiva gerencia checklist da lua de mel"
  on public.honeymoon_checklist for all
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- ---------- Índices ----------
create index if not exists idx_food_drink_profile on public.food_drink_checklist(profile_id);
create index if not exists idx_gifts_profile on public.gifts(profile_id);
create index if not exists idx_decor_checklist_profile on public.decor_checklist(profile_id);
create index if not exists idx_decor_inspiration_profile on public.decor_inspiration(profile_id);
create index if not exists idx_songs_profile on public.songs(profile_id);
create index if not exists idx_activities_profile on public.activity_ideas(profile_id);
create index if not exists idx_documents_profile on public.documents(profile_id);
create index if not exists idx_schedule_profile on public.wedding_day_schedule(profile_id);
create index if not exists idx_honeymoon_itinerary_profile on public.honeymoon_itinerary(profile_id);
create index if not exists idx_honeymoon_checklist_profile on public.honeymoon_checklist(profile_id);
