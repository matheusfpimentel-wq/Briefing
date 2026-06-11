# 🎧 Briefing Mazik

Sistema web de **briefing musical para DJ open format** (casamentos, 15 anos,
aniversários, corporativo, formatura). Formulário multi-step estilo Typeform,
mobile-first, tema dark com acento roxo-violeta. As respostas são salvas no
Supabase e, ao final, uma **ficha de curadoria** é enviada por e-mail.

## Stack

- **Frontend:** Vite + React 18 + TypeScript + Tailwind CSS + Framer Motion
- **Backend:** Funções serverless da Vercel em `/api` (Node)
- **Banco:** Supabase (Postgres) — acessado **somente** pelas funções
  serverless via `SUPABASE_SERVICE_ROLE_KEY`. O frontend nunca toca o banco
  e nenhuma chave aparece no bundle do cliente.
- **E-mail:** Resend, chamado dentro da função de submissão.

## Estrutura

```
api/                 Funções serverless
  _lib/              supabase, schema (zod), rate limit, e-mail, labels
  save.ts            POST /api/save   — salvamento parcial (in_progress)
  submit.ts          POST /api/submit — envio final (completed) + e-mail
src/
  config/            Configuração tipada do formulário (edite aqui!)
    formConfig.ts    Definição dos steps, validação por etapa
    options.ts       Listas de opções, gêneros, momentos, fases
  components/        StepShell, ProgressBar, campos e steps reutilizáveis
  hooks/             useBriefingForm (estado + persistência)
  lib/               tipos, validação, cliente HTTP
  pages/             /obrigado
supabase/
  migration.sql      Tabela briefings + RLS (rode no SQL Editor)
```

> Para **adicionar/remover perguntas** no futuro, mexa em
> `src/config/formConfig.ts` (steps) e `src/config/options.ts` (opções).
> Steps com campos simples usam o renderizador genérico; widgets especiais
> (gêneros, momentos, energia, resumo) têm componentes próprios.

## Variáveis de ambiente

Copie `.env.example` para `.env` (local) e configure as mesmas variáveis na
Vercel:

| Variável                    | Descrição                                              |
| --------------------------- | ------------------------------------------------------ |
| `SUPABASE_URL`              | URL do projeto Supabase                                |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave **service_role** (secreta, nunca no frontend)    |
| `RESEND_API_KEY`            | API key do Resend                                      |
| `NOTIFY_EMAIL`              | Seu e-mail (destino da notificação)                    |
| `RESEND_FROM`               | Remetente (default `onboarding@resend.dev`)            |

## Setup local

```bash
npm install
npm i -g vercel          # se ainda não tiver a CLI
vercel link              # vincula o projeto (uma vez)
cp .env.example .env     # preencha os valores

# Sobe frontend + funções /api juntos:
vercel dev
```

Abra http://localhost:3000. Use `vercel env pull` para baixar as variáveis do
projeto, ou preencha o `.env` manualmente.

> Só o frontend (sem `/api`): `npm run dev` (porta 5173). As chamadas a
> `/api/*` não funcionam nesse modo — use `vercel dev` para testar o fluxo
> completo.

## Rodar a migration no Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No painel, vá em **SQL Editor → New query**.
3. Cole o conteúdo de [`supabase/migration.sql`](supabase/migration.sql) e
   clique em **Run**.
4. Confirme em **Table Editor** que a tabela `briefings` existe com **RLS
   habilitado** (e nenhuma policy — só a service role acessa).
5. Em **Project Settings → API**, copie a `URL` e a chave `service_role`
   para suas variáveis de ambiente.

## Deploy na Vercel

1. Suba o repositório para o GitHub.
2. Em [vercel.com](https://vercel.com) → **Add New → Project** → importe o repo.
3. Framework detectado: **Vite**. Build: `npm run build` · Output: `dist`.
4. Em **Settings → Environment Variables**, adicione as 5 variáveis acima
   (Production e Preview).
5. **Deploy**. As funções em `/api` viram endpoints automaticamente.

### Resend

- Para testes, `RESEND_FROM=onboarding@resend.dev` já funciona.
- Para produção com seu domínio, verifique o domínio em
  **resend.com → Domains** e use um remetente desse domínio.

## Fluxo de dados

1. No 1º passo é gerado um `response_id` (UUID), guardado em `localStorage`
   para retomar a sessão se a página recarregar.
2. A cada etapa concluída, `POST /api/save` faz **upsert** com
   `status = in_progress`.
3. Na tela de resumo, `POST /api/submit` grava `status = completed`,
   `submitted_at` e dispara o e-mail via Resend.
4. Sucesso → redireciona para `/obrigado`. Erro → mensagem amigável com
   opção de tentar de novo (o reenvio é idempotente pelo `id`).
