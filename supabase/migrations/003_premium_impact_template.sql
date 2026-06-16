insert into public.templates (id, name, category, description, is_premium, is_active, layout_type)
values (
  'premium-impact',
  'Premium Impact',
  'Executive',
  'A polished navy-and-gold resume designed for experienced professionals who want to highlight leadership, achievements, and measurable impact.',
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
