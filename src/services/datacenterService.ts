import { supabase } from "@/integrations/supabase/client";
import { 
  Project, 
  Assembly, 
  ActualCost, 
  ProjectPhase, 
  ChangeOrder, 
  VarianceAnalysis,
  ProjectMetrics,
  Category,
  EnhancedComponent,
  QualityTier,
  UserLaborRate
} from "@/types/datacenter";

// Helper function to convert database dates to Date objects
const convertDates = (obj: any, dateFields: string[]): any => {
  const result = { ...obj };
  dateFields.forEach(field => {
    if (result[field]) {
      result[field] = new Date(result[field]);
    }
  });
  return result;
};

export const datacenterService = {
  // Labor rate management
  async getUserLaborRate(): Promise<number> {
    const { data, error } = await supabase
      .from('user_labor_rates')
      .select('labor_rate_per_hour')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching user labor rate:', error);
      throw error;
    }

    return data?.labor_rate_per_hour || 50.00; // Default to $50/hour
  },

  async setUserLaborRate(laborRate: number): Promise<UserLaborRate> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be authenticated');

    const { data, error } = await supabase
      .from('user_labor_rates')
      .upsert({
        user_id: user.id,
        labor_rate_per_hour: laborRate
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) {
      console.error('Error setting user labor rate:', error);
      throw error;
    }

    return convertDates(data, ['created_at', 'updated_at']);
  },

  async getAssemblyDetails(assemblyId: string) {
    const { data, error } = await supabase
      .from('assemblies')
      .select(`
        *,
        components:assembly_components(
          id,
          component_id,
          quantity,
          unit,
          notes,
          selected_quality_tier_id,
          component:components(
            id,
            name,
            description,
            labor_hours
          )
        )
      `)
      .eq('id', assemblyId)
      .single();

    if (error) throw error;

    // Now fetch quality tiers for each component separately
    const transformedData = {
      ...data,
      components: await Promise.all(
        (data.components || []).map(async (comp: any) => {
          // Fetch quality tiers for this component
          const { data: qualityTiers, error: tiersError } = await supabase
            .from('quality_tiers')
            .select('id, name, unit_cost, description')
            .eq('component_id', comp.component_id)
            .order('unit_cost', { ascending: true });

          if (tiersError) {
            console.error('Error fetching quality tiers:', tiersError);
          }

          return {
            id: comp.id,
            component_id: comp.component_id,
            component_name: comp.component?.name || '',
            component_description: comp.component?.description || '',
            quantity: comp.quantity,
            unit: comp.unit,
            notes: comp.notes,
            selected_quality_tier_id: comp.selected_quality_tier_id,
            labor_hours: comp.component?.labor_hours,
            quality_tiers: qualityTiers || [],
            selected_quality_tier: comp.selected_quality_tier_id 
              ? qualityTiers?.find((t: any) => t.id === comp.selected_quality_tier_id)
              : qualityTiers?.[0] || null
          };
        })
      )
    };

    return transformedData;
  },

  async updateAssembly(assemblyId: string, updates: {
    name?: string;
    description?: string;
    labor_hours?: number;
    total_material_cost?: number;
    total_labor_cost?: number;
  }) {
    const { data, error } = await supabase
      .from('assemblies')
      .update(updates)
      .eq('id', assemblyId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateAssemblyComponents(assemblyId: string, components: Array<{
    component_id: string;
    quantity: number;
    unit: string;
    notes?: string;
    selected_quality_tier_id?: string;
  }>) {
    // First, delete existing components
    await supabase
      .from('assembly_components')
      .delete()
      .eq('assembly_id', assemblyId);

    // Then insert new components
    if (components.length > 0) {
      const { data, error } = await supabase
        .from('assembly_components')
        .insert(
          components.map(comp => ({
            assembly_id: assemblyId,
            ...comp
          }))
        );

      if (error) throw error;
      return data;
    }

    return [];
  },
  // Project management
  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<Project> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be authenticated');

    const projectData = {
      name: project.name,
      description: project.description,
      project_type: project.project_type,
      capacity_mw: project.capacity_mw,
      location: project.location,
      start_date: project.start_date?.toISOString().split('T')[0],
      target_completion_date: project.target_completion_date?.toISOString().split('T')[0],
      status: project.status,
      total_budget: project.total_budget,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single();

    if (error) throw error;
    return convertDates(data, ['start_date', 'target_completion_date', 'created_at', 'updated_at']) as Project;
  },

  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(project => 
      convertDates(project, ['start_date', 'target_completion_date', 'created_at', 'updated_at'])
    ) as Project[];
  },

  async getProject(projectId: string): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) throw error;
    return convertDates(data, ['start_date', 'target_completion_date', 'created_at', 'updated_at']) as Project;
  },

  async updateProject(projectId: string, updates: Partial<Project>): Promise<Project> {
    const updateData: any = { ...updates };
    
    // Convert dates to strings for database
    if (updateData.start_date) {
      updateData.start_date = updateData.start_date.toISOString().split('T')[0];
    }
    if (updateData.target_completion_date) {
      updateData.target_completion_date = updateData.target_completion_date.toISOString().split('T')[0];
    }
    
    // Remove Date objects from updates
    delete updateData.created_at;
    delete updateData.updated_at;

    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;
    return convertDates(data, ['start_date', 'target_completion_date', 'created_at', 'updated_at']) as Project;
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    return (data || []).map(category => 
      convertDates(category, ['created_at', 'updated_at'])
    ) as Category[];
  },

  // Enhanced Components
  async getComponents(): Promise<EnhancedComponent[]> {
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .order('name');

    if (error) throw error;
    return (data || []).map(component => 
      convertDates(component, ['created_at', 'updated_at'])
    ) as EnhancedComponent[];
  },

  async getQualityTiers(componentId: string): Promise<QualityTier[]> {
    const { data, error } = await supabase
      .from('quality_tiers')
      .select('*')
      .eq('component_id', componentId)
      .order('unit_cost');

    if (error) throw error;
    return (data || []).map(tier => 
      convertDates(tier, ['created_at'])
    ) as QualityTier[];
  },

  // Assembly management
  async createAssembly(assembly: Omit<Assembly, 'id' | 'created_at' | 'updated_at' | 'components'>): Promise<Assembly> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be authenticated to create assemblies');

    const { data, error } = await supabase
      .from('assemblies')
      .insert({
        name: assembly.name,
        description: assembly.description,
        category_id: assembly.category_id,
        labor_hours: assembly.labor_hours,
        installation_sequence: assembly.installation_sequence,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return { 
      ...convertDates(data, ['created_at', 'updated_at']), 
      components: [] 
    } as Assembly;
  },

  async createAssemblyComponents(assemblyId: string, components: Array<{
    component_id: string;
    quantity: number;
    unit: string;
    notes?: string;
    selected_quality_tier_id?: string;
  }>): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be authenticated to create assembly components');

    const componentsData = components.map(comp => ({
      assembly_id: assemblyId,
      component_id: comp.component_id,
      quantity: comp.quantity,
      unit: comp.unit,
      notes: comp.notes,
      selected_quality_tier_id: comp.selected_quality_tier_id,
      user_id: user.id
    }));

    const { error } = await supabase
      .from('assembly_components')
      .insert(componentsData);

    if (error) throw error;
  },

  async getAssemblies(): Promise<Assembly[]> {
    const { data, error } = await supabase
      .from('assemblies')
      .select(`
        *,
        assembly_components (
          id,
          assembly_id,
          component_id,
          quantity,
          unit,
          notes,
          created_at
        )
      `)
      .order('name');

    if (error) throw error;
    return (data || []).map(assembly => ({
      ...convertDates(assembly, ['created_at', 'updated_at']),
      components: (assembly.assembly_components || []).map((comp: any) => 
        convertDates(comp, ['created_at'])
      )
    })) as Assembly[];
  },

  // Actual costs tracking
  async addActualCost(actualCost: Omit<ActualCost, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<ActualCost> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be authenticated');

    const costData = {
      project_id: actualCost.project_id,
      estimate_item_id: actualCost.estimate_item_id,
      assembly_id: actualCost.assembly_id,
      component_id: actualCost.component_id,
      actual_quantity: actualCost.actual_quantity,
      actual_unit_cost: actualCost.actual_unit_cost,
      actual_total_cost: actualCost.actual_total_cost,
      cost_date: actualCost.cost_date.toISOString().split('T')[0],
      vendor_name: actualCost.vendor_name,
      purchase_order_number: actualCost.purchase_order_number,
      invoice_number: actualCost.invoice_number,
      notes: actualCost.notes,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('actual_costs')
      .insert(costData)
      .select()
      .single();

    if (error) throw error;
    return convertDates(data, ['cost_date', 'created_at', 'updated_at']) as ActualCost;
  },

  async getActualCosts(projectId: string): Promise<ActualCost[]> {
    const { data, error } = await supabase
      .from('actual_costs')
      .select('*')
      .eq('project_id', projectId)
      .order('cost_date', { ascending: false });

    if (error) throw error;
    return (data || []).map(cost => 
      convertDates(cost, ['cost_date', 'created_at', 'updated_at'])
    ) as ActualCost[];
  },

  // Project phases
  async createProjectPhase(phase: Omit<ProjectPhase, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectPhase> {
    const phaseData = {
      project_id: phase.project_id,
      name: phase.name,
      description: phase.description,
      start_date: phase.start_date?.toISOString().split('T')[0],
      end_date: phase.end_date?.toISOString().split('T')[0],
      budget_allocation: phase.budget_allocation,
      status: phase.status,
      sort_order: phase.sort_order
    };

    const { data, error } = await supabase
      .from('project_phases')
      .insert(phaseData)
      .select()
      .single();

    if (error) throw error;
    return convertDates(data, ['start_date', 'end_date', 'created_at', 'updated_at']) as ProjectPhase;
  },

  async getProjectPhases(projectId: string): Promise<ProjectPhase[]> {
    const { data, error } = await supabase
      .from('project_phases')
      .select('*')
      .eq('project_id', projectId)
      .order('sort_order');

    if (error) throw error;
    return (data || []).map(phase => 
      convertDates(phase, ['start_date', 'end_date', 'created_at', 'updated_at'])
    ) as ProjectPhase[];
  },

  async updateProjectPhase(phaseId: string, updates: Partial<ProjectPhase>): Promise<ProjectPhase> {
    const updateData: any = { ...updates };
    
    // Convert dates to strings for database
    if (updateData.start_date) {
      updateData.start_date = updateData.start_date.toISOString().split('T')[0];
    }
    if (updateData.end_date) {
      updateData.end_date = updateData.end_date.toISOString().split('T')[0];
    }
    
    // Remove Date objects from updates
    delete updateData.created_at;
    delete updateData.updated_at;

    const { data, error } = await supabase
      .from('project_phases')
      .update(updateData)
      .eq('id', phaseId)
      .select()
      .single();

    if (error) throw error;
    return convertDates(data, ['start_date', 'end_date', 'created_at', 'updated_at']) as ProjectPhase;
  },

  // Change orders
  async createChangeOrder(changeOrder: Omit<ChangeOrder, 'id' | 'created_at' | 'updated_at'>): Promise<ChangeOrder> {
    const orderData = {
      project_id: changeOrder.project_id,
      change_order_number: changeOrder.change_order_number,
      description: changeOrder.description,
      cost_impact: changeOrder.cost_impact,
      schedule_impact_days: changeOrder.schedule_impact_days,
      status: changeOrder.status,
      requested_by: changeOrder.requested_by,
      approved_by: changeOrder.approved_by,
      approved_date: changeOrder.approved_date?.toISOString().split('T')[0]
    };

    const { data, error } = await supabase
      .from('change_orders')
      .insert(orderData)
      .select()
      .single();

    if (error) throw error;
    return convertDates(data, ['approved_date', 'created_at', 'updated_at']) as ChangeOrder;
  },

  async getChangeOrders(projectId: string): Promise<ChangeOrder[]> {
    const { data, error } = await supabase
      .from('change_orders')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(order => 
      convertDates(order, ['approved_date', 'created_at', 'updated_at'])
    ) as ChangeOrder[];
  },

  // Variance analysis
  async getVarianceAnalysis(projectId: string): Promise<VarianceAnalysis[]> {
    // This would be a complex query joining estimates, actual costs, and components
    // For now, return a simplified version
    const { data: actualCosts } = await supabase
      .from('actual_costs')
      .select('*')
      .eq('project_id', projectId);

    // TODO: Implement complex variance calculation
    return [];
  },

  async getProjectMetrics(projectId: string): Promise<ProjectMetrics> {
    const [actualCosts, phases] = await Promise.all([
      this.getActualCosts(projectId),
      this.getProjectPhases(projectId)
    ]);

    const totalActualCost = actualCosts.reduce((sum, cost) => sum + (cost.actual_total_cost || 0), 0);
    const completedPhases = phases.filter(phase => phase.status === 'completed').length;
    
    return {
      total_estimated_cost: 0, // TODO: Calculate from project estimates
      total_actual_cost: totalActualCost,
      overall_cost_variance: 0, // TODO: Calculate variance
      overall_cost_variance_percentage: 0,
      phases_completed: completedPhases,
      phases_total: phases.length,
      project_progress_percentage: phases.length > 0 ? (completedPhases / phases.length) * 100 : 0,
      critical_variances: [] // TODO: Implement variance analysis
    };
  }
};