import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertTriangle, 
  BarChart3,
  Calendar
} from "lucide-react";
import { datacenterService } from "@/services/datacenterService";
import { VarianceAnalysis, ProjectMetrics, Project } from "@/types/datacenter";
import { useToast } from "@/hooks/use-toast";

interface VarianceAnalysisDashboardProps {
  project: Project;
}

export const VarianceAnalysisDashboard = ({ project }: VarianceAnalysisDashboardProps) => {
  const [metrics, setMetrics] = useState<ProjectMetrics | null>(null);
  const [variances, setVariances] = useState<VarianceAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [project.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectMetrics, varianceData] = await Promise.all([
        datacenterService.getProjectMetrics(project.id),
        datacenterService.getVarianceAnalysis(project.id)
      ]);
      
      setMetrics(projectMetrics);
      setVariances(varianceData);
    } catch (error) {
      console.error('Error loading variance data:', error);
      toast({
        title: "Error",
        description: "Failed to load variance analysis data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getVarianceBadgeVariant = (percentage: number) => {
    if (Math.abs(percentage) < 5) return 'default';
    if (percentage > 0) return 'destructive';
    return 'secondary';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    const sign = percentage > 0 ? '+' : '';
    return `${sign}${percentage.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-6">
        <Card className="text-center py-12">
          <CardContent>
            <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No data available</h3>
            <p className="text-muted-foreground">
              Start adding actual costs to see variance analysis
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Variance Analysis</h1>
          <p className="text-muted-foreground">
            Cost performance tracking for {project.name}
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics.total_estimated_cost)}
            </div>
            <p className="text-xs text-muted-foreground">
              Original estimate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actual Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics.total_actual_cost)}
            </div>
            <p className="text-xs text-muted-foreground">
              Spent to date
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Variance</CardTitle>
            {metrics.overall_cost_variance > 0 ? (
              <TrendingUp className="h-4 w-4 text-destructive" />
            ) : (
              <TrendingDown className="h-4 w-4 text-green-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(Math.abs(metrics.overall_cost_variance))}
            </div>
            <p className="text-xs text-muted-foreground">
              <Badge variant={getVarianceBadgeVariant(metrics.overall_cost_variance_percentage)}>
                {formatPercentage(metrics.overall_cost_variance_percentage)}
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.project_progress_percentage.toFixed(0)}%
            </div>
            <Progress 
              value={metrics.project_progress_percentage} 
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.phases_completed} of {metrics.phases_total} phases complete
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="components">Component Analysis</TabsTrigger>
          <TabsTrigger value="critical">Critical Variances</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Summary</CardTitle>
              <CardDescription>
                Overall cost performance and project health
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Budget Utilization</span>
                    <span className="text-sm text-muted-foreground">
                      {((metrics.total_actual_cost / metrics.total_estimated_cost) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={(metrics.total_actual_cost / metrics.total_estimated_cost) * 100} 
                    className="h-2"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Schedule Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {metrics.project_progress_percentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={metrics.project_progress_percentage} 
                    className="h-2"
                  />
                </div>
              </div>

              {metrics.overall_cost_variance_percentage > 10 && (
                <div className="flex items-center space-x-2 p-3 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium text-destructive">
                    Project is significantly over budget
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="components" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Component-Level Analysis</CardTitle>
              <CardDescription>
                Detailed variance breakdown by construction component
              </CardDescription>
            </CardHeader>
            <CardContent>
              {variances.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No component data available yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {variances.map((variance, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{variance.component_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Est: {variance.estimated_quantity} {variance.estimated_unit_cost} | 
                          Act: {variance.actual_quantity} {variance.actual_unit_cost}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={getVarianceBadgeVariant(variance.cost_variance_percentage)}>
                          {formatPercentage(variance.cost_variance_percentage)}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(variance.cost_variance)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="critical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Critical Variances</CardTitle>
              <CardDescription>
                Components with significant cost overruns requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {metrics.critical_variances.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No critical variances detected</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {metrics.critical_variances.map((variance, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border-l-4 border-destructive bg-destructive/5 rounded-r-lg">
                      <div>
                        <p className="font-medium text-destructive">{variance.component_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Over budget by {formatCurrency(variance.cost_variance)}
                        </p>
                      </div>
                      <Badge variant="destructive">
                        {formatPercentage(variance.cost_variance_percentage)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};