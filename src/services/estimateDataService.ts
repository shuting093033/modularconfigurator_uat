import { supabase } from "@/integrations/supabase/client";

interface EstimateDataSummary {
  estimates: number;
  estimateItems: number;
  actualCosts: number;
  projects: number;
}

export const estimateDataService = {
  async generateEstimateData(userId: string): Promise<{ summary: EstimateDataSummary }> {
    try {
      // First, get existing components and assemblies from the database
      const [componentsResult, assembliesResult] = await Promise.all([
        supabase.from('components').select('*').limit(100),
        supabase.from('assemblies').select('*, assembly_components(*)').limit(50)
      ]);

      if (componentsResult.error) throw componentsResult.error;
      if (assembliesResult.error) throw assembliesResult.error;

      const components = componentsResult.data || [];
      const assemblies = assembliesResult.data || [];

      if (components.length === 0) {
        throw new Error('No components found in database. Please ensure base data exists first.');
      }

      // Create a simple project for organizing estimates
      const projectResult = await supabase
        .from('projects')
        .insert({
          name: 'Test Data Center Project',
          description: 'Generated project for estimate analytics',
          user_id: userId,
          status: 'planning',
          project_type: 'datacenter', // Fixed: using valid constraint value
          total_budget: 25000000, // $25M budget
          location: 'Test Location',
          start_date: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

      if (projectResult.error) throw projectResult.error;
      const project = projectResult.data;

      // Generate 25 realistic estimates
      const estimates = [];
      const estimateItems = [];
      const actualCosts = [];

      for (let i = 0; i < 25; i++) {
        // Create estimate
        const estimateName = [
          'Server Rack Infrastructure',
          'Cooling System Installation', 
          'Power Distribution Setup',
          'Network Cabling Phase',
          'Fire Suppression System',
          'Security Infrastructure',
          'Backup Power Systems',
          'Environmental Monitoring',
          'Access Control Systems',
          'Emergency Systems'
        ][i % 10] + ` - Phase ${Math.floor(i / 10) + 1}`;

        const estimate = {
          name: estimateName,
          user_id: userId,
          total_cost: 0 // Will be calculated from items
        };

        const estimateResult = await supabase
          .from('estimates')
          .insert(estimate)
          .select()
          .single();

        if (estimateResult.error) throw estimateResult.error;
        const savedEstimate = estimateResult.data;

        // Generate 5-15 estimate items per estimate
        const itemCount = 5 + Math.floor(Math.random() * 10);
        let totalEstimateCost = 0;

        for (let j = 0; j < itemCount; j++) {
          // Randomly select a component
          const component = components[Math.floor(Math.random() * components.length)];
          
          // Get quality tiers for this component
          const tiersResult = await supabase
            .from('quality_tiers')
            .select('*')
            .eq('component_id', component.id)
            .limit(3);

          const tiers = tiersResult.data || [];
          if (tiers.length === 0) continue;

          const selectedTier = tiers[Math.floor(Math.random() * tiers.length)];
          const quantity = Math.ceil(Math.random() * 50) + 1; // 1-50 units
          const itemTotalCost = selectedTier.unit_cost * quantity;

          const estimateItem = {
            estimate_id: savedEstimate.id,
            component_id: component.id,
            component_name: component.name,
            quality_tier_id: selectedTier.id,
            quality_tier_name: selectedTier.name,
            quality_tier_unit_cost: selectedTier.unit_cost,
            quality_tier_description: selectedTier.description,
            quantity: quantity,
            unit: component.unit,
            total_cost: itemTotalCost
          };

          estimateItems.push(estimateItem);
          totalEstimateCost += itemTotalCost;

          // Generate actual cost data with realistic variance (-20% to +30%)
          const varianceMultiplier = 0.8 + Math.random() * 0.5; // 0.8 to 1.3
          const actualUnitCost = selectedTier.unit_cost * varianceMultiplier;
          const actualTotalCost = actualUnitCost * quantity;

          actualCosts.push({
            project_id: project.id,
            user_id: userId,
            component_id: component.id,
            estimate_item_id: null, // Will be set after estimate items are created
            actual_quantity: quantity,
            actual_unit_cost: Math.round(actualUnitCost * 100) / 100,
            actual_total_cost: Math.round(actualTotalCost * 100) / 100,
            cost_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Random date within last 30 days
            vendor_name: ['ABC Supply Co', 'Tech Components Inc', 'Industrial Systems Ltd', 'DataCenter Solutions', 'Prime Equipment'][Math.floor(Math.random() * 5)],
            invoice_number: `INV-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
            notes: varianceMultiplier > 1.1 ? 'Cost overrun due to market conditions' : 
                   varianceMultiplier < 0.9 ? 'Savings achieved through bulk purchasing' : 
                   'Cost as expected'
          });
        }

        // Update estimate total cost
        await supabase
          .from('estimates')
          .update({ total_cost: Math.round(totalEstimateCost * 100) / 100 })
          .eq('id', savedEstimate.id);

        estimates.push(savedEstimate);
      }

      // Insert all estimate items
      const estimateItemsResult = await supabase
        .from('estimate_items')
        .insert(estimateItems)
        .select();

      if (estimateItemsResult.error) throw estimateItemsResult.error;

      // Insert actual costs
      const actualCostsResult = await supabase
        .from('actual_costs')
        .insert(actualCosts)
        .select();

      if (actualCostsResult.error) throw actualCostsResult.error;

      return {
        summary: {
          estimates: estimates.length,
          estimateItems: estimateItems.length,
          actualCosts: actualCosts.length,
          projects: 1
        }
      };

    } catch (error: any) {
      console.error('Error generating estimate data:', error);
      throw new Error(`Failed to generate estimate data: ${error.message}`);
    }
  },

  async getDataCounts(): Promise<{
    components: number;
    qualityTiers: number;
    assemblies: number;
    estimates: number;
    projects: number;
  }> {
    try {
      const [componentsResult, tiersResult, assembliesResult, estimatesResult, projectsResult] = await Promise.all([
        supabase.from('components').select('id', { count: 'exact', head: true }),
        supabase.from('quality_tiers').select('id', { count: 'exact', head: true }),
        supabase.from('assemblies').select('id', { count: 'exact', head: true }),
        supabase.from('estimates').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true })
      ]);

      return {
        components: componentsResult.count || 0,
        qualityTiers: tiersResult.count || 0,
        assemblies: assembliesResult.count || 0,
        estimates: estimatesResult.count || 0,
        projects: projectsResult.count || 0
      };
    } catch (error) {
      console.error('Error getting data counts:', error);
      return {
        components: 0,
        qualityTiers: 0,
        assemblies: 0,
        estimates: 0,
        projects: 0
      };
    }
  }
};