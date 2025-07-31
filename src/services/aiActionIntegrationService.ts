import { supabase } from "@/integrations/supabase/client";
import { estimateIntegrationService } from "./estimateIntegrationService";
import { aiComponentBuilder } from "./aiComponentBuilder";
import { aiAssemblyBuilder } from "./aiAssemblyBuilder";
import { toast } from "sonner";

export interface AIActionResult {
  action: string;
  success: boolean;
  data?: any;
  error?: string;
  estimateUpdated?: boolean;
}

export interface AIActionContext {
  estimateId?: string;
  projectType?: string;
  onComponentAdded?: (component: any) => void;
  onAssemblyAdded?: (assembly: any) => void;
  onEstimateUpdated?: () => void;
}

class AIActionIntegrationService {
  private readonly ACTION_TIMEOUT = 30000; // 30 seconds timeout per action

  async processAIActions(
    actionResults: any[], 
    context: AIActionContext
  ): Promise<AIActionResult[]> {
    const results: AIActionResult[] = [];

    // Validate input
    if (!Array.isArray(actionResults)) {
      console.error('Invalid actionResults provided:', actionResults);
      return [{
        action: 'validation_error',
        success: false,
        error: 'Invalid action results format - expected array'
      }];
    }

    if (actionResults.length === 0) {
      console.log('No actions to process');
      return [];
    }

    if (actionResults.length > 15) {
      console.warn(`Large number of actions requested: ${actionResults.length}. Processing first 15 only.`);
      actionResults = actionResults.slice(0, 15);
    }

    // Process actions sequentially to handle dependencies (components before assemblies)
    const componentActions = actionResults.filter(ar => (ar.action?.type || ar.action) === 'create_component');
    const assemblyActions = actionResults.filter(ar => (ar.action?.type || ar.action) === 'create_assembly');
    const otherActions = actionResults.filter(ar => !['create_component', 'create_assembly'].includes(ar.action?.type || ar.action));

    // Show initial progress message
    if (componentActions.length > 0) {
      toast.success(`Creating ${componentActions.length} missing components first...`);
    }

    // Process components first
    for (const [index, actionResult] of componentActions.entries()) {
      try {
        const result = await Promise.race([
          this.processIndividualAction(actionResult, context),
          new Promise<AIActionResult>((_, reject) => 
            setTimeout(() => reject(new Error('Component creation timed out')), this.ACTION_TIMEOUT)
          )
        ]);
        
        results.push(result);
        
        if (result.success) {
          const componentName = result.data?.name || 'Component';
          toast.success(`✅ Component ${index + 1}/${componentActions.length}: ${componentName}`);
        } else {
          toast.error(`❌ Component creation failed: ${result.error}`);
        }
      } catch (error) {
        console.error('Error processing component creation:', error);
        const errorResult: AIActionResult = {
          action: 'create_component',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
        results.push(errorResult);
        toast.error(`❌ Component creation failed: ${errorResult.error}`);
      }
    }

    // Process assemblies after components
    if (assemblyActions.length > 0) {
      toast.success(`Creating ${assemblyActions.length} assemblies...`);
    }

    for (const [index, actionResult] of assemblyActions.entries()) {
      try {
        const result = await Promise.race([
          this.processIndividualAction(actionResult, context),
          new Promise<AIActionResult>((_, reject) => 
            setTimeout(() => reject(new Error('Assembly creation timed out')), this.ACTION_TIMEOUT)
          )
        ]);
        
        results.push(result);
        
        if (result.success) {
          const assemblyName = result.data?.name || 'Assembly';
          toast.success(`✅ Assembly ${index + 1}/${assemblyActions.length}: ${assemblyName}`);
        } else {
          toast.error(`❌ Assembly creation failed: ${result.error}`);
        }
      } catch (error) {
        console.error('Error processing assembly creation:', error);
        const errorResult: AIActionResult = {
          action: 'create_assembly',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
        results.push(errorResult);
        toast.error(`❌ Assembly creation failed: ${errorResult.error}`);
      }
    }

    // Process other actions
    for (const actionResult of otherActions) {
      try {
        const result = await Promise.race([
          this.processIndividualAction(actionResult, context),
          new Promise<AIActionResult>((_, reject) => 
            setTimeout(() => reject(new Error('Action timed out')), this.ACTION_TIMEOUT)
          )
        ]);
        
        results.push(result);
        
        if (result.success) {
          this.showSuccessToast(result);
        } else {
          this.showErrorToast(result);
        }
      } catch (error) {
        console.error('Error processing AI action:', error);
        const errorResult: AIActionResult = {
          action: actionResult.action?.type || actionResult.action || 'unknown',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
        results.push(errorResult);
        this.showErrorToast(errorResult);
      }
    }

    // Final summary
    const successfulComponents = results.filter(r => r.success && r.action === 'create_component').length;
    const successfulAssemblies = results.filter(r => r.success && r.action === 'create_assembly').length;
    
    if (successfulComponents > 0 || successfulAssemblies > 0) {
      toast.success(`🎉 Created ${successfulComponents} components and ${successfulAssemblies} assemblies successfully!`);
      context.onEstimateUpdated?.();
    }

    return results;
  }

  private async processIndividualAction(
    actionResult: any, 
    context: AIActionContext
  ): Promise<AIActionResult> {
    const { action, result } = actionResult;
    
    // Handle both action.type and direct action string
    const actionType = action?.type || action;

    switch (actionType) {
      case 'create_component':
        return await this.handleComponentCreation(result, context);
      
      case 'create_assembly':
        return await this.handleAssemblyCreation(result, context);
      
      case 'add_to_estimate':
        return await this.handleAddToEstimate(result, context);
      
      case 'search_components':
        return await this.handleComponentSearch(result, context);
      
      default:
        return {
          action: actionType || 'unknown',
          success: false,
          error: `Unknown action type: ${actionType}`
        };
    }
  }

  private async handleComponentCreation(
    result: any, 
    context: AIActionContext
  ): Promise<AIActionResult> {
    try {
      // Extract the actual result from the wrapper
      const actualResult = result.result || result;
      
      if (!actualResult.success) {
        return {
          action: 'create_component',
          success: false,
          error: actualResult.error || 'Component creation failed in AI service'
        };
      }

      const component = actualResult.component;
      
      // Add to current estimate if one exists
      if (context.estimateId && component) {
        const integrationResult = await estimateIntegrationService.addComponentsToEstimate(
          context.estimateId,
          [{
            componentId: component.id,
            quantity: 1,
            qualityTierId: component.quality_tiers?.[0]?.id || 'standard'
          }]
        );

        if (integrationResult.success) {
          context.onEstimateUpdated?.();
        }
      }

      // Notify parent component
      context.onComponentAdded?.(component);

      return {
        action: 'create_component',
        success: true,
        data: component,
        estimateUpdated: !!context.estimateId
      };
    } catch (error) {
      return {
        action: 'create_component',
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process component creation'
      };
    }
  }

  private async handleAssemblyCreation(
    result: any, 
    context: AIActionContext
  ): Promise<AIActionResult> {
    try {
      // Extract the actual result from the wrapper
      const actualResult = result.result || result;
      
      if (!actualResult.success) {
        return {
          action: 'create_assembly',
          success: false,
          error: actualResult.error || 'Assembly creation failed in AI service'
        };
      }

      const assembly = actualResult.assembly;
      
      // Add to current estimate if one exists
      if (context.estimateId && assembly) {
        const integrationResult = await estimateIntegrationService.addAssemblyToEstimate(
          context.estimateId,
          assembly.id,
          1
        );

        if (integrationResult.success) {
          context.onEstimateUpdated?.();
        }
      }

      // Notify parent component
      context.onAssemblyAdded?.(assembly);

      return {
        action: 'create_assembly',
        success: true,
        data: assembly,
        estimateUpdated: !!context.estimateId
      };
    } catch (error) {
      return {
        action: 'create_assembly',
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process assembly creation'
      };
    }
  }

  private async handleAddToEstimate(
    result: any, 
    context: AIActionContext
  ): Promise<AIActionResult> {
    try {
      if (!context.estimateId) {
        return {
          action: 'add_to_estimate',
          success: false,
          error: 'No active estimate to add items to'
        };
      }

      // Extract the actual result from the wrapper
      const actualResult = result.result || result;
      
      if (!actualResult.success || !actualResult.items) {
        return {
          action: 'add_to_estimate',
          success: false,
          error: actualResult.error || 'No items to add to estimate'
        };
      }

      const integrationResult = await estimateIntegrationService.addComponentsToEstimate(
        context.estimateId,
        actualResult.items
      );

      if (integrationResult.success) {
        context.onEstimateUpdated?.();
      }

      return {
        action: 'add_to_estimate',
        success: integrationResult.success,
        data: integrationResult,
        estimateUpdated: integrationResult.success
      };
    } catch (error) {
      return {
        action: 'add_to_estimate',
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add items to estimate'
      };
    }
  }

  private async handleComponentSearch(
    result: any, 
    context: AIActionContext
  ): Promise<AIActionResult> {
    // Extract the actual result from the wrapper
    const actualResult = result.result || result;
    
    return {
      action: 'search_components',
      success: !!actualResult.components,
      data: actualResult.components || []
    };
  }

  private showSuccessToast(result: AIActionResult) {
    const messages: Record<string, string> = {
      create_component: 'Component created successfully!',
      create_assembly: 'Assembly created successfully!',
      add_to_estimate: 'Items added to estimate!',
      search_components: 'Components found!'
    };

    const message = messages[result.action] || 'Action completed successfully!';
    const details = result.estimateUpdated ? ' Estimate updated.' : '';
    
    toast.success(message + details);
  }

  private showErrorToast(result: AIActionResult) {
    const message = result.error || 'Action failed';
    toast.error(`Failed to ${result.action.replace('_', ' ')}: ${message}`);
  }

  async getCurrentEstimateContext(estimateId?: string): Promise<any> {
    if (!estimateId) return null;

    try {
      const { data: estimate, error: estimateError } = await supabase
        .from('estimates')
        .select(`
          *,
          estimate_items (
            *,
            component_name,
            quality_tier_name,
            total_cost
          )
        `)
        .eq('id', estimateId)
        .single();

      if (estimateError) throw estimateError;

      return {
        estimateId: estimate.id,
        estimateName: estimate.name,
        totalCost: estimate.total_cost,
        currentItems: estimate.estimate_items || []
      };
    } catch (error) {
      console.error('Error fetching estimate context:', error);
      return null;
    }
  }
}

export const aiActionIntegrationService = new AIActionIntegrationService();