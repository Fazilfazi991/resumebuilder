insert into public.templates (id, name, category, description, is_premium, is_active, layout_type)
values (
  'modern-engineer',
  'Modern Engineer',
  'Tech',
  'A polished green-and-white technical resume designed for software engineers and IT professionals who want to highlight skills, projects, certifications, and measurable achievements.',
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
