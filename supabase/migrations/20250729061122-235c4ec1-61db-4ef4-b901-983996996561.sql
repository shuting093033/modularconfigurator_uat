-- Create regional cost factors and industry benchmarks tables
CREATE TABLE IF NOT EXISTS regional_cost_factors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component_id TEXT NOT NULL,
  region_code TEXT NOT NULL,
  region_name TEXT NOT NULL,
  cost_multiplier NUMERIC(4,3) DEFAULT 1.000,
  labor_rate_adjustment NUMERIC(4,3) DEFAULT 1.000,
  material_cost_adjustment NUMERIC(4,3) DEFAULT 1.000,
  logistics_cost_factor NUMERIC(4,3) DEFAULT 1.000,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(component_id, region_code)
);

ALTER TABLE regional_cost_factors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Regional cost factors are viewable by everyone" ON regional_cost_factors FOR SELECT USING (true);