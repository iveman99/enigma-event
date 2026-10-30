-- Apply after 202610290001_signup.sql. No private keys are needed in SQL Editor.
begin;
alter table public.profiles add column id_card_path text not null default '';
grant select, update on public.profiles to service_role;
create table public.organisers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table public.payment_settings (
  id boolean primary key default true check(id),
  enabled boolean not null default false,
  payee text not null default '' check(length(payee) <= 120),
  upi_id text not null default '' check(length(upi_id) <= 150),
  qr_path text not null default '',
  open_events text[] not null default array['compile-vibes','blind-dates','decode-hunt','fifa-addicts'],
  updated_at timestamptz not null default now(),
  check (not enabled or (length(payee) > 1 and length(upi_id) > 3 and qr_path <> ''))
);
insert into public.payment_settings(id) values(true);
create table public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  event_id text not null check(event_id in ('compile-vibes','blind-dates','decode-hunt','fifa-addicts')),
  event_title text not null,
  team_name text not null default '', members jsonb not null default '[]' check(jsonb_typeof(members)='array' and jsonb_array_length(members)<=2),
  participant jsonb not null, id_card_path text not null, receipt_path text not null,
  transaction_reference text not null check(transaction_reference ~ '^[A-Z0-9-]{6,50}$'),
  amount integer not null check(amount in (99,149)),
  status text not null default 'pending' check(status in ('pending','approved','rejected','archived')),
  ticket_code text unique, review_note text not null default '' check(length(review_note)<=1000),
  reviewed_by uuid references auth.users(id), reviewed_at timestamptz,
  version integer not null default 1,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(user_id,event_id), unique(transaction_reference), unique(receipt_path),
  check ((status='approved') = (ticket_code is not null))
);
create index registration_queue on public.event_registrations(status,created_at);
create table public.registration_audit (
  id bigint generated always as identity primary key,
  registration_id uuid references public.event_registrations(id),
  actor_id uuid not null references auth.users(id),
  action text not null, note text not null default '', details jsonb not null default '{}',
  created_at timestamptz not null default now()
);
alter table public.organisers enable row level security;
alter table public.payment_settings enable row level security;
alter table public.event_registrations enable row level security;
alter table public.registration_audit enable row level security;
revoke all on public.organisers, public.payment_settings, public.event_registrations, public.registration_audit from public,anon,authenticated;
grant select,insert,update,delete on public.organisers, public.payment_settings, public.event_registrations, public.registration_audit to service_role;
grant usage,select on sequence public.registration_audit_id_seq to service_role;

-- Only verified server routes may execute these atomic operations. Identity comes
-- from auth.getUser(), never from browser payloads. Direct student writes denied.
create function public.submit_event_registration(p_actor uuid, p_event text, p_team text, p_members jsonb, p_receipt text, p_reference text)
returns public.event_registrations language plpgsql security definer set search_path='' as $$
declare
  p public.profiles; settings public.payment_settings; existing public.event_registrations;
  result public.event_registrations; participant_email text; event_name text; team_size integer;
begin
  select * into p from public.profiles where id=p_actor for share;
  select email into participant_email from auth.users where id=p_actor and email_confirmed_at is not null;
  if participant_email is null or p.first_name='' or p.last_name='' or p.phone='' or p.college='' or p.course='' or p.id_card_path='' then raise exception 'PROFILE_INCOMPLETE'; end if;
  select * into settings from public.payment_settings where id=true for share;
  if not settings.enabled or not(p_event=any(settings.open_events)) then raise exception 'REGISTRATIONS_CLOSED'; end if;
  if jsonb_typeof(p_members) <> 'array' then raise exception 'INVALID_TEAM'; end if;
  team_size := jsonb_array_length(p_members)+1;
  event_name := case p_event when 'compile-vibes' then 'Compile The Vibes' when 'blind-dates' then 'Blind Date with Code' when 'decode-hunt' then 'Decode The Hunt' when 'fifa-addicts' then 'FIFA Addicts' else null end;
  if event_name is null or team_size>3 or (p_event in ('blind-dates','fifa-addicts') and team_size<>1) or (p_event='decode-hunt' and team_size<2) or (team_size>1 and length(trim(p_team))<2) then raise exception 'INVALID_TEAM'; end if;
  if p_receipt !~ ('^' || p_actor::text || '/receipt/[a-f0-9-]{36}\.jpg$') then raise exception 'INVALID_RECEIPT'; end if;
  -- Serialise submissions by the same student, including first insert races.
  perform pg_advisory_xact_lock(hashtextextended(p_actor::text,0));
  select * into existing from public.event_registrations where user_id=p_actor and event_id=p_event for update;
  if found and existing.status <> 'rejected' then raise exception 'ALREADY_REGISTERED'; end if;
  insert into public.event_registrations(user_id,event_id,event_title,team_name,members,participant,id_card_path,receipt_path,transaction_reference,amount)
  values(p_actor,p_event,event_name,case when team_size>1 then trim(p_team) else '' end,p_members,
    jsonb_build_object('name',p.first_name || ' ' || p.last_name,'email',participant_email,'phone',p.phone,'college',p.college,'course',p.course),
    p.id_card_path,p_receipt,upper(trim(p_reference)),case when team_size>1 then 149 else 99 end)
  on conflict(user_id,event_id) do update set
    team_name=excluded.team_name,members=excluded.members,participant=excluded.participant,id_card_path=excluded.id_card_path,
    receipt_path=excluded.receipt_path,transaction_reference=excluded.transaction_reference,amount=excluded.amount,
    status='pending',ticket_code=null,review_note='',reviewed_by=null,reviewed_at=null,version=public.event_registrations.version+1,updated_at=now()
  returning * into result;
  insert into public.registration_audit(registration_id,actor_id,action,details) values(result.id,p_actor,case when existing.id is null then 'submitted' else 'resubmitted' end,
    jsonb_build_object('receipt_path',p_receipt,'transaction_reference',upper(trim(p_reference))));
  return result;
