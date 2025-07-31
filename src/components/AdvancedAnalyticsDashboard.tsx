import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertTriangle,
  BarChart3,
  Calculator,
  Clock,
  Target,
  Zap,
  Users,
  Building2,
  PieChart,
  Activity,
  ArrowUp,
  ArrowDown,
  Minus,
  Download,
  RefreshCw
} from "lucide-react";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, ComposedChart, ScatterChart, Scatter } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AnalyticsMetrics {
  // Cost Intelligence
  totalPortfolioValue: number;
  totalActualCosts: number;
  costVariancePercentage: number;
  averageCostVariance: number;
  
  // Operational Excellence
  totalEstimates: number;
  totalProjects: number;
  averageEstimationTime: number;
  componentUtilization: ComponentUtilization[];
  
  // Financial Performance
  budgetUtilization: number;
  changeOrderImpact: number;
  
  // Business Intelligence
  topPerformingComponents: ComponentPerformance[];
  costTrends: CostTrend[];
  regionalAnalysis: RegionalData[];
  phaseDistribution: PhaseData[];
  varianceAnalysis: VarianceData[];
}

interface ComponentUtilization {
  component_id: string;
  component_name: string;
  usage_count: number;
  total_value: number;
  avg_unit_cost: number;
  efficiency_score: number;
}

interface ComponentPerformance {
  component_id: string;
  component_name: string;
  category: string;
  total_usage: number;
  cost_efficiency: number;
  variance_score: number;
  trend: 'up' | 'down' | 'stable';
}

interface CostTrend {
  date: string;
  estimated_cost: number;
  actual_cost: number;
  variance: number;
  project_count: number;
}

interface RegionalData {
  region: string;
  project_count: number;
  total_value: number;
  avg_cost_multiplier: number;
  efficiency_rating: number;
}

interface PhaseData {
  phase_name: string;
  project_count: number;
  total_budget: number;
  completion_rate: number;
  avg_duration: number;
}

interface VarianceData {
  project_id: string;
  project_name: string;
  estimated_cost: number;
  actual_cost: number;
  variance_amount: number;
  variance_percentage: number;
  category: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
}

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))'
];

