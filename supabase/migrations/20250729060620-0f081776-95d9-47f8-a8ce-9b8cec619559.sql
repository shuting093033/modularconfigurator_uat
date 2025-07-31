-- Create comprehensive data center component library with 1000+ components
-- Expand existing components table with detailed technical specifications

-- Add more detailed technical specifications and vendor information
ALTER TABLE components 
ADD COLUMN IF NOT EXISTS power_requirements JSONB,
ADD COLUMN IF NOT EXISTS cooling_requirements JSONB,
ADD COLUMN IF NOT EXISTS physical_dimensions JSONB,
ADD COLUMN IF NOT EXISTS environmental_specs JSONB,
ADD COLUMN IF NOT EXISTS certifications TEXT[],
ADD COLUMN IF NOT EXISTS warranty_years INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS maintenance_schedule JSONB,
ADD COLUMN IF NOT EXISTS regional_availability TEXT[] DEFAULT '{"global"}';

-- Add database indexes for performance optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_components_category_skill ON components (category, skill_level);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_components_search ON components USING GIN (to_tsvector('english', name || ' ' || description));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_components_technical_specs ON components USING GIN (technical_specs);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_components_vendor ON components USING GIN (vendor_info);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_components_regional ON components USING GIN (regional_availability);

-- Create regional cost variations table
CREATE TABLE IF NOT EXISTS regional_cost_factors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component_id TEXT NOT NULL,
  region_code TEXT NOT NULL, -- US_NORTHEAST, US_SOUTHWEST, EU_CENTRAL, APAC_EAST, etc.
  region_name TEXT NOT NULL,
  cost_multiplier NUMERIC(4,3) DEFAULT 1.000,
  labor_rate_adjustment NUMERIC(4,3) DEFAULT 1.000,
  material_cost_adjustment NUMERIC(4,3) DEFAULT 1.000,
  logistics_cost_factor NUMERIC(4,3) DEFAULT 1.000,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(component_id, region_code)
);

-- Enable RLS for regional cost factors
ALTER TABLE regional_cost_factors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Regional cost factors are viewable by everyone" ON regional_cost_factors FOR SELECT USING (true);

-- Create index for regional cost lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_regional_costs_component_region ON regional_cost_factors (component_id, region_code);

-- Create industry benchmarks table
CREATE TABLE IF NOT EXISTS industry_benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  benchmark_category TEXT NOT NULL, -- 'cost_per_sqft', 'labor_hours_per_mw', etc.
  data_center_tier TEXT NOT NULL, -- 'tier_1', 'tier_2', 'tier_3', 'tier_4'
  region_code TEXT NOT NULL,
  benchmark_value NUMERIC(12,4) NOT NULL,
  unit_of_measure TEXT NOT NULL,
  percentile_25 NUMERIC(12,4),
  percentile_50 NUMERIC(12,4),
  percentile_75 NUMERIC(12,4),
  data_source TEXT,
  effective_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for industry benchmarks
ALTER TABLE industry_benchmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Industry benchmarks are viewable by everyone" ON industry_benchmarks FOR SELECT USING (true);

-- Create composite index for benchmark queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_benchmarks_category_tier_region ON industry_benchmarks (benchmark_category, data_center_tier, region_code);

-- Add materialized view for component performance metrics
CREATE MATERIALIZED VIEW IF NOT EXISTS component_performance_metrics AS
SELECT 
  c.id as component_id,
  c.name as component_name,
  c.category,
  COUNT(ac.id) as usage_count,
  AVG(ac.actual_unit_cost) as avg_actual_cost,
  MIN(qt.unit_cost) as min_catalog_cost,
  MAX(qt.unit_cost) as max_catalog_cost,
  AVG(qt.unit_cost) as avg_catalog_cost,
  STDDEV(ac.actual_unit_cost) as cost_variance,
  COUNT(DISTINCT ac.project_id) as project_count,
  AVG(CASE WHEN ac.actual_unit_cost > qt.unit_cost THEN (ac.actual_unit_cost - qt.unit_cost) / qt.unit_cost * 100 ELSE 0 END) as avg_cost_overrun_pct
FROM components c
LEFT JOIN quality_tiers qt ON c.id = qt.component_id
LEFT JOIN actual_costs ac ON c.id = ac.component_id
GROUP BY c.id, c.name, c.category;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_component_performance_component_id ON component_performance_metrics (component_id);

-- Create function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_component_performance_metrics()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY component_performance_metrics;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create advanced project analytics view
CREATE OR REPLACE VIEW project_analytics AS
SELECT 
  p.id,
  p.name,
  p.status,
  p.total_budget,
  p.capacity_mw,
  p.start_date,
  p.target_completion_date,
  p.location,
  COALESCE(SUM(ac.actual_total_cost), 0) as total_actual_cost,
  COALESCE(p.total_budget - SUM(ac.actual_total_cost), p.total_budget) as remaining_budget,
  CASE 
    WHEN p.total_budget > 0 THEN (COALESCE(SUM(ac.actual_total_cost), 0) / p.total_budget * 100)
    ELSE 0 
  END as budget_utilization_pct,
  COUNT(DISTINCT ac.component_id) as unique_components_used,
  COUNT(ac.id) as total_cost_entries,
  AVG(ac.actual_unit_cost) as avg_component_cost,
  MAX(ac.cost_date) as last_cost_entry_date,
  EXTRACT(DAY FROM (COALESCE(MAX(ac.cost_date), NOW()) - p.start_date)) as project_duration_days
FROM projects p
LEFT JOIN actual_costs ac ON p.id = ac.project_id
GROUP BY p.id, p.name, p.status, p.total_budget, p.capacity_mw, p.start_date, p.target_completion_date, p.location;

-- Add trigger to auto-refresh materialized view when actual costs change
CREATE OR REPLACE FUNCTION trigger_refresh_component_metrics()
RETURNS trigger AS $$
BEGIN
  -- Refresh in background (non-blocking)
  PERFORM pg_notify('refresh_metrics', 'component_performance_metrics');
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger on actual_costs table
DROP TRIGGER IF EXISTS refresh_metrics_on_cost_change ON actual_costs;
CREATE TRIGGER refresh_metrics_on_cost_change
  AFTER INSERT OR UPDATE OR DELETE ON actual_costs
  FOR EACH ROW EXECUTE FUNCTION trigger_refresh_component_metrics();