-- Split the migration into smaller parts to avoid transaction issues

-- Add columns to components table
ALTER TABLE components 
ADD COLUMN IF NOT EXISTS power_requirements JSONB,
ADD COLUMN IF NOT EXISTS cooling_requirements JSONB,
ADD COLUMN IF NOT EXISTS physical_dimensions JSONB,
ADD COLUMN IF NOT EXISTS environmental_specs JSONB,
ADD COLUMN IF NOT EXISTS certifications TEXT[],
ADD COLUMN IF NOT EXISTS warranty_years INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS maintenance_schedule JSONB,
ADD COLUMN IF NOT EXISTS regional_availability TEXT[] DEFAULT '{"global"}';