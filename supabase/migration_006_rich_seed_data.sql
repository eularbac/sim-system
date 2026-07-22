-- =========================================================
-- Sistema Sim — migração 006: preenchimento rico (10+ itens por módulo)
-- Rode este arquivo no SQL Editor do Supabase (depois das migrações 001-005).
--
-- Substitui a função de "boas-vindas" por uma versão bem mais completa:
-- cada módulo nasce com pelo menos 10 itens de exemplo (orçamento com DJ,
-- banda, buffet, iluminação, palco etc. já incluídos e vinculados aos
-- fornecedores correspondentes). Só vale para contas criadas depois de
-- rodar esta migração.
-- =========================================================

create or replace function public.handle_new_user()
returns trigger as $$
declare
  table1_id uuid;
  table2_id uuid;
  table3_id uuid;
  tipo_cha text;

  budget_buffet_id uuid;
  budget_bebidas_id uuid;
  budget_bolo_id uuid;
  budget_dj_id uuid;
  budget_banda_id uuid;
  budget_iluminacao_id uuid;
  budget_palco_id uuid;
  budget_decoracao_id uuid;
  budget_fotografia_id uuid;
  budget_video_id uuid;
  budget_local_id uuid;
  budget_papelaria_id uuid;
begin
  -- Perfil
  insert into public.profiles (id, nome_noiva, data_casamento)
  values (new.id, new.raw_user_meta_data->>'nome_noiva', current_date + interval '9 months');

  -- Mesas
  insert into public.seating_tables (profile_id, nome, capacidade) values (new.id, 'Mesa 1', 8) returning id into table1_id;
  insert into public.seating_tables (profile_id, nome, capacidade) values (new.id, 'Mesa 2', 8) returning id into table2_id;
  insert into public.seating_tables (profile_id, nome, capacidade) values (new.id, 'Mesa 3', 10) returning id into table3_id;

  -- Convidados (10)
  insert into public.guests (profile_id, nome, proximidade, faixa_etaria, convidado_status, rsvp, table_id)
  values
    (new.id, 'Ana Beatriz', 'Madrinha', 'Adulto', 'Convidado', 'Confirmado', table1_id),
    (new.id, 'Rafael Souza', 'Padrinho', 'Adulto', 'Convidado', 'Confirmado', table1_id),
    (new.id, 'Carlos Eduardo', 'Amigo do casal', 'Adulto', 'Convidado', 'Aguardando', table1_id),
    (new.id, 'Fernanda Lima', 'Prima da noiva', 'Adulto', 'Convidado', 'Confirmado', table2_id),
    (new.id, 'Juliana Alves', 'Amiga da noiva', 'Adulto', 'Convidado', 'Confirmado', table2_id),
    (new.id, 'Pedro Henrique', 'Amigo do noivo', 'Adulto', 'Convidado', 'Aguardando', table2_id),
    (new.id, 'Sofia (5 anos)', 'Sobrinha', 'Criança', 'Convidado', 'Confirmado', null),
    (new.id, 'Miguel (7 anos)', 'Sobrinho', 'Criança', 'Convidado', 'Confirmado', null),
    (new.id, 'Roberto Nogueira', 'Tio do noivo', 'Adulto', 'Convidado', 'Recusado', null),
    (new.id, 'Marta Nogueira', 'Tia do noivo', 'Adulto', 'Convidado', 'Aguardando', table3_id);

  -- Orçamento (12 itens, cobrindo DJ, banda, buffet, iluminação, palco, bebidas...)
  insert into public.budget_items (profile_id, nome, tipo_servico, orcamento, custo_real, status) values
    (new.id, 'Buffet', 'Alimentação', 15000, 5000, 'Entrada') returning id into budget_buffet_id;
  insert into public.budget_items (profile_id, nome, tipo_servico, orcamento, custo_real, status) values
    (new.id, 'Bebidas / Open bar', 'Bebidas', 4000, 0, 'Não pago') returning id into budget_bebidas_id;
  insert into public.budget_items (profile_id, nome, tipo_servico, orcamento, custo_real, status) values
    (new.id, 'Bolo e mesa de doces', 'Alimentação', 2500, 2500, 'Pago') returning id into budget_bolo_id;
  insert into public.budget_items (profile_id, nome, tipo_servico, orcamento, custo_real, status) values
    (new.id, 'DJ', 'Som e animação', 3500, 3500, 'Pago') returning id into budget_dj_id;
  insert into public.budget_items (profile_id, nome, tipo_servico, orcamento, custo_real, status) values
    (new.id, 'Banda ao vivo', 'Som e animação', 6000, 1500, 'Entrada') returning id into budget_banda_id;
  insert into public.budget_items (profile_id, nome, tipo_servico, orcamento, custo_real, status) values
    (new.id, 'Iluminação', 'Ambientação', 3000, 0, 'Não pago') returning id into budget_iluminacao_id;
  insert into public.budget_items (profile_id, nome, tipo_servico, orcamento, custo_real, status) values
    (new.id, 'Palco e som', 'Estrutura', 4500, 2000, 'Entrada') returning id into budget_palco_id;
  insert into public.budget_items (profile_id, nome, tipo_servico, orcamento, custo_real, status) values
    (new.id, 'Decoração', 'Ambientação', 8000, 8000, 'Pago') returning id into budget_decoracao_id;
  insert into public.budget_items (profile_id, nome, tipo_servico, orcamento, custo_real, status) values
    (new.id, 'Fotografia', 'Registro', 6000, 2000, 'Entrada') returning id into budget_fotografia_id;
  insert into public.budget_items (profile_id, nome, tipo_servico, orcamento, custo_real, status) values
    (new.id, 'Vídeo', 'Registro', 4000, 0, 'Não pago') returning id into budget_video_id;
  insert into public.budget_items (profile_id, nome, tipo_servico, orcamento, custo_real, status) values
    (new.id, 'Local (espaço)', 'Estrutura', 12000, 12000, 'Pago') returning id into budget_local_id;
  insert into public.budget_items (profile_id, nome, tipo_servico, orcamento, custo_real, status) values
    (new.id, 'Convites e papelaria', 'Papelaria', 1200, 1200, 'Pago') returning id into budget_papelaria_id;

  -- Tarefas (10)
  insert into public.tasks (profile_id, nome, feito, sugestao_tempo, responsavel) values
    (new.id, 'Fechar contrato com o local da festa', true, '12 a 10 meses antes', 'Noiva'),
    (new.id, 'Contratar buffet', true, '10 a 8 meses antes', 'Noivos'),
    (new.id, 'Contratar fotógrafo e videomaker', true, '10 a 8 meses antes', 'Noiva'),
    (new.id, 'Contratar DJ ou banda', true, '8 a 6 meses antes', 'Noivo'),
    (new.id, 'Provar bolo e definir sabores', false, '4 a 3 meses antes', 'Noivos'),
    (new.id, 'Enviar convites', false, '3 meses antes', 'Noiva'),
    (new.id, 'Confirmar fornecedores', false, '2 meses antes', 'Noivo'),
    (new.id, 'Fazer prova do vestido', false, '2 meses antes', 'Noiva'),
    (new.id, 'Definir cardápio final com o buffet', false, '1 mês antes', 'Noivos'),
    (new.id, 'Confirmar lista de convidados final', false, '1 semana antes', 'Noiva');

  -- Comes e bebes (10)
  insert into public.food_drink_checklist (profile_id, item, feito) values
    (new.id, 'Definir cardápio do jantar', true),
    (new.id, 'Escolher bebidas do open bar', false),
    (new.id, 'Alinhar restrições alimentares com o buffet', false),
    (new.id, 'Provar o menu degustação', true),
    (new.id, 'Definir bolo e mesa de doces', true),
    (new.id, 'Escolher vinhos para o brinde', false),
    (new.id, 'Confirmar quantidade de convidados com o buffet', false),
    (new.id, 'Definir welcome drink', false),
    (new.id, 'Alinhar horário de servir o jantar', false),
    (new.id, 'Escolher bar de drinks especiais', false);

  -- Lista de presentes (10)
  insert into public.gifts (profile_id, nome, categoria, faixa_preco, recebido) values
    (new.id, 'Jogo de panelas', 'Cozinha', 'R$ 150 a R$ 300', false),
    (new.id, 'Cota lua de mel', 'Experiência', 'A partir de R$ 50', false),
    (new.id, 'Jogo de cama casal', 'Quarto', 'R$ 100 a R$ 250', false),
    (new.id, 'Liquidificador', 'Cozinha', 'R$ 80 a R$ 150', false),
    (new.id, 'Aparelho de jantar', 'Cozinha', 'R$ 200 a R$ 400', false),
    (new.id, 'Air fryer', 'Cozinha', 'R$ 250 a R$ 450', true),
    (new.id, 'Jogo de toalhas', 'Banheiro', 'R$ 60 a R$ 120', false),
    (new.id, 'Cafeteira', 'Cozinha', 'R$ 150 a R$ 300', false),
    (new.id, 'Kit churrasco', 'Área externa', 'R$ 100 a R$ 200', false),
    (new.id, 'Cota reforma da casa nova', 'Casa nova', 'A partir de R$ 50', false);

  -- Decoração — checklist (10)
  insert into public.decor_checklist (profile_id, item, feito) values
    (new.id, 'Definir paleta de cores', true),
    (new.id, 'Escolher arranjos de mesa', false),
    (new.id, 'Alinhar iluminação com o local', false),
    (new.id, 'Definir toalhas e guardanapos', false),
    (new.id, 'Escolher arco/altar da cerimônia', true),
    (new.id, 'Definir centro de mesa', false),
    (new.id, 'Escolher tipo de piso/tapete', false),
    (new.id, 'Definir letreiro/luminoso', false),
    (new.id, 'Escolher velas e objetos decorativos', false),
    (new.id, 'Alinhar decoração com o buffet', false);

  -- Decoração — mural de inspiração (6 ilustrações originais)
  insert into public.decor_inspiration (profile_id, image_url, nota) values
    (new.id, 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20300%20200%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fdf7f5%22/%3E%3Cpath%20d%3D%22M60%20190%20Q60%2040%20150%2040%20Q240%2040%20240%20190%22%20fill%3D%22none%22%20stroke%3D%22%238b9574%22%20stroke-width%3D%226%22%20stroke-linecap%3D%22round%22/%3E%3Cg%20fill%3D%22%23c97b84%22%3E%3Ccircle%20cx%3D%2262%22%20cy%3D%2260%22%20r%3D%229%22/%3E%3Ccircle%20cx%3D%2278%22%20cy%3D%2242%22%20r%3D%227%22/%3E%3Ccircle%20cx%3D%22238%22%20cy%3D%2260%22%20r%3D%229%22/%3E%3Ccircle%20cx%3D%22222%22%20cy%3D%2242%22%20r%3D%227%22/%3E%3C/g%3E%3Cg%20fill%3D%22%23c3703f%22%3E%3Ccircle%20cx%3D%2270%22%20cy%3D%2290%22%20r%3D%227%22/%3E%3Ccircle%20cx%3D%22230%22%20cy%3D%2290%22%20r%3D%227%22/%3E%3C/g%3E%3Cg%20fill%3D%22%23c9a565%22%3E%3Ccircle%20cx%3D%2266%22%20cy%3D%22120%22%20r%3D%226%22/%3E%3Ccircle%20cx%3D%22234%22%20cy%3D%22120%22%20r%3D%226%22/%3E%3C/g%3E%3Cpath%20d%3D%22M150%20170%20L150%20130%20M130%20150%20L170%20150%22%20stroke%3D%22%23a68d86%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22/%3E%3C/svg%3E', 'Arco floral para a cerimônia'),
    (new.id, 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20300%20200%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fbeee9%22/%3E%3Cellipse%20cx%3D%22150%22%20cy%3D%22120%22%20rx%3D%2270%22%20ry%3D%2216%22%20fill%3D%22none%22%20stroke%3D%22%233a2b28%22%20stroke-width%3D%222%22%20opacity%3D%220.5%22/%3E%3Ccircle%20cx%3D%22150%22%20cy%3D%22110%22%20r%3D%2234%22%20fill%3D%22%23fdf7f5%22%20stroke%3D%22%23c97b84%22%20stroke-width%3D%222%22/%3E%3Ccircle%20cx%3D%22150%22%20cy%3D%22110%22%20r%3D%2214%22%20fill%3D%22none%22%20stroke%3D%22%23c9a565%22%20stroke-width%3D%221.5%22/%3E%3Cpath%20d%3D%22M95%2090%20L95%20140%20M90%2090%20L90%20108%20M100%2090%20L100%20108%22%20stroke%3D%22%236b524c%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22/%3E%3Cpath%20d%3D%22M205%2090%20L205%20140%22%20stroke%3D%22%236b524c%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22/%3E%3Cellipse%20cx%3D%22205%22%20cy%3D%2290%22%20rx%3D%226%22%20ry%3D%224%22%20fill%3D%22none%22%20stroke%3D%22%236b524c%22%20stroke-width%3D%221.5%22/%3E%3Ccircle%20cx%3D%22150%22%20cy%3D%2270%22%20r%3D%2210%22%20fill%3D%22%23c97b84%22%20opacity%3D%220.6%22/%3E%3Ccircle%20cx%3D%22165%22%20cy%3D%2276%22%20r%3D%227%22%20fill%3D%22%23c3703f%22%20opacity%3D%220.6%22/%3E%3Ccircle%20cx%3D%22135%22%20cy%3D%2276%22%20r%3D%227%22%20fill%3D%22%238b9574%22%20opacity%3D%220.6%22/%3E%3C/svg%3E', 'Mesa posta para a recepção'),
    (new.id, 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20300%20200%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fdf7f5%22/%3E%3Crect%20x%3D%2295%22%20y%3D%22120%22%20width%3D%22110%22%20height%3D%2234%22%20rx%3D%224%22%20fill%3D%22%23fbeee9%22%20stroke%3D%22%23c97b84%22%20stroke-width%3D%222%22/%3E%3Crect%20x%3D%22112%22%20y%3D%2286%22%20width%3D%2276%22%20height%3D%2234%22%20rx%3D%224%22%20fill%3D%22%23fdf7f5%22%20stroke%3D%22%23c97b84%22%20stroke-width%3D%222%22/%3E%3Crect%20x%3D%22128%22%20y%3D%2254%22%20width%3D%2244%22%20height%3D%2232%22%20rx%3D%224%22%20fill%3D%22%23fbeee9%22%20stroke%3D%22%23c97b84%22%20stroke-width%3D%222%22/%3E%3Ccircle%20cx%3D%22150%22%20cy%3D%2248%22%20r%3D%225%22%20fill%3D%22%23c9a565%22/%3E%3Cg%20fill%3D%22%23c97b84%22%20opacity%3D%220.7%22%3E%3Ccircle%20cx%3D%22115%22%20cy%3D%22120%22%20r%3D%224%22/%3E%3Ccircle%20cx%3D%22185%22%20cy%3D%22120%22%20r%3D%224%22/%3E%3Ccircle%20cx%3D%22130%22%20cy%3D%2286%22%20r%3D%223.5%22/%3E%3Ccircle%20cx%3D%22170%22%20cy%3D%2286%22%20r%3D%223.5%22/%3E%3C/g%3E%3Cg%20fill%3D%22%238b9574%22%20opacity%3D%220.6%22%3E%3Ccircle%20cx%3D%22150%22%20cy%3D%22120%22%20r%3D%223%22/%3E%3Ccircle%20cx%3D%22150%22%20cy%3D%2286%22%20r%3D%223%22/%3E%3C/g%3E%3C/svg%3E', 'Referência de bolo de casamento'),
    (new.id, 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20300%20200%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fbeee9%22/%3E%3Cpath%20d%3D%22M150%20190%20L150%20110%22%20stroke%3D%22%238b9574%22%20stroke-width%3D%224%22%20stroke-linecap%3D%22round%22/%3E%3Cpath%20d%3D%22M150%20190%20L130%20120%22%20stroke%3D%22%238b9574%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22/%3E%3Cpath%20d%3D%22M150%20190%20L170%20120%22%20stroke%3D%22%238b9574%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22/%3E%3Cg%20fill%3D%22%23c97b84%22%3E%3Ccircle%20cx%3D%22150%22%20cy%3D%2280%22%20r%3D%2220%22/%3E%3Ccircle%20cx%3D%22122%22%20cy%3D%2295%22%20r%3D%2214%22/%3E%3Ccircle%20cx%3D%22178%22%20cy%3D%2295%22%20r%3D%2214%22/%3E%3C/g%3E%3Cg%20fill%3D%22%23c3703f%22%20opacity%3D%220.8%22%3E%3Ccircle%20cx%3D%22135%22%20cy%3D%2265%22%20r%3D%2210%22/%3E%3Ccircle%20cx%3D%22165%22%20cy%3D%2265%22%20r%3D%2210%22/%3E%3C/g%3E%3Cg%20fill%3D%22%23c9a565%22%20opacity%3D%220.8%22%3E%3Ccircle%20cx%3D%22150%22%20cy%3D%2255%22%20r%3D%228%22/%3E%3C/g%3E%3Cpath%20d%3D%22M138%20150%20Q150%20160%20162%20150%20L158%20172%20Q150%20176%20142%20172%20Z%22%20fill%3D%22%23c97b84%22/%3E%3C/svg%3E', 'Buquê de referência'),
    (new.id, 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20300%20200%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fdf7f5%22/%3E%3Ccircle%20cx%3D%22130%22%20cy%3D%22100%22%20r%3D%2238%22%20fill%3D%22none%22%20stroke%3D%22%23c9a565%22%20stroke-width%3D%226%22/%3E%3Ccircle%20cx%3D%22172%22%20cy%3D%22100%22%20r%3D%2238%22%20fill%3D%22none%22%20stroke%3D%22%23c97b84%22%20stroke-width%3D%226%22/%3E%3Ccircle%20cx%3D%22172%22%20cy%3D%2266%22%20r%3D%225%22%20fill%3D%22%23c97b84%22/%3E%3Cg%20stroke%3D%22%23a68d86%22%20stroke-width%3D%221.5%22%20opacity%3D%220.5%22%3E%3Cpath%20d%3D%22M90%20150%20q10%2010%2020%200%22%20fill%3D%22none%22/%3E%3Cpath%20d%3D%22M190%20150%20q10%2010%2020%200%22%20fill%3D%22none%22/%3E%3C/g%3E%3C/svg%3E', 'Alianças e detalhes'),
    (new.id, 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20300%20200%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fbeee9%22/%3E%3Crect%20x%3D%2280%22%20y%3D%2245%22%20width%3D%22140%22%20height%3D%22110%22%20rx%3D%224%22%20fill%3D%22%23fdf7f5%22%20stroke%3D%22%23c97b84%22%20stroke-width%3D%222%22/%3E%3Cpath%20d%3D%22M80%2045%20L150%20100%20L220%2045%22%20fill%3D%22none%22%20stroke%3D%22%23c97b84%22%20stroke-width%3D%222%22/%3E%3Cline%20x1%3D%22110%22%20y1%3D%22125%22%20x2%3D%22190%22%20y2%3D%22125%22%20stroke%3D%22%23a68d86%22%20stroke-width%3D%221.5%22/%3E%3Cline%20x1%3D%22120%22%20y1%3D%22135%22%20x2%3D%22180%22%20y2%3D%22135%22%20stroke%3D%22%23a68d86%22%20stroke-width%3D%221.5%22/%3E%3Ccircle%20cx%3D%22150%22%20cy%3D%2280%22%20r%3D%226%22%20fill%3D%22%23c9a565%22/%3E%3C/svg%3E', 'Modelo de convite');

  -- Músicas (10)
  insert into public.songs (profile_id, momento, musica, aprovado) values
    (new.id, 'Entrada da noiva', 'Perfect — Ed Sheeran', true),
    (new.id, 'Troca de alianças', 'A Thousand Years — Christina Perri', false),
    (new.id, 'Saída da cerimônia', 'Marry You — Bruno Mars', false),
    (new.id, '1ª dança', 'At Last — Etta James', false),
    (new.id, 'Dança com o pai', 'My Girl — The Temptations', false),
    (new.id, 'Dança com a mãe', 'You Raise Me Up — Josh Groban', false),
    (new.id, 'Entrada dos noivos na festa', 'Can''t Stop the Feeling — Justin Timberlake', false),
    (new.id, 'Abertura da pista', 'Uptown Funk — Bruno Mars', true),
    (new.id, 'Corte do bolo', 'Sugar — Maroon 5', false),
    (new.id, 'Última música da noite', 'Don''t Stop Believin'' — Journey', false);

  -- Novas ideias / atividades (10)
  insert into public.activity_ideas (profile_id, nome, status, custo_estimado) values
    (new.id, 'Cabine de fotos', 'Bora fazer', 1200),
    (new.id, 'Flash tattoo', 'Só ideia', 800),
    (new.id, 'Leques personalizados', 'Bora fazer', 300),
    (new.id, 'Sky lanterns', 'Por que não', 600),
    (new.id, 'Food truck de sobremesa', 'Só ideia', 1500),
    (new.id, 'Caricaturista', 'Só ideia', 900),
    (new.id, 'Mesa de charutos', 'Por que não', 700),
    (new.id, 'Fogos frios', 'Bora fazer', 500),
    (new.id, 'Álbum de recados', 'Bora fazer', 150),
    (new.id, 'DJ set acústico na cerimônia', 'Bora fazer', 800);

  -- Documentos (10)
  insert into public.documents (profile_id, nome, categoria) values
    (new.id, 'Orçamento do buffet (recebido)', 'Orçamento'),
    (new.id, 'Contrato do espaço assinado', 'Contrato'),
    (new.id, 'Orçamento da decoração', 'Orçamento'),
    (new.id, 'Portfólio do fotógrafo', 'Portfólio'),
    (new.id, 'Contrato do DJ assinado', 'Contrato'),
    (new.id, 'RG e CPF dos noivos', 'Documento pessoal'),
    (new.id, 'Certidão de nascimento atualizada', 'Documento pessoal'),
    (new.id, 'Contrato do buffet assinado', 'Contrato'),
    (new.id, 'Orçamento da banda', 'Orçamento'),
    (new.id, 'Comprovante de entrada do local', 'Financeiro');

  -- Dia do casamento (10)
  insert into public.wedding_day_schedule (profile_id, horario, o_que, responsavel, etapa) values
    (new.id, '12:00', 'Chegada do cabelo e maquiagem', 'Cabeleireira', 'Antes da cerimônia'),
    (new.id, '14:00', 'Making of da noiva', 'Fotógrafo', 'Antes da cerimônia'),
    (new.id, '15:30', 'Noivo pronto e no local', 'Noivo', 'Antes da cerimônia'),
    (new.id, '16:30', 'Chegada dos convidados', 'Cerimonialista', 'Antes da cerimônia'),
    (new.id, '17:00', 'Entrada da noiva', 'Cerimonialista', 'Cerimônia'),
    (new.id, '17:30', 'Troca de alianças e votos', 'Celebrante', 'Cerimônia'),
    (new.id, '18:00', 'Sessão de fotos com a família', 'Fotógrafo', 'Cerimônia'),
    (new.id, '19:00', 'Entrada dos noivos na recepção', 'DJ', 'Recepção'),
    (new.id, '19:30', 'Jantar', 'Buffet', 'Recepção'),
    (new.id, '21:00', 'Abertura da pista', 'DJ', 'Recepção');

  -- Lua de mel — roteiro (10)
  insert into public.honeymoon_itinerary (profile_id, dia, atividade, local) values
    (new.id, 1, 'Check-in no resort', 'Maragogi, AL'),
    (new.id, 2, 'Passeio de barco nas piscinas naturais', 'Maragogi, AL'),
    (new.id, 3, 'Passeio de escuna', 'Maragogi, AL'),
    (new.id, 4, 'Dia livre na praia', 'Maragogi, AL'),
    (new.id, 5, 'Traslado para Porto de Galinhas', 'Porto de Galinhas, PE'),
    (new.id, 6, 'Mergulho com snorkel', 'Porto de Galinhas, PE'),
    (new.id, 7, 'Jantar romântico à beira-mar', 'Porto de Galinhas, PE'),
    (new.id, 8, 'Passeio de jangada', 'Porto de Galinhas, PE'),
    (new.id, 9, 'Compras e recordações', 'Porto de Galinhas, PE'),
    (new.id, 10, 'Retorno para casa', 'Voo de volta');

  -- Lua de mel — checklist pré-viagem (10)
  insert into public.honeymoon_checklist (profile_id, item, feito) values
    (new.id, 'Verificar validade do passaporte', true),
    (new.id, 'Contratar seguro viagem', false),
    (new.id, 'Trocar moeda / avisar o banco da viagem', false),
    (new.id, 'Reservar hospedagem', true),
    (new.id, 'Reservar passagens aéreas', true),
    (new.id, 'Fazer as malas', false),
    (new.id, 'Verificar vacinas necessárias', false),
    (new.id, 'Baixar aplicativos de tradução offline', false),
    (new.id, 'Confirmar reservas de passeios', false),
    (new.id, 'Deixar cópia dos documentos com a família', false);

  -- Chás — 10 passos para cada um dos 4 tipos
  foreach tipo_cha in array array['Chá Bar', 'Chá de Panela', 'Chá de Lingerie', 'Chá de Casa Nova']
  loop
    insert into public.shower_checklist (profile_id, tipo, item, feito) values
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

  -- Fornecedores (12, vinculados aos itens de orçamento correspondentes)
  insert into public.vendors (profile_id, nome, servico, status, telefone, email, budget_item_id) values
    (new.id, 'Buffet Sabor & Arte', 'Alimentação', 'Contratado', '(61) 99999-0001', 'contato@buffetsaborarte.com.br', budget_buffet_id),
    (new.id, 'Bar Móvel Elegance', 'Bebidas', 'Em contato', '(61) 99999-0002', 'contato@barelegance.com.br', budget_bebidas_id),
    (new.id, 'Confeitaria Doce Encanto', 'Bolo e doces', 'Orçamento recebido', '(61) 99999-0003', 'contato@doceencanto.com.br', budget_bolo_id),
    (new.id, 'DJ Marcelo Beats', 'DJ', 'Contratado', '(61) 99999-0004', 'contato@djmarcelobeats.com.br', budget_dj_id),
    (new.id, 'Banda Harmonia Real', 'Banda ao vivo', 'Em contato', '(61) 99999-0005', 'contato@harmoniareal.com.br', budget_banda_id),
    (new.id, 'Luz & Cia Iluminação', 'Iluminação', 'Não contatado', '(61) 99999-0006', null, budget_iluminacao_id),
    (new.id, 'Estruturas Prime', 'Palco e som', 'Orçamento recebido', '(61) 99999-0007', 'contato@estruturasprime.com.br', budget_palco_id),
    (new.id, 'Decorações Encantar', 'Decoração', 'Contratado', '(61) 99999-0008', 'contato@decoracoesencantar.com.br', budget_decoracao_id),
    (new.id, 'Espaço Jardim das Flores', 'Local (Espaço)', 'Em contato', '(61) 99999-0009', null, budget_local_id),
    (new.id, 'Estúdio Luz & Registro', 'Fotografia', 'Orçamento recebido', '(61) 99999-0010', 'contato@luzeregistro.com.br', budget_fotografia_id),
    (new.id, 'Vídeo Memórias', 'Vídeo', 'Não contatado', '(61) 99999-0011', null, budget_video_id),
    (new.id, 'Papelaria Convite Perfeito', 'Convites e papelaria', 'Contratado', '(61) 99999-0012', 'contato@convitperfeito.com.br', budget_papelaria_id);

  -- Vestuário (10)
  insert into public.attire (profile_id, item, categoria, preco, status, para_quem) values
    (new.id, 'Vestido de noiva', 'Noiva', 4500, 'Encomendado', 'Noiva'),
    (new.id, 'Terno azul-marinho', 'Noivo', 1800, 'Comprado', 'Noivo'),
    (new.id, 'Vestido rosé (madrinhas)', 'Madrinhas', 350, 'Ideia', 'Madrinhas'),
    (new.id, 'Terno cinza (padrinhos)', 'Padrinhos', 600, 'Ideia', 'Padrinhos'),
    (new.id, 'Sapato da noiva', 'Noiva', 450, 'Comprado', 'Noiva'),
    (new.id, 'Sapato do noivo', 'Noivo', 380, 'Comprado', 'Noivo'),
    (new.id, 'Véu', 'Noiva', 600, 'Encomendado', 'Noiva'),
    (new.id, 'Gravata e acessórios', 'Noivo', 200, 'Comprado', 'Noivo'),
    (new.id, 'Vestido das damas de honra', 'Damas', 250, 'Ideia', 'Damas'),
    (new.id, 'Roupa dos pajens', 'Pajens', 300, 'Ideia', 'Pajens');

  -- Padrinhos, madrinhas, damas e pajens (10)
  insert into public.wedding_party (profile_id, nome, papel, traje_definido) values
    (new.id, 'Ana Beatriz', 'Madrinha', true),
    (new.id, 'Rafael Souza', 'Padrinho', false),
    (new.id, 'Juliana Alves', 'Madrinha', false),
    (new.id, 'Pedro Henrique', 'Padrinho', false),
    (new.id, 'Camila Rocha', 'Madrinha', true),
    (new.id, 'Bruno Costa', 'Padrinho', false),
    (new.id, 'Sofia', 'Dama', false),
    (new.id, 'Miguel', 'Pajem', false),
    (new.id, 'Laura Martins', 'Dama', false),
    (new.id, 'Enzo Ferreira', 'Pajem', false);

  return new;
end;
$$ language plpgsql security definer;
