-- Apply after 202610300001_registrations.sql. One day pass per participant email.
begin;

create table public.festival_passes (
  email text primary key check (email = lower(email) and length(email) <= 254),
  token uuid not null unique default gen_random_uuid(),
  display_name text not null check (length(display_name) <= 160),
  phone text not null default '' check (length(phone) <= 30),
  checked_in_at timestamptz,
  checked_in_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index festival_passes_arrivals on public.festival_passes(checked_in_at);
alter table public.festival_passes enable row level security;
revoke all on public.festival_passes from public, anon, authenticated;
grant select, insert, update, delete on public.festival_passes to service_role;

create function public.ensure_festival_passes() returns trigger
language plpgsql security definer set search_path = '' as $$
declare person jsonb; person_email text;
begin
  if new.status <> 'approved' then return new; end if;
  for person in select value from jsonb_array_elements(jsonb_build_array(new.participant) || new.members)
  loop
    person_email := lower(trim(person->>'email'));
    if person_email <> '' then
      insert into public.festival_passes(email, display_name, phone)
      values(person_email, left(coalesce(person->>'name',''),160), left(coalesce(person->>'phone',''),30))
      on conflict(email) do update set
        display_name = case when public.festival_passes.display_name = '' then excluded.display_name else public.festival_passes.display_name end,
        phone = case when public.festival_passes.phone = '' then excluded.phone else public.festival_passes.phone end,
        updated_at = now();
    end if;
  end loop;
  return new;
end;
$$;
revoke all on function public.ensure_festival_passes() from public,anon,authenticated;
create trigger approved_festival_passes after insert or update of status on public.event_registrations
  for each row execute function public.ensure_festival_passes();

-- Give already approved participants their passes when this migration is applied.
insert into public.festival_passes(email,display_name,phone)
select distinct on (lower(trim(person->>'email')))
  lower(trim(person->>'email')), left(coalesce(person->>'name',''),160), left(coalesce(person->>'phone',''),30)
from public.event_registrations r
cross join lateral jsonb_array_elements(jsonb_build_array(r.participant) || r.members) person
where r.status='approved' and coalesce(person->>'email','') <> ''
order by lower(trim(person->>'email')), r.created_at
on conflict(email) do nothing;

create function public.check_in_festival_pass(p_actor uuid,p_token uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare pass public.festival_passes; active_count integer;
begin
  perform 1 from public.organisers where user_id=p_actor for share;
  if not found then raise exception 'NOT_ORGANISER'; end if;
  select * into pass from public.festival_passes where token=p_token for update;
  if not found then raise exception 'PASS_NOT_FOUND'; end if;
  select count(*) into active_count from public.event_registrations r
  where r.status='approved' and (
    lower(r.participant->>'email')=pass.email or
    exists(select 1 from jsonb_array_elements(r.members) m where lower(m->>'email')=pass.email)
  );
  if active_count=0 then raise exception 'NO_ACTIVE_EVENTS'; end if;
  if pass.checked_in_at is not null then
    return jsonb_build_object('result','already_checked_in','checkedInAt',pass.checked_in_at);
  end if;
  update public.festival_passes set checked_in_at=now(),checked_in_by=p_actor,updated_at=now()
    where email=pass.email returning * into pass;
  insert into public.registration_audit(actor_id,action,details)
    values(p_actor,'attendee_checked_in',jsonb_build_object('email',pass.email));
  return jsonb_build_object('result','checked_in','checkedInAt',pass.checked_in_at);
end;
$$;
revoke all on function public.check_in_festival_pass(uuid,uuid) from public,anon,authenticated;
grant execute on function public.check_in_festival_pass(uuid,uuid) to service_role;

create function public.reverse_festival_check_in(p_actor uuid,p_token uuid,p_reason text)
returns void language plpgsql security definer set search_path = '' as $$
declare pass public.festival_passes;
begin
  perform 1 from public.organisers where user_id=p_actor for share;
  if not found then raise exception 'NOT_ORGANISER'; end if;
  if length(trim(p_reason)) < 5 or length(p_reason) > 500 then raise exception 'REASON_REQUIRED'; end if;
  select * into pass from public.festival_passes where token=p_token for update;
  if not found or pass.checked_in_at is null then raise exception 'NOT_CHECKED_IN'; end if;
  update public.festival_passes set checked_in_at=null,checked_in_by=null,updated_at=now() where email=pass.email;
  insert into public.registration_audit(actor_id,action,note,details)
    values(p_actor,'attendee_check_in_reversed',trim(p_reason),jsonb_build_object('email',pass.email));
end;
$$;
revoke all on function public.reverse_festival_check_in(uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.reverse_festival_check_in(uuid,uuid,text) to service_role;
commit;
