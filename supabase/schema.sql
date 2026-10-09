-- Run this script in Supabase Dashboard > SQL Editor.
-- Each signed-in user can access only their own notes.

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null check (char_length(trim(title)) > 0),
  body text not null check (char_length(trim(body)) > 0),
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notes_user_id_created_at_idx
  on public.notes (user_id, created_at desc);

alter table public.notes enable row level security;

-- Do not expose notes to signed-out/public clients.
revoke all on table public.notes from anon, authenticated;
grant select, insert, update, delete on table public.notes to authenticated;

drop policy if exists "Users can read their own notes" on public.notes;
create policy "Users can read their own notes"
  on public.notes for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own notes" on public.notes;
create policy "Users can create their own notes"
  on public.notes for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own notes" on public.notes;
create policy "Users can update their own notes"
  on public.notes for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own notes" on public.notes;
create policy "Users can delete their own notes"
  on public.notes for delete
  to authenticated
  using ((select auth.uid()) = user_id);
