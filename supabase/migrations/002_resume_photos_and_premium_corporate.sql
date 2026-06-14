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

insert into public.templates (id, name, category, description, is_premium, is_active, layout_type)
values (
  'premium-corporate',
  'Premium Corporate',
  'Executive',
  'Premium two-column resume with a navy sidebar, photo, skill bars, and refined corporate hierarchy.',
  true,
  true,
  'two-column'
)
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  description = excluded.description,
  is_premium = excluded.is_premium,
  is_active = excluded.is_active,
  layout_type = excluded.layout_type;
