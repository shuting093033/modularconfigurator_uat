import { supabase } from "@/integrations/supabase/client";
import { Component, EstimateItem } from "@/types/estimate";

export interface EstimateIntegrationResult {
  success: boolean;
  estimateId?: string;
  itemsAdded?: number;
  totalCost?: number;
  error?: string;
}

export interface BulkAddRequest {
  estimateId: string;
  components: Array<{
    componentId: string;
    qualityTierId: string;
    quantity: number;
  }>;
}

export interface EstimateValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  compliance_score: number;
  cost_analysis: {
    total_cost: number;
    cost_per_category: Record<string, number>;
    budget_variance?: number;
  };
}

class EstimateIntegrationService {
  async addComponentsToEstimate(
    estimateId: string, 
    components: Array<{ componentId: string; qualityTierId: string; quantity: number; }>
  ): Promise<EstimateIntegrationResult> {
    try {
      // Validate estimate exists and user has access
      const { data: estimate, error: estimateError } = await supabase
        .from('estimates')
        .select('id, name, total_cost')
        .eq('id', estimateId)
        .single();

      if (estimateError || !estimate) {
        return {
          success: false,
          error: 'Estimate not found or access denied'
        };
      }

      // Get component details
      const componentIds = components.map(c => c.componentId);
      const qualityTierIds = components.map(c => c.qualityTierId);

      const { data: componentsData, error: componentsError } = await supabase
        .from('components')
        .select('*')
        .in('id', componentIds);

      const { data: tiersData, error: tiersError } = await supabase
        .from('quality_tiers')
        .select('*')
        .in('id', qualityTierIds);

      if (componentsError || tiersError) {
        return {
          success: false,
          error: 'Failed to fetch component details'
        };
      }

      // Create estimate items
      const estimateItems = components.map(comp => {
        const component = componentsData?.find(c => c.id === comp.componentId);
        const qualityTier = tiersData?.find(t => t.id === comp.qualityTierId);

        if (!component || !qualityTier) {
          return null;
        }

        return {
          estimate_id: estimateId,
          component_id: component.id,
          component_name: component.name,
          quality_tier_id: qualityTier.id,
          quality_tier_name: qualityTier.name,
          quality_tier_description: qualityTier.description,
          quality_tier_unit_cost: qualityTier.unit_cost,
          quantity: comp.quantity,
          unit: component.unit,
          total_cost: qualityTier.unit_cost * comp.quantity
        };
      }).filter(item => item !== null);

      if (estimateItems.length === 0) {
        return {
          success: false,
          error: 'No valid components to add'
        };
      }

      // Insert estimate items
      const { error: insertError } = await supabase
        .from('estimate_items')
        .insert(estimateItems);

      if (insertError) {
        return {
          success: false,
          error: `Failed to add items to estimate: ${insertError.message}`
        };
      }

      // Calculate new total cost
      const addedCost = estimateItems.reduce((sum, item) => sum + item.total_cost, 0);
      const newTotalCost = estimate.total_cost + addedCost;

      // Update estimate total
      const { error: updateError } = await supabase
        .from('estimates')
        .update({ total_cost: newTotalCost })
        .eq('id', estimateId);

      if (updateError) {
        console.warn('Failed to update estimate total:', updateError);
      }

      return {
        success: true,
        estimateId,
        itemsAdded: estimateItems.length,
        totalCost: newTotalCost
      };

    } catch (error) {
      console.error('Error in addComponentsToEstimate:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async addAssemblyToEstimate(estimateId: string, assemblyId: string, quantity: number = 1): Promise<EstimateIntegrationResult> {
    try {
      // Get assembly with components
      const { data: assembly, error: assemblyError } = await supabase
        .from('assemblies')
        .select(`
          *,
          assembly_components(
            *,
            components(*),
            quality_tiers:selected_quality_tier_id(*)
          )
        `)
        .eq('id', assemblyId)
        .single();

      if (assemblyError || !assembly) {
        return {
          success: false,
          error: 'Assembly not found'
        };
      }

      // Add assembly record to estimate
      const { data: estimateAssembly, error: assemblyInsertError } = await supabase
        .from('estimate_assemblies')
        .insert({
          estimate_id: estimateId,
          assembly_id: assemblyId,
          assembly_name: assembly.name,
          quantity,
          total_material_cost: assembly.total_material_cost * quantity,
          total_labor_cost: assembly.total_labor_cost * quantity,
          total_labor_hours: assembly.labor_hours * quantity
        })
        .select()
        .single();

      if (assemblyInsertError) {
        return {
          success: false,
          error: `Failed to add assembly: ${assemblyInsertError.message}`
        };
      }

      // Add individual components as estimate items
      const estimateItems = assembly.assembly_components?.map((ac: any) => ({
        estimate_id: estimateId,
        estimate_assembly_id: estimateAssembly.id,
        component_id: ac.component_id,
        component_name: ac.components.name,
        quality_tier_id: ac.selected_quality_tier_id,
        quality_tier_name: ac.quality_tiers?.name || 'Standard',
        quality_tier_description: ac.quality_tiers?.description || '',
        quality_tier_unit_cost: ac.quality_tiers?.unit_cost || 0,
        quantity: ac.quantity * quantity,
        unit: ac.unit,
        total_cost: (ac.quality_tiers?.unit_cost || 0) * ac.quantity * quantity
      })) || [];

      if (estimateItems.length > 0) {
        const { error: itemsError } = await supabase
          .from('estimate_items')
          .insert(estimateItems);

        if (itemsError) {
          // Clean up assembly if item creation fails
          await supabase.from('estimate_assemblies').delete().eq('id', estimateAssembly.id);
          return {
            success: false,
            error: `Failed to add assembly components: ${itemsError.message}`
          };
        }
      }

      // Update estimate total
      const totalAssemblyCost = assembly.total_material_cost + assembly.total_labor_cost;
      const { data: currentEstimate } = await supabase
        .from('estimates')
        .select('total_cost')
        .eq('id', estimateId)
        .single();

      const newTotalCost = (currentEstimate?.total_cost || 0) + (totalAssemblyCost * quantity);

      await supabase
        .from('estimates')
        .update({ total_cost: newTotalCost })
        .eq('id', estimateId);

      return {
        success: true,
        estimateId,
        itemsAdded: estimateItems.length,
        totalCost: newTotalCost
      };

    } catch (error) {
      console.error('Error in addAssemblyToEstimate:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async validateEstimate(estimateId: string, requirements?: {
    maxBudget?: number;
    requiredCategories?: string[];
    powerLimits?: { maxKw: number };
    spaceLimits?: { maxRackUnits: number };
  }): Promise<EstimateValidationResult> {
    try {
      // Get estimate with items
      const { data: estimate, error: estimateError } = await supabase
        .from('estimates')
        .select(`
          *,
          estimate_items(
            *,
            components(*)
          )
        `)
        .eq('id', estimateId)
        .single();

      if (estimateError || !estimate) {
        return {
          valid: false,
          errors: ['Estimate not found'],
          warnings: [],
          compliance_score: 0,
          cost_analysis: {
            total_cost: 0,
            cost_per_category: {}
          }
        };
      }

      const errors: string[] = [];
      const warnings: string[] = [];

      // Cost analysis
      const costPerCategory = estimate.estimate_items?.reduce((acc: Record<string, number>, item: any) => {
        const category = item.components?.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + item.total_cost;
        return acc;
      }, {}) || {};

      // Budget validation
      if (requirements?.maxBudget && estimate.total_cost > requirements.maxBudget) {
        errors.push(`Total cost $${estimate.total_cost.toLocaleString()} exceeds budget of $${requirements.maxBudget.toLocaleString()}`);
      }

      // Category requirements validation
      if (requirements?.requiredCategories) {
        const estimateCategories = new Set(estimate.estimate_items?.map((item: any) => item.components?.category).filter(Boolean));
        const missingCategories = requirements.requiredCategories.filter(cat => !estimateCategories.has(cat));
        
        if (missingCategories.length > 0) {
          errors.push(`Missing required categories: ${missingCategories.join(', ')}`);
        }
      }

      // Power requirements validation
      if (requirements?.powerLimits) {
        const totalPowerKw = estimate.estimate_items?.reduce((sum: number, item: any) => {
          const powerKw = item.components?.power_requirements?.power_kw || 0;
          return sum + (powerKw * item.quantity);
        }, 0) || 0;

        if (totalPowerKw > requirements.powerLimits.maxKw) {
          errors.push(`Total power requirement ${totalPowerKw}kW exceeds limit of ${requirements.powerLimits.maxKw}kW`);
        }
      }

      // Space requirements validation
      if (requirements?.spaceLimits) {
        const totalRackUnits = estimate.estimate_items?.reduce((sum: number, item: any) => {
          const rackUnits = item.components?.physical_dimensions?.rack_units || 0;
          return sum + (rackUnits * item.quantity);
        }, 0) || 0;

        if (totalRackUnits > requirements.spaceLimits.maxRackUnits) {
          warnings.push(`Total rack units ${totalRackUnits} may exceed available space of ${requirements.spaceLimits.maxRackUnits} units`);
        }
      }

      // Calculate compliance score
      let complianceScore = 100;
      if (errors.length > 0) complianceScore -= errors.length * 20;
      if (warnings.length > 0) complianceScore -= warnings.length * 10;
      complianceScore = Math.max(0, complianceScore);

      return {
        valid: errors.length === 0,
        errors,
        warnings,
        compliance_score: complianceScore,
        cost_analysis: {
          total_cost: estimate.total_cost,
          cost_per_category: costPerCategory,
          budget_variance: requirements?.maxBudget ? estimate.total_cost - requirements.maxBudget : undefined
        }
      };

    } catch (error) {
      console.error('Error in validateEstimate:', error);
      return {
        valid: false,
        errors: ['Validation failed'],
        warnings: [],
        compliance_score: 0,
        cost_analysis: {
          total_cost: 0,
          cost_per_category: {}
        }
      };
    }
  }

  async optimizeEstimate(estimateId: string): Promise<{
    optimizations: Array<{
      type: 'cost_reduction' | 'component_substitution' | 'quantity_optimization';
      description: string;
      potential_savings: number;
      action_required: string;
    }>;
    total_potential_savings: number;
  }> {
    try {
      const { data: estimate, error } = await supabase
        .from('estimates')
        .select(`
          *,
          estimate_items(
            *,
            components(*, quality_tiers(*))
          )
        `)
        .eq('id', estimateId)
        .single();

      if (error || !estimate) {
        throw new Error('Estimate not found');
      }

      const optimizations = [];
      let totalSavings = 0;

      // Analyze each item for optimization opportunities
      for (const item of estimate.estimate_items || []) {
        const component = item.components as any;
        if (!component || !component.quality_tiers) continue;

        // Look for cheaper quality tiers
        const currentTierCost = item.quality_tier_unit_cost;
        const cheaperTiers = component.quality_tiers.filter((tier: any) => tier.unit_cost < currentTierCost);
        
        if (cheaperTiers.length > 0) {
          const cheapestTier = cheaperTiers.reduce((min: any, tier: any) => 
            tier.unit_cost < min.unit_cost ? tier : min
          );
          const savings = (currentTierCost - cheapestTier.unit_cost) * item.quantity;
          totalSavings += savings;
          
          optimizations.push({
            type: 'cost_reduction',
            description: `Switch ${component.name} to ${cheapestTier.name} tier`,
            potential_savings: savings,
            action_required: `Update quality tier selection for ${component.name}`
          });
        }

        // Check for quantity optimization (bulk discounts)
        if (item.quantity >= 10 && item.quantity < 50) {
          const bulkSavings = currentTierCost * item.quantity * 0.1; // 10% bulk discount
          optimizations.push({
            type: 'quantity_optimization',
            description: `Negotiate bulk pricing for ${component.name}`,
            potential_savings: bulkSavings,
            action_required: 'Contact supplier for bulk pricing'
          });
        }
      }

      return {
        optimizations,
        total_potential_savings: totalSavings
      };

    } catch (error) {
      console.error('Error optimizing estimate:', error);
      throw error;
    }
  }
}

export const estimateIntegrationService = new EstimateIntegrationService();