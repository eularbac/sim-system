-- =========================================================
-- Sistema Sim — migração 003: chás + dados de exemplo
-- Rode este arquivo no SQL Editor do Supabase (depois das migrações 001 e 002).
--
-- O que este arquivo faz:
-- 1. Cria a tabela "shower_checklist", usada pelos 4 módulos de chá
--    (Chá Bar, Chá de Panela, Chá de Lingerie, Chá de Casa Nova).
-- 2. Reescreve a função que roda quando uma noiva se cadastra, pra que ela
--    já preencha TODOS os módulos com alguns exemplos editáveis — assim
--    quem se cadastra já entende como usar cada tela, e pode editar ou
--    apagar os exemplos livremente.
-- =========================================================

-- ---------- CHÁS (Bar, Panela, Lingerie, Casa Nova) ----------
create table if not exists public.shower_checklist (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  tipo text not null, -- 'Chá Bar' | 'Chá de Panela' | 'Chá de Lingerie' | 'Chá de Casa Nova'
  item text not null,
  feito boolean default false,
  created_at timestamptz default now()
);
alter table public.shower_checklist enable row level security;
create policy "Noiva gerencia os chás"
  on public.shower_checklist for all
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create index if not exists idx_shower_profile on public.shower_checklist(profile_id);
create index if not exists idx_shower_tipo on public.shower_checklist(tipo);

-- ---------- Seed automático no cadastro ----------
create or replace function public.handle_new_user()
returns trigger as $$
declare
  new_table_id uuid;
  tipo_cha text;
begin
  -- Perfil
  insert into public.profiles (id, nome_noiva, data_casamento)
  values (new.id, new.raw_user_meta_data->>'nome_noiva', current_date + interval '9 months');

  -- Mesa de exemplo
  insert into public.seating_tables (profile_id, nome, capacidade)
  values (new.id, 'Mesa 1', 8)
  returning id into new_table_id;

  -- Convidados de exemplo
  insert into public.guests (profile_id, nome, proximidade, faixa_etaria, convidado_status, rsvp, table_id)
  values
    (new.id, 'Ana Beatriz', 'Madrinha', 'Adulto', 'Convidado', 'Confirmado', new_table_id),
    (new.id, 'Carlos Eduardo', 'Amigo do casal', 'Adulto', 'Convidado', 'Aguardando', new_table_id),
    (new.id, 'Sofia (5 anos)', 'Sobrinha', 'Criança', 'Convidado', 'Confirmado', null);

  -- Orçamento de exemplo
  insert into public.budget_items (profile_id, nome, tipo_servico, orcamento, custo_real, status)
  values
    (new.id, 'Buffet', 'Alimentação', 15000, 0, 'Não pago'),
    (new.id, 'Fotografia e vídeo', 'Registro', 6000, 2000, 'Entrada'),
    (new.id, 'Decoração', 'Ambientação', 8000, 8000, 'Pago');

  -- Tarefas de exemplo
  insert into public.tasks (profile_id, nome, feito, sugestao_tempo, responsavel)
  values
    (new.id, 'Fechar contrato com o local da festa', true, '12 a 10 meses antes', 'Noiva'),
    (new.id, 'Provar bolo e definir sabores', false, '4 a 3 meses antes', 'Noivos'),
    (new.id, 'Enviar convites', false, '3 meses antes', 'Noiva');

  -- Comes e bebes
  insert into public.food_drink_checklist (profile_id, item, feito)
  values
    (new.id, 'Definir cardápio do jantar', true),
    (new.id, 'Escolher bebidas do open bar', false),
    (new.id, 'Alinhar restrições alimentares com o buffet', false);

  -- Presentes
  insert into public.gifts (profile_id, nome, categoria, faixa_preco, recebido)
  values
    (new.id, 'Jogo de panelas', 'Cozinha', 'R$ 150 a R$ 300', false),
    (new.id, 'Cota lua de mel', 'Experiência', 'A partir de R$ 50', false);

  -- Decoração
  insert into public.decor_checklist (profile_id, item, feito)
  values
    (new.id, 'Definir paleta de cores', true),
    (new.id, 'Escolher arranjos de mesa', false),
    (new.id, 'Alinhar iluminação com o local', false);

  -- Músicas
  insert into public.songs (profile_id, momento, musica, aprovado)
  values
    (new.id, 'Entrada da noiva', 'Perfect — Ed Sheeran', true),
    (new.id, 'Troca de alianças', 'A Thousand Years — Christina Perri', false),
    (new.id, '1ª dança', 'At Last — Etta James', false);

  -- Ideias de atividades
  insert into public.activity_ideas (profile_id, nome, status, custo_estimado)
  values
    (new.id, 'Cabine de fotos', 'Bora fazer', 1200),
    (new.id, 'Flash tattoo', 'Só ideia', 800);

  -- Documentos
  insert into public.documents (profile_id, nome, categoria)
  values
    (new.id, 'Orçamento do buffet (recebido)', 'Orçamento');

  -- Cronograma do dia
  insert into public.wedding_day_schedule (profile_id, horario, o_que, responsavel, etapa)
  values
    (new.id, '14:00', 'Making of da noiva', 'Fotógrafo', 'Antes da cerimônia'),
    (new.id, '17:00', 'Entrada da noiva', 'Cerimonialista', 'Cerimônia'),
    (new.id, '19:00', 'Abertura da pista', 'DJ', 'Recepção');

  -- Lua de mel
  insert into public.honeymoon_itinerary (profile_id, dia, atividade, local)
  values
    (new.id, 1, 'Check-in no resort', 'Maragogi, AL'),
    (new.id, 2, 'Passeio de barco nas piscinas naturais', 'Maragogi, AL');

  insert into public.honeymoon_checklist (profile_id, item, feito)
  values
    (new.id, 'Verificar validade do passaporte', true),
    (new.id, 'Contratar seguro viagem', false),
    (new.id, 'Trocar moeda / avisar o banco da viagem', false);

  -- Chás — mesmo checklist de 10 passos para os 4 tipos
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

  return new;
end;
$$ language plpgsql security definer;

-- o trigger "on_auth_user_created" já existe (criado em schema.sql) e continua
-- apontando pra essa mesma função — não precisa recriar o trigger.
