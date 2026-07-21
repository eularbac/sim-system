-- =========================================================
-- Sistema Sim — migração 005: mural de inspiração de exemplo
-- Rode este arquivo no SQL Editor do Supabase (depois das migrações 001-004).
--
-- Adiciona 3 ilustrações originais (arco floral, mesa posta, bolo) ao mural
-- de inspiração de toda conta nova, como exemplo de uso do módulo. São
-- ilustrações em SVG geradas pelo próprio sistema — não dependem de link
-- externo, então nunca vão quebrar.
-- =========================================================

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

  insert into public.decor_inspiration (profile_id, image_url, nota)
  values
    (new.id, 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20300%20200%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fdf7f5%22/%3E%3Cpath%20d%3D%22M60%20190%20Q60%2040%20150%2040%20Q240%2040%20240%20190%22%20fill%3D%22none%22%20stroke%3D%22%238b9574%22%20stroke-width%3D%226%22%20stroke-linecap%3D%22round%22/%3E%3Cg%20fill%3D%22%23c97b84%22%3E%3Ccircle%20cx%3D%2262%22%20cy%3D%2260%22%20r%3D%229%22/%3E%3Ccircle%20cx%3D%2278%22%20cy%3D%2242%22%20r%3D%227%22/%3E%3Ccircle%20cx%3D%22238%22%20cy%3D%2260%22%20r%3D%229%22/%3E%3Ccircle%20cx%3D%22222%22%20cy%3D%2242%22%20r%3D%227%22/%3E%3C/g%3E%3Cg%20fill%3D%22%23c3703f%22%3E%3Ccircle%20cx%3D%2270%22%20cy%3D%2290%22%20r%3D%227%22/%3E%3Ccircle%20cx%3D%22230%22%20cy%3D%2290%22%20r%3D%227%22/%3E%3C/g%3E%3Cg%20fill%3D%22%23c9a565%22%3E%3Ccircle%20cx%3D%2266%22%20cy%3D%22120%22%20r%3D%226%22/%3E%3Ccircle%20cx%3D%22234%22%20cy%3D%22120%22%20r%3D%226%22/%3E%3C/g%3E%3Cpath%20d%3D%22M150%20170%20L150%20130%20M130%20150%20L170%20150%22%20stroke%3D%22%23a68d86%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22/%3E%3C/svg%3E', 'Arco floral para a cerimônia'),
    (new.id, 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20300%20200%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fbeee9%22/%3E%3Cellipse%20cx%3D%22150%22%20cy%3D%22120%22%20rx%3D%2270%22%20ry%3D%2216%22%20fill%3D%22none%22%20stroke%3D%22%233a2b28%22%20stroke-width%3D%222%22%20opacity%3D%220.5%22/%3E%3Ccircle%20cx%3D%22150%22%20cy%3D%22110%22%20r%3D%2234%22%20fill%3D%22%23fdf7f5%22%20stroke%3D%22%23c97b84%22%20stroke-width%3D%222%22/%3E%3Ccircle%20cx%3D%22150%22%20cy%3D%22110%22%20r%3D%2214%22%20fill%3D%22none%22%20stroke%3D%22%23c9a565%22%20stroke-width%3D%221.5%22/%3E%3Cpath%20d%3D%22M95%2090%20L95%20140%20M90%2090%20L90%20108%20M100%2090%20L100%20108%22%20stroke%3D%22%236b524c%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22/%3E%3Cpath%20d%3D%22M205%2090%20L205%20140%22%20stroke%3D%22%236b524c%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22/%3E%3Cellipse%20cx%3D%22205%22%20cy%3D%2290%22%20rx%3D%226%22%20ry%3D%224%22%20fill%3D%22none%22%20stroke%3D%22%236b524c%22%20stroke-width%3D%221.5%22/%3E%3Ccircle%20cx%3D%22150%22%20cy%3D%2270%22%20r%3D%2210%22%20fill%3D%22%23c97b84%22%20opacity%3D%220.6%22/%3E%3Ccircle%20cx%3D%22165%22%20cy%3D%2276%22%20r%3D%227%22%20fill%3D%22%23c3703f%22%20opacity%3D%220.6%22/%3E%3Ccircle%20cx%3D%22135%22%20cy%3D%2276%22%20r%3D%227%22%20fill%3D%22%238b9574%22%20opacity%3D%220.6%22/%3E%3C/svg%3E', 'Mesa posta para a recepção'),
    (new.id, 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20300%20200%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fdf7f5%22/%3E%3Crect%20x%3D%2295%22%20y%3D%22120%22%20width%3D%22110%22%20height%3D%2234%22%20rx%3D%224%22%20fill%3D%22%23fbeee9%22%20stroke%3D%22%23c97b84%22%20stroke-width%3D%222%22/%3E%3Crect%20x%3D%22112%22%20y%3D%2286%22%20width%3D%2276%22%20height%3D%2234%22%20rx%3D%224%22%20fill%3D%22%23fdf7f5%22%20stroke%3D%22%23c97b84%22%20stroke-width%3D%222%22/%3E%3Crect%20x%3D%22128%22%20y%3D%2254%22%20width%3D%2244%22%20height%3D%2232%22%20rx%3D%224%22%20fill%3D%22%23fbeee9%22%20stroke%3D%22%23c97b84%22%20stroke-width%3D%222%22/%3E%3Ccircle%20cx%3D%22150%22%20cy%3D%2248%22%20r%3D%225%22%20fill%3D%22%23c9a565%22/%3E%3Cg%20fill%3D%22%23c97b84%22%20opacity%3D%220.7%22%3E%3Ccircle%20cx%3D%22115%22%20cy%3D%22120%22%20r%3D%224%22/%3E%3Ccircle%20cx%3D%22185%22%20cy%3D%22120%22%20r%3D%224%22/%3E%3Ccircle%20cx%3D%22130%22%20cy%3D%2286%22%20r%3D%223.5%22/%3E%3Ccircle%20cx%3D%22170%22%20cy%3D%2286%22%20r%3D%223.5%22/%3E%3C/g%3E%3Cg%20fill%3D%22%238b9574%22%20opacity%3D%220.6%22%3E%3Ccircle%20cx%3D%22150%22%20cy%3D%22120%22%20r%3D%223%22/%3E%3Ccircle%20cx%3D%22150%22%20cy%3D%2286%22%20r%3D%223%22/%3E%3C/g%3E%3C/svg%3E', 'Referência de bolo de casamento');

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

  insert into public.vendors (profile_id, nome, servico, status, telefone, email, budget_item_id)
  values
    (new.id, 'Buffet Sabor & Arte', 'Alimentação', 'Contratado', '(61) 99999-0001', 'contato@buffetsaborarte.com.br', buffet_budget_id),
    (new.id, 'Espaço Jardim das Flores', 'Local (Espaço)', 'Em contato', '(61) 99999-0002', null, null),
    (new.id, 'Estúdio Luz & Registro', 'Fotografia', 'Orçamento recebido', '(61) 99999-0003', 'contato@luzeregistro.com.br', null);

  insert into public.attire (profile_id, item, categoria, preco, status, para_quem)
  values
    (new.id, 'Vestido de noiva', 'Noiva', 4500, 'Encomendado', 'Noiva'),
    (new.id, 'Terno azul-marinho', 'Noivo', 1800, 'Comprado', 'Noivo'),
    (new.id, 'Vestido rosé (madrinhas)', 'Madrinhas', 350, 'Ideia', 'Madrinhas');

  insert into public.wedding_party (profile_id, nome, papel, traje_definido)
  values
    (new.id, 'Ana Beatriz', 'Madrinha', true),
    (new.id, 'Rafael Souza', 'Padrinho', false),
    (new.id, 'Sofia', 'Dama', false);

  return new;
end;
$$ language plpgsql security definer;
