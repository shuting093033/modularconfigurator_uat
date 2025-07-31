import { supabase } from "@/integrations/supabase/client";
import { EnhancedComponent, QualityTier } from "@/types/datacenter";

export const datacenterComponentService = {
  async getComponents(): Promise<EnhancedComponent[]> {
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .order('category', { ascending: true });
    
    if (error) throw error;
    
    return data.map(component => ({
      ...component,
      skill_level: component.skill_level as 'entry' | 'intermediate' | 'expert' | 'specialist' | undefined,
      created_at: new Date(component.created_at),
      updated_at: new Date(component.updated_at)
    })) as EnhancedComponent[];
  },

  async getComponentsByCategory(category: string): Promise<EnhancedComponent[]> {
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .eq('category', category)
      .order('name', { ascending: true });
    
    if (error) throw error;
    
    return data.map(component => ({
      ...component,
      skill_level: component.skill_level as 'entry' | 'intermediate' | 'expert' | 'specialist' | undefined,
      created_at: new Date(component.created_at),
      updated_at: new Date(component.updated_at)
    })) as EnhancedComponent[];
  },

  async getQualityTiers(componentId: string): Promise<QualityTier[]> {
    const { data, error } = await supabase
      .from('quality_tiers')
      .select('*')
      .eq('component_id', componentId)
      .order('unit_cost', { ascending: true });
    
    if (error) throw error;
    
    return data.map(tier => ({
      ...tier,
      created_at: new Date(tier.created_at)
    }));
  },

  async searchComponents(searchTerm: string): Promise<EnhancedComponent[]> {
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
      .order('name', { ascending: true });
    
    if (error) throw error;
    
    return data.map(component => ({
      ...component,
      skill_level: component.skill_level as 'entry' | 'intermediate' | 'expert' | 'specialist' | undefined,
      created_at: new Date(component.created_at),
      updated_at: new Date(component.updated_at)
    })) as EnhancedComponent[];
  },

  async createComponent(componentData: {
    id: string;
    name: string;
    category: string;
    description?: string;
    unit: string;
    skill_level?: 'entry' | 'intermediate' | 'expert' | 'specialist';
    labor_hours?: number;
    vendor_info?: any;
    lead_time_days?: number;
    technical_specs?: any;
    installation_notes?: string;
  }): Promise<EnhancedComponent> {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User must be authenticated to create components');
    }

    const { data, error } = await supabase
      .from('components')
      .insert({
        ...componentData,
        user_id: user.id
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      skill_level: data.skill_level as 'entry' | 'intermediate' | 'expert' | 'specialist' | undefined,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at)
    } as EnhancedComponent;
  },

  async updateComponent(id: string, componentData: {
    name?: string;
    category?: string;
    description?: string;
    unit?: string;
    skill_level?: 'entry' | 'intermediate' | 'expert' | 'specialist';
    labor_hours?: number;
    vendor_info?: any;
    lead_time_days?: number;
    technical_specs?: any;
    installation_notes?: string;
  }): Promise<EnhancedComponent> {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User must be authenticated to update components');
    }

    console.log('Updating component with ID:', id);
    console.log('User ID:', user.id);
    console.log('Component data:', componentData);

    // First check if the component exists and if the user owns it
    const { data: existingComponent, error: checkError } = await supabase
      .from('components')
      .select('id, user_id, name')
      .eq('id', id)
      .single();
    
    if (checkError) {
      console.error('Error checking component:', checkError);
      throw new Error(`Component not found: ${checkError.message}`);
    }

    console.log('Existing component:', existingComponent);

    if (existingComponent.user_id !== user.id) {
      throw new Error('You can only edit components that you created');
    }

    const { data, error } = await supabase
      .from('components')
      .update(componentData)
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user can only update their own components
      .select()
      .single();
    
    if (error) {
      console.error('Update error:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from update operation');
    }
    
    return {
      ...data,
      skill_level: data.skill_level as 'entry' | 'intermediate' | 'expert' | 'specialist' | undefined,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at)
    } as EnhancedComponent;
  },

  async deleteComponent(id: string): Promise<void> {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User must be authenticated to delete components');
    }

    // First delete associated quality tiers
    const { error: tiersError } = await supabase
      .from('quality_tiers')
      .delete()
      .eq('component_id', id);
    
    if (tiersError) throw tiersError;

    // Then delete the component
    const { error } = await supabase
      .from('components')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // Ensure user can only delete their own components
    
    if (error) throw error;
  },

  getComponentCategories(): string[] {
    return [
      'Electrical Infrastructure',
      'Mechanical Systems', 
      'IT Infrastructure',
      'Fire Protection',
      'Security Systems',
      'Foundation Systems',
      'Backup Power',
      'Monitoring & Controls'
    ];
  }
};