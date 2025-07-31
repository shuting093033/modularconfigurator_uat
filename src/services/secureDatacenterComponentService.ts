import { supabase } from "@/integrations/supabase/client";
import { EnhancedComponent, QualityTier } from "@/types/datacenter";
import { SecurityValidator } from "@/utils/validation";
import { ErrorHandler } from "@/utils/errorHandling";

export const secureDatacenterComponentService = {
  async getComponents(): Promise<EnhancedComponent[]> {
    try {
      const { data, error } = await supabase
        .from('components')
        .select('*')
        .order('category', { ascending: true });
      
      if (error) {
        const secureError = ErrorHandler.sanitizeError(error);
        ErrorHandler.logSecurityEvent('database_query_failed', { operation: 'getComponents', error: secureError.logMessage });
        throw new Error(secureError.userMessage);
      }
      
      if (!data) return [];
      
      return data.map(component => ({
        ...component,
        skill_level: component.skill_level as 'entry' | 'intermediate' | 'expert' | 'specialist' | undefined,
        created_at: new Date(component.created_at),
        updated_at: new Date(component.updated_at)
      })) as EnhancedComponent[];
    } catch (error) {
      const secureError = ErrorHandler.sanitizeError(error);
      ErrorHandler.logSecurityEvent('service_error', { service: 'datacenterComponent', method: 'getComponents', error: secureError.logMessage });
      throw new Error(secureError.userMessage);
    }
  },

  async getComponentsByCategory(category: string): Promise<EnhancedComponent[]> {
    // Validate and sanitize input
    const sanitizedCategory = SecurityValidator.sanitizeText(category);
    const validation = SecurityValidator.validateProjectName(sanitizedCategory);
    
    if (!validation.isValid) {
      throw new Error(validation.error || 'Invalid category name');
    }

    try {
      const { data, error } = await supabase
        .from('components')
        .select('*')
        .eq('category', sanitizedCategory)
        .order('name', { ascending: true });
      
      if (error) {
        const secureError = ErrorHandler.sanitizeError(error);
        ErrorHandler.logSecurityEvent('database_query_failed', { operation: 'getComponentsByCategory', category: sanitizedCategory, error: secureError.logMessage });
        throw new Error(secureError.userMessage);
      }
      
      if (!data) return [];
      
      return data.map(component => ({
        ...component,
        skill_level: component.skill_level as 'entry' | 'intermediate' | 'expert' | 'specialist' | undefined,
        created_at: new Date(component.created_at),
        updated_at: new Date(component.updated_at)
      })) as EnhancedComponent[];
    } catch (error) {
      const secureError = ErrorHandler.sanitizeError(error);
      ErrorHandler.logSecurityEvent('service_error', { service: 'datacenterComponent', method: 'getComponentsByCategory', error: secureError.logMessage });
      throw new Error(secureError.userMessage);
    }
  },

  async getQualityTiers(componentId: string): Promise<QualityTier[]> {
    // Validate componentId
    const sanitizedId = SecurityValidator.sanitizeText(componentId);
    if (!sanitizedId || sanitizedId.length > 100) {
      throw new Error('Invalid component ID');
    }

    try {
      const { data, error } = await supabase
        .from('quality_tiers')
        .select('*')
        .eq('component_id', sanitizedId)
        .order('unit_cost', { ascending: true });
      
      if (error) {
        const secureError = ErrorHandler.sanitizeError(error);
        ErrorHandler.logSecurityEvent('database_query_failed', { operation: 'getQualityTiers', componentId: sanitizedId, error: secureError.logMessage });
        throw new Error(secureError.userMessage);
      }
      
      if (!data) return [];
      
      return data.map(tier => ({
        ...tier,
        created_at: new Date(tier.created_at)
      }));
    } catch (error) {
      const secureError = ErrorHandler.sanitizeError(error);
      ErrorHandler.logSecurityEvent('service_error', { service: 'datacenterComponent', method: 'getQualityTiers', error: secureError.logMessage });
      throw new Error(secureError.userMessage);
    }
  },

  async searchComponents(searchTerm: string): Promise<EnhancedComponent[]> {
    // Rate limiting check
    if (!ErrorHandler.checkRateLimit('component_search', 30, 60000)) {
      throw new Error('Too many search requests. Please wait a moment.');
    }

    // Validate and sanitize search term
    const sanitizedTerm = SecurityValidator.sanitizeText(searchTerm);
    if (!sanitizedTerm || sanitizedTerm.length < 2) {
      throw new Error('Search term must be at least 2 characters long');
    }
    if (sanitizedTerm.length > 100) {
      throw new Error('Search term is too long');
    }

    try {
      const { data, error } = await supabase
        .from('components')
        .select('*')
        .or(`name.ilike.%${sanitizedTerm}%,description.ilike.%${sanitizedTerm}%,category.ilike.%${sanitizedTerm}%`)
        .order('name', { ascending: true });
      
      if (error) {
        const secureError = ErrorHandler.sanitizeError(error);
        ErrorHandler.logSecurityEvent('database_query_failed', { operation: 'searchComponents', searchTerm: sanitizedTerm, error: secureError.logMessage });
        throw new Error(secureError.userMessage);
      }
      
      if (!data) return [];
      
      return data.map(component => ({
        ...component,
        skill_level: component.skill_level as 'entry' | 'intermediate' | 'expert' | 'specialist' | undefined,
        created_at: new Date(component.created_at),
        updated_at: new Date(component.updated_at)
      })) as EnhancedComponent[];
    } catch (error) {
      const secureError = ErrorHandler.sanitizeError(error);
      ErrorHandler.logSecurityEvent('service_error', { service: 'datacenterComponent', method: 'searchComponents', error: secureError.logMessage });
      throw new Error(secureError.userMessage);
    }
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
    // Rate limiting for component creation
    if (!ErrorHandler.checkRateLimit('component_create', 10, 300000)) {
      throw new Error('Too many component creation requests. Please wait 5 minutes.');
    }

    // Validate all inputs
    const nameValidation = SecurityValidator.validateProjectName(componentData.name);
    if (!nameValidation.isValid) {
      throw new Error(nameValidation.error || 'Invalid component name');
    }

    const categoryValidation = SecurityValidator.validateProjectName(componentData.category);
    if (!categoryValidation.isValid) {
      throw new Error(categoryValidation.error || 'Invalid category');
    }

    if (componentData.labor_hours !== undefined) {
      const laborValidation = SecurityValidator.validateNumeric(componentData.labor_hours, 'Labor hours');
      if (!laborValidation.isValid) {
        throw new Error(laborValidation.error || 'Invalid labor hours');
      }
    }

    if (componentData.lead_time_days !== undefined) {
      const leadTimeValidation = SecurityValidator.validateNumeric(componentData.lead_time_days, 'Lead time');
      if (!leadTimeValidation.isValid) {
        throw new Error(leadTimeValidation.error || 'Invalid lead time');
      }
    }

    // Sanitize text inputs
    const sanitizedData = {
      ...componentData,
      id: SecurityValidator.sanitizeText(componentData.id),
      name: SecurityValidator.sanitizeText(componentData.name),
      category: SecurityValidator.sanitizeText(componentData.category),
      unit: SecurityValidator.sanitizeText(componentData.unit),
      description: componentData.description ? SecurityValidator.sanitizeText(componentData.description) : undefined,
      installation_notes: componentData.installation_notes ? SecurityValidator.sanitizeText(componentData.installation_notes) : undefined
    };

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        ErrorHandler.logSecurityEvent('unauthorized_component_creation', { componentId: sanitizedData.id }, 'high');
        throw new Error('You must be authenticated to create components');
      }

      const { data, error } = await supabase
        .from('components')
        .insert({
          ...sanitizedData,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) {
        const secureError = ErrorHandler.sanitizeError(error);
        ErrorHandler.logSecurityEvent('database_insert_failed', { operation: 'createComponent', userId: user.id, error: secureError.logMessage });
        throw new Error(secureError.userMessage);
      }
      
      if (!data) {
        throw new Error('Failed to create component');
      }
      
      ErrorHandler.logSecurityEvent('component_created', { componentId: data.id, userId: user.id });
      
      return {
        ...data,
        skill_level: data.skill_level as 'entry' | 'intermediate' | 'expert' | 'specialist' | undefined,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      } as EnhancedComponent;
    } catch (error) {
      const secureError = ErrorHandler.sanitizeError(error);
      ErrorHandler.logSecurityEvent('service_error', { service: 'datacenterComponent', method: 'createComponent', error: secureError.logMessage });
      throw new Error(secureError.userMessage);
    }
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