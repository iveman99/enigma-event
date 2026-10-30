-- First sign in with these organiser accounts on the website.
-- These addresses must first sign in and verify their email. This does not create inboxes.
insert into public.organisers(user_id)
select id from auth.users
where email_confirmed_at is not null
  and lower(email) in (
    'mayur@enigmaudcs.in',
    'veman@enigmaudcs.in',
    'deeksha@enigmaudcs.in'
  )
on conflict(user_id) do nothing;

select u.email as authorised_organiser
from public.organisers o join auth.users u on u.id=o.user_id
order by u.email;
