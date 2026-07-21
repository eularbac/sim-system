# Sistema Sim

Organizador de casamento multi-noiva (SaaS), com login próprio e dados isolados
por conta. MVP com 5 módulos: Painel, Convidados, Mesas, Orçamento e Tarefas.

Stack: **React + Vite + Tailwind v4** (frontend, hospedado no Netlify) +
**Supabase** (autenticação + banco Postgres + Row Level Security).

---

## 1. Criar o projeto no Supabase (5 min, grátis)

1. Acesse [supabase.com](https://supabase.com) e crie uma conta/projeto novo.
2. Espere o projeto provisionar (~2 min).
3. No menu lateral, abra **SQL Editor** → **New query**.
4. Copie todo o conteúdo do arquivo `supabase/schema.sql` deste projeto, cole
   no editor e clique em **Run**. Isso cria as tabelas `profiles`, `guests`,
   `seating_tables`, `budget_items`, `tasks` — já com as regras de segurança
   que garantem que cada noiva só vê os próprios dados.
5. Repita o processo com `supabase/migration_002_remaining_modules.sql` (New
   query → colar → Run). Isso cria as tabelas dos outros 7 módulos: Comes e
   Bebes, Lista de presentes, Decoração, Músicas e ideias, Documentos, Dia do
   casamento e Lua de mel — já com as mesmas regras de segurança.
6. Repita novamente com `supabase/migration_003_showers_and_seed_data.sql`.
   Isso cria os 4 módulos de chá (Bar, Panela, Lingerie, Casa Nova) e também
   reescreve a função de "boas-vindas": a partir de agora, toda vez que
   alguém se cadastrar, o sistema já vai preencher automaticamente todos os
   módulos com alguns exemplos editáveis (convidados, orçamento, tarefas,
   checklist de cada chá, etc.), pra a pessoa entender como cada tela
   funciona sem começar do zero. Quem já tinha se cadastrado antes de rodar
   essa migração não recebe os exemplos retroativamente — só quem se
   cadastrar depois.
7. Repita mais uma vez com `supabase/migration_004_vendors_attire_party.sql`.
   Isso adiciona Fornecedores, Vestuário e Padrinhos/Madrinhas — e estende o
   preenchimento automático pra incluir exemplos desses 3 módulos também.
8. Por fim, rode `supabase/migration_005_mural_seed_images.sql`. Isso
   adiciona 3 ilustrações de exemplo (arco floral, mesa posta, bolo) ao
   mural de inspiração de decoração de toda conta nova — são SVGs originais
   gerados pelo próprio sistema, sem depender de link externo.
5. Vá em **Project Settings → API**. Copie:
   - **Project URL**
   - **anon public key**

### Ajuste recomendado de autenticação
Em **Authentication → Providers → Email**, você pode desativar
"Confirm email" durante os testes (assim o cadastro já loga direto, sem
precisar clicar em link de confirmação). Antes de vender o produto de
verdade, vale reativar e configurar o **Site URL** em
**Authentication → URL Configuration** apontando para o seu domínio.

---

## 2. Rodar localmente

```bash
npm install
cp .env.example .env
# edite .env e cole a Project URL e a anon key do Supabase
npm run dev
```

Abra `http://localhost:5173`, crie uma conta de teste e navegue pelos módulos.

---

## 3. Deploy no Netlify

**Build command:** `npm run build`
**Publish directory:** `dist`

### Caminho recomendado (deploy contínuo via Git)
1. Suba este projeto para um repositório no GitHub.
2. No Netlify: **Add new site → Import an existing project** → conecte o repo.
3. Em **Site settings → Environment variables**, adicione:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy. A cada `git push`, o Netlify atualiza o site sozinho.

### Caminho rápido (Netlify Drop, como você já usa)
1. Rode `npm install && npm run build` localmente com o `.env` preenchido.
2. Arraste a pasta `dist` gerada para [app.netlify.com/drop](https://app.netlify.com/drop).
   (Nesse caminho, se trocar as chaves do Supabase depois, precisa gerar o
   build de novo e arrastar novamente — por isso o caminho via Git é melhor
   a médio prazo.)

### Domínio próprio
Em **Site settings → Domain management → Add a domain**, coloque seu domínio
e siga as instruções de DNS que o Netlify mostrar (geralmente um registro
CNAME ou os nameservers do Netlify).


## Estrutura do projeto

```
src/
  lib/
    supabase.js          cliente Supabase
    AuthContext.jsx       contexto de autenticação (login/sessão/perfil)
  components/
    Layout.jsx            casca com sidebar (desktop) / menu (mobile)
    Sidebar.jsx            navegação entre os 12 módulos
    RequireAuth.jsx        protege rotas internas
    PageHeading.jsx / Ribbon.jsx   identidade visual (título + assinatura)
    SimpleChecklist.jsx    checklist genérico reaproveitado em 3 módulos
    ShowerChecklist.jsx    checklist genérico dos 4 módulos de chá
    AnimatedNumber.jsx     contador animado (usado no Painel)
    BouquetArt.jsx         ilustração original em SVG (login, cadastro, painel)
    Avatar.jsx             avatar com iniciais e cor determinística (convidados)
  pages/
    Login.jsx / Signup.jsx
    Dashboard.jsx          painel com contagem de convidados, RSVP, tarefas e saldo
    Guests.jsx             cadastro e filtro de convidados
    Tables.jsx             organização das mesas
    Budget.jsx             orçamento planejado x custo real x saldo
    Tasks.jsx              checklist de tarefas com progresso
    FoodDrink.jsx          checklist de comes e bebes
    Gifts.jsx              lista de presentes
    Decor.jsx              checklist de decoração + mural de inspiração
    Music.jsx              playlist por momento + ideias de atividades
    Documents.jsx          repositório de links/documentos
    WeddingDay.jsx         cronograma do dia, por etapa
    Honeymoon.jsx          roteiro da lua de mel + checklist pré-viagem
    ChaBar.jsx / ChaPanela.jsx / ChaLingerie.jsx / ChaCasaNova.jsx
                            checklist de 10 passos para cada tipo de chá
    Vendors.jsx            fornecedores, vinculados ao orçamento
    Attire.jsx             vestuário (item, preço, status, para quem)
    WeddingParty.jsx       padrinhos, madrinhas, damas e pajens
supabase/
  schema.sql                                módulos essenciais (MVP)
  migration_002_remaining_modules.sql       os outros 7 módulos
  migration_003_showers_and_seed_data.sql   chás + preenchimento automático
  migration_004_vendors_attire_party.sql    fornecedores, vestuário, padrinhos/madrinhas
  migration_005_mural_seed_images.sql       ilustrações de exemplo no mural
```

## Estilo e animações

Fade-in suave a cada troca de página, números do Painel contando de 0 até o
valor real, cards com leve elevação ao passar o mouse, botões com feedback
de toque, e uma ilustração floral original (sem depender de banco de
imagens) nas telas de login, cadastro e painel. Tudo respeita
`prefers-reduced-motion` — quem usa essa preferência de acessibilidade não
vê as animações.

## Sistema Sim completo

Os 12 módulos do planejador original já estão todos aqui. Ideias pra
próximas evoluções: upload de imagem de verdade no mural de inspiração (via
Supabase Storage — hoje é por link), campos extras nas Bases de dados
(Fornecedores, Vestuário, Damas e Pajens, Documentos legais), e um plano
pago/gratuito diferenciando funcionalidades por conta.
