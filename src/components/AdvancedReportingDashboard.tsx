import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, AlertTriangle, BarChart3, FileText, Clock, Target } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from "recharts";
import { toast } from "sonner";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Extend jsPDF with autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

interface TrendData {
  month: string;
  cost_per_sqft: number;
  labor_productivity: number;
  material_inflation: number;
  project_duration: number;
}

interface VarianceReport {
  id: string;
  component_category: string;
  planned_cost: number;
  actual_cost: number;
  variance_amount: number;
  variance_percentage: number;
  root_cause: string;
  impact_level: 'low' | 'medium' | 'high' | 'critical';
}

interface BenchmarkData {
  category: string;
  industry_standard: number;
  company_performance: number;
  percentile_rank: number;
  improvement_target: number;
}

const CHART_COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(var(--muted))", "hsl(var(--destructive))"];

export function AdvancedReportingDashboard() {
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'6months' | '1year' | '2years'>('1year');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Mock trend analysis data
  const trendData: TrendData[] = [
    { month: "Jan 2024", cost_per_sqft: 450, labor_productivity: 85, material_inflation: 3.2, project_duration: 8.5 },
    { month: "Feb 2024", cost_per_sqft: 465, labor_productivity: 87, material_inflation: 3.8, project_duration: 8.3 },
    { month: "Mar 2024", cost_per_sqft: 470, labor_productivity: 89, material_inflation: 4.1, project_duration: 8.0 },
    { month: "Apr 2024", cost_per_sqft: 485, labor_productivity: 92, material_inflation: 4.5, project_duration: 7.8 },
    { month: "May 2024", cost_per_sqft: 495, labor_productivity: 94, material_inflation: 4.8, project_duration: 7.5 },
    { month: "Jun 2024", cost_per_sqft: 510, labor_productivity: 96, material_inflation: 5.2, project_duration: 7.2 }
  ];

  // Mock variance analysis data
  const varianceReports: VarianceReport[] = [
    {
      id: "1",
      component_category: "Electrical Infrastructure",
      planned_cost: 2500000,
      actual_cost: 2850000,
      variance_amount: 350000,
      variance_percentage: 14.0,
      root_cause: "Copper price increase and additional circuit requirements",
      impact_level: "high"
    },
    {
      id: "2", 
      component_category: "Mechanical Systems",
      planned_cost: 1800000,
      actual_cost: 1950000,
      variance_amount: 150000,
      variance_percentage: 8.3,
      root_cause: "HVAC upgrade for higher efficiency requirements",
      impact_level: "medium"
    },
    {
      id: "3",
      component_category: "IT Infrastructure", 
      planned_cost: 3200000,
      actual_cost: 3050000,
      variance_amount: -150000,
      variance_percentage: -4.7,
      root_cause: "Volume discount negotiations and optimized rack layout",
      impact_level: "low"
    }
  ];

  // Mock benchmark data
  const benchmarkData: BenchmarkData[] = [
    { category: "Cost per sq ft (Tier III)", industry_standard: 485, company_performance: 510, percentile_rank: 40, improvement_target: 465 },
    { category: "Project Duration (months)", industry_standard: 8.2, company_performance: 7.5, percentile_rank: 75, improvement_target: 7.0 },
    { category: "Cost Variance (%)", industry_standard: 12.5, company_performance: 8.3, percentile_rank: 85, improvement_target: 6.0 },
    { category: "Schedule Performance", industry_standard: 88, company_performance: 94, percentile_rank: 90, improvement_target: 96 }
  ];

  const getVarianceBadgeVariant = (impact: string) => {
    switch (impact) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
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

  const generateReport = (type: 'variance' | 'trend' | 'benchmark') => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      
      // Header
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.text(`${type.charAt(0).toUpperCase() + type.slice(1)} Report`, pageWidth / 2, 30, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 40, { align: 'center' });
      
      let yPosition = 60;
      
      if (type === 'variance') {
        // Variance Report Content
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('Variance Analysis Summary', 20, yPosition);
        yPosition += 20;
        
        // Create table data for variance reports
        const tableData = varianceReports.map(report => [
          report.component_category,
          formatCurrency(report.planned_cost),
          formatCurrency(report.actual_cost),
          formatCurrency(report.variance_amount),
          `${report.variance_percentage > 0 ? '+' : ''}${report.variance_percentage.toFixed(1)}%`,
          report.impact_level.toUpperCase(),
          report.root_cause
        ]);
        
        // Add table using autoTable
        autoTable(doc, {
          head: [['Component Category', 'Planned Cost', 'Actual Cost', 'Variance Amount', 'Variance %', 'Impact Level', 'Root Cause']],
          body: tableData,
          startY: yPosition,
          styles: { fontSize: 8, cellPadding: 3 },
          headStyles: { fillColor: [71, 85, 105], textColor: 255 },
          columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 20 },
            2: { cellWidth: 20 },
            3: { cellWidth: 20 },
            4: { cellWidth: 15 },
            5: { cellWidth: 15 },
            6: { cellWidth: 35 }
          },
          theme: 'striped'
        });
        
      } else if (type === 'trend') {
        // Trend Report Content
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('Trend Analysis Summary', 20, yPosition);
        yPosition += 20;
        
        const trendTableData = trendData.map(data => [
          data.month,
          `$${data.cost_per_sqft}`,
          `${data.labor_productivity}%`,
          `${data.material_inflation}%`,
          `${data.project_duration} months`
        ]);
        
        autoTable(doc, {
          head: [['Month', 'Cost per Sq Ft', 'Labor Productivity', 'Material Inflation', 'Project Duration']],
          body: trendTableData,
          startY: yPosition,
          styles: { fontSize: 10, cellPadding: 4 },
          headStyles: { fillColor: [71, 85, 105], textColor: 255 },
          theme: 'striped'
        });
        
      } else if (type === 'benchmark') {
        // Benchmark Report Content
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('Industry Benchmark Analysis', 20, yPosition);
        yPosition += 20;
        
        const benchmarkTableData = benchmarkData.map(data => [
          data.category,
          data.industry_standard.toString(),
          data.company_performance.toString(),
          `${data.percentile_rank}th`,
          data.improvement_target.toString()
        ]);
        
        autoTable(doc, {
          head: [['Category', 'Industry Standard', 'Our Performance', 'Percentile Rank', 'Target']],
          body: benchmarkTableData,
          startY: yPosition,
          styles: { fontSize: 10, cellPadding: 4 },
          headStyles: { fillColor: [71, 85, 105], textColor: 255 },
          theme: 'striped'
        });
      }
      
      // Footer
      const footerY = pageHeight - 20;
      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      doc.text('Confidential - Data Center Construction Analytics', pageWidth / 2, footerY, { align: 'center' });
      
      // Save the PDF
      const filename = `${type}_report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} report generated and downloaded successfully`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF report. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-24 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advanced Reporting & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive variance analysis, trend forecasting, and industry benchmarking
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedTimeframe} onValueChange={(value: any) => setSelectedTimeframe(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
              <SelectItem value="2years">2 Years</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="north_america">North America</SelectItem>
              <SelectItem value="europe">Europe</SelectItem>
              <SelectItem value="asia_pacific">Asia Pacific</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Cost Variance</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.3%</div>
            <p className="text-xs text-muted-foreground">-2.1% from last quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Schedule Performance</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">+3% industry benchmark</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost per Sq Ft</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$510</div>
            <p className="text-xs text-muted-foreground">+5.2% YoY inflation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forecast Accuracy</CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">+12% from last year</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="variance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="variance">Variance Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
          <TabsTrigger value="benchmarks">Industry Benchmarks</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="variance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Detailed Variance Reports</CardTitle>
                  <Button onClick={() => generateReport('variance')} size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
                <CardDescription>Component-level cost variance analysis with root cause identification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {varianceReports.map((report) => (
                    <div key={report.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{report.component_category}</h4>
                        <Badge variant={getVarianceBadgeVariant(report.impact_level)}>
                          {report.variance_percentage > 0 ? '+' : ''}{report.variance_percentage.toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Planned:</span> {formatCurrency(report.planned_cost)}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Actual:</span> {formatCurrency(report.actual_cost)}
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-muted-foreground text-sm">Root Cause:</span>
                        <p className="text-sm mt-1">{report.root_cause}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Variance Trend Analysis</CardTitle>
                <CardDescription>Cost variance trends over time by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <Tooltip formatter={(value: number) => [`$${value}`, 'Cost per Sq Ft']} />
                      <Legend />
                      <Line type="monotone" dataKey="cost_per_sqft" stroke={CHART_COLORS[0]} name="Cost per Sq Ft" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Trend Analysis & Forecasting</CardTitle>
                <Button onClick={() => generateReport('trend')} size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Forecast
                </Button>
              </div>
              <CardDescription>Historical trends and predictive analysis for key metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="labor_productivity" stackId="1" stroke={CHART_COLORS[0]} fill={CHART_COLORS[0]} fillOpacity={0.3} name="Labor Productivity %" />
                    <Area type="monotone" dataKey="material_inflation" stackId="2" stroke={CHART_COLORS[1]} fill={CHART_COLORS[1]} fillOpacity={0.3} name="Material Inflation %" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Industry Benchmarking</CardTitle>
                <Button onClick={() => generateReport('benchmark')} size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Benchmark Report
                </Button>
              </div>
              <CardDescription>Performance comparison against industry standards and best practices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {benchmarkData.map((benchmark, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">{benchmark.category}</h4>
                      <Badge variant={benchmark.percentile_rank >= 75 ? 'default' : benchmark.percentile_rank >= 50 ? 'secondary' : 'outline'}>
                        {benchmark.percentile_rank}th Percentile
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-muted-foreground">Industry Standard</div>
                        <div className="font-medium text-lg">{benchmark.industry_standard}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted-foreground">Our Performance</div>
                        <div className="font-medium text-lg">{benchmark.company_performance}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted-foreground">Target</div>
                        <div className="font-medium text-lg">{benchmark.improvement_target}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Budget Forecasting Model</CardTitle>
                <CardDescription>Predictive analysis based on historical performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `${value} mo`} />
                      <Tooltip formatter={(value: number) => [`${value} months`, 'Project Duration']} />
                      <Legend />
                      <Line type="monotone" dataKey="project_duration" stroke={CHART_COLORS[2]} name="Project Duration" strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Forecast Parameters</CardTitle>
                <CardDescription>Adjust forecasting model parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="confidence-interval">Confidence Interval</Label>
                  <Select defaultValue="90">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="80">80%</SelectItem>
                      <SelectItem value="90">90%</SelectItem>
                      <SelectItem value="95">95%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="forecast-horizon">Forecast Horizon (months)</Label>
                  <Input id="forecast-horizon" type="number" defaultValue="12" min="3" max="36" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inflation-rate">Expected Inflation Rate (%)</Label>
                  <Input id="inflation-rate" type="number" defaultValue="3.5" min="0" max="20" step="0.1" />
                </div>
                <Button className="w-full">Update Forecast Model</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}