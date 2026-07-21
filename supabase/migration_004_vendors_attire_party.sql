-- =========================================================
-- Sistema Sim — migração 004: fornecedores, vestuário e padrinhos/madrinhas
-- Rode este arquivo no SQL Editor do Supabase (depois das migrações 001-003).
-- =========================================================

-- ---------- FORNECEDORES ----------
create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  nome text not null,
  servico text,                 -- Local, Buffet, Fotografia...
  status text default 'Não contatado', -- Não contatado | Em contato | Orçamento recebido | Contratado | Recusado
  endereco text,
  contato text,
  telefone text,
  email text,
  contrato_link text,
  o_que_foi_contratado text,
  observacoes text,
  budget_item_id uuid references public.budget_items(id) on delete set null,
  created_at timestamptz default now()
);
alter table public.vendors enable row level security;
create policy "Noiva gerencia fornecedores"
  on public.vendors for all
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- ---------- VESTUÁRIO ----------
create table if not exists public.attire (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  item text not null,
  categoria text,
  preco numeric,
  link text,
  status text default 'Ideia',  -- Ideia | Encomendado | Comprado | Alugado
  para_quem text,
  observacoes text,
  created_at timestamptz default now()
);
alter table public.attire enable row level security;
create policy "Noiva gerencia o vestuário"
  on public.attire for all
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- ---------- PADRINHOS, MADRINHAS, DAMAS E PAJENS ----------
create table if not exists public.wedding_party (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  nome text not null,
  papel text default 'Madrinha', -- Madrinha | Padrinho | Dama | Pajem
  contato text,
  traje_definido boolean default false,
  observacoes text,
  created_at timestamptz default now()
);
alter table public.wedding_party enable row level security;
create policy "Noiva gerencia padrinhos e madrinhas"
  on public.wedding_party for all
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create index if not exists idx_vendors_profile on public.vendors(profile_id);
create index if not exists idx_attire_profile on public.attire(profile_id);
create index if not exists idx_wedding_party_profile on public.wedding_party(profile_id);

-- ---------- Estender o seed automático do cadastro ----------
create or replace function public.handle_new_user()
returns trigger as $$
declare
  new_table_id uuid;
  buffet_budget_id uuid;
  tipo_cha text;
