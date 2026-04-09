create type rsvp_status as enum (
  'pending','accepted','declined','maybe',
  'meal_selected','transport_requested','accommodation_requested'
);

create table public.households (
  id         uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.wedding_programs(id) on delete cascade,
  name       text not null,
  side       text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

create table public.guests (
  id                   uuid primary key default gen_random_uuid(),
  program_id           uuid not null references public.wedding_programs(id) on delete cascade,
  household_id         uuid references public.households(id),
  first_name           text not null,
  last_name            text,
  email                text,
  phone                text,
  is_vip               boolean default false,
  is_child             boolean default false,
  is_elder             boolean default false,
  plus_one_allowed     boolean default false,
  dietary_notes        text,
  allergy_notes        text,
  mobility_notes       text,
  language_preference  text,
  accommodation_status text,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now(),
  deleted_at           timestamptz
);

create table public.event_attendance (
  id           uuid primary key default gen_random_uuid(),
  event_id     uuid not null references public.events(id) on delete cascade,
  guest_id     uuid not null references public.guests(id) on delete cascade,
  rsvp_status  rsvp_status default 'pending',
  meal_choice  text,
  notes        text,
  responded_at timestamptz,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now(),
  unique (event_id, guest_id)
);

create trigger households_updated_at
  before update on public.households
  for each row execute procedure public.update_updated_at();

create trigger guests_updated_at
  before update on public.guests
  for each row execute procedure public.update_updated_at();

alter table public.households       enable row level security;
alter table public.guests           enable row level security;
alter table public.event_attendance enable row level security;

-- Households
create policy "households: member read"
  on public.households for select
  using (
    program_id in (
      select program_id from public.program_members
      where user_id = public.firebase_uid()
    )
  );

create policy "households: member write"
  on public.households for insert
  with check (
    program_id in (
      select program_id from public.program_members
      where user_id = public.firebase_uid()
    )
  );

-- Guests
create policy "guests: member read"
  on public.guests for select
  using (
    program_id in (
      select program_id from public.program_members
      where user_id = public.firebase_uid()
    )
  );

create policy "guests: member insert"
  on public.guests for insert
  with check (
    program_id in (
      select program_id from public.program_members
      where user_id = public.firebase_uid()
    )
  );

create policy "guests: member update"
  on public.guests for update
  using (
    program_id in (
      select program_id from public.program_members
      where user_id = public.firebase_uid()
    )
  );

-- Event attendance
create policy "attendance: member read"
  on public.event_attendance for select
  using (
    event_id in (
      select e.id from public.events e
      join public.program_members pm on pm.program_id = e.program_id
      where pm.user_id = public.firebase_uid()
    )
  );

create policy "attendance: member insert"
  on public.event_attendance for insert
  with check (
    event_id in (
      select e.id from public.events e
      join public.program_members pm on pm.program_id = e.program_id
      where pm.user_id = public.firebase_uid()
    )
  );