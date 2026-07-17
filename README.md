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

\`\`\`bash
npm install
cp .env.example .env
# edite .env e cole a Project URL e a anon key do Supabase
npm run dev
\`\`\`

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

---

## Estrutura do projeto

\`\`\`
src/
  lib/
    supabase.js         cliente Supabase
    AuthContext.jsx      contexto de autenticação (login/sessão/perfil)
  components/
    Layout.jsx           casca com sidebar (desktop) / menu (mobile)
    Sidebar.jsx           navegação entre módulos
    RequireAuth.jsx       protege rotas internas
    PageHeading.jsx / Ribbon.jsx   identidade visual (título + assinatura)
  pages/
    Login.jsx / Signup.jsx
    Dashboard.jsx         painel com contagem de convidados, RSVP, tarefas e saldo
    Guests.jsx            cadastro e filtro de convidados
    Tables.jsx            organização das mesas
    Budget.jsx            orçamento planejado x custo real x saldo
    Tasks.jsx             checklist com progresso
supabase/
  schema.sql             schema completo com RLS
\`\`\`

## Próximos módulos (estrutura já preparada para crescer)

Comes e Bebes, Lista de presentes, Decoração, Músicas e novas ideias,
Documentos, Dia do casamento e Lua de mel — já aparecem em "Em breve" na
barra lateral. Dá pra construir cada um seguindo o mesmo padrão dos módulos
atuais (tabela no Supabase + página React), quando quiser evoluir o produto.
