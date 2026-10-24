-- Profiles: one row per Hookline account, for things people save, like their YouTube channel.
-- To set it up, open your Supabase project → SQL Editor → New query, paste this file, click Run.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  -- What the person typed for their channel: an @handle or a channel ID (UC…). Hookline stores
  -- only this, never data copied from YouTube.
  youtube_channel text check (char_length(youtube_channel) between 3 and 64),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Who can reach the table at all. Visitors who aren't signed in can't.
revoke all on public.profiles from anon;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.profiles to service_role;

-- Which rows: signed-in people can only see and change their own.
-- (The "drop … if exists" lines make it safe to run this file again.)
alter table public.profiles enable row level security;

drop policy if exists "Read your own profile" on public.profiles;
create policy "Read your own profile" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Create your own profile" on public.profiles;
create policy "Create your own profile" on public.profiles
  for insert to authenticated
  with check ((select auth.uid()) = id);

drop policy if exists "Update your own profile" on public.profiles;
create policy "Update your own profile" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Deleting an account deletes its profile too (the "on delete cascade" above).