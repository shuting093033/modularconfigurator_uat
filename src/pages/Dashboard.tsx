import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, FileText, BarChart3, Calculator, Clock, TrendingUp, Users, Building2, Eye, Edit, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { estimateService } from '@/services/estimateService';
import { datacenterService } from '@/services/datacenterService';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { DataGenerationButton } from '@/components/DataGenerationButton';

interface DashboardStats {
  totalEstimates: number;
  totalEstimateValue: number;
  totalProjects: number;
  totalProjectValue: number;
  totalAssemblies: number;
  thisMonthEstimates: number;
  thisMonthProjects: number;
  thisMonthAssemblies: number;
}

interface RecentActivity {
  estimates: Array<{
    id: string;
    name: string;
    totalCost: number;
    createdAt: Date;
  }>;
  projects: Array<{
    id: string;
    name: string;
    status: string;
    totalBudget: number | null;
    createdAt: Date;
  }>;
  assemblies: Array<{
    id: string;
    name: string;
    createdAt: Date;
  }>;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch estimates, projects, and assemblies in parallel
      const [estimates, projects, assemblies] = await Promise.all([
        estimateService.getEstimates(),
        datacenterService.getProjects(),
        datacenterService.getAssemblies()
      ]);

      // Calculate stats
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const thisMonthEstimates = estimates.filter(e => {
        const date = new Date(e.created_at);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      }).length;

      const thisMonthProjects = projects.filter(p => {
        const date = new Date(p.created_at);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      }).length;

      const thisMonthAssemblies = assemblies.filter(a => {
        const date = new Date(a.created_at);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      }).length;

      const dashboardStats: DashboardStats = {
        totalEstimates: estimates.length,
        totalEstimateValue: estimates.reduce((sum, e) => sum + e.total_cost, 0),
        totalProjects: projects.length,
        totalProjectValue: projects.reduce((sum, p) => sum + (p.total_budget || 0), 0),
        totalAssemblies: assemblies.length,
        thisMonthEstimates,
        thisMonthProjects,
        thisMonthAssemblies
      };

      // Get recent activity (last 5 items each)
      const recentActivityData: RecentActivity = {
        estimates: estimates
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
          .map(e => ({
            id: e.id,
            name: e.name,
            totalCost: e.total_cost,
            createdAt: new Date(e.created_at)
          })),
        projects: projects
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
          .map(p => ({
            id: p.id,
            name: p.name,
            status: p.status,
            totalBudget: p.total_budget,
            createdAt: new Date(p.created_at)
          })),
        assemblies: assemblies
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
          .map(a => ({
            id: a.id,
            name: a.name,
            createdAt: new Date(a.created_at)
          }))
      };

      setStats(dashboardStats);
      setRecentActivity(recentActivityData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'in-progress':
        return 'secondary';
      case 'planning':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
            <p className="text-muted-foreground">Get started with your construction estimates</p>
          </div>
        </div>

        {/* Data Generation Section */}
        <div className="mb-8">
          <DataGenerationButton />
        </div>

        {/* Quick Action Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/datacenter-builder')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Create New Estimate</CardTitle>
              <Calculator className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription>Start building a new construction estimate with our powerful calculator</CardDescription>
              <Button className="w-full mt-4" variant="default">
                <Plus className="mr-2 h-4 w-4" />
                New Estimate
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/estimates')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">View Estimates</CardTitle>
              <FileText className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription>Access and manage your saved construction estimates</CardDescription>
              <Button className="w-full mt-4" variant="outline">
                View All Estimates
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/analytics')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Analytics & Reports</CardTitle>
              <BarChart3 className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription>View detailed metrics and insights about your estimates</CardDescription>
              <Button className="w-full mt-4" variant="outline">
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Dynamic Statistics Dashboard */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Estimates</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold text-primary">{stats?.totalEstimates || 0}</div>
              )}
              <p className="text-xs text-muted-foreground">
                {loading ? <Skeleton className="h-4 w-20" /> : `${formatCurrency(stats?.totalEstimateValue || 0)} total value`}
              </p>
            </CardContent>
          </Card>


          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assemblies</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold text-primary">{stats?.totalAssemblies || 0}</div>
              )}
              <p className="text-xs text-muted-foreground">Components & assemblies</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold text-primary">
                  {(stats?.thisMonthEstimates || 0) + (stats?.thisMonthProjects || 0) + (stats?.thisMonthAssemblies || 0)}
                </div>
              )}
              <p className="text-xs text-muted-foreground">New items created</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Timeline */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Recent Estimates
              </CardTitle>
              <CardDescription>Your latest cost estimates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                ))
              ) : recentActivity?.estimates.length === 0 ? (
                <p className="text-sm text-muted-foreground">No estimates yet</p>
              ) : (
                recentActivity?.estimates.map((estimate) => (
                  <div key={estimate.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-lg transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{estimate.name}</p>
                      <p className="text-xs text-muted-foreground">{format(estimate.createdAt, 'MMM d, yyyy')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-primary">{formatCurrency(estimate.totalCost)}</span>
                      <Button size="sm" variant="ghost" onClick={() => navigate('/estimates')}>
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
              {!loading && (recentActivity?.estimates.length || 0) > 0 && (
                <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => navigate('/estimates')}>
                  View All Estimates
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              )}
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Recent Assemblies
              </CardTitle>
              <CardDescription>Your latest component assemblies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                ))
              ) : recentActivity?.assemblies.length === 0 ? (
                <p className="text-sm text-muted-foreground">No assemblies yet</p>
              ) : (
                recentActivity?.assemblies.map((assembly) => (
                  <div key={assembly.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-lg transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{assembly.name}</p>
                      <p className="text-xs text-muted-foreground">{format(assembly.createdAt, 'MMM d, yyyy')}</p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => navigate('/assembly-builder')}>
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                ))
              )}
              {!loading && (recentActivity?.assemblies.length || 0) > 0 && (
                <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => navigate('/assembly-builder')}>
                  View All Assemblies
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;