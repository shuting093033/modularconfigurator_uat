import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  DollarSign, 
  Package, 
  Hash, 
  Clock, 
  BarChart3,
  Wrench,
  Zap,
  Building,
  Hammer,
  FileDown,
  FileSpreadsheet
} from "lucide-react";
import { estimateService, SavedEstimate, SavedEstimateItem } from "@/services/estimateService";
import { useToast } from "@/hooks/use-toast";
import { HierarchicalEstimate, AssemblyEstimateItem } from "@/types/estimate";
import { formatCurrency } from "@/utils/currency";
import { EnhancedAssemblyEstimateCard } from "@/components/EnhancedAssemblyEstimateCard";
import { PDFExportService } from "@/services/pdfExportService";
import { ExcelExportService } from "@/services/excelExportService";

interface EnhancedEstimateDetailModalProps {
  estimateId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CategoryData {
  name: string;
  icon: React.ComponentType<any>;
  assemblies: AssemblyEstimateItem[];
  totalCost: number;
  totalLaborHours: number;
  color: string;
}

export function EnhancedEstimateDetailModal({ estimateId, open, onOpenChange }: EnhancedEstimateDetailModalProps) {
  const [estimate, setEstimate] = useState<SavedEstimate | null>(null);
  const [items, setItems] = useState<SavedEstimateItem[]>([]);
  const [hierarchicalEstimate, setHierarchicalEstimate] = useState<HierarchicalEstimate | null>(null);
  const [isHierarchical, setIsHierarchical] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && estimateId) {
      loadEstimateDetails();
    }
  }, [open, estimateId]);

  const loadEstimateDetails = async () => {
    setLoading(true);
    try {
      // Try to load as hierarchical first
      try {
        const hierarchicalData = await estimateService.getEstimateWithAssemblies(estimateId);
        if (hierarchicalData.assemblies.length > 0) {
          setHierarchicalEstimate(hierarchicalData);
          setIsHierarchical(true);
          processCategories(hierarchicalData.assemblies);
          return;
        }
      } catch (error) {
        console.log('Loading as legacy estimate format');
      }

      // Fallback to legacy format
      const data = await estimateService.getEstimateWithItems(estimateId);
      setEstimate(data.estimate);
      setItems(data.items);
      setIsHierarchical(false);
    } catch (error) {
      toast({
        title: "Load Failed",
        description: "Failed to load estimate details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const processCategories = (assemblies: AssemblyEstimateItem[]) => {
    const categoryMap = new Map<string, CategoryData>();

    assemblies.forEach((assembly) => {
      // Determine category based on component types
      const category = determineCategoryFromAssembly(assembly);
      
      if (!categoryMap.has(category.name)) {
        categoryMap.set(category.name, {
          name: category.name,
          icon: category.icon,
          assemblies: [],
          totalCost: 0,
          totalLaborHours: 0,
          color: category.color,
        });
      }

      const categoryData = categoryMap.get(category.name)!;
      categoryData.assemblies.push(assembly);
      categoryData.totalCost += (assembly.totalMaterialCost + assembly.totalLaborCost) * assembly.quantity;
      categoryData.totalLaborHours += assembly.totalLaborHours * assembly.quantity;
    });

    setCategories(Array.from(categoryMap.values()));
  };

  const determineCategoryFromAssembly = (assembly: AssemblyEstimateItem) => {
    // Analyze component categories to determine assembly category
    const componentCategories = assembly.components.map(c => c.componentName.toLowerCase());
    
    if (componentCategories.some(cat => cat.includes('electrical') || cat.includes('power') || cat.includes('panel') || cat.includes('cable'))) {
      return { name: 'Electrical Systems', icon: Zap, color: 'text-yellow-500' };
    }
    if (componentCategories.some(cat => cat.includes('mechanical') || cat.includes('hvac') || cat.includes('cooling') || cat.includes('ventilation'))) {
      return { name: 'Mechanical Systems', icon: Wrench, color: 'text-blue-500' };
    }
    if (componentCategories.some(cat => cat.includes('structural') || cat.includes('foundation') || cat.includes('concrete') || cat.includes('steel'))) {
      return { name: 'Structural Systems', icon: Building, color: 'text-gray-500' };
    }
    if (componentCategories.some(cat => cat.includes('site') || cat.includes('civil') || cat.includes('grading') || cat.includes('utilities'))) {
      return { name: 'Site Development', icon: Hammer, color: 'text-green-500' };
    }
    
    return { name: 'General Construction', icon: Package, color: 'text-slate-500' };
  };

  const handleExportPDF = async () => {
    setExportingPDF(true);
    try {
      if (isHierarchical && hierarchicalEstimate) {
        await PDFExportService.exportEstimateToPDF(hierarchicalEstimate, true);
      } else if (estimate) {
        const legacyEstimate = {
          id: estimate.id,
          name: estimate.name,
          items: items.map(item => ({
            id: item.id,
            componentId: item.component_id,
            componentName: item.component_name,
            qualityTier: {
              id: item.quality_tier_id,
              name: item.quality_tier_name,
              unitCost: item.quality_tier_unit_cost,
              description: item.quality_tier_description || ''
            },
            quantity: item.quantity,
            unit: item.unit,
            totalCost: item.total_cost,
            laborHours: 0 // Legacy format doesn't have labor hours per item
          })),
          totalCost: estimate.total_cost,
          createdAt: new Date(estimate.created_at),
          updatedAt: new Date(estimate.updated_at)
        };
        await PDFExportService.exportEstimateToPDF(legacyEstimate, false);
      }
      
      toast({
        title: "PDF Exported",
        description: "Estimate has been downloaded as PDF.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export estimate as PDF.",
        variant: "destructive",
      });
    } finally {
      setExportingPDF(false);
    }
  };

  const handleExportExcel = async () => {
    setExportingExcel(true);
    try {
      if (isHierarchical && hierarchicalEstimate) {
        await ExcelExportService.exportEstimateToExcel(hierarchicalEstimate, true);
      } else if (estimate) {
        const legacyEstimate = {
          id: estimate.id,
          name: estimate.name,
          items: items.map(item => ({
            id: item.id,
            componentId: item.component_id,
            componentName: item.component_name,
            qualityTier: {
              id: item.quality_tier_id,
              name: item.quality_tier_name,
              unitCost: item.quality_tier_unit_cost,
              description: item.quality_tier_description || ''
            },
            quantity: item.quantity,
            unit: item.unit,
            totalCost: item.total_cost,
            laborHours: 0 // Legacy format doesn't have labor hours per item
          })),
          totalCost: estimate.total_cost,
          createdAt: new Date(estimate.created_at),
          updatedAt: new Date(estimate.updated_at)
        };
        await ExcelExportService.exportEstimateToExcel(legacyEstimate, false);
      }
      
      toast({
        title: "Excel Exported",
        description: "Estimate has been downloaded as Excel file.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export estimate as Excel file.",
        variant: "destructive",
      });
    } finally {
      setExportingExcel(false);
    }
  };

  const getQualityBadgeVariant = (tierId: string) => {
    switch (tierId) {
      case 'basic': return 'secondary';
      case 'standard': return 'default';
      case 'premium': return 'destructive';
      default: return 'outline';
    }
  };

  const renderSummaryTab = () => {
    if (!hierarchicalEstimate) return null;

    return (
      <div className="space-y-6">
        {/* Executive Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Project Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(hierarchicalEstimate.totalCost)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assemblies</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hierarchicalEstimate.assemblies.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Labor Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hierarchicalEstimate.totalLaborHours.toFixed(1)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map((category) => {
                const percentage = ((category.totalCost / hierarchicalEstimate.totalCost) * 100).toFixed(1);
                return (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <category.icon className={`h-4 w-4 ${category.color}`} />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(category.totalCost)}</div>
                        <div className="text-sm text-muted-foreground">{percentage}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {category.assemblies.length} assemblies • {category.totalLaborHours.toFixed(1)} labor hours
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Project Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Created Date</p>
                  <p className="font-medium">
                    {new Date(hierarchicalEstimate.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Components</p>
                  <p className="font-medium">
                    {hierarchicalEstimate.assemblies.reduce((total, assembly) => 
                      total + assembly.components.length, 0)} components
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCategoryTab = (category: CategoryData) => {
    return (
      <div className="space-y-4">
        {/* Category Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <category.icon className={`h-5 w-5 ${category.color}`} />
              {category.name} Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-2xl font-bold">{formatCurrency(category.totalCost)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assemblies</p>
                <p className="text-2xl font-bold">{category.assemblies.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Labor Hours</p>
                <p className="text-2xl font-bold">{category.totalLaborHours.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assembly List */}
        <div className="space-y-3">
          {category.assemblies.map((assembly) => (
            <EnhancedAssemblyEstimateCard
              key={assembly.id}
              assembly={assembly}
              readOnly={true}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderLegacyContent = () => (
    <div className="space-y-6">
      {/* Legacy Estimate Summary */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            <p className="font-medium">
              {estimate && new Date(estimate.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Items</p>
            <p className="font-medium">{items.length} components</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Total Cost</p>
            <p className="font-semibold text-lg">
              {formatCurrency(estimate?.total_cost || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Estimate Items</h3>
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id} className="p-3">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm leading-tight">{item.component_name}</h4>
                    <Badge 
                      variant={getQualityBadgeVariant(item.quality_tier_id)}
                      className="text-xs mt-1"
                    >
                      {item.quality_tier_name}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">{item.quantity}</span>
                  <span className="text-xs text-muted-foreground">{item.unit}</span>
                  <span className="text-xs">@</span>
                  <span className="text-xs font-medium">
                    {formatCurrency(item.quality_tier_unit_cost)}
                  </span>
                </div>
                
                <div className="text-right">
                  <span className="font-semibold">
                    {formatCurrency(item.total_cost)}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {isHierarchical ? hierarchicalEstimate?.name || 'Loading...' : estimate?.name || 'Loading...'}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleExportPDF}
                disabled={loading || exportingPDF}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <FileDown className="h-4 w-4" />
                {exportingPDF ? "Exporting..." : "Export PDF"}
              </Button>
              <Button
                onClick={handleExportExcel}
                disabled={loading || exportingExcel}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <FileSpreadsheet className="h-4 w-4" />
                {exportingExcel ? "Exporting..." : "Export Excel"}
              </Button>
            </div>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading estimate details...</span>
          </div>
        ) : isHierarchical && hierarchicalEstimate ? (
          <Tabs defaultValue="summary" className="flex-1 flex flex-col min-h-0">
            <TabsList className="flex w-full flex-shrink-0 relative z-10 bg-background border-b h-auto overflow-x-auto">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category.name} value={category.name.toLowerCase().replace(/\s+/g, '-')}>
                  <category.icon className="h-4 w-4 mr-2" />
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <div className="flex-1 min-h-0 mt-4 relative">
              <ScrollArea className="h-full">
                <div className="pr-4">
                  <TabsContent value="summary" className="mt-0">
                    {renderSummaryTab()}
                  </TabsContent>
                  
                  {categories.map((category) => (
                    <TabsContent 
                      key={category.name} 
                      value={category.name.toLowerCase().replace(/\s+/g, '-')} 
                      className="mt-0"
                    >
                      {renderCategoryTab(category)}
                    </TabsContent>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </Tabs>
        ) : (
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="pr-4">
                {renderLegacyContent()}
              </div>
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}