begin
  insert into public.profiles (id, nome_noiva, data_casamento)
  values (new.id, new.raw_user_meta_data->>'nome_noiva', current_date + interval '9 months');

  insert into public.seating_tables (profile_id, nome, capacidade)
  values (new.id, 'Mesa 1', 8)
  returning id into new_table_id;

  insert into public.guests (profile_id, nome, proximidade, faixa_etaria, convidado_status, rsvp, table_id)
  values
    (new.id, 'Ana Beatriz', 'Madrinha', 'Adulto', 'Convidado', 'Confirmado', new_table_id),
    (new.id, 'Carlos Eduardo', 'Amigo do casal', 'Adulto', 'Convidado', 'Aguardando', new_table_id),
    (new.id, 'Sofia (5 anos)', 'Sobrinha', 'Criança', 'Convidado', 'Confirmado', null);

  insert into public.budget_items (profile_id, nome, tipo_servico, orcamento, custo_real, status)
  values
    (new.id, 'Buffet', 'Alimentação', 15000, 0, 'Não pago'),
    (new.id, 'Fotografia e vídeo', 'Registro', 6000, 2000, 'Entrada'),
    (new.id, 'Decoração', 'Ambientação', 8000, 8000, 'Pago')
  returning id into buffet_budget_id;

  insert into public.tasks (profile_id, nome, feito, sugestao_tempo, responsavel)
  values
    (new.id, 'Fechar contrato com o local da festa', true, '12 a 10 meses antes', 'Noiva'),
    (new.id, 'Provar bolo e definir sabores', false, '4 a 3 meses antes', 'Noivos'),
    (new.id, 'Enviar convites', false, '3 meses antes', 'Noiva');

  insert into public.food_drink_checklist (profile_id, item, feito)
  values
    (new.id, 'Definir cardápio do jantar', true),
    (new.id, 'Escolher bebidas do open bar', false),
    (new.id, 'Alinhar restrições alimentares com o buffet', false);

  insert into public.gifts (profile_id, nome, categoria, faixa_preco, recebido)
  values
    (new.id, 'Jogo de panelas', 'Cozinha', 'R$ 150 a R$ 300', false),
    (new.id, 'Cota lua de mel', 'Experiência', 'A partir de R$ 50', false);

  insert into public.decor_checklist (profile_id, item, feito)
  values
    (new.id, 'Definir paleta de cores', true),
    (new.id, 'Escolher arranjos de mesa', false),
    (new.id, 'Alinhar iluminação com o local', false);

  insert into public.songs (profile_id, momento, musica, aprovado)
  values
    (new.id, 'Entrada da noiva', 'Perfect — Ed Sheeran', true),
    (new.id, 'Troca de alianças', 'A Thousand Years — Christina Perri', false),
    (new.id, '1ª dança', 'At Last — Etta James', false);

  insert into public.activity_ideas (profile_id, nome, status, custo_estimado)
  values
    (new.id, 'Cabine de fotos', 'Bora fazer', 1200),
    (new.id, 'Flash tattoo', 'Só ideia', 800);

  insert into public.documents (profile_id, nome, categoria)
  values
    (new.id, 'Orçamento do buffet (recebido)', 'Orçamento');

  insert into public.wedding_day_schedule (profile_id, horario, o_que, responsavel, etapa)
  values
    (new.id, '14:00', 'Making of da noiva', 'Fotógrafo', 'Antes da cerimônia'),
    (new.id, '17:00', 'Entrada da noiva', 'Cerimonialista', 'Cerimônia'),
    (new.id, '19:00', 'Abertura da pista', 'DJ', 'Recepção');

  insert into public.honeymoon_itinerary (profile_id, dia, atividade, local)
  values
    (new.id, 1, 'Check-in no resort', 'Maragogi, AL'),
    (new.id, 2, 'Passeio de barco nas piscinas naturais', 'Maragogi, AL');

  insert into public.honeymoon_checklist (profile_id, item, feito)
  values
    (new.id, 'Verificar validade do passaporte', true),
    (new.id, 'Contratar seguro viagem', false),
    (new.id, 'Trocar moeda / avisar o banco da viagem', false);

  foreach tipo_cha in array array['Chá Bar', 'Chá de Panela', 'Chá de Lingerie', 'Chá de Casa Nova']
  loop
    insert into public.shower_checklist (profile_id, tipo, item, feito)
    values
      (new.id, tipo_cha, 'Defina um orçamento', false),
      (new.id, tipo_cha, 'Monte a lista de convidados', false),
      (new.id, tipo_cha, 'Encontre um espaço ideal', false),
      (new.id, tipo_cha, 'Separe uma data e prepare os convites', false),
      (new.id, tipo_cha, 'Defina a decoração da festa', false),
      (new.id, tipo_cha, 'Monte um cardápio', false),
      (new.id, tipo_cha, 'Faça uma lista de presentes', false),
      (new.id, tipo_cha, 'Prepare as lembrancinhas', false),
      (new.id, tipo_cha, 'Organize algumas brincadeiras', false),
      (new.id, tipo_cha, 'Separe uma playlist especial', false);
  end loop;

  -- Fornecedores (o buffet já vinculado ao item de orçamento correspondente)
  insert into public.vendors (profile_id, nome, servico, status, telefone, email, budget_item_id)
  values
    (new.id, 'Buffet Sabor & Arte', 'Alimentação', 'Contratado', '(61) 99999-0001', 'contato@buffetsaborarte.com.br', buffet_budget_id),
    (new.id, 'Espaço Jardim das Flores', 'Local (Espaço)', 'Em contato', '(61) 99999-0002', null, null),
    (new.id, 'Estúdio Luz & Registro', 'Fotografia', 'Orçamento recebido', '(61) 99999-0003', 'contato@luzeregistro.com.br', null);

  -- Vestuário
  insert into public.attire (profile_id, item, categoria, preco, status, para_quem)
  values
    (new.id, 'Vestido de noiva', 'Noiva', 4500, 'Encomendado', 'Noiva'),
    (new.id, 'Terno azul-marinho', 'Noivo', 1800, 'Comprado', 'Noivo'),
    (new.id, 'Vestido rosé (madrinhas)', 'Madrinhas', 350, 'Ideia', 'Madrinhas');

  -- Padrinhos e madrinhas
  insert into public.wedding_party (profile_id, nome, papel, traje_definido)
  values
    (new.id, 'Ana Beatriz', 'Madrinha', true),
    (new.id, 'Rafael Souza', 'Padrinho', false),
    (new.id, 'Sofia', 'Dama', false);

  return new;
end;
$$ language plpgsql security definer;