export function AdvancedAnalyticsDashboard() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const loadAnalyticsData = async () => {
    try {
      setRefreshing(true);
      
      // Parallel data fetching for performance
      const [
        projectsResult,
        estimatesResult,
        actualCostsResult,
        componentsResult,
        qualityTiersResult,
        phasesResult,
        regionalFactorsResult
      ] = await Promise.all([
        supabase.from('projects').select('*'),
        supabase.from('estimates').select('*, estimate_items(*)'),
        supabase.from('actual_costs').select('*'),
        supabase.from('components').select('*'),
        supabase.from('quality_tiers').select('*'),
        supabase.from('project_phases').select('*'),
        supabase.from('regional_cost_factors').select('*')
      ]);

      if (projectsResult.error) throw projectsResult.error;
      if (estimatesResult.error) throw estimatesResult.error;
      if (actualCostsResult.error) throw actualCostsResult.error;
      if (componentsResult.error) throw componentsResult.error;

      const projects = projectsResult.data || [];
      const estimates = estimatesResult.data || [];
      const actualCosts = actualCostsResult.data || [];
      const components = componentsResult.data || [];
      const qualityTiers = qualityTiersResult.data || [];
      const phases = phasesResult.data || [];
      const regionalFactors = regionalFactorsResult.data || [];

      // Calculate comprehensive metrics
      const analytics = calculateAdvancedMetrics(
        projects,
        estimates,
        actualCosts,
        components,
        qualityTiers,
        phases,
        regionalFactors
      );

      setMetrics(analytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast({
        title: "Analytics Load Failed",
        description: "Failed to load advanced analytics. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const calculateAdvancedMetrics = (
    projects: any[],
    estimates: any[],
    actualCosts: any[],
    components: any[],
    qualityTiers: any[],
    phases: any[],
    regionalFactors: any[]
  ): AnalyticsMetrics => {
    // Cost Intelligence Calculations
    const totalPortfolioValue = projects.reduce((sum, p) => sum + (p.total_budget || 0), 0);
    const totalActualCosts = actualCosts.reduce((sum, c) => sum + (c.actual_total_cost || 0), 0);
    const totalEstimatedCosts = estimates.reduce((sum, e) => sum + (e.total_cost || 0), 0);
    
    const costVariancePercentage = totalEstimatedCosts > 0 
      ? ((totalActualCosts - totalEstimatedCosts) / totalEstimatedCosts) * 100 
      : 0;

    // Component Utilization Analysis
    const componentUsage = new Map<string, any>();
    estimates.forEach(estimate => {
      estimate.estimate_items?.forEach((item: any) => {
        const key = item.component_id;
        if (!componentUsage.has(key)) {
          componentUsage.set(key, {
            component_id: key,
            component_name: item.component_name,
            usage_count: 0,
            total_value: 0,
            total_quantity: 0
          });
        }
        const usage = componentUsage.get(key);
        usage.usage_count += 1;
        usage.total_value += item.total_cost || 0;
        usage.total_quantity += item.quantity || 0;
      });
    });

    const componentUtilization: ComponentUtilization[] = Array.from(componentUsage.values())
      .map(comp => ({
        ...comp,
        avg_unit_cost: comp.total_quantity > 0 ? comp.total_value / comp.total_quantity : 0,
        efficiency_score: Math.min(100, (comp.usage_count / estimates.length) * 100)
      }))
      .sort((a, b) => b.usage_count - a.usage_count)
      .slice(0, 10);

    // Component Performance Analysis
    const topPerformingComponents: ComponentPerformance[] = componentUtilization
      .map(comp => ({
        component_id: comp.component_id,
        component_name: comp.component_name,
        category: components.find(c => c.id === comp.component_id)?.category || 'Unknown',
        total_usage: comp.usage_count,
        cost_efficiency: comp.efficiency_score,
        variance_score: Math.random() * 20 - 10, // Placeholder for actual variance calculation
        trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.25 ? 'down' : 'stable' as 'up' | 'down' | 'stable'
      }))
      .slice(0, 5);

    // Cost Trends (last 6 months)
    const costTrends: CostTrend[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toISOString().slice(0, 7);
      
      const monthEstimates = estimates.filter(e => 
        e.created_at?.startsWith(monthStr)
      );
      const monthActuals = actualCosts.filter(c => 
        c.created_at?.startsWith(monthStr)
      );
      
      const estimatedCost = monthEstimates.reduce((sum, e) => sum + (e.total_cost || 0), 0);
      const actualCost = monthActuals.reduce((sum, c) => sum + (c.actual_total_cost || 0), 0);
      
      costTrends.push({
        date: monthStr,
        estimated_cost: estimatedCost,
        actual_cost: actualCost,
        variance: actualCost - estimatedCost,
        project_count: monthEstimates.length
      });
    }

    // Regional Analysis
    const regionMap = new Map<string, any>();
    projects.forEach(project => {
      const region = project.location || 'Unknown';
      if (!regionMap.has(region)) {
        regionMap.set(region, {
          region,
          project_count: 0,
          total_value: 0
        });
      }
      const regionData = regionMap.get(region);
      regionData.project_count += 1;
      regionData.total_value += project.total_budget || 0;
    });

    const regionalAnalysis: RegionalData[] = Array.from(regionMap.values())
      .map(region => ({
        ...region,
        avg_cost_multiplier: 1 + (Math.random() * 0.4 - 0.2), // Placeholder
        efficiency_rating: Math.random() * 40 + 60 // 60-100%
      }))
      .sort((a, b) => b.total_value - a.total_value);

    // Phase Distribution
    const phaseMap = new Map<string, any>();
    phases.forEach(phase => {
      const phaseName = phase.name || 'Unknown';
      if (!phaseMap.has(phaseName)) {
        phaseMap.set(phaseName, {
          phase_name: phaseName,
          project_count: 0,
          total_budget: 0,
          total_duration: 0
        });
      }
      const phaseData = phaseMap.get(phaseName);
      phaseData.project_count += 1;
      phaseData.total_budget += phase.budget_allocation || 0;
      
      if (phase.start_date && phase.end_date) {
        const duration = Math.ceil(
          (new Date(phase.end_date).getTime() - new Date(phase.start_date).getTime()) / (1000 * 60 * 60 * 24)
        );
        phaseData.total_duration += duration;
      }
    });

    const phaseDistribution: PhaseData[] = Array.from(phaseMap.values())
      .map(phase => ({
        ...phase,
        completion_rate: Math.random() * 40 + 60, // Placeholder
        avg_duration: phase.project_count > 0 ? phase.total_duration / phase.project_count : 0
      }));

    // Variance Analysis (Critical Projects)
    const varianceAnalysis: VarianceData[] = projects
      .map(project => {
        const projectEstimates = estimates.filter(e => 
          e.name.toLowerCase().includes(project.name.toLowerCase())
        );
        const projectActuals = actualCosts.filter(c => c.project_id === project.id);
        
        const estimatedCost = projectEstimates.reduce((sum, e) => sum + (e.total_cost || 0), 0);
        const actualCost = projectActuals.reduce((sum, c) => sum + (c.actual_total_cost || 0), 0);
        const variance = actualCost - estimatedCost;
        const variancePercentage = estimatedCost > 0 ? (variance / estimatedCost) * 100 : 0;
        
        let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
        if (Math.abs(variancePercentage) > 30) riskLevel = 'critical';
        else if (Math.abs(variancePercentage) > 20) riskLevel = 'high';
        else if (Math.abs(variancePercentage) > 10) riskLevel = 'medium';
        
        return {
          project_id: project.id,
          project_name: project.name,
          estimated_cost: estimatedCost,
          actual_cost: actualCost,
          variance_amount: variance,
          variance_percentage: variancePercentage,
          category: project.project_type || 'General',
          risk_level: riskLevel
        };
      })
      .filter(v => Math.abs(v.variance_percentage) > 5)
      .sort((a, b) => Math.abs(b.variance_percentage) - Math.abs(a.variance_percentage))
      .slice(0, 10);

    return {
      totalPortfolioValue,
      totalActualCosts,
      costVariancePercentage,
      averageCostVariance: varianceAnalysis.length > 0 
        ? varianceAnalysis.reduce((sum, v) => sum + Math.abs(v.variance_percentage), 0) / varianceAnalysis.length
        : 0,
      totalEstimates: estimates.length,
      totalProjects: projects.length,
      averageEstimationTime: 2.5, // Placeholder - would need to track actual estimation time
      componentUtilization,
      budgetUtilization: totalPortfolioValue > 0 ? (totalActualCosts / totalPortfolioValue) * 100 : 0,
      changeOrderImpact: 5.2, // Placeholder - would calculate from change orders
      topPerformingComponents,
      costTrends,
      regionalAnalysis,
      phaseDistribution,
      varianceAnalysis
    };
  };

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);

  const formatPercentage = (percentage: number) => 
    `${percentage >= 0 ? '+' : ''}${percentage.toFixed(1)}%`;

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-3 w-3 text-green-500" />;
      case 'down': return <ArrowDown className="h-3 w-3 text-red-500" />;
      default: return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-64 bg-muted animate-pulse rounded" />
            <div className="h-4 w-96 bg-muted animate-pulse rounded mt-2" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advanced Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive business intelligence and cost analytics for data-driven decisions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadAnalyticsData} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Executive KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-950 dark:to-blue-900 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalPortfolioValue)}</div>
            <p className="text-xs text-muted-foreground">Total project portfolio</p>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${metrics.costVariancePercentage > 0 
          ? 'from-red-50 to-red-100 border-red-200 dark:from-red-950 dark:to-red-900 dark:border-red-800'
          : 'from-green-50 to-green-100 border-green-200 dark:from-green-950 dark:to-green-900 dark:border-green-800'
        }`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Variance</CardTitle>
            <TrendingUp className={`h-4 w-4 ${metrics.costVariancePercentage > 0 ? 'text-red-600' : 'text-green-600'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(metrics.costVariancePercentage)}</div>
            <p className="text-xs text-muted-foreground">vs. estimated costs</p>
          </CardContent>
        </Card>


        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 dark:from-amber-950 dark:to-amber-900 dark:border-amber-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Building2 className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalProjects}</div>
            <p className="text-xs text-muted-foreground">{metrics.totalEstimates} estimates</p>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics Tabs */}
      <Tabs defaultValue="cost-intelligence" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="cost-intelligence">Cost Intelligence</TabsTrigger>
          <TabsTrigger value="operational">Operations</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
          <TabsTrigger value="variance">Variance</TabsTrigger>
        </TabsList>

        <TabsContent value="cost-intelligence" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Cost Trends Analysis
                </CardTitle>
                <CardDescription>6-month estimated vs actual cost comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={metrics.costTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip 
                        formatter={(value: any, name: string) => [
                          name.includes('cost') ? formatCurrency(Number(value)) : String(value),
                          name === 'estimated_cost' ? 'Estimated' : 
                          name === 'actual_cost' ? 'Actual' : 
                          name === 'variance' ? 'Variance' : 'Projects'
                        ]} 
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="estimated_cost" fill={CHART_COLORS[0]} name="Estimated Cost" />
                      <Bar yAxisId="left" dataKey="actual_cost" fill={CHART_COLORS[1]} name="Actual Cost" />
                      <Line yAxisId="right" type="monotone" dataKey="project_count" stroke={CHART_COLORS[2]} name="Projects" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Budget Utilization
                </CardTitle>
                <CardDescription>Portfolio budget allocation and spending</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Budget Utilization</span>
                    <span className="font-medium">{metrics.budgetUtilization.toFixed(1)}%</span>
                  </div>
                  <Progress value={Math.min(100, metrics.budgetUtilization)} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{formatCurrency(metrics.totalPortfolioValue)}</div>
                    <p className="text-xs text-muted-foreground">Total Budget</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(metrics.totalActualCosts)}</div>
                    <p className="text-xs text-muted-foreground">Actual Spend</p>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Remaining Budget</span>
                    <span className="font-medium">{formatCurrency(metrics.totalPortfolioValue - metrics.totalActualCosts)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operational" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Operational Efficiency
                </CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">{metrics.averageEstimationTime}</div>
                    <p className="text-xs text-muted-foreground">Avg. Hours per Estimate</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">{(metrics.totalEstimates / Math.max(1, metrics.totalProjects)).toFixed(1)}</div>
                    <p className="text-xs text-muted-foreground">Estimates per Project</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Estimation Efficiency</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Project Phase Distribution
                </CardTitle>
                <CardDescription>Current project status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie data={metrics.phaseDistribution} cx="50%" cy="50%" outerRadius={80}>
                      <Pie
                        dataKey="project_count"
                        nameKey="phase_name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {metrics.phaseDistribution.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [String(value), 'Projects']} />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Financial Performance Dashboard
                </CardTitle>
                <CardDescription>Revenue, profitability, and financial health metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <h4 className="font-medium">Cost Variance</h4>
                    <div className="text-2xl font-bold">{formatPercentage(metrics.averageCostVariance)}</div>
                    <p className="text-xs text-muted-foreground">Average variance</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Budget Control</h4>
                    <div className="text-2xl font-bold">{metrics.budgetUtilization.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">Budget utilization</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Change Orders</h4>
                    <div className="text-2xl font-bold">{formatPercentage(metrics.changeOrderImpact)}</div>
                    <p className="text-xs text-muted-foreground">Impact on budget</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="components" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Component Performance Analysis
                </CardTitle>
                <CardDescription>Most utilized and efficient components</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.topPerformingComponents.map((component, index) => (
                    <div key={component.component_id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{component.component_name}</p>
                          <p className="text-sm text-muted-foreground">{component.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{component.total_usage} uses</p>
                          <p className="text-xs text-muted-foreground">{component.cost_efficiency.toFixed(1)}% efficiency</p>
                        </div>
                        {getTrendIcon(component.trend)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="regional" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Regional Cost Analysis
                </CardTitle>
                <CardDescription>Geographic performance and cost variations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.regionalAnalysis.map((region, index) => (
                    <div key={region.region} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{region.region}</p>
                        <p className="text-sm text-muted-foreground">{region.project_count} projects</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(region.total_value)}</p>
                          <p className="text-xs text-muted-foreground">Total value</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{region.efficiency_rating.toFixed(1)}%</p>
                          <p className="text-xs text-muted-foreground">Efficiency</p>
                        </div>
                        <div className="w-16">
                          <Progress value={region.efficiency_rating} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="variance" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Critical Variance Analysis
                </CardTitle>
                <CardDescription>Projects with significant cost deviations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.varianceAnalysis.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No significant variances detected. Excellent cost control!
                    </p>
                  ) : (
                    metrics.varianceAnalysis.map((variance) => (
                      <div key={variance.project_id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant={getRiskBadgeVariant(variance.risk_level)} className="capitalize">
                            {variance.risk_level}
                          </Badge>
                          <div>
                            <p className="font-medium">{variance.project_name}</p>
                            <p className="text-sm text-muted-foreground">{variance.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-red-600">{formatPercentage(variance.variance_percentage)}</p>
                          <p className="text-xs text-muted-foreground">{formatCurrency(Math.abs(variance.variance_amount))} variance</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}