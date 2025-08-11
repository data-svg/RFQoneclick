-- Minimal schema with quotes.company included
create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";
-- (other tables omitted for brevity)
create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  rfq_id uuid references rfqs(id) on delete cascade,
  supplier_id uuid references suppliers(id) on delete set null,
  invite_token text,
  supplier_email text,
  company text,
  price numeric(12,2),
  currency text default 'GBP',
  notes text,
  created_at timestamptz not null default now()
);
