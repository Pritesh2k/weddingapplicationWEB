create type vendor_category as enum (
  'venue','decor','florals','rentals','planner','officiant',
  'caterer','dessert','cake','entertainment','dj','live_music',
  'photographer','videographer','transport','hair_makeup',
  'lighting','av','security','childcare','accommodation_partner','other'
);

create type vendor_status as enum (
  'researching','shortlisted','booked','backup','rejected'
);

create type payment_status as enum (
  'pending','paid','overdue','waived'
);

create table public.vendors (
  id           uuid primary key default gen_random_uuid(),
  program_id   uuid not null references public.wedding_programs(id) on delete cascade,
  name         text not null,
  category     vendor_category not null,
  status       vendor_status default 'researching',
  contact_name text,
  email        text,
  phone        text,
  website      text,
  notes        text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now(),
  deleted_at   timestamptz
);

create table public.vendor_contracts (
  id               uuid primary key default gen_random_uuid(),
  vendor_id        uuid not null references public.vendors(id) on delete cascade,
  document_url     text,
  quoted_amount    numeric(12,2),
  final_amount     numeric(12,2),
  deposit_amount   numeric(12,2),
  deposit_due_date date,
  notes            text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

create table public.payment_milestones (
  id         uuid primary key default gen_random_uuid(),
  vendor_id  uuid not null references public.vendors(id) on delete cascade,
  label      text not null,
  amount     numeric(12,2) not null,
  due_date   date,
  status     payment_status default 'pending',
  paid_at    timestamptz,
  notes      text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger vendors_updated_at
  before update on public.vendors
  for each row execute procedure public.update_updated_at();

alter table public.vendors            enable row level security;
alter table public.vendor_contracts   enable row level security;
alter table public.payment_milestones enable row level security;

create policy "vendors: member read"
  on public.vendors for select
  using (
    program_id in (
      select program_id from public.program_members
      where user_id = public.firebase_uid()
    )
  );

create policy "vendors: member insert"
  on public.vendors for insert
  with check (
    program_id in (
      select program_id from public.program_members
      where user_id = public.firebase_uid()
    )
  );

create policy "vendors: member update"
  on public.vendors for update
  using (
    program_id in (
      select program_id from public.program_members
      where user_id = public.firebase_uid()
    )
  );

create policy "vendor_contracts: member read"
  on public.vendor_contracts for select
  using (
    vendor_id in (
      select v.id from public.vendors v
      join public.program_members pm on pm.program_id = v.program_id
      where pm.user_id = public.firebase_uid()
    )
  );

create policy "vendor_contracts: member insert"
  on public.vendor_contracts for insert
  with check (
    vendor_id in (
      select v.id from public.vendors v
      join public.program_members pm on pm.program_id = v.program_id
      where pm.user_id = public.firebase_uid()
    )
  );

create policy "payment_milestones: member read"
  on public.payment_milestones for select
  using (
    vendor_id in (
      select v.id from public.vendors v
      join public.program_members pm on pm.program_id = v.program_id
      where pm.user_id = public.firebase_uid()
    )
  );

create policy "payment_milestones: member insert"
  on public.payment_milestones for insert
  with check (
    vendor_id in (
      select v.id from public.vendors v
      join public.program_members pm on pm.program_id = v.program_id
      where pm.user_id = public.firebase_uid()
    )
  );