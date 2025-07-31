-- Phase 1: Create foundation schema for Data Center Construction Cost Management

-- Create Components table with enhanced data center specifications
CREATE TABLE public.components (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  unit TEXT NOT NULL,
  labor_hours DECIMAL(10,2),
  skill_level TEXT CHECK (skill_level IN ('entry', 'intermediate', 'expert', 'specialist')),
  vendor_info JSONB,
  lead_time_days INTEGER,
  technical_specs JSONB,
  material_waste_factor DECIMAL(5,4) DEFAULT 0.05,
  installation_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Quality Tiers table
CREATE TABLE public.quality_tiers (
  id TEXT NOT NULL PRIMARY KEY,
  component_id TEXT NOT NULL REFERENCES public.components(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  unit_cost DECIMAL(10,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Assemblies table
CREATE TABLE public.assemblies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID,
  labor_hours DECIMAL(10,2),
  installation_sequence INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Assembly Components junction table
CREATE TABLE public.assembly_components (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assembly_id UUID NOT NULL REFERENCES public.assemblies(id) ON DELETE CASCADE,
  component_id TEXT NOT NULL REFERENCES public.components(id),
  quantity DECIMAL(10,3) NOT NULL,
  unit TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhanced Categories table with hierarchical structure
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  parent_category_id UUID REFERENCES public.categories(id),
  category_type TEXT CHECK (category_type IN ('datacenter', 'infrastructure', 'systems', 'equipment')),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Projects table for enhanced project management
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  project_type TEXT CHECK (project_type IN ('datacenter', 'infrastructure', 'renovation', 'expansion')),
  capacity_mw DECIMAL(8,2),
  location TEXT,
  start_date DATE,
  target_completion_date DATE,
  status TEXT CHECK (status IN ('planning', 'design', 'procurement', 'construction', 'commissioning', 'completed', 'cancelled')) DEFAULT 'planning',
  total_budget DECIMAL(15,2),
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Project Estimates junction table
CREATE TABLE public.project_estimates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  estimate_id UUID NOT NULL REFERENCES public.estimates(id) ON DELETE CASCADE,
  phase_name TEXT,
  is_baseline BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Actual Costs table for variance analysis
CREATE TABLE public.actual_costs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  estimate_item_id UUID REFERENCES public.estimate_items(id),
  assembly_id UUID REFERENCES public.assemblies(id),
  component_id TEXT REFERENCES public.components(id),
  actual_quantity DECIMAL(10,3),
  actual_unit_cost DECIMAL(10,2),
  actual_total_cost DECIMAL(15,2),
  cost_date DATE NOT NULL,
  vendor_name TEXT,
  purchase_order_number TEXT,
  invoice_number TEXT,
  notes TEXT,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Project Phases table
CREATE TABLE public.project_phases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  budget_allocation DECIMAL(15,2),
  status TEXT CHECK (status IN ('planned', 'active', 'completed', 'delayed', 'cancelled')) DEFAULT 'planned',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Change Orders table
CREATE TABLE public.change_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  change_order_number TEXT NOT NULL,
  description TEXT NOT NULL,
  cost_impact DECIMAL(15,2),
  schedule_impact_days INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'implemented')) DEFAULT 'pending',
  requested_by UUID NOT NULL,
  approved_by UUID,
  approved_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assemblies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assembly_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actual_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.change_orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for Components (publicly readable for now)
CREATE POLICY "Components are viewable by everyone" ON public.components
FOR SELECT USING (true);

-- Create RLS policies for Quality Tiers (publicly readable)
CREATE POLICY "Quality tiers are viewable by everyone" ON public.quality_tiers
FOR SELECT USING (true);

-- Create RLS policies for Projects
CREATE POLICY "Users can view their own projects" ON public.projects
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects" ON public.projects
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON public.projects
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON public.projects
FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for Actual Costs
CREATE POLICY "Users can view actual costs for their projects" ON public.actual_costs
FOR SELECT USING (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = actual_costs.project_id 
  AND projects.user_id = auth.uid()
));

CREATE POLICY "Users can create actual costs for their projects" ON public.actual_costs
FOR INSERT WITH CHECK (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = actual_costs.project_id 
  AND projects.user_id = auth.uid()
) AND auth.uid() = user_id);

CREATE POLICY "Users can update actual costs for their projects" ON public.actual_costs
FOR UPDATE USING (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = actual_costs.project_id 
  AND projects.user_id = auth.uid()
));

