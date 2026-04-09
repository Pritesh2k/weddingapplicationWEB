create type wedding_format as enum (
  'single_day','multi_day','destination',
  'interfaith','civil_plus_cultural','custom'
);

create type planning_mode as enum (
  'self_planning','planner_assisted','family_coordinated'
);

create type program_role as enum (
  'owner','co_owner','planner_admin','coordinator',
  'family_lead','finance_approver','hospitality_lead',
  'transport_lead','vendor_portal','guest'
);

create table public.wedding_programs (
  id              uuid primary key default gen_random_uuid(),
  owner_id        text not null references public.users(id),
  title           text not null,
  format          wedding_format not null default 'single_day',
  planning_mode   planning_mode  not null default 'self_planning',
  date_start      date,
  date_end        date,
  region          text,
  currency        text not null default 'GBP',
  culture_modules text[]  default '{}',
  is_live_mode    boolean default false,
  readiness_score int     default 0,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  deleted_at      timestamptz
);

create table public.program_members (
  id          uuid primary key default gen_random_uuid(),
  program_id  uuid not null references public.wedding_programs(id) on delete cascade,
  user_id     text not null references public.users(id),
  role        program_role not null default 'guest',
  invited_at  timestamptz default now(),
  accepted_at timestamptz,
  created_at  timestamptz default now(),
  unique (program_id, user_id)
);

create trigger wedding_programs_updated_at
  before update on public.wedding_programs
  for each row execute procedure public.update_updated_at();

alter table public.wedding_programs enable row level security;
alter table public.program_members  enable row level security;

-- Programs: only members can read
create policy "programs: member read"
  on public.wedding_programs for select
  using (
    id in (
      select program_id from public.program_members
      where user_id = public.firebase_uid()
    )
  );

-- Programs: only owner can insert
create policy "programs: owner insert"
  on public.wedding_programs for insert
  with check (owner_id = public.firebase_uid());

-- Programs: only owner can update
create policy "programs: owner update"
  on public.wedding_programs for update
  using (owner_id = public.firebase_uid());

-- Programs: only owner can delete
create policy "programs: owner delete"
  on public.wedding_programs for delete
  using (owner_id = public.firebase_uid());

-- Members: users can read their own membership rows
create policy "members: read own"
  on public.program_members for select
  using (user_id = public.firebase_uid());

-- Members: only program owner can add members
create policy "members: owner insert"
  on public.program_members for insert
  with check (
    program_id in (
      select id from public.wedding_programs
      where owner_id = public.firebase_uid()
    )
  );

-- Members: only program owner can remove members
create policy "members: owner delete"
  on public.program_members for delete
  using (
    program_id in (
      select id from public.wedding_programs
      where owner_id = public.firebase_uid()
    )
  );