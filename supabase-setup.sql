-- Run this in your Supabase SQL editor to create the payments table

create table if not exists payments (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  stripe_session_id text unique,
  user_id text,
  email text,
  name text,
  phone text,
  location jsonb,              -- full billing address as JSON
  amount_total bigint,         -- smallest currency unit (e.g. kobo/cents)
  currency text,
  status text,
  raw jsonb
);

create index if not exists payments_email_idx on payments (email);

-- Enable Row Level Security (RLS)
alter table payments enable row level security;

-- Create a policy that allows service role to do everything
create policy "Service role can manage payments" on payments
  for all using (auth.role() = 'service_role');