CREATE POLICY "Users can delete actual costs for their projects" ON public.actual_costs
FOR DELETE USING (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = actual_costs.project_id 
  AND projects.user_id = auth.uid()
));

-- Create RLS policies for Categories (publicly readable)
CREATE POLICY "Categories are viewable by everyone" ON public.categories
FOR SELECT USING (true);

-- Create RLS policies for Assemblies (publicly readable for now)
CREATE POLICY "Assemblies are viewable by everyone" ON public.assemblies
FOR SELECT USING (true);

-- Create RLS policies for Assembly Components (publicly readable)
CREATE POLICY "Assembly components are viewable by everyone" ON public.assembly_components
FOR SELECT USING (true);

-- Create RLS policies for Project Estimates
CREATE POLICY "Users can view project estimates for their projects" ON public.project_estimates
FOR SELECT USING (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = project_estimates.project_id 
  AND projects.user_id = auth.uid()
));

CREATE POLICY "Users can create project estimates for their projects" ON public.project_estimates
FOR INSERT WITH CHECK (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = project_estimates.project_id 
  AND projects.user_id = auth.uid()
));

-- Create RLS policies for Project Phases
CREATE POLICY "Users can view phases for their projects" ON public.project_phases
FOR SELECT USING (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = project_phases.project_id 
  AND projects.user_id = auth.uid()
));

CREATE POLICY "Users can create phases for their projects" ON public.project_phases
FOR INSERT WITH CHECK (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = project_phases.project_id 
  AND projects.user_id = auth.uid()
));

CREATE POLICY "Users can update phases for their projects" ON public.project_phases
FOR UPDATE USING (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = project_phases.project_id 
  AND projects.user_id = auth.uid()
));

-- Create RLS policies for Change Orders
CREATE POLICY "Users can view change orders for their projects" ON public.change_orders
FOR SELECT USING (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = change_orders.project_id 
  AND projects.user_id = auth.uid()
));

CREATE POLICY "Users can create change orders for their projects" ON public.change_orders
FOR INSERT WITH CHECK (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = change_orders.project_id 
  AND projects.user_id = auth.uid()
) AND auth.uid() = requested_by);

-- Create indexes for performance
CREATE INDEX idx_quality_tiers_component ON public.quality_tiers(component_id);
CREATE INDEX idx_assemblies_category ON public.assemblies(category_id);
CREATE INDEX idx_assembly_components_assembly ON public.assembly_components(assembly_id);
CREATE INDEX idx_assembly_components_component ON public.assembly_components(component_id);
CREATE INDEX idx_categories_parent ON public.categories(parent_category_id);
CREATE INDEX idx_projects_user ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_actual_costs_project ON public.actual_costs(project_id);
CREATE INDEX idx_actual_costs_date ON public.actual_costs(cost_date);
CREATE INDEX idx_project_estimates_project ON public.project_estimates(project_id);
CREATE INDEX idx_project_phases_project ON public.project_phases(project_id);
CREATE INDEX idx_change_orders_project ON public.change_orders(project_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_components_updated_at
  BEFORE UPDATE ON public.components
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assemblies_updated_at
  BEFORE UPDATE ON public.assemblies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_actual_costs_updated_at
  BEFORE UPDATE ON public.actual_costs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_phases_updated_at
  BEFORE UPDATE ON public.project_phases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_change_orders_updated_at
  BEFORE UPDATE ON public.change_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data center categories
INSERT INTO public.categories (name, description, category_type, sort_order) VALUES
('Site Preparation', 'Excavation, grading, utilities connections', 'datacenter', 10),
('Foundation Systems', 'Deep foundations, equipment pads, raised floors', 'datacenter', 20),
('Structural Systems', 'Steel frame, concrete, seismic systems', 'datacenter', 30),
('Electrical Infrastructure', 'Switchgear, UPS, generators, distribution', 'datacenter', 40),
('Mechanical Systems', 'HVAC, cooling towers, chillers, pumps', 'datacenter', 50),
('Fire Protection', 'Suppression systems, detection, alarms', 'datacenter', 60),
('Security Systems', 'Access control, surveillance, perimeter', 'datacenter', 70),
('IT Infrastructure', 'Cable management, racks, networking', 'datacenter', 80),
('Backup Power', 'Generators, fuel systems, transfer switches', 'datacenter', 90),
('Monitoring & Controls', 'BMS, DCIM, environmental monitoring', 'datacenter', 100);