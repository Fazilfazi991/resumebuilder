-- Apply only after the relaunch application has been deployed and legacy
-- public photo URLs have been verified through /api/resume-photo.
-- This migration changes access policy only; it does not delete or rewrite objects.

insert into storage.buckets (id, name, public)
values ('resume-photos', 'resume-photos', false)
on conflict (id) do update set public = false;

drop policy if exists "resume_photos_public_read" on storage.objects;
drop policy if exists "resume_photos_owner_read" on storage.objects;

create policy "resume_photos_owner_read"
on storage.objects for select
to authenticated
using (
  bucket_id = 'resume-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

-- Recreate the write policies idempotently and keep them owner-only.
drop policy if exists "resume_photos_owner_insert" on storage.objects;
drop policy if exists "resume_photos_owner_update" on storage.objects;
drop policy if exists "resume_photos_owner_delete" on storage.objects;

create policy "resume_photos_owner_insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'resume-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "resume_photos_owner_update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'resume-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'resume-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "resume_photos_owner_delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'resume-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
