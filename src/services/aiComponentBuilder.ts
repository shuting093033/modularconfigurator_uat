import { supabase } from "@/integrations/supabase/client";
import { Component, QualityTier } from "@/types/estimate";

export interface ComponentSpecification {
  name: string;
  category: string;
  description?: string;
  unit: string;
  quantity?: number;
  qualityTiers: QualityTierSpec[];
  technicalSpecs?: Record<string, any>;
  powerRequirements?: Record<string, any>;
  physicalDimensions?: Record<string, any>;
  laborHours?: number;
}

export interface QualityTierSpec {
  name: string;
  unitCost: number;
  description?: string;
}

export interface ComponentCreationResult {
  component: Component;
  qualityTiers: QualityTier[];
  success: boolean;
  error?: string;
}

class AIComponentBuilder {
  async createComponentFromSpec(spec: ComponentSpecification): Promise<ComponentCreationResult> {
    try {
      // Validate specification
      if (!spec.name || !spec.category || !spec.unit) {
        return {
          component: {} as Component,
          qualityTiers: [],
          success: false,
          error: "Missing required fields: name, category, or unit"
        };
      }

      // Generate unique component ID
      const componentId = `ai_${spec.category.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;

      // Create component in database
      const { data: componentData, error: componentError } = await supabase
        .from('components')
        .insert({
          id: componentId,
          name: spec.name,
          category: spec.category,
          description: spec.description || '',
          unit: spec.unit,
          labor_hours: spec.laborHours || 0,
          technical_specs: spec.technicalSpecs || {},
          power_requirements: spec.powerRequirements || {},
          physical_dimensions: spec.physicalDimensions || {}
        })
        .select()
        .single();

      if (componentError) {
        console.error('Error creating component:', componentError);
        return {
          component: {} as Component,
          qualityTiers: [],
          success: false,
          error: `Failed to create component: ${componentError.message}`
        };
      }

      // Create quality tiers
      const qualityTiersData = spec.qualityTiers.map((tier, index) => ({
        id: `${componentId}_tier_${index + 1}`,
        component_id: componentId,
        name: tier.name,
        unit_cost: tier.unitCost,
        description: tier.description || ''
      }));

      const { data: tiersData, error: tiersError } = await supabase
        .from('quality_tiers')
        .insert(qualityTiersData)
        .select();

      if (tiersError) {
        console.error('Error creating quality tiers:', tiersError);
        // Clean up component if tier creation fails
        await supabase.from('components').delete().eq('id', componentId);
        return {
          component: {} as Component,
          qualityTiers: [],
          success: false,
          error: `Failed to create quality tiers: ${tiersError.message}`
        };
      }

      const component: Component = {
        id: componentData.id,
        name: componentData.name,
        category: componentData.category,
        description: componentData.description,
        unit: componentData.unit,
        qualityTiers: tiersData.map(tier => ({
          id: tier.id,
          name: tier.name,
          unitCost: tier.unit_cost,
          description: tier.description
        }))
      };

      return {
        component,
        qualityTiers: component.qualityTiers,
        success: true
      };

    } catch (error) {
      console.error('Error in createComponentFromSpec:', error);
      return {
        component: {} as Component,
        qualityTiers: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async findSimilarComponents(specification: Partial<ComponentSpecification>): Promise<Component[]> {
    try {
      const { data, error } = await supabase
        .from('components')
        .select(`
          *,
          quality_tiers(*)
        `)
        .ilike('name', `%${specification.name || ''}%`)
        .eq('category', specification.category || '')
        .limit(5);

      if (error) {
        console.error('Error finding similar components:', error);
        return [];
      }

      return data?.map(comp => ({
        id: comp.id,
        name: comp.name,
        category: comp.category,
        description: comp.description,
        unit: comp.unit,
        qualityTiers: comp.quality_tiers?.map((tier: any) => ({
          id: tier.id,
          name: tier.name,
          unitCost: tier.unit_cost,
          description: tier.description
        })) || []
      })) || [];
    } catch (error) {
      console.error('Error in findSimilarComponents:', error);
      return [];
    }
  }

  async findAlternativeComponents(componentId: string, criteria: {
    maxCost?: number;
    minPerformance?: number;
    sameCategory?: boolean;
  } = {}): Promise<Component[]> {
    try {
      // Get the base component first
      const { data: baseComponent, error: baseError } = await supabase
        .from('components')
        .select(`*, quality_tiers(*)`)
        .eq('id', componentId)
        .single();

      if (baseError || !baseComponent) {
        return [];
      }

      let query = supabase.from('components').select(`
        *,
        quality_tiers(*)
      `);

      // Filter by same category if requested
      if (criteria.sameCategory !== false) {
        query = query.eq('category', baseComponent.category);
      }

      // Exclude the base component
      query = query.neq('id', componentId);

      const { data, error } = await query.limit(5);

      if (error) {
        console.error('Error finding alternative components:', error);
        return [];
      }

      // Filter and score alternatives
      return (data || []).filter(component => {
        const avgCost = component.quality_tiers?.reduce((sum: number, tier: any) => sum + tier.unit_cost, 0) / (component.quality_tiers?.length || 1);
        
        if (criteria.maxCost && avgCost > criteria.maxCost) {
          return false;
        }

        return true;
      }).map(comp => ({
        id: comp.id,
        name: comp.name,
        category: comp.category,
        description: comp.description,
        unit: comp.unit,
        qualityTiers: comp.quality_tiers?.map((tier: any) => ({
          id: tier.id,
          name: tier.name,
          unitCost: tier.unit_cost,
          description: tier.description
        })) || []
      }));

    } catch (error) {
      console.error('Error in findSimilarComponents:', error);
      return [];
    }
  }

  async searchComponentsSemanticaly(query: string): Promise<Component[]> {
    try {
      // Use the full-text search index we created
      const { data, error } = await supabase
        .rpc('search_components_text', { search_query: query });

      if (error) {
        console.error('Error in semantic search:', error);
        // Fallback to regular search
        return this.searchComponentsFallback(query);
      }

      // Transform the search results to match Component interface
      return (data || []).map((comp: any) => ({
        id: comp.id,
        name: comp.name,
        category: comp.category,
        description: comp.description,
        unit: comp.unit,
        qualityTiers: [] // Quality tiers would need separate query
      }));

    } catch (error) {
      console.error('Error in searchComponentsSemanticaly:', error);
      return this.searchComponentsFallback(query);
    }
  }

  private async searchComponentsFallback(query: string): Promise<Component[]> {
    try {
      const { data, error } = await supabase
        .from('components')
        .select(`
          *,
          quality_tiers(*)
        `)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        .limit(10);

      if (error) {
        console.error('Error in fallback search:', error);
        return [];
      }

      return data?.map(comp => ({
        id: comp.id,
        name: comp.name,
        category: comp.category,
        description: comp.description,
        unit: comp.unit,
        qualityTiers: comp.quality_tiers?.map((tier: any) => ({
          id: tier.id,
          name: tier.name,
          unitCost: tier.unit_cost,
          description: tier.description
        })) || []
      })) || [];

    } catch (error) {
      console.error('Error in searchComponentsFallback:', error);
      return [];
    }
  }

  validateSpecification(spec: Partial<ComponentSpecification>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!spec.name || spec.name.trim().length === 0) {
      errors.push('Component name is required');
    }

    if (!spec.category || spec.category.trim().length === 0) {
      errors.push('Component category is required');
    }

    if (!spec.unit || spec.unit.trim().length === 0) {
      errors.push('Component unit is required');
    }

    if (spec.qualityTiers && spec.qualityTiers.length === 0) {
      errors.push('At least one quality tier is required');
    }

    if (spec.qualityTiers) {
      spec.qualityTiers.forEach((tier, index) => {
        if (!tier.name || tier.name.trim().length === 0) {
          errors.push(`Quality tier ${index + 1} name is required`);
        }
        if (tier.unitCost <= 0) {
          errors.push(`Quality tier ${index + 1} unit cost must be greater than 0`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export const aiComponentBuilder = new AIComponentBuilder();