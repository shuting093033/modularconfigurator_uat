import { supabase } from "@/integrations/supabase/client";
import { Component, EstimateItem } from "@/types/estimate";

export interface AssemblySpecification {
  name: string;
  description?: string;
  components: AssemblyComponentSpec[];
  category?: string;
  totalLaborHours?: number;
}

export interface AssemblyComponentSpec {
  componentId: string;
  quantity: number;
  qualityTierId: string;
  notes?: string;
}

export interface AssemblyCreationResult {
  assemblyId: string;
  assemblyName: string;
  totalMaterialCost: number;
  totalLaborCost: number;
  totalLaborHours: number;
  components: EstimateItem[];
  success: boolean;
  error?: string;
}

class AIAssemblyBuilder {
  async createAssemblyFromSpec(spec: AssemblySpecification): Promise<AssemblyCreationResult> {
    try {
      // Validate specification
      const validation = this.validateSpecification(spec);
      if (!validation.valid) {
        return {
          assemblyId: '',
          assemblyName: '',
          totalMaterialCost: 0,
          totalLaborCost: 0,
          totalLaborHours: 0,
          components: [],
          success: false,
          error: `Validation failed: ${validation.errors.join(', ')}`
        };
      }

      // Get component details and calculate costs
      const componentDetails = await this.getComponentDetails(spec.components);
      if (componentDetails.length === 0) {
        return {
          assemblyId: '',
          assemblyName: '',
          totalMaterialCost: 0,
          totalLaborCost: 0,
          totalLaborHours: 0,
          components: [],
          success: false,
          error: 'No valid components found for assembly'
        };
      }

      // Calculate assembly totals
      const totalMaterialCost = componentDetails.reduce((sum, item) => sum + item.totalCost, 0);
      const totalLaborHours = spec.totalLaborHours || 0;

      // Get user's labor rate for cost calculation
      const { data: laborRateData } = await supabase
        .from('user_labor_rates')
        .select('labor_rate_per_hour')
        .single();

      const laborRate = laborRateData?.labor_rate_per_hour || 50;
      const totalLaborCost = totalLaborHours * laborRate;

      // Create assembly in database
      const { data: assemblyData, error: assemblyError } = await supabase
        .from('assemblies')
        .insert({
          name: spec.name,
          description: spec.description || '',
          total_material_cost: totalMaterialCost,
          total_labor_cost: totalLaborCost,
          labor_hours: totalLaborHours
        })
        .select()
        .single();

      if (assemblyError) {
        console.error('Error creating assembly:', assemblyError);
        return {
          assemblyId: '',
          assemblyName: '',
          totalMaterialCost: 0,
          totalLaborCost: 0,
          totalLaborHours: 0,
          components: [],
          success: false,
          error: `Failed to create assembly: ${assemblyError.message}`
        };
      }

      // Create assembly components
      const assemblyComponents = spec.components.map(comp => ({
        assembly_id: assemblyData.id,
        component_id: comp.componentId,
        quantity: comp.quantity,
        selected_quality_tier_id: comp.qualityTierId,
        unit: componentDetails.find(cd => cd.componentId === comp.componentId)?.unit || 'each',
        notes: comp.notes || ''
      }));

      const { error: componentsError } = await supabase
        .from('assembly_components')
        .insert(assemblyComponents);

      if (componentsError) {
        console.error('Error creating assembly components:', componentsError);
        // Clean up assembly if component creation fails
        await supabase.from('assemblies').delete().eq('id', assemblyData.id);
        return {
          assemblyId: '',
          assemblyName: '',
          totalMaterialCost: 0,
          totalLaborCost: 0,
          totalLaborHours: 0,
          components: [],
          success: false,
          error: `Failed to create assembly components: ${componentsError.message}`
        };
      }

      return {
        assemblyId: assemblyData.id,
        assemblyName: assemblyData.name,
        totalMaterialCost,
        totalLaborCost,
        totalLaborHours,
        components: componentDetails,
        success: true
      };

    } catch (error) {
      console.error('Error in createAssemblyFromSpec:', error);
      return {
        assemblyId: '',
        assemblyName: '',
        totalMaterialCost: 0,
        totalLaborCost: 0,
        totalLaborHours: 0,
        components: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private async getComponentDetails(components: AssemblyComponentSpec[]): Promise<EstimateItem[]> {
    try {
      const componentIds = components.map(c => c.componentId);
      const qualityTierIds = components.map(c => c.qualityTierId);

      // Get component details
      const { data: componentsData, error: componentsError } = await supabase
        .from('components')
        .select('*')
        .in('id', componentIds);

      if (componentsError) {
        console.error('Error fetching components:', componentsError);
        return [];
      }

      // Get quality tier details
      const { data: tiersData, error: tiersError } = await supabase
        .from('quality_tiers')
        .select('*')
        .in('id', qualityTierIds);

      if (tiersError) {
        console.error('Error fetching quality tiers:', tiersError);
        return [];
      }

      // Combine data into estimate items
      const estimateItems: EstimateItem[] = components.map(comp => {
        const component = componentsData?.find(c => c.id === comp.componentId);
        const qualityTier = tiersData?.find(t => t.id === comp.qualityTierId);

        if (!component || !qualityTier) {
          return null;
        }

        return {
          id: `${comp.componentId}_${comp.qualityTierId}_${Date.now()}`,
          componentId: component.id,
          componentName: component.name,
          qualityTier: {
            id: qualityTier.id,
            name: qualityTier.name,
            unitCost: qualityTier.unit_cost,
            description: qualityTier.description
          },
          quantity: comp.quantity,
          unit: component.unit,
          totalCost: qualityTier.unit_cost * comp.quantity
        };
      }).filter(item => item !== null) as EstimateItem[];

      return estimateItems;

    } catch (error) {
      console.error('Error in getComponentDetails:', error);
      return [];
    }
  }

  async suggestAssemblyFromComponents(components: Component[], projectType?: string): Promise<AssemblySpecification[]> {
    try {
      // Group components by category for logical assemblies
      const componentsByCategory = components.reduce((acc, comp) => {
        if (!acc[comp.category]) {
          acc[comp.category] = [];
        }
        acc[comp.category].push(comp);
        return acc;
      }, {} as Record<string, Component[]>);

      const suggestions: AssemblySpecification[] = [];

      // Create assembly suggestions based on common patterns
      for (const [category, categoryComponents] of Object.entries(componentsByCategory)) {
        if (categoryComponents.length >= 2) {
          const assemblySpec: AssemblySpecification = {
            name: `${category} Assembly`,
            description: `Complete ${category.toLowerCase()} assembly for ${projectType || 'data center'} project`,
            category,
            components: categoryComponents.map(comp => ({
              componentId: comp.id,
              quantity: 1,
              qualityTierId: comp.qualityTiers[0]?.id || '',
              notes: `Standard ${comp.name} configuration`
            })),
            totalLaborHours: categoryComponents.reduce((sum, comp) => sum + (comp.qualityTiers[0]?.unitCost || 0) * 0.1, 0)
          };

          suggestions.push(assemblySpec);
        }
      }

      return suggestions;

    } catch (error) {
      console.error('Error in suggestAssemblyFromComponents:', error);
      return [];
    }
  }

  validateSpecification(spec: AssemblySpecification): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!spec.name || spec.name.trim().length === 0) {
      errors.push('Assembly name is required');
    }

    if (!spec.components || spec.components.length === 0) {
      errors.push('At least one component is required');
    }

    if (spec.components) {
      spec.components.forEach((comp, index) => {
        if (!comp.componentId) {
          errors.push(`Component ${index + 1} ID is required`);
        }
        if (comp.quantity <= 0) {
          errors.push(`Component ${index + 1} quantity must be greater than 0`);
        }
        if (!comp.qualityTierId) {
          errors.push(`Component ${index + 1} quality tier is required`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  async optimizeAssembly(assemblyId: string): Promise<{
    optimizations: Array<{
      type: 'cost_reduction' | 'efficiency_improvement' | 'bulk_discount';
      description: string;
      potential_savings?: number;
      recommendations: string[];
    }>;
    total_potential_savings: number;
  }> {
    try {
      // Get assembly with components
      const { data: assembly, error } = await supabase
        .from('assemblies')
        .select(`
          *,
          assembly_components(
            *,
            components(*, quality_tiers(*))
          )
        `)
        .eq('id', assemblyId)
        .single();

      if (error || !assembly) {
        throw new Error('Assembly not found');
      }

      const optimizations = [];
      let totalSavings = 0;

      // Analyze each component for optimization opportunities
      for (const assemblyComp of assembly.assembly_components || []) {
        const component = assemblyComp.components;
        if (!component || !component.quality_tiers) continue;

        // Cost reduction opportunities
        const currentTier = component.quality_tiers.find((t: any) => t.id === assemblyComp.selected_quality_tier_id);
        const cheaperTier = component.quality_tiers
          .filter((t: any) => t.unit_cost < (currentTier?.unit_cost || 0))
          .sort((a: any, b: any) => b.unit_cost - a.unit_cost)[0];

        if (cheaperTier) {
          const savings = (currentTier.unit_cost - cheaperTier.unit_cost) * assemblyComp.quantity;
          totalSavings += savings;
          optimizations.push({
            type: 'cost_reduction' as const,
            description: `Switch ${component.name} from ${currentTier.name} to ${cheaperTier.name} tier`,
            potential_savings: savings,
            recommendations: [`Consider using ${cheaperTier.name} tier if quality requirements allow`]
          });
        }

        // Bulk discount opportunities
        if (assemblyComp.quantity >= 10) {
          optimizations.push({
            type: 'bulk_discount' as const,
            description: `Bulk pricing opportunity for ${component.name}`,
            potential_savings: (currentTier?.unit_cost || 0) * assemblyComp.quantity * 0.15,
            recommendations: ['Negotiate bulk pricing with suppliers', 'Consider grouping with other projects']
          });
        }

        // Efficiency improvements
        if (component.labor_hours && component.labor_hours > 4) {
          optimizations.push({
            type: 'efficiency_improvement' as const,
            description: `Installation efficiency for ${component.name}`,
            recommendations: [
              'Consider pre-assembly options',
              'Review installation sequence',
              'Train installation team on specific component'
            ]
          });
        }
      }

      return {
        optimizations,
        total_potential_savings: totalSavings
      };

    } catch (error) {
      console.error('Error optimizing assembly:', error);
      throw error;
    }
  }

  async createBulkAssemblies(projectType: string, scale: string): Promise<AssemblyCreationResult[]> {
    const results: AssemblyCreationResult[] = [];

    try {
      // Define bulk assembly templates
      const bulkTemplates = {
        'datacenter_5mw': [
          {
            name: 'Power Distribution Assembly',
            description: 'Complete power distribution system for 5MW data center',
            components: [
              { name: 'Main Distribution Panel', category: 'Power', quantity: 1, basePrice: 15000 },
              { name: 'UPS System', category: 'Power', quantity: 4, basePrice: 25000 },
              { name: 'Power Cables', category: 'Power', quantity: 500, basePrice: 50 }
            ]
          },
          {
            name: 'Cooling System Assembly',
            description: 'Complete cooling infrastructure for 5MW data center',
            components: [
              { name: 'Precision AC Unit', category: 'HVAC', quantity: 8, basePrice: 15000 },
              { name: 'Chilled Water Piping', category: 'HVAC', quantity: 1000, basePrice: 25 },
              { name: 'Air Handlers', category: 'HVAC', quantity: 4, basePrice: 8000 }
            ]
          }
        ]
      };

      const templates = bulkTemplates[projectType as keyof typeof bulkTemplates] || [];

      for (const template of templates) {
        // Create components first
        const componentIds = [];
        for (const comp of template.components) {
          const componentId = `bulk_${comp.category.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          const { error: componentError } = await supabase
            .from('components')
            .insert({
              id: componentId,
              name: comp.name,
              category: comp.category,
              description: `Bulk component for ${projectType}`,
              unit: 'each',
              labor_hours: comp.basePrice / 1000
            });

          if (!componentError) {
            // Create quality tiers
            const tiersData = [
              {
                id: `${componentId}_tier_1`,
                component_id: componentId,
                name: 'Standard',
                unit_cost: comp.basePrice * 0.9,
                description: 'Standard quality'
              },
              {
                id: `${componentId}_tier_2`,
                component_id: componentId,
                name: 'Premium',
                unit_cost: comp.basePrice,
                description: 'Premium quality'
              }
            ];

            await supabase.from('quality_tiers').insert(tiersData);
            componentIds.push({ componentId, quantity: comp.quantity, qualityTierId: `${componentId}_tier_1` });
          }
        }

        // Create assembly
        const assemblySpec: AssemblySpecification = {
          name: template.name,
          description: template.description,
          components: componentIds.map(c => ({
            componentId: c.componentId,
            quantity: c.quantity,
            qualityTierId: c.qualityTierId,
            notes: 'Bulk created'
          })),
          category: 'Bulk Assembly',
          totalLaborHours: template.components.reduce((sum, comp) => sum + (comp.basePrice / 1000 * comp.quantity), 0)
        };

        const result = await this.createAssemblyFromSpec(assemblySpec);
        results.push(result);
      }

      return results;

    } catch (error) {
      console.error('Error creating bulk assemblies:', error);
      throw error;
    }
  }
}

export const aiAssemblyBuilder = new AIAssemblyBuilder();