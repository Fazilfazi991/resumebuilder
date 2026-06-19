-- Resumi resume photo storage setup.
-- Create a Supabase Storage bucket named "resume-photos".
-- Recommended bucket setting: public read, with uploads restricted by these policies.
--
-- Dashboard option:
-- Storage > New bucket > Name: resume-photos > Public bucket: enabled.
--
-- SQL option:
insert into storage.buckets (id, name, public)
values ('resume-photos', 'resume-photos', true)
on conflict (id) do update set public = true;

drop policy if exists "resume_photos_public_read" on storage.objects;
drop policy if exists "resume_photos_owner_insert" on storage.objects;
drop policy if exists "resume_photos_owner_update" on storage.objects;
drop policy if exists "resume_photos_owner_delete" on storage.objects;

create policy "resume_photos_public_read"
on storage.objects for select
using (bucket_id = 'resume-photos');

create policy "resume_photos_owner_insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'resume-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "resume_photos_owner_update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'resume-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'resume-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "resume_photos_owner_delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'resume-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);
