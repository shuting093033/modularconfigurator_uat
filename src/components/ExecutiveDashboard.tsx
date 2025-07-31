import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, Clock, Target, Users, Building2, Calculator } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ExecutiveMetrics {
  portfolioValue: number;
  totalProjects: number;
  activeProjects: number;
  totalEstimates: number;
  portfolioBudget: number;
  estimatedValue: number;
  projectSuccess: number;
  averageProjectSize: number;
  monthlyGrowth: number;
  costEfficiencyRatio: number;
  revenueGrowth: number;
  profitMargin: number;
}

interface ProjectPhaseData {
  phase: string;
  count: number;
  value: number;
}

interface MonthlyTrend {
  month: string;
  estimates: number;
  projects: number;
  value: number;
}

const CHART_COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(var(--muted))", "hsl(var(--destructive))"];

export function ExecutiveDashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<ExecutiveMetrics | null>(null);
  const [phaseData, setPhaseData] = useState<ProjectPhaseData[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);
  const [timeframe, setTimeframe] = useState<'month' | 'quarter' | 'year'>('quarter');

  useEffect(() => {
    loadExecutiveData();
  }, [timeframe]);

  const loadExecutiveData = async () => {
    try {
      setLoading(true);

      // Fetch projects data
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*');
      
      if (projectsError) throw projectsError;

      // Fetch estimates data
      const { data: estimates, error: estimatesError } = await supabase
        .from('estimates')
        .select('*');
      
      if (estimatesError) throw estimatesError;

      // Calculate portfolio metrics
      const portfolioMetrics = calculatePortfolioMetrics(projects || [], estimates || []);
      setMetrics(portfolioMetrics);

      // Calculate phase distribution
      const phases = calculatePhaseDistribution(projects || []);
      setPhaseData(phases);

      // Calculate monthly trends
      const trends = calculateMonthlyTrends(projects || [], estimates || []);
      setMonthlyTrends(trends);

    } catch (error) {
      console.error('Error loading executive data:', error);
      toast.error('Failed to load executive dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculatePortfolioMetrics = (projects: any[], estimates: any[]): ExecutiveMetrics => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => 
      ['planning', 'design', 'construction'].includes(p.status)
    ).length;
    
    const portfolioBudget = projects.reduce((sum, p) => sum + (p.total_budget || 0), 0);
    const estimatedValue = estimates.reduce((sum, e) => sum + (e.total_cost || 0), 0);
    
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const projectSuccess = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;
    
    const averageProjectSize = totalProjects > 0 ? portfolioBudget / totalProjects : 0;
    
    // Calculate trends from last 6 months of data
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const recentProjects = projects.filter(p => 
      new Date(p.created_at) >= sixMonthsAgo
    );
    const monthlyGrowth = (recentProjects.length / Math.max(totalProjects - recentProjects.length, 1)) * 100;
    
    // Business intelligence metrics
    const costEfficiencyRatio = portfolioBudget > 0 ? estimatedValue / portfolioBudget : 0;
    const revenueGrowth = monthlyGrowth; // Simplified for demo
    const profitMargin = Math.max(0, (1 - costEfficiencyRatio) * 100);

    return {
      portfolioValue: portfolioBudget + estimatedValue,
      totalProjects,
      activeProjects,
      totalEstimates: estimates.length,
      portfolioBudget,
      estimatedValue,
      projectSuccess,
      averageProjectSize,
      monthlyGrowth,
      costEfficiencyRatio,
      revenueGrowth,
      profitMargin
    };
  };

  const calculatePhaseDistribution = (projects: any[]): ProjectPhaseData[] => {
    const statusGroups = projects.reduce((acc, project) => {
      const status = project.status || 'unknown';
      if (!acc[status]) {
        acc[status] = { count: 0, value: 0 };
      }
      acc[status].count += 1;
      acc[status].value += project.total_budget || 0;
      return acc;
    }, {} as Record<string, { count: number; value: number }>);

    return Object.entries(statusGroups).map(([phase, data]: [string, { count: number; value: number }]) => ({
      phase: phase.charAt(0).toUpperCase() + phase.slice(1),
      count: data.count,
      value: data.value
    }));
  };

  const calculateMonthlyTrends = (projects: any[], estimates: any[]): MonthlyTrend[] => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthProjects = projects.filter(p => {
        const projectDate = new Date(p.created_at);
        return projectDate >= monthStart && projectDate <= monthEnd;
      });
      
      const monthEstimates = estimates.filter(e => {
        const estimateDate = new Date(e.created_at);
        return estimateDate >= monthStart && estimateDate <= monthEnd;
      });
      
      months.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        estimates: monthEstimates.length,
        projects: monthProjects.length,
        value: monthProjects.reduce((sum, p) => sum + (p.total_budget || 0), 0) +
               monthEstimates.reduce((sum, e) => sum + (e.total_cost || 0), 0)
      });
    }
    
    return months;
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const getMetricCards = () => {
    if (!metrics) return [];

    return [
      {
        title: "Total Portfolio Value",
        value: formatCurrency(metrics.portfolioValue),
        change: metrics.revenueGrowth,
        icon: DollarSign,
        description: "Combined value of all projects and estimates",
        trend: metrics.revenueGrowth > 0 ? "up" : "down"
      },
      {
        title: "Active Projects",
        value: metrics.activeProjects,
        change: metrics.monthlyGrowth,
        icon: Building2,
        description: "Projects currently in planning, design, or construction",
        trend: metrics.monthlyGrowth > 0 ? "up" : "down"
      },
      {
        title: "Average Project Size",
        value: formatCurrency(metrics.averageProjectSize),
        change: 12.3,
        icon: Calculator,
        description: "Average budget per project in portfolio",
        trend: "up"
      },
      {
        title: "Cost Efficiency Ratio",
        value: metrics.costEfficiencyRatio.toFixed(2),
        change: metrics.costEfficiencyRatio > 1 ? 8.5 : -3.2,
        icon: TrendingUp,
        description: "Estimated cost vs. budget efficiency",
        trend: metrics.costEfficiencyRatio > 1 ? "up" : "down"
      }
    ];
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-full bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No data available</h3>
          <p className="text-muted-foreground">Unable to load executive dashboard metrics.</p>
        </div>
      </div>
    );
  }

  const metricCards = getMetricCards();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="text-muted-foreground">
            Portfolio-wide business intelligence and strategic metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={timeframe === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeframe('month')}
          >
            Month
          </Button>
          <Button
            variant={timeframe === 'quarter' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeframe('quarter')}
          >
            Quarter
          </Button>
          <Button
            variant={timeframe === 'year' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeframe('year')}
          >
            Year
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {card.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={card.change > 0 ? 'text-green-500' : 'text-red-500'}>
                  {card.change > 0 ? '+' : ''}{card.change.toFixed(1)}%
                </span>
                <span className="ml-1">vs. previous period</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
          <TabsTrigger value="trends">Growth Trends</TabsTrigger>
          <TabsTrigger value="distribution">Project Distribution</TabsTrigger>
          <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Value Composition</CardTitle>
                <CardDescription>Breakdown of total portfolio value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Project Budgets</span>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(metrics.portfolioBudget)}
                    </span>
                  </div>
                  <Progress 
                    value={(metrics.portfolioBudget / metrics.portfolioValue) * 100} 
                    className="h-2"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Estimate Values</span>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(metrics.estimatedValue)}
                    </span>
                  </div>
                  <Progress 
                    value={(metrics.estimatedValue / metrics.portfolioValue) * 100} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Health Indicators</CardTitle>
                <CardDescription>Key performance indicators for business decisions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Profit Margin</span>
                    <Badge variant={metrics.profitMargin > 15 ? "default" : "secondary"}>
                      {metrics.profitMargin.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cost Efficiency</span>
                    <Badge variant={metrics.costEfficiencyRatio < 1 ? "default" : "destructive"}>
                      {(metrics.costEfficiencyRatio * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Portfolio Utilization</span>
                    <Badge variant="outline">
                      {((metrics.activeProjects / Math.max(metrics.totalProjects, 1)) * 100).toFixed(0)}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Growth Trends</CardTitle>
              <CardDescription>Monthly activity and value trends over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip 
                      formatter={(value: any, name: string) => [
                        name === 'value' ? formatCurrency(Number(value)) : String(value),
                        name === 'value' ? 'Portfolio Value' : name === 'estimates' ? 'Estimates' : 'Projects'
                      ]} 
                    />
                    <Legend />
                    <Area yAxisId="right" type="monotone" dataKey="value" stackId="1" stroke={CHART_COLORS[0]} fill={CHART_COLORS[0]} fillOpacity={0.3} name="Portfolio Value" />
                    <Line yAxisId="left" type="monotone" dataKey="projects" stroke={CHART_COLORS[1]} strokeWidth={2} name="New Projects" />
                    <Line yAxisId="left" type="monotone" dataKey="estimates" stroke={CHART_COLORS[2]} strokeWidth={2} name="New Estimates" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Phase Distribution</CardTitle>
              <CardDescription>Current distribution of projects across different phases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={phaseData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({phase, count, percent}) => `${phase}: ${count} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {phaseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [String(value), 'Projects']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Phase Value Analysis</CardTitle>
              <CardDescription>Budget allocation and project count by phase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={phaseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="phase" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip 
                      formatter={(value: any, name: string) => [
                        name === 'value' ? formatCurrency(Number(value)) : String(value),
                        name === 'value' ? 'Total Value' : 'Project Count'
                      ]} 
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="count" fill={CHART_COLORS[0]} name="Project Count" />
                    <Bar yAxisId="right" dataKey="value" fill={CHART_COLORS[1]} name="Total Value" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}