-- ── update_sub_event ─────────────────────────────────────────────
create or replace function update_sub_event(
  p_uid          text,
  p_programme_id uuid,
  p_event_id     uuid,
  p_title        text        default null,
  p_event_date   date        default null,
  p_start_time   time        default null,
  p_end_time     time        default null
)
returns void
language plpgsql security definer
as $$
begin
  -- verify ownership
  if not exists (
    select 1 from public.wedding_programs
    where id = p_programme_id and owner_id = p_uid and deleted_at is null
  ) then
    raise exception 'not_found';
  end if;

  update public.events set
    title      = coalesce(p_title,      title),
    event_date = coalesce(p_event_date, event_date),
    start_time = coalesce(p_start_time, start_time),
    end_time   = coalesce(p_end_time,   end_time),
    updated_at = now()
  where id = p_event_id and program_id = p_programme_id;
end;
$$;

-- ── insert_sub_event ─────────────────────────────────────────────
create or replace function insert_sub_event(
  p_uid          text,
  p_programme_id uuid,
  p_title        text,
  p_event_date   date        default null,
  p_start_time   time        default null,
  p_end_time     time        default null
)
returns uuid
language plpgsql security definer
as $$
declare
  v_id uuid;
begin
  if not exists (
    select 1 from public.wedding_programs
    where id = p_programme_id and owner_id = p_uid and deleted_at is null
  ) then
    raise exception 'not_found';
  end if;

  insert into public.events (program_id, title, event_date, start_time, end_time)
  values (p_programme_id, p_title, p_event_date, p_start_time, p_end_time)
  returning id into v_id;

  return v_id;
end;
$$;

-- ── delete_sub_event ─────────────────────────────────────────────
create or replace function delete_sub_event(
  p_uid          text,
  p_programme_id uuid,
  p_event_id     uuid
)
returns void
language plpgsql security definer
as $$
begin
  if not exists (
    select 1 from public.wedding_programs
    where id = p_programme_id and owner_id = p_uid and deleted_at is null
  ) then
    raise exception 'not_found';
  end if;

  delete from public.events
  where id = p_event_id and program_id = p_programme_id;
end;
$$;

-- ── update_programme_details (hasPlanner field) ──────────────────
create or replace function update_programme_details(
  p_uid          text,
  p_programme_id uuid,
  p_has_planner  boolean default null
)
returns void
language plpgsql security definer
as $$
begin
  if not exists (
    select 1 from public.wedding_programs
    where id = p_programme_id and owner_id = p_uid and deleted_at is null
  ) then
    raise exception 'not_found';
  end if;

  update public.wedding_programs set
    planning_mode = case
      when p_has_planner = true  then 'planner_assisted'::planning_mode
      when p_has_planner = false then 'self_planning'::planning_mode
      else planning_mode
    end,
    updated_at = now()
  where id = p_programme_id and owner_id = p_uid;
end;
$$;