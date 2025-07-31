import { supabase } from "@/integrations/supabase/client";
import { EstimateItem, AssemblyEstimateItem, HierarchicalEstimate } from "@/types/estimate";

export interface SavedEstimate {
  id: string;
  name: string;
  total_cost: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface SavedEstimateItem {
  id: string;
  estimate_id: string;
  component_id: string;
  component_name: string;
  quality_tier_id: string;
  quality_tier_name: string;
  quality_tier_unit_cost: number;
  quality_tier_description: string;
  quantity: number;
  unit: string;
  total_cost: number;
}

export const estimateService = {
  async saveAssemblyEstimate(name: string, assemblies: AssemblyEstimateItem[]): Promise<SavedEstimate> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be signed in to save estimates');
    }

    const totalCost = assemblies.reduce((sum, assembly) => 
      sum + assembly.totalMaterialCost + assembly.totalLaborCost, 0);
    
    // Insert the estimate
    const { data: estimate, error: estimateError } = await supabase
      .from('estimates')
      .insert({
        name,
        total_cost: totalCost,
        user_id: user.id
      })
      .select()
      .single();

    if (estimateError) throw estimateError;

    // Insert assemblies and their components
    for (const assembly of assemblies) {
      const { data: estimateAssembly, error: assemblyError } = await supabase
        .from('estimate_assemblies')
        .insert({
          estimate_id: estimate.id,
          assembly_id: assembly.assemblyId,
          assembly_name: assembly.assemblyName,
          quantity: assembly.quantity,
          total_material_cost: assembly.totalMaterialCost,
          total_labor_cost: assembly.totalLaborCost,
          total_labor_hours: assembly.totalLaborHours
        })
        .select()
        .single();

      if (assemblyError) throw assemblyError;

      // Insert components for this assembly
      if (assembly.components.length > 0) {
        const componentItems = assembly.components.map(component => ({
          estimate_id: estimate.id,
          estimate_assembly_id: estimateAssembly.id,
          component_id: component.componentId,
          component_name: component.componentName,
          quality_tier_id: component.qualityTier.id,
          quality_tier_name: component.qualityTier.name,
          quality_tier_unit_cost: component.qualityTier.unitCost,
          quality_tier_description: component.qualityTier.description,
          quantity: component.quantity,
          unit: component.unit,
          total_cost: component.totalCost
        }));

        const { error: itemsError } = await supabase
          .from('estimate_items')
          .insert(componentItems);

        if (itemsError) throw itemsError;
      }
    }

    return estimate;
  },

  async saveEstimate(name: string, items: EstimateItem[]): Promise<SavedEstimate> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be signed in to save estimates');
    }

    const totalCost = items.reduce((sum, item) => sum + item.totalCost, 0);
    
    // Insert the estimate
    const { data: estimate, error: estimateError } = await supabase
      .from('estimates')
      .insert({
        name,
        total_cost: totalCost,
        user_id: user.id
      })
      .select()
      .single();

    if (estimateError) throw estimateError;

    // Insert the estimate items
    const estimateItems = items.map(item => ({
      estimate_id: estimate.id,
      component_id: item.componentId,
      component_name: item.componentName,
      quality_tier_id: item.qualityTier.id,
      quality_tier_name: item.qualityTier.name,
      quality_tier_unit_cost: item.qualityTier.unitCost,
      quality_tier_description: item.qualityTier.description,
      quantity: item.quantity,
      unit: item.unit,
      total_cost: item.totalCost
    }));

    const { error: itemsError } = await supabase
      .from('estimate_items')
      .insert(estimateItems);

    if (itemsError) throw itemsError;

    return estimate;
  },

  async getEstimates(): Promise<SavedEstimate[]> {
    const { data, error } = await supabase
      .from('estimates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getEstimateWithAssemblies(estimateId: string): Promise<HierarchicalEstimate> {
    const { data: estimate, error: estimateError } = await supabase
      .from('estimates')
      .select('*')
      .eq('id', estimateId)
      .single();

    if (estimateError) throw estimateError;

    const { data: assemblies, error: assembliesError } = await supabase
      .from('estimate_assemblies')
      .select('*')
      .eq('estimate_id', estimateId)
      .order('created_at');

    if (assembliesError) throw assembliesError;

    const hierarchicalAssemblies: AssemblyEstimateItem[] = [];

    for (const assembly of assemblies || []) {
      const { data: components, error: componentsError } = await supabase
        .from('estimate_items')
        .select('*')
        .eq('estimate_assembly_id', assembly.id)
        .order('created_at');

      if (componentsError) throw componentsError;

      const assemblyComponents = (components || []).map(item => ({
        id: item.id,
        componentId: item.component_id,
        componentName: item.component_name,
        qualityTier: {
          id: item.quality_tier_id,
          name: item.quality_tier_name,
          unitCost: Number(item.quality_tier_unit_cost),
          description: item.quality_tier_description || ''
        },
        quantity: item.quantity,
        unit: item.unit,
        totalCost: Number(item.total_cost)
      }));

      hierarchicalAssemblies.push({
        id: assembly.id,
        estimateId: assembly.estimate_id,
        assemblyId: assembly.assembly_id,
        assemblyName: assembly.assembly_name,
        quantity: assembly.quantity,
        totalMaterialCost: Number(assembly.total_material_cost),
        totalLaborCost: Number(assembly.total_labor_cost),
        totalLaborHours: Number(assembly.total_labor_hours),
        components: assemblyComponents
      });
    }

    return {
      id: estimate.id,
      name: estimate.name,
      assemblies: hierarchicalAssemblies,
      totalCost: Number(estimate.total_cost),
      totalLaborHours: hierarchicalAssemblies.reduce((sum, assembly) => sum + assembly.totalLaborHours, 0),
      createdAt: new Date(estimate.created_at),
      updatedAt: new Date(estimate.updated_at)
    };
  },

  async getEstimateWithItems(estimateId: string): Promise<{
    estimate: SavedEstimate;
    items: SavedEstimateItem[];
  }> {
    const { data: estimate, error: estimateError } = await supabase
      .from('estimates')
      .select('*')
      .eq('id', estimateId)
      .single();

    if (estimateError) throw estimateError;

    const { data: items, error: itemsError } = await supabase
      .from('estimate_items')
      .select('*')
      .eq('estimate_id', estimateId)
      .order('created_at');

    if (itemsError) throw itemsError;

    return { estimate, items: items || [] };
  },

  async deleteEstimate(estimateId: string): Promise<void> {
    const { error } = await supabase
      .from('estimates')
      .delete()
      .eq('id', estimateId);

    if (error) throw error;
  }
};