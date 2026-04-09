create table public.users (
  id            text primary key,
  email         text unique not null,
  display_name  text,
  avatar_url    text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),
  deleted_at    timestamptz
);

create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_updated_at
  before update on public.users
  for each row execute procedure public.update_updated_at();

alter table public.users enable row level security;

create policy "users: read own"
  on public.users for select
  using (id = public.firebase_uid());

create policy "users: insert own"
  on public.users for insert
  with check (id = public.firebase_uid());

create policy "users: update own"
  on public.users for update
  using (id = public.firebase_uid());