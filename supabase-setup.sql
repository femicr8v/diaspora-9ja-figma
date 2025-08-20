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

-- Create leads table to track users who started the join process
create table if not exists leads (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  location text,
  status text not null default 'lead', -- 'lead', 'converted', 'abandoned'
  stripe_session_id text, -- will be populated when they start checkout
  converted_at timestamptz, -- when they completed payment
  unique(email) -- prevent duplicate leads for same email
);

create index if not exists leads_email_idx on leads (email);
create index if not exists leads_status_idx on leads (status);
create index if not exists leads_created_at_idx on leads (created_at);

-- Enable Row Level Security (RLS) for leads
alter table leads enable row level security;

-- Create a policy that allows service role to manage leads
create policy "Service role can manage leads" on leads
  for all using (auth.role() = 'service_role');

-- Function to update the updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
create trigger update_leads_updated_at
  before update on leads
  for each row
  execute function update_updated_at_column();