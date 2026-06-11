-- ════════════════════════════════════════════════════════════════
-- Briefing Mazik — migração inicial
-- Rode este script no SQL Editor da Supabase (Project > SQL Editor).
-- ════════════════════════════════════════════════════════════════

create table if not exists public.briefings (
  id            uuid primary key,                       -- response_id gerado no frontend
  status        text not null default 'in_progress'
                check (status in ('in_progress', 'completed')),

  -- Resposta completa
  data          jsonb not null default '{}'::jsonb,

  -- Colunas extraídas para consulta rápida
  respondent_name text,
  event_type      text,
  event_date      date,
  email           text,
  whatsapp        text,

  -- Timestamps
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  submitted_at  timestamptz
);

-- Índices úteis para consultar a agenda
create index if not exists briefings_status_idx     on public.briefings (status);
create index if not exists briefings_event_date_idx on public.briefings (event_date);
create index if not exists briefings_created_at_idx on public.briefings (created_at desc);

-- Mantém updated_at sempre atualizado
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_briefings_updated_at on public.briefings;
create trigger trg_briefings_updated_at
  before update on public.briefings
  for each row execute function public.set_updated_at();

-- ─── Segurança ───
-- RLS habilitado e SEM nenhuma policy: apenas a service_role (usada nas
-- funções serverless) consegue ler/gravar. O frontend nunca acessa direto.
alter table public.briefings enable row level security;

-- (Intencional: nenhuma policy criada — acesso público bloqueado.)
