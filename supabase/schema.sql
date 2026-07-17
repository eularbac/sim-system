-- =========================================================
-- Sistema Sim — schema inicial (MVP)
-- Rode este arquivo inteiro no SQL Editor do seu projeto Supabase.
-- Cada tabela usa Row Level Security: uma noiva só enxerga
-- e edita as próprias linhas (profile_id = auth.uid()).
-- =========================================================

-- ---------- PROFILES (dados do casamento de cada noiva) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome_noiva text,
  nome_noivo text,
  data_casamento date,
  local_casamento text,
  orcamento_total numeric,
  frase_ancora text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Noiva vê o próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Noiva edita o próprio perfil"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Noiva cria o próprio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Cria o perfil automaticamente quando alguém se cadastra
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nome_noiva)
  values (new.id, new.raw_user_meta_data->>'nome_noiva');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- SEATING TABLES (mesas) ----------
create table if not exists public.seating_tables (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  nome text not null default 'Mesa',
  capacidade int default 8,
  created_at timestamptz default now()
);

alter table public.seating_tables enable row level security;

create policy "Noiva gerencia as próprias mesas"
  on public.seating_tables for all
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

-- ---------- GUESTS (convidados) ----------
create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  nome text not null,
  proximidade text,               -- ex: Madrinha, Amigo, Família da noiva...
  faixa_etaria text default 'Adulto', -- Adulto | Criança
  convidado_status text default 'Não ainda', -- Não ainda | Convidado
  data_envio_convite date,
  rsvp text default 'Aguardando', -- Aguardando | Confirmado | Recusado
  restricoes_alimentares text,
  cartao_agradecimento text default 'A fazer',
  contato text,
  email text,
  endereco text,
  observacoes text,
  table_id uuid references public.seating_tables(id) on delete set null,
  created_at timestamptz default now()
);

alter table public.guests enable row level security;

create policy "Noiva gerencia os próprios convidados"
  on public.guests for all
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

-- ---------- BUDGET ITEMS (orçamento) ----------
create table if not exists public.budget_items (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  nome text not null,
  tipo_servico text,             -- Local, Buffet, Decoração, Fotografia...
  orcamento numeric default 0,
  custo_real numeric default 0,
  responsavel_pagamento text,
  fornecedor text,
  data_vencimento date,
  status text default 'Não pago', -- Não pago | Entrada | Segunda parcela | Pago
  observacoes text,
  created_at timestamptz default now()
);

alter table public.budget_items enable row level security;

create policy "Noiva gerencia o próprio orçamento"
  on public.budget_items for all
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

-- ---------- TASKS (lista de tarefas) ----------
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  nome text not null,
  feito boolean default false,
  data date,
  sugestao_tempo text,           -- ex: "12 a 10 meses antes"
  responsavel text,
  observacoes text,
  created_at timestamptz default now()
);

alter table public.tasks enable row level security;

create policy "Noiva gerencia as próprias tarefas"
  on public.tasks for all
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

-- ---------- Índices úteis ----------
create index if not exists idx_guests_profile on public.guests(profile_id);
create index if not exists idx_guests_table on public.guests(table_id);
create index if not exists idx_budget_profile on public.budget_items(profile_id);
create index if not exists idx_tasks_profile on public.tasks(profile_id);
create index if not exists idx_tables_profile on public.seating_tables(profile_id);
