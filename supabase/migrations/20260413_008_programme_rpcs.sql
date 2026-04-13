-- ── get_wedding_programme ─────────────────────────────────────────
-- Already assumed to exist (used in page load), but define defensively
create or replace function get_wedding_programme(
  p_uid          text,
  p_programme_id uuid
)
returns json
language plpgsql security definer
as $$
declare
  v_prog  public.wedding_programs%rowtype;
  v_events json;
  v_result json;
begin
  select * into v_prog
  from public.wedding_programs
  where id = p_programme_id
    and owner_id = p_uid
    and deleted_at is null;

  if not found then return null; end if;

  select json_agg(
    json_build_object(
      'id',         e.id,
      'title',      e.title,
      'event_date', e.event_date,
      'start_time', e.start_time,
      'end_time',   e.end_time
    ) order by e.sort_order, e.event_date
  ) into v_events
  from public.events e
  where e.program_id = p_programme_id
    and e.deleted_at is null;

  return json_build_object(
    'id',                 v_prog.id,
    'title',              v_prog.title,
    'format',             v_prog.format,
    'couple_name_a',      split_part(v_prog.title, ' & ', 1),
    'couple_name_b',      split_part(v_prog.title, ' & ', 2),
    'date_start',         v_prog.date_start,
    'date_end',           v_prog.date_end,
    'region',             v_prog.region,
    'currency',           v_prog.currency,
    'culture_modules',    v_prog.culture_modules,
    'priorities',         coalesce(v_prog.priorities, '{}'),
    'guest_estimate',     v_prog.guest_estimate,
    'budget_target',      v_prog.budget_target,
    'has_planner',        (v_prog.planning_mode = 'planner_assisted'),
    'created_at',         v_prog.created_at,
    'events',             coalesce(v_events, '[]'::json)
  );
end;
$$;

-- ── update_wedding_programme ──────────────────────────────────────
-- Handles: date, region, guest_estimate, budget_target — all optional
create or replace function update_wedding_programme(
  p_uid            text,
  p_programme_id   uuid,
  p_date_start     date    default null,
  p_region         text    default null,
  p_guest_estimate numeric default null,
  p_budget_target  numeric default null
)
returns void
language plpgsql security definer
as $$
begin
  if not exists (
    select 1 from public.wedding_programs
    where id = p_programme_id
      and owner_id = p_uid
      and deleted_at is null
  ) then
    raise exception 'not_found';
  end if;

  update public.wedding_programs set
    date_start = coalesce(p_date_start, date_start),
    region     = coalesce(p_region,     region),
    updated_at = now()
  where id = p_programme_id and owner_id = p_uid;
end;
$$;

-- ── update_programme_priorities ───────────────────────────────────
-- Stores priorities in a separate column — add it if it doesn't exist
alter table public.wedding_programs
  add column if not exists priorities text[] default '{}';

create or replace function update_programme_priorities(
  p_uid          text,
  p_programme_id uuid,
  p_priorities   text[]
)
returns void
language plpgsql security definer
as $$
begin
  if not exists (
    select 1 from public.wedding_programs
    where id = p_programme_id
      and owner_id = p_uid
      and deleted_at is null
  ) then
    raise exception 'not_found';
  end if;

  update public.wedding_programs set
    priorities = p_priorities,
    updated_at = now()
  where id = p_programme_id and owner_id = p_uid;
end;
$$;

-- ── guest_estimate / budget_target columns ────────────────────────
-- Add these columns to the table since the RPC writes to them
alter table public.wedding_programs
  add column if not exists guest_estimate numeric,
  add column if not exists budget_target  numeric;

-- ── update_programme_stats ────────────────────────────────────────
-- Dedicated RPC for the Stats strip (guests + budget)
create or replace function update_programme_stats(
  p_uid            text,
  p_programme_id   uuid,
  p_guest_estimate numeric default null,
  p_budget_target  numeric default null
)
returns void
language plpgsql security definer
as $$
begin
  if not exists (
    select 1 from public.wedding_programs
    where id = p_programme_id
      and owner_id = p_uid
      and deleted_at is null
  ) then
    raise exception 'not_found';
  end if;

  update public.wedding_programs set
    guest_estimate = coalesce(p_guest_estimate, guest_estimate),
    budget_target  = coalesce(p_budget_target,  budget_target),
    updated_at     = now()
  where id = p_programme_id and owner_id = p_uid;
end;
$$;