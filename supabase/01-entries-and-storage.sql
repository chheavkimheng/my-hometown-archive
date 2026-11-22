-- 01-entries-and-storage.sql
--
-- The entries table, its first row-level security policies, the slug column that links
-- the first eight entries to their Khmer text, the photos bucket and the text-length checks.
-- Run this first. The review gate (02) then drops "anyone can read entries" and replaces
-- the add and edit policies below. It leaves the delete policy as it is.

-- Lab 6 Part 1: the entries table and its first four policies
create table entries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  owner uuid not null references auth.users (id),
  title text not null,
  description text not null,
  contributor text not null,
  place text,
  photo_url text
);

alter table entries enable row level security;

create policy "anyone can read entries"
  on entries for select using (true);

create policy "owners add their own entries"
  on entries for insert with check (auth.uid() = owner);

create policy "owners edit their own entries"
  on entries for update using (auth.uid() = owner);

create policy "owners delete their own entries"
  on entries for delete using (auth.uid() = owner);

-- Lab 6 fix: a slug column, so the first eight entries can find their Khmer text in
-- data/translations.js. On a new database there are no rows yet, so these updates change
-- nothing. They match the titles of my original eight entries.
alter table entries add column slug text;

update entries set slug = 'entry1' where title = 'Welcoming the New Year Tevada';
update entries set slug = 'entry2' where title = 'Stir-Fried Glass Noodles';
update entries set slug = 'entry3' where title = 'Building the Sand Stupas (Phnom Khsach)';
update entries set slug = 'entry4' where title = 'Bathing the Buddha Statues and Elders (Srong Preah)';
update entries set slug = 'entry5' where title = 'Chol Chhoung (Scarf-Tossing Game)';
update entries set slug = 'entry6' where title = 'Leak Kanseng (Hide the Scarf Game)';
update entries set slug = 'entry7' where title = 'Kralan (Bamboo Sticky Rice)';
update entries set slug = 'entry8' where title = 'Nom Ansom Chek (Banana Sticky Rice Cake)';

-- Lab 7 Part 0: a public bucket for entry photos: images only, 5 MB max
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photos', 'photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = true,
      file_size_limit = 5242880,
      allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

-- logged-in contributors can upload, but only into a folder named after their own id
create policy "contributors upload into their own folder"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid()::text));

-- and delete only what's in their own folder
create policy "contributors delete their own photos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid()::text));

-- Lab 7 Part 3: length checks, so the database refuses what the form should have caught
alter table entries
  add constraint entries_title_length
  check (char_length(trim(title)) > 0 and char_length(trim(title)) <= 100);

alter table entries
  add constraint entries_description_length
  check (char_length(trim(description)) > 0 and char_length(trim(description)) <= 1000);

alter table entries
  add constraint entries_contributor_length
  check (char_length(trim(contributor)) > 0 and char_length(trim(contributor)) <= 100);

alter table entries
  add constraint entries_place_length
  check (place is null or char_length(trim(place)) <= 150);

alter table entries
  add constraint entries_photo_required
  check (photo_url is not null and char_length(trim(photo_url)) > 0);

-- Table privileges, kept to the minimum. In Week 6 the Data API could not reach this table
-- until it was granted privileges. These are the final, least-privilege versions:
-- logged-out visitors can only read, logged-in users can read and write, and the
-- row-level security policies above decide which rows each of them may touch.
revoke all on table public.entries from anon, authenticated;
grant select on table public.entries to anon;
grant select, insert, update, delete on table public.entries to authenticated;