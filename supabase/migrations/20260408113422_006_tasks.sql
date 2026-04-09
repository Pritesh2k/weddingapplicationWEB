create type task_status as enum (
  'todo','in_progress','blocked','done','cancelled'
);

create type task_priority as enum (
  'low','medium','high','critical'
);

create table public.tasks (
  id             uuid primary key default gen_random_uuid(),
  program_id     uuid not null references public.wedding_programs(id) on delete cascade,
  event_id       uuid references public.events(id),
  parent_task_id uuid references public.tasks(id),
  title          text not null,
  description    text,
  status         task_status    default 'todo',
  priority       task_priority  default 'medium',
  owner_id       text references public.users(id),
  due_date       date,
  start_date     date,
  is_milestone   boolean default false,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now(),
  deleted_at     timestamptz
);

create table public.task_dependencies (
  task_id       uuid not null references public.tasks(id) on delete cascade,
  depends_on_id uuid not null references public.tasks(id) on delete cascade,
  primary key (task_id, depends_on_id)
);

create trigger tasks_updated_at
  before update on public.tasks
  for each row execute procedure public.update_updated_at();

alter table public.tasks             enable row level security;
alter table public.task_dependencies enable row level security;

create policy "tasks: member read"
  on public.tasks for select
  using (
    program_id in (
      select program_id from public.program_members
      where user_id = public.firebase_uid()
    )
  );

create policy "tasks: member insert"
  on public.tasks for insert
  with check (
    program_id in (
      select program_id from public.program_members
      where user_id = public.firebase_uid()
    )
  );

create policy "tasks: member update"
  on public.tasks for update
  using (
    program_id in (
      select program_id from public.program_members
      where user_id = public.firebase_uid()
    )
  );

create policy "task_dependencies: member read"
  on public.task_dependencies for select
  using (
    task_id in (
      select t.id from public.tasks t
      join public.program_members pm on pm.program_id = t.program_id
      where pm.user_id = public.firebase_uid()
    )
  );