create table public.events (
  id           uuid primary key default gen_random_uuid(),
  program_id   uuid not null references public.wedding_programs(id) on delete cascade,
  title        text not null,
  event_date   date,
  start_time   time,
  end_time     time,
  venue_id     uuid,
  dress_code   text,
  host_side    text,
  culture_tags text[] default '{}',
  is_live      boolean default false,
  sort_order   int     default 0,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now(),
  deleted_at   timestamptz
);

create trigger events_updated_at
  before update on public.events
  for each row execute procedure public.update_updated_at();

alter table public.events enable row level security;

create policy "events: member read"
  on public.events for select
  using (
    program_id in (
      select program_id from public.program_members
      where user_id = public.firebase_uid()
    )
  );

create policy "events: member insert"
  on public.events for insert
  with check (
    program_id in (
      select program_id from public.program_members
      where user_id = public.firebase_uid()
    )
  );

create policy "events: member update"
  on public.events for update
  using (
    program_id in (
      select program_id from public.program_members
      where user_id = public.firebase_uid()
    )
  );

create policy "events: owner delete"
  on public.events for delete
  using (
    program_id in (
      select id from public.wedding_programs
      where owner_id = public.firebase_uid()
    )
  );