-- Fix the search function to have immutable search_path
CREATE OR REPLACE FUNCTION public.search_components_text(search_query text)
RETURNS TABLE (
  id text,
  name text,
  category text,
  description text,
  unit text,
  rank real
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    c.id,
    c.name,
    c.category,
    c.description,
    c.unit,
    ts_rank(to_tsvector('english', c.name || ' ' || COALESCE(c.description, '')), plainto_tsquery('english', search_query)) as rank
  FROM components c
  WHERE to_tsvector('english', c.name || ' ' || COALESCE(c.description, '')) @@ plainto_tsquery('english', search_query)
  ORDER BY rank DESC
  LIMIT 10;
$$;