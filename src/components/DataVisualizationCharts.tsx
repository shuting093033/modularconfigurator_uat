import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart } from "recharts";

// Sample data for charts
const projectTimelineData = [
  { month: 'Jan', planned: 4, actual: 3, budget: 850000, spent: 720000 },
  { month: 'Feb', planned: 6, actual: 5, budget: 1200000, spent: 1100000 },
  { month: 'Mar', planned: 8, actual: 7, budget: 1500000, spent: 1350000 },
  { month: 'Apr', planned: 10, actual: 9, budget: 1800000, spent: 1650000 },
  { month: 'May', planned: 12, actual: 10, budget: 2100000, spent: 1980000 },
  { month: 'Jun', planned: 14, actual: 13, budget: 2400000, spent: 2200000 },
];

const projectStatusData = [
  { name: 'Planning', value: 8, color: '#0088FE' },
  { name: 'In Progress', value: 15, color: '#00C49F' },
  { name: 'On Hold', value: 3, color: '#FFBB28' },
  { name: 'Completed', value: 12, color: '#FF8042' },
];

const budgetVarianceData = [
  { category: 'Electrical', budget: 500000, actual: 485000, variance: -15000 },
  { category: 'Mechanical', budget: 750000, actual: 820000, variance: 70000 },
  { category: 'IT Infrastructure', budget: 350000, actual: 365000, variance: 15000 },
  { category: 'Fire Safety', budget: 200000, actual: 185000, variance: -15000 },
  { category: 'Security', budget: 150000, actual: 172000, variance: 22000 },
];

const riskTrendData = [
  { month: 'Jan', high: 2, medium: 5, low: 8 },
  { month: 'Feb', high: 3, medium: 4, low: 7 },
  { month: 'Mar', high: 1, medium: 6, low: 9 },
  { month: 'Apr', high: 2, medium: 3, low: 12 },
  { month: 'May', high: 1, medium: 4, low: 10 },
  { month: 'Jun', high: 3, medium: 2, low: 8 },
];

export function DataVisualizationCharts() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Project Timeline Chart */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Project Timeline Progress</CardTitle>
          <CardDescription>Planned vs actual project completions</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={projectTimelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="planned" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="Planned"
              />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="hsl(var(--destructive))" 
                strokeWidth={2}
                name="Actual"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Project Status Distribution */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Project Status Distribution</CardTitle>
          <CardDescription>Current status of all projects</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {projectStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Budget vs Actual Spending */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Budget vs Actual Spending</CardTitle>
          <CardDescription>Monthly budget utilization trend</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={projectTimelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="budget" 
                stackId="1" 
                stroke="hsl(var(--primary))" 
                fill="hsl(var(--primary) / 0.6)"
                name="Budget"
              />
              <Area 
                type="monotone" 
                dataKey="spent" 
                stackId="1" 
                stroke="hsl(var(--destructive))" 
                fill="hsl(var(--destructive) / 0.6)"
                name="Actual Spent"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Variance Analysis */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Category Variance Analysis</CardTitle>
          <CardDescription>Budget variance by project category</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetVarianceData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={formatCurrency} />
              <YAxis dataKey="category" type="category" width={100} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar 
                dataKey="budget" 
                fill="hsl(var(--primary) / 0.6)" 
                name="Budget"
              />
              <Bar 
                dataKey="actual" 
                fill="hsl(var(--destructive) / 0.6)" 
                name="Actual"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Risk Trend Analysis */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Risk Trend Analysis</CardTitle>
          <CardDescription>Monthly risk assessment trends by severity</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={riskTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="low" 
                stackId="1" 
                stroke="#00C49F" 
                fill="#00C49F"
                name="Low Risk"
              />
              <Area 
                type="monotone" 
                dataKey="medium" 
                stackId="1" 
                stroke="#FFBB28" 
                fill="#FFBB28"
                name="Medium Risk"
              />
              <Area 
                type="monotone" 
                dataKey="high" 
                stackId="1" 
                stroke="#FF8042" 
                fill="#FF8042"
                name="High Risk"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}