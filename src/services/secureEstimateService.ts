import { supabase } from "@/integrations/supabase/client";
import { EstimateItem, AssemblyEstimateItem, HierarchicalEstimate } from "@/types/estimate";
import { SecurityValidator } from "@/utils/validation";
import { ErrorHandler } from "@/utils/errorHandling";

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

export const secureEstimateService = {
  async saveAssemblyEstimate(name: string, assemblies: AssemblyEstimateItem[]): Promise<SavedEstimate> {
    // Rate limiting for estimate saves
    if (!ErrorHandler.checkRateLimit('estimate_save', 10, 300000)) {
      throw new Error('Too many save requests. Please wait 5 minutes.');
    }

    // Validate estimate name
    const nameValidation = SecurityValidator.validateProjectName(name);
    if (!nameValidation.isValid) {
      throw new Error(nameValidation.error || 'Invalid estimate name');
    }

    // Validate assemblies array
    if (!Array.isArray(assemblies) || assemblies.length === 0) {
      throw new Error('At least one assembly is required');
    }

    if (assemblies.length > 100) {
      throw new Error('Too many assemblies in estimate');
    }

    // Validate each assembly
    for (const assembly of assemblies) {
      const assemblyNameValidation = SecurityValidator.validateProjectName(assembly.assemblyName);
      if (!assemblyNameValidation.isValid) {
        throw new Error(`Invalid assembly name: ${assemblyNameValidation.error}`);
      }

      const quantityValidation = SecurityValidator.validateNumeric(assembly.quantity, 'Assembly quantity');
      if (!quantityValidation.isValid) {
        throw new Error(`Invalid assembly quantity: ${quantityValidation.error}`);
      }

      const materialCostValidation = SecurityValidator.validateCurrency(assembly.totalMaterialCost, 'Material cost');
      if (!materialCostValidation.isValid) {
        throw new Error(`Invalid material cost: ${materialCostValidation.error}`);
      }

      const laborCostValidation = SecurityValidator.validateCurrency(assembly.totalLaborCost, 'Labor cost');
      if (!laborCostValidation.isValid) {
        throw new Error(`Invalid labor cost: ${laborCostValidation.error}`);
      }

      // Validate components in assembly
      if (assembly.components && assembly.components.length > 50) {
        throw new Error('Too many components in assembly');
      }
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        ErrorHandler.logSecurityEvent('unauthorized_estimate_save', { estimateName: name }, 'high');
        throw new Error('You must be signed in to save estimates');
      }

      const totalCost = assemblies.reduce((sum, assembly) => 
        sum + assembly.totalMaterialCost + assembly.totalLaborCost, 0);
      
      const totalCostValidation = SecurityValidator.validateCurrency(totalCost, 'Total cost');
      if (!totalCostValidation.isValid) {
        throw new Error(totalCostValidation.error || 'Invalid total cost');
      }
      
      // Sanitize estimate name
      const sanitizedName = SecurityValidator.sanitizeText(name);
      
      // Insert the estimate
      const { data: estimate, error: estimateError } = await supabase
        .from('estimates')
        .insert({
          name: sanitizedName,
          total_cost: totalCost,
          user_id: user.id
        })
        .select()
        .single();

      if (estimateError) {
        const secureError = ErrorHandler.sanitizeError(estimateError);
        ErrorHandler.logSecurityEvent('database_insert_failed', { operation: 'saveEstimate', userId: user.id, error: secureError.logMessage });
        throw new Error(secureError.userMessage);
      }

      if (!estimate) {
        throw new Error('Failed to create estimate');
      }

      // Insert assemblies and their components
      for (const assembly of assemblies) {
        const { data: estimateAssembly, error: assemblyError } = await supabase
          .from('estimate_assemblies')
          .insert({
            estimate_id: estimate.id,
            assembly_id: assembly.assemblyId,
            assembly_name: SecurityValidator.sanitizeText(assembly.assemblyName),
            quantity: assembly.quantity,
            total_material_cost: assembly.totalMaterialCost,
            total_labor_cost: assembly.totalLaborCost,
            total_labor_hours: assembly.totalLaborHours
          })
          .select()
          .single();

        if (assemblyError) {
          const secureError = ErrorHandler.sanitizeError(assemblyError);
          ErrorHandler.logSecurityEvent('database_insert_failed', { operation: 'saveAssembly', estimateId: estimate.id, error: secureError.logMessage });
          throw new Error(secureError.userMessage);
        }

        // Insert components for this assembly
        if (assembly.components.length > 0) {
          const componentItems = assembly.components.map(component => ({
            estimate_id: estimate.id,
            estimate_assembly_id: estimateAssembly?.id,
            component_id: SecurityValidator.sanitizeText(component.componentId),
            component_name: SecurityValidator.sanitizeText(component.componentName),
            quality_tier_id: SecurityValidator.sanitizeText(component.qualityTier.id),
            quality_tier_name: SecurityValidator.sanitizeText(component.qualityTier.name),
            quality_tier_unit_cost: component.qualityTier.unitCost,
            quality_tier_description: SecurityValidator.sanitizeText(component.qualityTier.description || ''),
            quantity: component.quantity,
            unit: SecurityValidator.sanitizeText(component.unit),
            total_cost: component.totalCost
          }));

          const { error: itemsError } = await supabase
            .from('estimate_items')
            .insert(componentItems);

          if (itemsError) {
            const secureError = ErrorHandler.sanitizeError(itemsError);
            ErrorHandler.logSecurityEvent('database_insert_failed', { operation: 'saveEstimateItems', estimateId: estimate.id, error: secureError.logMessage });
            throw new Error(secureError.userMessage);
          }
        }
      }

      ErrorHandler.logSecurityEvent('estimate_saved', { estimateId: estimate.id, userId: user.id, totalCost });
      
      return estimate;
    } catch (error) {
      const secureError = ErrorHandler.sanitizeError(error);
      ErrorHandler.logSecurityEvent('service_error', { service: 'estimate', method: 'saveAssemblyEstimate', error: secureError.logMessage });
      throw new Error(secureError.userMessage);
    }
  },

  async saveEstimate(name: string, items: EstimateItem[]): Promise<SavedEstimate> {
    // Rate limiting for estimate saves
    if (!ErrorHandler.checkRateLimit('estimate_save', 10, 300000)) {
      throw new Error('Too many save requests. Please wait 5 minutes.');
    }

    // Validate estimate name
    const nameValidation = SecurityValidator.validateProjectName(name);
    if (!nameValidation.isValid) {
      throw new Error(nameValidation.error || 'Invalid estimate name');
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('At least one item is required');
    }

    if (items.length > 500) {
      throw new Error('Too many items in estimate');
    }

    // Validate each item
    for (const item of items) {
      const quantityValidation = SecurityValidator.validateNumeric(item.quantity, 'Item quantity');
      if (!quantityValidation.isValid) {
        throw new Error(`Invalid item quantity: ${quantityValidation.error}`);
      }

      const costValidation = SecurityValidator.validateCurrency(item.totalCost, 'Item cost');
      if (!costValidation.isValid) {
        throw new Error(`Invalid item cost: ${costValidation.error}`);
      }
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        ErrorHandler.logSecurityEvent('unauthorized_estimate_save', { estimateName: name }, 'high');
        throw new Error('You must be signed in to save estimates');
      }

      const totalCost = items.reduce((sum, item) => sum + item.totalCost, 0);
      
      const totalCostValidation = SecurityValidator.validateCurrency(totalCost, 'Total cost');
      if (!totalCostValidation.isValid) {
        throw new Error(totalCostValidation.error || 'Invalid total cost');
      }
      
      // Sanitize estimate name
      const sanitizedName = SecurityValidator.sanitizeText(name);
      
      // Insert the estimate
      const { data: estimate, error: estimateError } = await supabase
        .from('estimates')
        .insert({
          name: sanitizedName,
          total_cost: totalCost,
          user_id: user.id
        })
        .select()
        .single();

      if (estimateError) {
        const secureError = ErrorHandler.sanitizeError(estimateError);
        ErrorHandler.logSecurityEvent('database_insert_failed', { operation: 'saveEstimate', userId: user.id, error: secureError.logMessage });
        throw new Error(secureError.userMessage);
      }

      if (!estimate) {
        throw new Error('Failed to create estimate');
      }

      // Insert the estimate items
      const estimateItems = items.map(item => ({
        estimate_id: estimate.id,
        component_id: SecurityValidator.sanitizeText(item.componentId),
        component_name: SecurityValidator.sanitizeText(item.componentName),
        quality_tier_id: SecurityValidator.sanitizeText(item.qualityTier.id),
        quality_tier_name: SecurityValidator.sanitizeText(item.qualityTier.name),
        quality_tier_unit_cost: item.qualityTier.unitCost,
        quality_tier_description: SecurityValidator.sanitizeText(item.qualityTier.description || ''),
        quantity: item.quantity,
        unit: SecurityValidator.sanitizeText(item.unit),
        total_cost: item.totalCost
      }));

      const { error: itemsError } = await supabase
        .from('estimate_items')
        .insert(estimateItems);

      if (itemsError) {
        const secureError = ErrorHandler.sanitizeError(itemsError);
        ErrorHandler.logSecurityEvent('database_insert_failed', { operation: 'saveEstimateItems', estimateId: estimate.id, error: secureError.logMessage });
        throw new Error(secureError.userMessage);
      }

      ErrorHandler.logSecurityEvent('estimate_saved', { estimateId: estimate.id, userId: user.id, totalCost });

      return estimate;
    } catch (error) {
      const secureError = ErrorHandler.sanitizeError(error);
      ErrorHandler.logSecurityEvent('service_error', { service: 'estimate', method: 'saveEstimate', error: secureError.logMessage });
      throw new Error(secureError.userMessage);
    }
  },

  async getEstimates(): Promise<SavedEstimate[]> {
    try {
      const { data, error } = await supabase
        .from('estimates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        const secureError = ErrorHandler.sanitizeError(error);
        ErrorHandler.logSecurityEvent('database_query_failed', { operation: 'getEstimates', error: secureError.logMessage });
        throw new Error(secureError.userMessage);
      }
      
      return data || [];
    } catch (error) {
      const secureError = ErrorHandler.sanitizeError(error);
      ErrorHandler.logSecurityEvent('service_error', { service: 'estimate', method: 'getEstimates', error: secureError.logMessage });
      throw new Error(secureError.userMessage);
    }
  },

  async getEstimateWithAssemblies(estimateId: string): Promise<HierarchicalEstimate> {
    // Validate estimateId
    const sanitizedId = SecurityValidator.sanitizeText(estimateId);
    if (!sanitizedId || sanitizedId.length > 100) {
      throw new Error('Invalid estimate ID');
    }

    try {
      const { data: estimate, error: estimateError } = await supabase
        .from('estimates')
        .select('*')
        .eq('id', sanitizedId)
        .single();

      if (estimateError) {
        const secureError = ErrorHandler.sanitizeError(estimateError);
        ErrorHandler.logSecurityEvent('database_query_failed', { operation: 'getEstimate', estimateId: sanitizedId, error: secureError.logMessage });
        throw new Error(secureError.userMessage);
      }

      const { data: assemblies, error: assembliesError } = await supabase
        .from('estimate_assemblies')
        .select('*')
        .eq('estimate_id', sanitizedId)
        .order('created_at');

      if (assembliesError) {
        const secureError = ErrorHandler.sanitizeError(assembliesError);
        ErrorHandler.logSecurityEvent('database_query_failed', { operation: 'getEstimateAssemblies', estimateId: sanitizedId, error: secureError.logMessage });
        throw new Error(secureError.userMessage);
      }

      const hierarchicalAssemblies: AssemblyEstimateItem[] = [];

      for (const assembly of assemblies || []) {
        const { data: components, error: componentsError } = await supabase
          .from('estimate_items')
          .select('*')
          .eq('estimate_assembly_id', assembly.id)
          .order('created_at');

        if (componentsError) {
          const secureError = ErrorHandler.sanitizeError(componentsError);
          ErrorHandler.logSecurityEvent('database_query_failed', { operation: 'getAssemblyComponents', assemblyId: assembly.id, error: secureError.logMessage });
          throw new Error(secureError.userMessage);
        }

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
    } catch (error) {
      const secureError = ErrorHandler.sanitizeError(error);
      ErrorHandler.logSecurityEvent('service_error', { service: 'estimate', method: 'getEstimateWithAssemblies', error: secureError.logMessage });
      throw new Error(secureError.userMessage);
    }
  },

  async getEstimateWithItems(estimateId: string): Promise<{
    estimate: SavedEstimate;
    items: SavedEstimateItem[];
  }> {
    // Validate estimateId
    const sanitizedId = SecurityValidator.sanitizeText(estimateId);
    if (!sanitizedId || sanitizedId.length > 100) {
      throw new Error('Invalid estimate ID');
    }

    try {
      const { data: estimate, error: estimateError } = await supabase
        .from('estimates')
        .select('*')
        .eq('id', sanitizedId)
        .single();

      if (estimateError) {
        const secureError = ErrorHandler.sanitizeError(estimateError);
        ErrorHandler.logSecurityEvent('database_query_failed', { operation: 'getEstimate', estimateId: sanitizedId, error: secureError.logMessage });
        throw new Error(secureError.userMessage);
      }

      const { data: items, error: itemsError } = await supabase
        .from('estimate_items')
        .select('*')
        .eq('estimate_id', sanitizedId)
        .order('created_at');

      if (itemsError) {
        const secureError = ErrorHandler.sanitizeError(itemsError);
        ErrorHandler.logSecurityEvent('database_query_failed', { operation: 'getEstimateItems', estimateId: sanitizedId, error: secureError.logMessage });
        throw new Error(secureError.userMessage);
      }

      return { estimate, items: items || [] };
    } catch (error) {
      const secureError = ErrorHandler.sanitizeError(error);
      ErrorHandler.logSecurityEvent('service_error', { service: 'estimate', method: 'getEstimateWithItems', error: secureError.logMessage });
      throw new Error(secureError.userMessage);
    }
  },

  async deleteEstimate(estimateId: string): Promise<void> {
    // Rate limiting for deletes
    if (!ErrorHandler.checkRateLimit('estimate_delete', 10, 300000)) {
      throw new Error('Too many delete requests. Please wait 5 minutes.');
    }

    // Validate estimateId
    const sanitizedId = SecurityValidator.sanitizeText(estimateId);
    if (!sanitizedId || sanitizedId.length > 100) {
      throw new Error('Invalid estimate ID');
    }

    try {
      const { error } = await supabase
        .from('estimates')
        .delete()
        .eq('id', sanitizedId);

      if (error) {
        const secureError = ErrorHandler.sanitizeError(error);
        ErrorHandler.logSecurityEvent('database_delete_failed', { operation: 'deleteEstimate', estimateId: sanitizedId, error: secureError.logMessage });
        throw new Error(secureError.userMessage);
      }

      ErrorHandler.logSecurityEvent('estimate_deleted', { estimateId: sanitizedId });
    } catch (error) {
      const secureError = ErrorHandler.sanitizeError(error);
      ErrorHandler.logSecurityEvent('service_error', { service: 'estimate', method: 'deleteEstimate', error: secureError.logMessage });
      throw new Error(secureError.userMessage);
    }
  }
};