end;
$$;
create function public.review_event_registration(p_actor uuid,p_id uuid,p_version integer,p_decision text,p_note text)
returns public.event_registrations language plpgsql security definer set search_path='' as $$
declare result public.event_registrations;
begin
  perform 1 from public.organisers where user_id=p_actor for share;
  if not found then raise exception 'NOT_ORGANISER'; end if;
  if p_decision not in ('approved','rejected') or length(p_note)>1000 or (p_decision='rejected' and length(trim(p_note))<5) then raise exception 'INVALID_REVIEW'; end if;
  select * into result from public.event_registrations where id=p_id for update;
  if not found or result.status<>'pending' or result.version<>p_version then raise exception 'REVIEW_CONFLICT'; end if;
  if result.user_id=p_actor then raise exception 'SELF_REVIEW'; end if;
  update public.event_registrations set status=p_decision,review_note=trim(p_note),reviewed_by=p_actor,reviewed_at=now(),updated_at=now(),version=version+1,
    ticket_code=case when p_decision='approved' then 'ENG27-' || upper(replace(id::text,'-','')) else null end
    where id=p_id returning * into result;
  insert into public.registration_audit(registration_id,actor_id,action,note) values(p_id,p_actor,p_decision,trim(p_note));
  return result;
end;
$$;
revoke all on function public.submit_event_registration(uuid,text,text,jsonb,text,text) from public,anon,authenticated;
revoke all on function public.review_event_registration(uuid,uuid,integer,text,text) from public,anon,authenticated;
grant execute on function public.submit_event_registration(uuid,text,text,jsonb,text,text) to service_role;
grant execute on function public.review_event_registration(uuid,uuid,integer,text,text) to service_role;

create function public.save_payment_settings(p_actor uuid,p_enabled boolean,p_payee text,p_upi text,p_qr text,p_events text[])
returns void language plpgsql security definer set search_path='' as $$
begin
  perform 1 from public.organisers where user_id=p_actor for share;
  if not found then raise exception 'NOT_ORGANISER'; end if;
  update public.payment_settings set enabled=p_enabled,payee=p_payee,upi_id=p_upi,qr_path=p_qr,open_events=p_events,updated_at=now() where id=true;
  insert into public.registration_audit(actor_id,action,details) values(p_actor,'payment_settings_updated',jsonb_build_object('enabled',p_enabled,'events',p_events,'payee',p_payee,'upi_id',p_upi,'qr_path',p_qr));
end;
$$;
revoke all on function public.save_payment_settings(uuid,boolean,text,text,text,text[]) from public,anon,authenticated;
grant execute on function public.save_payment_settings(uuid,boolean,text,text,text,text[]) to service_role;

create function public.manage_event_registration(p_actor uuid,p_id uuid,p_version integer,p_action text,p_team text,p_note text)
returns public.event_registrations language plpgsql security definer set search_path='' as $$
declare result public.event_registrations;
begin
  perform 1 from public.organisers where user_id=p_actor for share;
  if not found then raise exception 'NOT_ORGANISER'; end if;
  select * into result from public.event_registrations where id=p_id for update;
  if not found or result.version<>p_version or result.status='archived' then raise exception 'REVIEW_CONFLICT'; end if;
  if result.user_id=p_actor then raise exception 'SELF_REVIEW'; end if;
  if p_action not in ('edit','archive') or length(trim(p_note))<5 or length(p_note)>1000 or length(p_team)>80 then raise exception 'INVALID_MANAGEMENT'; end if;
  if p_action='edit' and ((jsonb_array_length(result.members)>0 and length(trim(p_team))<2) or (jsonb_array_length(result.members)=0 and length(trim(p_team))>0)) then raise exception 'INVALID_MANAGEMENT'; end if;
  update public.event_registrations set team_name=case when p_action='edit' then trim(p_team) else team_name end,
    status=case when p_action='archive' then 'archived' else status end,
    ticket_code=case when p_action='archive' then null else ticket_code end,
    review_note=case when p_action='archive' then trim(p_note) else review_note end,
    updated_at=now(),version=version+1 where id=p_id returning * into result;
  insert into public.registration_audit(registration_id,actor_id,action,note) values(p_id,p_actor,p_action,trim(p_note));
  return result;
end;
$$;
revoke all on function public.manage_event_registration(uuid,uuid,integer,text,text,text) from public,anon,authenticated;
grant execute on function public.manage_event_registration(uuid,uuid,integer,text,text,text) to service_role;

-- Private bucket: no anonymous or authenticated storage policies. All reads use
-- short-lived signed URLs after ownership/organiser checks in the server.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('enigma-documents','enigma-documents',false,1048576,array['image/jpeg'])
on conflict(id) do nothing;
commit;
