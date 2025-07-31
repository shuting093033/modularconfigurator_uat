import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
  conversationHistory: ChatMessage[];
  estimateContext?: any;
}

interface AIAction {
  type: 'create_component' | 'create_assembly' | 'add_to_estimate' | 'search_components' | 'suggest_alternatives' | 'optimize_assembly' | 'bulk_create' | 'validate_requirements';
  data: any;
  reasoning: string;
}

interface StructuredResponse {
  response: string;
  actions: AIAction[];
  suggestions: ComponentSuggestion[];
}

interface ComponentSuggestion {
  componentId: string;
  componentName: string;
  category: string;
  quantity?: number;
  reasoning: string;
}

// Helper function to extract user ID from JWT token
function extractUserIdFromJWT(authHeader: string): string | null {
  try {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || null;
  } catch (error) {
    console.error('Error extracting user ID from JWT:', error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract user ID from authorization header
    const authHeader = req.headers.get('authorization');
    const userId = extractUserIdFromJWT(authHeader || '');
    
    if (!userId) {
      console.error('No valid user ID found in authorization header');
      return new Response(
        JSON.stringify({ error: 'Authentication required' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Authenticated user ID:', userId);

    const { message, conversationHistory, estimateContext }: ChatRequest = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Initialize Supabase client with authentication
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing');
    }

    if (!authHeader) {
      throw new Error('Authorization header required');
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Create Supabase client with service role key and user context
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    });

    // Fetch available components for context
    const { data: components } = await supabase
      .from('components')
      .select('id, name, category, description, unit')
      .limit(100);

    const systemPrompt = `You are an AI assistant specialized in data center construction cost estimation. You can perform structured actions to help users build estimates.

AVAILABLE ACTIONS:
1. create_component - Create new components when user describes something not in the catalog
2. create_assembly - Group related components into assemblies  
3. add_to_estimate - Add components/assemblies to current estimate
4. search_components - Find existing components matching user requirements
5. suggest_alternatives - Recommend alternative components based on cost, availability, or performance
6. optimize_assembly - Suggest improvements to assemblies for cost or efficiency
7. bulk_create - Create multiple components/assemblies for large-scale projects
8. validate_requirements - Check if components meet data center requirements (power, cooling, space)

CRITICAL ACTION SEQUENCING RULES:
- ALWAYS create missing components BEFORE creating assemblies that need them
- When creating assemblies, check if all required components exist first
- If components are missing, create them with proper specifications and quality tiers
- Use componentName (not componentId) in assembly creation to reference components by name
- For assemblies, provide components array with {componentName, quantity, reasoning} format

RESPONSE FORMAT:
Always respond with JSON containing:
{
  "response": "Human-readable message explaining what you're doing",
  "actions": [
    {
      "type": "action_type",
      "data": { /* action-specific data */ },
      "reasoning": "Why this action is recommended"
    }
  ],
  "suggestions": [
    {
      "componentId": "id",
      "componentName": "name", 
      "category": "category",
      "quantity": 1,
      "reasoning": "Why suggested"
    }
  ]
}

Available components: ${components?.map(c => `${c.name} (${c.category})`).join(', ')}
Current estimate context: ${JSON.stringify(estimateContext)}

WORKFLOW FOR COMPLEX REQUESTS:
1. Analyze user request for specific components and assemblies needed
2. Search existing components to see what's already available
3. For missing components: Create them first with detailed specs and quality tiers
4. For assemblies: Reference components by name (not ID) and include proper quantities
5. Provide clear explanations of what was created and why

COMPONENT CREATION GUIDELINES:
- Include 2-3 quality tiers (Basic/Standard, Premium, Enterprise)
- Set realistic market-based pricing (research typical costs)
- Include detailed technical specifications relevant to data centers
- Estimate accurate labor hours for installation
- Use appropriate units (each, linear ft, sq ft, kW, BTU, etc)
- Include power requirements, cooling needs, physical dimensions
- Add relevant certifications and warranty information

ASSEMBLY CREATION GUIDELINES:
- Reference components using "componentName" field (not componentId)
- Include proper quantities for each component
- Provide reasoning for component selection and quantities
- Consider redundancy requirements (N+1, 2N, etc.)
- Include installation sequence and dependencies

EXAMPLE ASSEMBLY FORMAT:
{
  "type": "create_assembly",
  "data": {
    "name": "Chiller Plant Assembly",
    "description": "Complete chiller plant with redundancy",
    "components": [
      {"componentName": "Water-Cooled Chiller 500kW", "quantity": 2, "reasoning": "N+1 redundancy"},
      {"componentName": "Chilled Water Pump", "quantity": 4, "reasoning": "Primary/backup pumps per chiller"}
    ]
  },
  "reasoning": "Creates complete cooling solution with redundancy"
}

Be intelligent, proactive, and thorough in creating complete solutions.`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages,
        temperature: 0.3,
        max_tokens: 2000,
        stream: false,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const aiResponseContent = data.choices[0].message.content;

    // Parse structured response
    let structuredResponse: StructuredResponse;
    try {
      structuredResponse = JSON.parse(aiResponseContent);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Fallback to simple response
      structuredResponse = {
        response: aiResponseContent,
        actions: [],
        suggestions: []
      };
    }

    // Process actions if any
    const actionResults = await processActions(supabase, structuredResponse.actions || [], userId);

    // Log the conversation for future learning
    await supabase.from('ai_conversations').insert({
      user_id: userId,
      conversation_data: {
        user_message: message,
        ai_response: structuredResponse.response,
        actions: structuredResponse.actions,
        action_results: actionResults,
        context: estimateContext
      }
    });

    return new Response(JSON.stringify({ 
      response: structuredResponse.response,
      suggestions: structuredResponse.suggestions || [],
      actions: structuredResponse.actions || [],
      actionResults
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function processActions(supabase: any, actions: AIAction[], userId: string): Promise<any[]> {
  const results = [];
  
  for (const action of actions) {
    try {
      let result;
      
      switch (action.type) {
        case 'create_component':
          result = await createComponentAction(supabase, action.data, userId);
          break;
        case 'create_assembly':
          result = await createAssemblyAction(supabase, action.data, userId);
          break;
        case 'search_components':
          result = await searchComponentsAction(supabase, action.data);
          break;
        case 'suggest_alternatives':
          result = await suggestAlternativesAction(supabase, action.data);
          break;
        case 'optimize_assembly':
          result = await optimizeAssemblyAction(supabase, action.data);
          break;
        case 'bulk_create':
          result = await bulkCreateAction(supabase, action.data, userId);
          break;
        case 'validate_requirements':
          result = await validateRequirementsAction(supabase, action.data);
          break;
        default:
          result = { success: false, error: `Unknown action type: ${action.type}` };
      }
      
      results.push({ action: action.type, result });
    } catch (error) {
      console.error(`Error processing action ${action.type}:`, error);
      results.push({ 
        action: action.type, 
        result: { success: false, error: error.message } 
      });
    }
  }
  
  return results;
}

async function createComponentAction(supabase: any, data: any, userId: string) {
  console.log('Creating component with data:', JSON.stringify(data, null, 2), 'for user:', userId);

  // Validation: Ensure we have required data
  if (!data || typeof data !== 'object') {
    console.error('Invalid component data provided:', data);
    return { success: false, error: 'Invalid component data provided' };
  }

  // Validate required fields
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    return { success: false, error: 'Component name is required and must be a non-empty string' };
  }

  if (!data.category || typeof data.category !== 'string' || data.category.trim().length === 0) {
    return { success: false, error: 'Component category is required and must be a non-empty string' };
  }

  if (!data.unit || typeof data.unit !== 'string' || data.unit.trim().length === 0) {
    return { success: false, error: 'Component unit is required and must be a non-empty string' };
  }

  // Validate field lengths (database constraints)
  if (data.name.trim().length > 100) {
    return { success: false, error: 'Component name must be 100 characters or less' };
  }

  if (data.category.trim().length > 100) {
    return { success: false, error: 'Component category must be 100 characters or less' };
  }

  // Validate numeric fields
  const laborHours = parseFloat(data.laborHours) || 0;
  const basePrice = parseFloat(data.basePrice) || 100;

  if (laborHours < 0) {
    return { success: false, error: 'Labor hours must be non-negative' };
  }

  if (basePrice <= 0) {
    return { success: false, error: 'Base price must be greater than zero' };
  }

  // Generate unique component ID with better collision resistance
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  const categorySlug = data.category.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const componentId = `ai_${categorySlug}_${timestamp}_${random}`;

  try {
    // Create component
    const { data: componentData, error: componentError } = await supabase
      .from('components')
      .insert({
        id: componentId,
        name: data.name.trim(),
        category: data.category.trim(),
        description: (data.description || '').substring(0, 1000), // Limit description length
        unit: data.unit.trim(),
        labor_hours: laborHours,
        technical_specs: data.technicalSpecs || {},
        power_requirements: data.powerRequirements || {},
        physical_dimensions: data.physicalDimensions || {},
        cooling_requirements: data.coolingRequirements || {},
        environmental_specs: data.environmentalSpecs || {},
        certifications: data.certifications || [],
        warranty_years: parseInt(data.warrantyYears) || 1,
        lead_time_days: parseInt(data.leadTimeDays) || 30,
        material_waste_factor: parseFloat(data.materialWasteFactor) || 0.05,
        user_id: userId
      })
      .select()
      .single();

    if (componentError) {
      console.error('Component creation error:', componentError);
      return { success: false, error: `Failed to create component: ${componentError.message}` };
    }

    console.log('Component created successfully:', componentData);

    // Create quality tiers with validation
    const qualityTiers = data.qualityTiers || [
      { name: 'Basic', unitCost: basePrice * 0.8, description: 'Standard quality option' },
      { name: 'Premium', unitCost: basePrice * 1.2, description: 'Higher quality option' },
      { name: 'Enterprise', unitCost: basePrice * 1.5, description: 'Enterprise grade option' }
    ];

    // Validate quality tiers
    const validatedTiers = [];
    for (let i = 0; i < qualityTiers.length; i++) {
      const tier = qualityTiers[i];
      
      if (!tier.name || typeof tier.name !== 'string') {
        console.warn(`Skipping invalid quality tier ${i}: missing or invalid name`);
        continue;
      }

      const unitCost = parseFloat(tier.unitCost);
      if (isNaN(unitCost) || unitCost <= 0) {
        console.warn(`Skipping quality tier ${tier.name}: invalid unit cost`);
        continue;
      }

      validatedTiers.push({
        id: `${componentId}_tier_${i + 1}`,
        component_id: componentId,
        name: tier.name.trim(),
        unit_cost: unitCost,
        description: (tier.description || '').substring(0, 500) // Limit description length
      });
    }

    if (validatedTiers.length === 0) {
      // Clean up component if no valid tiers
      await supabase.from('components').delete().eq('id', componentId);
      return { success: false, error: 'No valid quality tiers provided' };
    }

    const { error: tiersError } = await supabase
      .from('quality_tiers')
      .insert(validatedTiers);

    if (tiersError) {
      console.error('Quality tiers creation error:', tiersError);
      // Clean up component if tier creation fails
      await supabase.from('components').delete().eq('id', componentId);
      return { success: false, error: `Failed to create quality tiers: ${tiersError.message}` };
    }

    console.log('Quality tiers created successfully');

    return { 
      success: true, 
      componentId,
      component: componentData,
      qualityTiers: validatedTiers
    };

  } catch (error) {
    console.error('Unexpected error in createComponentAction:', error);
    // Attempt cleanup
    try {
      await supabase.from('components').delete().eq('id', componentId);
    } catch (cleanupError) {
      console.error('Failed to cleanup component after error:', cleanupError);
    }
    
    return { 
      success: false, 
      error: `Unexpected error creating component: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

async function createAssemblyAction(supabase: any, data: any, userId: string) {
  console.log('Creating assembly with data:', JSON.stringify(data, null, 2), 'for user:', userId);

  // Validation: Ensure we have required data
  if (!data || typeof data !== 'object') {
    console.error('Invalid assembly data provided:', data);
    return { success: false, error: 'Invalid assembly data provided' };
  }

  // Ensure we have a name for the assembly
  const assemblyName = data.assemblyName || data.name || data.assemblyName;
  if (!assemblyName || typeof assemblyName !== 'string' || assemblyName.trim().length === 0) {
    console.error('No valid assembly name provided in data:', data);
    return { success: false, error: 'Assembly name is required and must be a non-empty string' };
  }

  // Validate name length (database constraint check)
  if (assemblyName.trim().length > 100) {
    return { success: false, error: 'Assembly name must be 100 characters or less' };
  }

  // Validate components array if provided
  if (data.components && (!Array.isArray(data.components) || data.components.length === 0)) {
    console.error('Invalid components array provided:', data.components);
    return { success: false, error: 'Components must be a non-empty array if provided' };
  }

  // Validate numeric fields
  const totalMaterialCost = parseFloat(data.totalMaterialCost) || 0;
  const totalLaborCost = parseFloat(data.totalLaborCost) || 0;
  const laborHours = parseFloat(data.totalLaborHours || data.laborHours) || 0;

  if (totalMaterialCost < 0 || totalLaborCost < 0 || laborHours < 0) {
    return { success: false, error: 'Cost and labor hour values must be non-negative' };
  }

  // Create assembly
  const assemblyPayload = {
    name: assemblyName.trim(),
    description: (data.description || '').substring(0, 1000), // Limit description length
    total_material_cost: totalMaterialCost,
    total_labor_cost: totalLaborCost,
    labor_hours: laborHours,
    user_id: userId
  };
  
  console.log('Assembly payload:', JSON.stringify(assemblyPayload, null, 2));
  
  const { data: assemblyData, error: assemblyError } = await supabase
    .from('assemblies')
    .insert(assemblyPayload)
    .select()
    .single();

  if (assemblyError) {
    console.error('Assembly creation error:', assemblyError);
    return { success: false, error: `Failed to create assembly: ${assemblyError.message}` };
  }

  console.log('Assembly created successfully:', assemblyData);

  // Create assembly components if provided
  if (data.components && Array.isArray(data.components) && data.components.length > 0) {
    console.log('Processing components:', data.components);
    
    try {
      // Get all components from database to map names/descriptions to actual IDs
      const { data: allComponents, error: componentsQueryError } = await supabase
        .from('components')
        .select('id, name, category, unit');
      
      if (componentsQueryError) {
        console.error('Error fetching components:', componentsQueryError);
        await supabase.from('assemblies').delete().eq('id', assemblyData.id);
        return { success: false, error: 'Failed to fetch component references' };
      }

      console.log(`Found ${allComponents?.length || 0} components in database`);

      // Map provided component identifiers to actual component IDs
      const assemblyComponents = [];
      const componentMappingErrors = [];
      
      for (const comp of data.components) {
        // Validate component structure
        if (!comp || typeof comp !== 'object') {
          componentMappingErrors.push(`Invalid component object: ${JSON.stringify(comp)}`);
          continue;
        }

        // Support both componentId and componentName for flexibility
        const componentRef = comp.componentId || comp.componentName;
        if (!componentRef) {
          componentMappingErrors.push(`Component missing componentId or componentName: ${JSON.stringify(comp)}`);
          continue;
        }

        // Validate quantity
        const quantity = parseFloat(comp.quantity) || 1;
        if (quantity <= 0) {
          componentMappingErrors.push(`Invalid quantity for component ${componentRef}: ${comp.quantity}`);
          continue;
        }

        let actualComponentId = componentRef;
        let componentUnit = comp.unit || 'each';
        
        // If the componentRef doesn't exist in database as ID, try to find it by name or description
        const existsDirectly = allComponents?.find(c => c.id === componentRef);
        
        if (!existsDirectly) {
          console.log(`Component reference "${componentRef}" not found directly, searching by name...`);
          
          // Try to find by name (exact match first, then partial)
          let foundComponent = allComponents?.find(c => 
            c.name.toLowerCase() === componentRef.toLowerCase()
          );
          
          if (!foundComponent) {
            // Try partial name match
            foundComponent = allComponents?.find(c => 
              c.name.toLowerCase().includes(componentRef.toLowerCase()) ||
              componentRef.toLowerCase().includes(c.name.toLowerCase())
            );
          }
          
          if (!foundComponent) {
            // Try matching by extracting key words from the provided reference
            const keywords = componentRef.toLowerCase()
              .split(/[\s\-\(\)]+/)
              .filter(word => word.length > 2);
            
            foundComponent = allComponents?.find(c => {
              const componentName = c.name.toLowerCase();
              return keywords.some(keyword => componentName.includes(keyword));
            });
          }
          
          if (foundComponent) {
            console.log(`Mapped "${componentRef}" to "${foundComponent.id}" (${foundComponent.name})`);
            actualComponentId = foundComponent.id;
            componentUnit = foundComponent.unit || componentUnit; // Use component's unit if available
          } else {
            componentMappingErrors.push(`Component "${componentRef}" not found in database`);
            continue;
          }
        } else {
          componentUnit = existsDirectly.unit || componentUnit;
        }
        
        assemblyComponents.push({
          assembly_id: assemblyData.id,
          component_id: actualComponentId,
          quantity: quantity,
          selected_quality_tier_id: comp.qualityTierId || 'standard',
          unit: componentUnit,
          notes: (comp.notes || '').substring(0, 500) // Limit notes length
        });
      }

      // Check if we have mapping errors
      if (componentMappingErrors.length > 0) {
        console.error('Component mapping errors:', componentMappingErrors);
        await supabase.from('assemblies').delete().eq('id', assemblyData.id);
        
        const availableComponents = allComponents?.slice(0, 10).map(c => `${c.name} (${c.id})`).join(', ') || 'None available';
        return { 
          success: false, 
          error: `Component mapping failed: ${componentMappingErrors.join('; ')}. First 10 available components: ${availableComponents}`
        };
      }

      // Check if we have any valid components to insert
      if (assemblyComponents.length === 0) {
        console.error('No valid components to insert after processing');
        await supabase.from('assemblies').delete().eq('id', assemblyData.id);
        return { success: false, error: 'No valid components provided for assembly' };
      }

      console.log('Final assembly components to insert:', assemblyComponents);

      // Insert assembly components
      const { error: componentsError } = await supabase
        .from('assembly_components')
        .insert(assemblyComponents);

      if (componentsError) {
        console.error('Assembly components creation error:', componentsError);
        // Clean up assembly if component creation fails
        await supabase.from('assemblies').delete().eq('id', assemblyData.id);
        return { success: false, error: `Failed to create assembly components: ${componentsError.message}` };
      }
      
      console.log('Assembly components created successfully');
      
    } catch (componentError) {
      console.error('Unexpected error during component processing:', componentError);
      await supabase.from('assemblies').delete().eq('id', assemblyData.id);
      return { 
        success: false, 
        error: `Unexpected error processing components: ${componentError instanceof Error ? componentError.message : 'Unknown error'}` 
      };
    }
  }

  return { 
    success: true, 
    assemblyId: assemblyData.id,
    assembly: assemblyData
  };
}

async function searchComponentsAction(supabase: any, data: any) {
  try {
    // Validate input
    if (!data || !data.query || typeof data.query !== 'string') {
      return { success: false, error: 'Search query is required and must be a string' };
    }

    const query = data.query.trim();
    if (query.length === 0) {
      return { success: false, error: 'Search query cannot be empty' };
    }

    if (query.length > 100) {
      return { success: false, error: 'Search query is too long (max 100 characters)' };
    }

    const { data: components, error } = await supabase
      .from('components')
      .select(`
        *,
        quality_tiers(*)
      `)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .limit(10);

    if (error) {
      console.error('Search components error:', error);
      return { success: false, error: `Search failed: ${error.message}` };
    }

    return { 
      success: true, 
      components: components || [],
      query: query
    };
  } catch (error) {
    console.error('Unexpected error in searchComponentsAction:', error);
    return { 
      success: false, 
      error: `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

async function suggestAlternativesAction(supabase: any, data: any) {
  const { componentId, criteria } = data;
  
  // Get the base component
  const { data: baseComponent, error: baseError } = await supabase
    .from('components')
    .select(`*, quality_tiers(*)`)
    .eq('id', componentId)
    .single();

  if (baseError || !baseComponent) {
    return { success: false, error: 'Component not found' };
  }

  // Find alternatives based on criteria
  let query = supabase
    .from('components')
    .select(`
      *,
      quality_tiers(*)
    `)
    .eq('category', baseComponent.category)
    .neq('id', componentId);

  // Apply criteria filters
  if (criteria?.maxCost) {
    query = query.filter('quality_tiers.unit_cost', 'lte', criteria.maxCost);
  }
  if (criteria?.minPerformance) {
    // Filter by technical specs if available
    query = query.filter('technical_specs->performance', 'gte', criteria.minPerformance);
  }

  const { data: alternatives, error } = await query.limit(5);

  if (error) {
    return { success: false, error: error.message };
  }

  // Score alternatives based on criteria
  const scoredAlternatives = (alternatives || []).map((alt: any) => {
    let score = 0;
    const avgCost = alt.quality_tiers?.reduce((sum: number, tier: any) => sum + tier.unit_cost, 0) / (alt.quality_tiers?.length || 1);
    const baseCost = baseComponent.quality_tiers?.reduce((sum: number, tier: any) => sum + tier.unit_cost, 0) / (baseComponent.quality_tiers?.length || 1);
    
    // Lower cost = higher score
    if (avgCost < baseCost) score += 2;
    
    // Similar performance = higher score
    if (alt.technical_specs && baseComponent.technical_specs) {
      score += 1;
    }
    
    return { ...alt, score, cost_savings: baseCost - avgCost };
  }).sort((a: any, b: any) => b.score - a.score);

  return {
    success: true,
    baseComponent,
    alternatives: scoredAlternatives,
    criteria
  };
}

async function optimizeAssemblyAction(supabase: any, data: any) {
  const { assemblyId } = data;
  
  // Get assembly with components
  const { data: assembly, error: assemblyError } = await supabase
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

  if (assemblyError || !assembly) {
    return { success: false, error: 'Assembly not found' };
  }

  const optimizations = [];
  let potentialSavings = 0;

  // Analyze each component for optimization opportunities
  for (const assemblyComp of assembly.assembly_components || []) {
    const component = assemblyComp.components;
    if (!component || !component.quality_tiers) continue;

    // Find cheaper quality tier
    const currentTier = component.quality_tiers.find((t: any) => t.id === assemblyComp.selected_quality_tier_id);
    const cheaperTier = component.quality_tiers
      .filter((t: any) => t.unit_cost < (currentTier?.unit_cost || 0))
      .sort((a: any, b: any) => b.unit_cost - a.unit_cost)[0];

    if (cheaperTier) {
      const savings = (currentTier.unit_cost - cheaperTier.unit_cost) * assemblyComp.quantity;
      potentialSavings += savings;
      optimizations.push({
        component: component.name,
        currentTier: currentTier.name,
        suggestedTier: cheaperTier.name,
        savings,
        quantity: assemblyComp.quantity
      });
    }

    // Check for bulk quantity discounts
    if (assemblyComp.quantity >= 10) {
      optimizations.push({
        component: component.name,
        optimization: 'bulk_discount',
        suggestion: 'Consider negotiating bulk pricing for quantities over 10',
        potential_savings_percent: 15
      });
    }
  }

  return {
    success: true,
    assembly,
    optimizations,
    potential_savings: potentialSavings,
    recommendations: [
      'Consider using lower-tier components where quality requirements allow',
      'Group similar installations for bulk purchasing',
      'Review installation sequence for efficiency gains'
    ]
  };
}

async function bulkCreateAction(supabase: any, data: any, userId: string) {
  console.log('Creating bulk components for user:', userId);
  const { projectType, scale, requirements } = data;
  const results = [];

  try {
    // Define bulk component sets based on project type
    const bulkSets = {
      'datacenter_5mw': [
        { name: 'High-Efficiency UPS', category: 'Power', quantity: 4, basePrice: 25000 },
        { name: 'Precision Cooling Unit', category: 'HVAC', quantity: 8, basePrice: 15000 },
        { name: 'Emergency Generator', category: 'Power', quantity: 2, basePrice: 50000 },
        { name: 'Server Rack Cabinet', category: 'Infrastructure', quantity: 200, basePrice: 800 },
        { name: 'Fire Suppression System', category: 'Safety', quantity: 1, basePrice: 75000 }
      ],
      'datacenter_10mw': [
        { name: 'High-Efficiency UPS', category: 'Power', quantity: 8, basePrice: 25000 },
        { name: 'Precision Cooling Unit', category: 'HVAC', quantity: 16, basePrice: 15000 },
        { name: 'Emergency Generator', category: 'Power', quantity: 4, basePrice: 50000 },
        { name: 'Server Rack Cabinet', category: 'Infrastructure', quantity: 400, basePrice: 800 },
        { name: 'Fire Suppression System', category: 'Safety', quantity: 2, basePrice: 75000 }
      ]
    };

    const componentsToCreate = bulkSets[projectType as keyof typeof bulkSets] || [];

    // Create components in batch
    for (const comp of componentsToCreate) {
      const componentId = `bulk_${comp.category.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create component
      const { data: componentData, error: componentError } = await supabase
        .from('components')
        .insert({
          id: componentId,
          name: comp.name,
          category: comp.category,
          description: `Bulk created component for ${projectType} project`,
          unit: 'each',
          labor_hours: comp.basePrice / 1000, // Estimate labor hours
          technical_specs: { bulk_created: true, project_type: projectType },
          user_id: userId
        })
        .select()
        .single();

      if (!componentError) {
        // Create quality tiers
        const qualityTiers = [
          { name: 'Standard', unitCost: comp.basePrice * 0.8, description: 'Standard quality for bulk projects' },
          { name: 'Premium', unitCost: comp.basePrice, description: 'Premium quality option' },
          { name: 'Enterprise', unitCost: comp.basePrice * 1.3, description: 'Enterprise grade quality' }
        ];

        const tiersData = qualityTiers.map((tier, index) => ({
          id: `${componentId}_tier_${index + 1}`,
          component_id: componentId,
          name: tier.name,
          unit_cost: tier.unitCost,
          description: tier.description
        }));

        await supabase.from('quality_tiers').insert(tiersData);

        results.push({
          component: comp.name,
          componentId,
          quantity: comp.quantity,
          success: true
        });
      } else {
        results.push({
          component: comp.name,
          success: false,
          error: componentError.message
        });
      }
    }

    return {
      success: true,
      project_type: projectType,
      components_created: results.filter(r => r.success).length,
      total_components: componentsToCreate.length,
      results
    };

  } catch (error) {
    return {
      success: false,
      error: error.message,
      partial_results: results
    };
  }
}

async function validateRequirementsAction(supabase: any, data: any) {
  const { componentIds, requirements } = data;
  const validationResults = [];

  for (const componentId of componentIds) {
    const { data: component, error } = await supabase
      .from('components')
      .select('*')
      .eq('id', componentId)
      .single();

    if (error || !component) {
      validationResults.push({
        componentId,
        valid: false,
        errors: ['Component not found']
      });
      continue;
    }

    const errors = [];
    const warnings = [];

    // Power requirements validation
    if (requirements.maxPowerKw && component.power_requirements?.power_kw > requirements.maxPowerKw) {
      errors.push(`Power requirement ${component.power_requirements.power_kw}kW exceeds limit of ${requirements.maxPowerKw}kW`);
    }

    // Cooling requirements validation
    if (requirements.maxCoolingBtu && component.cooling_requirements?.btu_per_hour > requirements.maxCoolingBtu) {
      errors.push(`Cooling requirement ${component.cooling_requirements.btu_per_hour} BTU/h exceeds limit of ${requirements.maxCoolingBtu} BTU/h`);
    }

    // Space requirements validation
    if (requirements.maxDimensions && component.physical_dimensions) {
      const dims = component.physical_dimensions;
      if (dims.height > requirements.maxDimensions.height ||
          dims.width > requirements.maxDimensions.width ||
          dims.depth > requirements.maxDimensions.depth) {
        errors.push('Component dimensions exceed space constraints');
      }
    }

    // Environmental requirements
    if (requirements.operatingTemp && component.environmental_specs) {
      const envSpecs = component.environmental_specs;
      if (envSpecs.min_temp > requirements.operatingTemp.min ||
          envSpecs.max_temp < requirements.operatingTemp.max) {
        warnings.push('Operating temperature range may not be optimal');
      }
    }

    // Certification requirements
    if (requirements.requiredCertifications && component.certifications) {
      const missingCerts = requirements.requiredCertifications.filter(
        (cert: string) => !component.certifications.includes(cert)
      );
      if (missingCerts.length > 0) {
        errors.push(`Missing required certifications: ${missingCerts.join(', ')}`);
      }
    }

    validationResults.push({
      componentId,
      componentName: component.name,
      valid: errors.length === 0,
      errors,
      warnings,
      compliance_score: errors.length === 0 ? (warnings.length === 0 ? 100 : 85) : 60
    });
  }

  return {
    success: true,
    overall_compliance: validationResults.every(r => r.valid),
    validation_results: validationResults,
    summary: {
      total_components: componentIds.length,
      compliant_components: validationResults.filter(r => r.valid).length,
      avg_compliance_score: validationResults.reduce((sum, r) => sum + r.compliance_score, 0) / validationResults.length
    }
  };
}