-- Add database-level security constraints and validation triggers

-- Add check constraints for critical fields
ALTER TABLE estimates ADD CONSTRAINT check_estimate_name_length 
  CHECK (length(name) >= 1 AND length(name) <= 100);

ALTER TABLE estimates ADD CONSTRAINT check_estimate_total_cost 
  CHECK (total_cost >= 0 AND total_cost <= 999999999999);

ALTER TABLE estimate_items ADD CONSTRAINT check_item_quantity 
  CHECK (quantity > 0 AND quantity <= 999999);

ALTER TABLE estimate_items ADD CONSTRAINT check_item_cost 
  CHECK (total_cost >= 0 AND total_cost <= 999999999999);

ALTER TABLE components ADD CONSTRAINT check_component_name_length 
  CHECK (length(name) >= 1 AND length(name) <= 100);

ALTER TABLE quality_tiers ADD CONSTRAINT check_quality_tier_cost 
  CHECK (unit_cost >= 0 AND unit_cost <= 999999999999);

-- Add validation trigger for estimates
CREATE OR REPLACE FUNCTION validate_estimate_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Sanitize text fields
  NEW.name = trim(regexp_replace(NEW.name, '[<>]', '', 'g'));
  
  -- Validate name length
  IF length(NEW.name) < 1 OR length(NEW.name) > 100 THEN
    RAISE EXCEPTION 'Estimate name must be between 1 and 100 characters';
  END IF;
  
  -- Validate cost
  IF NEW.total_cost < 0 OR NEW.total_cost > 999999999999 THEN
    RAISE EXCEPTION 'Total cost must be between 0 and 999,999,999,999';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_estimate_before_insert_update
  BEFORE INSERT OR UPDATE ON estimates
  FOR EACH ROW
  EXECUTE FUNCTION validate_estimate_data();

-- Add validation trigger for components
CREATE OR REPLACE FUNCTION validate_component_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Sanitize text fields
  NEW.name = trim(regexp_replace(NEW.name, '[<>]', '', 'g'));
  NEW.category = trim(regexp_replace(NEW.category, '[<>]', '', 'g'));
  
  IF NEW.description IS NOT NULL THEN
    NEW.description = trim(regexp_replace(NEW.description, '[<>]', '', 'g'));
  END IF;
  
  -- Validate name length
  IF length(NEW.name) < 1 OR length(NEW.name) > 100 THEN
    RAISE EXCEPTION 'Component name must be between 1 and 100 characters';
  END IF;
  
  -- Validate category length
  IF length(NEW.category) < 1 OR length(NEW.category) > 100 THEN
    RAISE EXCEPTION 'Component category must be between 1 and 100 characters';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_component_before_insert_update
  BEFORE INSERT OR UPDATE ON components
  FOR EACH ROW
  EXECUTE FUNCTION validate_component_data();

-- Add audit logging function
CREATE OR REPLACE FUNCTION log_security_event()
RETURNS TRIGGER AS $$
BEGIN
  -- Log critical security events
  IF TG_OP = 'DELETE' THEN
    INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at)
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      json_build_object(
        'event', 'DELETE',
        'table', TG_TABLE_NAME,
        'user_id', auth.uid(),
        'timestamp', now()
      ),
      now()
    );
    RETURN OLD;
  ELSE
    INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at)
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      json_build_object(
        'event', TG_OP,
        'table', TG_TABLE_NAME,
        'user_id', auth.uid(),
        'timestamp', now()
      ),
      now()
    );
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers for sensitive tables
CREATE TRIGGER audit_estimates
  AFTER INSERT OR UPDATE OR DELETE ON estimates
  FOR EACH ROW
  EXECUTE FUNCTION log_security_event();

CREATE TRIGGER audit_components
  AFTER INSERT OR UPDATE OR DELETE ON components
  FOR EACH ROW
  EXECUTE FUNCTION log_security_event();

-- Add user activity tracking
CREATE TABLE IF NOT EXISTS user_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  resource_type text,
  resource_id text,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on activity log
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

-- Users can only view their own activity
CREATE POLICY "Users can view their own activity" ON user_activity_log
  FOR SELECT USING (auth.uid() = user_id);

-- System can insert activity logs
CREATE POLICY "System can log user activity" ON user_activity_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);