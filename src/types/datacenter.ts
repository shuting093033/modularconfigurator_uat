// Enhanced types for Data Center Construction Cost Management System

export interface EnhancedComponent {
  id: string;
  name: string;
  category: string;
  description: string;
  unit: string;
  labor_hours?: number;
  skill_level?: 'entry' | 'intermediate' | 'expert' | 'specialist';
  vendor_info?: {
    preferred_vendor?: string;
    part_number?: string;
    contact_info?: string;
  };
  lead_time_days?: number;
  technical_specs?: {
    voltage?: string;
    power_rating?: string;
    efficiency?: string;
    dimensions?: string;
    weight?: string;
    operating_temp?: string;
    cooling_requirements?: string;
    redundancy_level?: string;
    outlet_count?: string;
    battery_runtime?: string;
    fuel_type?: string;
    cooling_capacity?: string;
    rack_units?: string;
    port_count?: string;
    coverage_area?: string;
    reader_type?: string;
    resolution?: string;
    panel_size?: string;
    compressive_strength?: string;
    mounting?: string;
    network?: string;
    monitoring?: string;
    airflow?: string;
    refrigerant?: string;
    power_consumption?: string;
    water_flow?: string;
    fan_motor?: string;
    approach_temperature?: string;
    material?: string;
    weight_capacity?: string;
    finish?: string;
    height_range?: string;
    uplink_ports?: string;
    switching_capacity?: string;
    forwarding_rate?: string;
    agent_type?: string;
    discharge_time?: string;
    cylinder_count?: string;
    cylinder_size?: string;
    detection?: string;
    control_panel?: string;
    lock_type?: string;
    power_supply?: string;
    communication?: string;
    card_capacity?: string;
    access_levels?: string;
    lens?: string;
    field_of_view?: string;
    low_light?: string;
    compression?: string;
    power?: string;
    thickness?: string;
    load_rating?: string;
    understructure?: string;
    slump?: string;
    aggregate_size?: string;
    cement_content?: string;
    water_cement_ratio?: string;
    air_content?: string;
    sound_level?: string;
    fuel_consumption?: string;
    [key: string]: string | undefined;
  };
  material_waste_factor?: number;
  installation_notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface QualityTier {
  id: string;
  component_id: string;
  name: string;
  unit_cost: number;
  description: string;
  created_at: Date;
}

export interface Assembly {
  id: string;
  name: string;
  description?: string;
  category_id?: string;
  labor_hours?: number;
  total_material_cost?: number;
  total_labor_cost?: number;
  installation_sequence?: number;
  user_id?: string;
  components: AssemblyComponent[];
  created_at: Date;
  updated_at: Date;
}

export interface AssemblyComponent {
  id: string;
  assembly_id: string;
  component_id: string;
  quantity: number;
  unit: string;
  notes?: string;
  selected_quality_tier_id?: string;
  component?: EnhancedComponent;
  created_at: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parent_category_id?: string;
  category_type: 'datacenter' | 'infrastructure' | 'systems' | 'equipment';
  sort_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  project_type: 'datacenter' | 'infrastructure' | 'renovation' | 'expansion';
  capacity_mw?: number;
  location?: string;
  start_date?: Date;
  target_completion_date?: Date;
  status: 'planning' | 'design' | 'procurement' | 'construction' | 'commissioning' | 'completed' | 'cancelled';
  total_budget?: number;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface ProjectEstimate {
  id: string;
  project_id: string;
  estimate_id: string;
  phase_name?: string;
  is_baseline: boolean;
  created_at: Date;
}

export interface ActualCost {
  id: string;
  project_id: string;
  estimate_item_id?: string;
  assembly_id?: string;
  component_id?: string;
  actual_quantity?: number;
  actual_unit_cost?: number;
  actual_total_cost?: number;
  cost_date: Date;
  vendor_name?: string;
  purchase_order_number?: string;
  invoice_number?: string;
  notes?: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface ProjectPhase {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  start_date?: Date;
  end_date?: Date;
  budget_allocation?: number;
  status: 'planned' | 'active' | 'completed' | 'delayed' | 'cancelled';
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface ChangeOrder {
  id: string;
  project_id: string;
  change_order_number: string;
  description: string;
  cost_impact?: number;
  schedule_impact_days: number;
  status: 'pending' | 'approved' | 'rejected' | 'implemented';
  requested_by: string;
  approved_by?: string;
  approved_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface VarianceAnalysis {
  component_id: string;
  component_name: string;
  estimated_quantity: number;
  actual_quantity: number;
  estimated_unit_cost: number;
  actual_unit_cost: number;
  estimated_total: number;
  actual_total: number;
  cost_variance: number;
  cost_variance_percentage: number;
  quantity_variance: number;
  quantity_variance_percentage: number;
}

export interface UserLaborRate {
  id: string;
  user_id: string;
  labor_rate_per_hour: number;
  created_at: Date;
  updated_at: Date;
}

export interface ProjectMetrics {
  total_estimated_cost: number;
  total_actual_cost: number;
  overall_cost_variance: number;
  overall_cost_variance_percentage: number;
  phases_completed: number;
  phases_total: number;
  project_progress_percentage: number;
  critical_variances: VarianceAnalysis[];
}

// Data Center specific category types
export type DataCenterCategory = 
  | 'Site Preparation'
  | 'Foundation Systems'
  | 'Structural Systems'
  | 'Electrical Infrastructure'
  | 'Mechanical Systems'
  | 'Fire Protection'
  | 'Security Systems'
  | 'IT Infrastructure'
  | 'Backup Power'
  | 'Monitoring & Controls';

export type ProjectStatus = 'planning' | 'design' | 'procurement' | 'construction' | 'commissioning' | 'completed' | 'cancelled';
export type ProjectType = 'datacenter' | 'infrastructure' | 'renovation' | 'expansion';
export type SkillLevel = 'entry' | 'intermediate' | 'expert' | 'specialist';