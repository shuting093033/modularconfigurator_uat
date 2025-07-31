import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  FileText, 
  Calendar,
  BarChart3,
  Calculator,
  Clock
} from "lucide-react";
import { estimateService, SavedEstimate } from "@/services/estimateService";
import { useToast } from "@/hooks/use-toast";

interface EstimateMetrics {
  totalEstimates: number;
  totalValue: number;
  averageValue: number;
  thisMonth: number;
  lastMonth: number;
  monthlyGrowth: number;
  recentEstimates: SavedEstimate[];
}

export function MetricsDashboard() {
  const [metrics, setMetrics] = useState<EstimateMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const calculateMetrics = (estimates: SavedEstimate[]): EstimateMetrics => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonthEstimates = estimates.filter(
      est => new Date(est.created_at) >= thisMonth
    );
    
    const lastMonthEstimates = estimates.filter(
      est => new Date(est.created_at) >= lastMonth && new Date(est.created_at) <= lastMonthEnd
    );

    const totalValue = estimates.reduce((sum, est) => sum + est.total_cost, 0);
    const thisMonthValue = thisMonthEstimates.reduce((sum, est) => sum + est.total_cost, 0);
    const lastMonthValue = lastMonthEstimates.reduce((sum, est) => sum + est.total_cost, 0);
    
    const monthlyGrowth = lastMonthValue > 0 
      ? ((thisMonthValue - lastMonthValue) / lastMonthValue) * 100 
      : 0;

    return {
      totalEstimates: estimates.length,
      totalValue,
      averageValue: estimates.length > 0 ? totalValue / estimates.length : 0,
      thisMonth: thisMonthEstimates.length,
      lastMonth: lastMonthEstimates.length,
      monthlyGrowth,
      recentEstimates: estimates
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
    };
  };

  const loadMetrics = async () => {
    try {
      const estimates = await estimateService.getEstimates();
      const calculatedMetrics = calculateMetrics(estimates);
      setMetrics(calculatedMetrics);
    } catch (error) {
      toast({
        title: "Load Failed",
        description: "Failed to load metrics. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading metrics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Track your estimation performance and business insights
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-950 dark:to-blue-900 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Total Estimates
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {metrics.totalEstimates}
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Lifetime estimates created
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-950 dark:to-green-900 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100">
              Total Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              ${metrics.totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-green-700 dark:text-green-300">
              Combined project value
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-950 dark:to-purple-900 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">
              Average Value
            </CardTitle>
            <Calculator className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              ${metrics.averageValue.toLocaleString()}
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-300">
              Per estimate average
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 dark:from-amber-950 dark:to-amber-900 dark:border-amber-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-900 dark:text-amber-100">
              Monthly Growth
            </CardTitle>
            {metrics.monthlyGrowth >= 0 ? (
              <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
              {metrics.monthlyGrowth >= 0 ? '+' : ''}{metrics.monthlyGrowth.toFixed(1)}%
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              vs. last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Comparison */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Monthly Activity
            </CardTitle>
            <CardDescription>
              Estimate creation comparison
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">This Month</span>
                <span className="text-2xl font-bold text-primary">{metrics.thisMonth}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Month</span>
                <span className="text-2xl font-bold text-muted-foreground">{metrics.lastMonth}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Change</span>
                <span className={`text-sm font-medium ${
                  metrics.thisMonth >= metrics.lastMonth ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metrics.thisMonth >= metrics.lastMonth ? '+' : ''}
                  {metrics.thisMonth - metrics.lastMonth} estimates
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest estimates created
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.recentEstimates.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No estimates created yet
                </p>
              ) : (
                metrics.recentEstimates.map((estimate) => (
                  <div key={estimate.id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{estimate.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(estimate.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      ${estimate.total_cost.toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}