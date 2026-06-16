insert into public.templates (id, name, category, description, is_premium, is_active, layout_type)
values (
  'creative-portfolio',
  'Creative Portfolio',
  'Creative',
  'A polished purple-accent resume template for designers and creatives who want to showcase portfolio projects, design skills, and achievements with a modern visual layout.',
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
