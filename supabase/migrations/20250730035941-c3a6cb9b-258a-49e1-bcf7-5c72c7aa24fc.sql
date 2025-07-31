-- Fix function search path security warnings

-- Update validate_estimate_data function with proper search path
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Update validate_component_data function with proper search path
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Update log_security_event function with proper search path
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';