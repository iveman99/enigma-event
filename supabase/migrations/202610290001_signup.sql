-- Run once in Supabase SQL Editor, or apply with supabase db push.
begin;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null default '' check (char_length(first_name) <= 80),
  last_name text not null default '' check (char_length(last_name) <= 80),
  phone text not null default '' check (phone = '' or phone ~ '^\+[1-9][0-9]{7,14}$'),
  college text not null default '' check (char_length(college) <= 200),
  course text not null default '' check (char_length(course) <= 120),
  year text not null default '' check (char_length(year) <= 80),
  prn text not null default '' check (char_length(prn) <= 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (first_name, last_name, phone, college, course, year, prn) on public.profiles to authenticated;

create policy "Students read their own profile" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "Students update their own profile" on public.profiles
  for update to authenticated using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create function public.set_profile_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger profile_updated_at before update on public.profiles
  for each row execute function public.set_profile_updated_at();

-- Runs for email OTP and OAuth accounts. No role is read from user metadata.
create function public.create_student_profile() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  full_name text := coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '');
  phone_value text := coalesce(new.raw_user_meta_data->>'phone', '');
begin
  insert into public.profiles (id, first_name, last_name, phone)
  values (
    new.id,
    left(trim(coalesce(new.raw_user_meta_data->>'first_name', split_part(full_name, ' ', 1))), 80),
    left(trim(coalesce(new.raw_user_meta_data->>'last_name', case when position(' ' in full_name) > 0 then substr(full_name, position(' ' in full_name) + 1) else '' end)), 80),
    case when phone_value ~ '^\+[1-9][0-9]{7,14}$' then phone_value else '' end
  );
  return new;
end;
$$;
revoke all on function public.create_student_profile() from public;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.create_student_profile();

-- Existing Supabase users get an empty profile, completed after verified login.
insert into public.profiles(id) select id from auth.users on conflict (id) do nothing;

create table public.auth_rate_limits (
  key text primary key check (char_length(key) <= 100),
  window_started_at timestamptz not null,
  attempts integer not null check (attempts >= 1)
);
create index auth_rate_limits_window_idx on public.auth_rate_limits(window_started_at);
alter table public.auth_rate_limits enable row level security;
revoke all on public.auth_rate_limits from public, anon, authenticated;

create function public.consume_auth_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  updated_key text;
begin
  if p_limit < 1 or p_limit > 10000 or p_window_seconds < 10 or p_window_seconds > 86400 then
    raise exception 'Invalid rate limit parameters';
  end if;
  delete from public.auth_rate_limits where window_started_at < now() - interval '2 days';
  insert into public.auth_rate_limits (key, window_started_at, attempts)
  values (p_key, now(), 1)
  on conflict (key) do update set
    attempts = case when auth_rate_limits.window_started_at <= now() - make_interval(secs => p_window_seconds) then 1 else auth_rate_limits.attempts + 1 end,
    window_started_at = case when auth_rate_limits.window_started_at <= now() - make_interval(secs => p_window_seconds) then now() else auth_rate_limits.window_started_at end
  where auth_rate_limits.window_started_at <= now() - make_interval(secs => p_window_seconds)
     or auth_rate_limits.attempts < p_limit
  returning key into updated_key;
  return updated_key is not null;
end;
$$;
revoke all on function public.consume_auth_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_auth_rate_limit(text, integer, integer) to service_role;

commit;
