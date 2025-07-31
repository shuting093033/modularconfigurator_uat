import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Trash2, Calculator, Search } from "lucide-react";
import { datacenterComponentService } from "@/services/datacenterComponentService";
import { datacenterService } from "@/services/datacenterService";
import { estimateService } from "@/services/estimateService";
import { EnhancedComponent, QualityTier, Assembly } from "@/types/datacenter";
import { EstimateItem, AssemblyEstimateItem } from "@/types/estimate";
import { SaveEstimateDialog } from "@/components/SaveEstimateDialog";
import { AssemblyEstimateCard } from "@/components/AssemblyEstimateCard";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/currency";
interface DataCenterEstimateItem {
  id: string;
  componentId: string;
  componentName: string;
  qualityTier: QualityTier;
  quantity: number;
  unit: string;
  laborHours: number;
  totalCost: number;
  totalLaborCost: number;
}
const LABOR_RATE_PER_HOUR = 85; // Average skilled labor rate

export const DataCenterEstimateBuilder = () => {
  const [components, setComponents] = useState<EnhancedComponent[]>([]);
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [estimateItems, setEstimateItems] = useState<DataCenterEstimateItem[]>([]);
  const [assemblyEstimates, setAssemblyEstimates] = useState<AssemblyEstimateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("components");
  const {
    toast
  } = useToast();
  const categories = datacenterComponentService.getComponentCategories();
  useEffect(() => {
    loadComponents();
    loadAssemblies();
  }, [selectedCategory, searchTerm]);
  const loadAssemblies = async () => {
    try {
      const assembliesData = await datacenterService.getAssemblies();
      setAssemblies(assembliesData);
    } catch (error) {
      console.error('Error loading assemblies:', error);
      toast({
        title: "Error",
        description: "Failed to load assemblies",
        variant: "destructive"
      });
    }
  };
  const loadComponents = async () => {
    try {
      setLoading(true);
      let componentsData: EnhancedComponent[];
      if (searchTerm) {
        componentsData = await datacenterComponentService.searchComponents(searchTerm);
      } else if (selectedCategory === "All") {
        componentsData = await datacenterComponentService.getComponents();
      } else {
        componentsData = await datacenterComponentService.getComponentsByCategory(selectedCategory);
      }
      setComponents(componentsData);
    } catch (error) {
      console.error('Error loading components:', error);
      toast({
        title: "Error",
        description: "Failed to load components",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const addToEstimate = async (component: EnhancedComponent, qualityTier: QualityTier) => {
    const existingItem = estimateItems.find(item => item.componentId === component.id && item.qualityTier.id === qualityTier.id);
    if (existingItem) {
      updateQuantity(existingItem.id, existingItem.quantity + 1);
      return;
    }
    const laborHours = component.labor_hours || 0;
    const totalLaborCost = laborHours * LABOR_RATE_PER_HOUR;
    const materialCost = qualityTier.unit_cost;
    const totalCost = materialCost + totalLaborCost;
    const newItem: DataCenterEstimateItem = {
      id: `${component.id}-${qualityTier.id}-${Date.now()}`,
      componentId: component.id,
      componentName: component.name,
      qualityTier,
      quantity: 1,
      unit: component.unit,
      laborHours,
      totalCost,
      totalLaborCost
    };
    setEstimateItems([...estimateItems, newItem]);
  };
  const addAssemblyToEstimate = async (assembly: Assembly, quantity: number = 1) => {
    try {
      // Check if assembly already exists in estimate
      const existingAssembly = assemblyEstimates.find(item => item.assemblyId === assembly.id);
      if (existingAssembly) {
        updateAssemblyQuantity(existingAssembly.id, existingAssembly.quantity + quantity);
        return;
      }

      // Get all components first to avoid async issues
      const allComponents = await datacenterComponentService.getComponents();
      const assemblyComponents: EstimateItem[] = [];
      let totalMaterialCost = 0;
      let totalLaborCost = 0;
      let totalLaborHours = 0;
      for (const assemblyComponent of assembly.components || []) {
        const component = allComponents.find(c => c.id === assemblyComponent.component_id);
        if (!component) continue;

        // Get quality tiers for the component
        const qualityTiers = await datacenterComponentService.getQualityTiers(component.id);
        const qualityTier = qualityTiers[0];
        if (!qualityTier) continue;
        const componentQuantity = assemblyComponent.quantity;
        const laborHours = (component.labor_hours || 0) * componentQuantity;
        const laborCost = laborHours * LABOR_RATE_PER_HOUR;
        const materialCost = qualityTier.unit_cost * componentQuantity;
        totalMaterialCost += materialCost;
        totalLaborCost += laborCost;
        totalLaborHours += laborHours;
        const componentItem: EstimateItem = {
          id: `${component.id}-${qualityTier.id}-${assembly.id}-${Date.now()}-${Math.random()}`,
          componentId: component.id,
          componentName: component.name,
          qualityTier: {
            id: qualityTier.id,
            name: qualityTier.name,
            unitCost: qualityTier.unit_cost,
            description: qualityTier.description
          },
          quantity: componentQuantity,
          unit: component.unit,
          totalCost: materialCost + laborCost
        };
        assemblyComponents.push(componentItem);
      }
      const newAssemblyEstimate: AssemblyEstimateItem = {
        id: `assembly-${assembly.id}-${Date.now()}`,
        estimateId: '',
        assemblyId: assembly.id,
        assemblyName: assembly.name,
        quantity,
        totalMaterialCost,
        totalLaborCost,
        totalLaborHours,
        components: assemblyComponents
      };
      setAssemblyEstimates([...assemblyEstimates, newAssemblyEstimate]);
      toast({
        title: "Assembly Added",
        description: `Added "${assembly.name}" with ${assemblyComponents.length} components`
      });
    } catch (error) {
      console.error('Error adding assembly to estimate:', error);
      toast({
        title: "Error",
        description: "Failed to add assembly to estimate",
        variant: "destructive"
      });
    }
  };
  const updateAssemblyQuantity = (assemblyEstimateId: string, quantity: number) => {
    if (quantity <= 0) {
      removeAssemblyFromEstimate(assemblyEstimateId);
      return;
    }
    setAssemblyEstimates(assemblyEstimates.map(assembly => {
      if (assembly.id === assemblyEstimateId) {
        return {
          ...assembly,
          quantity
        };
      }
      return assembly;
    }));
  };
  const removeAssemblyFromEstimate = (assemblyEstimateId: string) => {
    setAssemblyEstimates(assemblyEstimates.filter(assembly => assembly.id !== assemblyEstimateId));
  };
  const removeFromEstimate = (itemId: string) => {
    setEstimateItems(estimateItems.filter(item => item.id !== itemId));
  };
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromEstimate(itemId);
      return;
    }
    setEstimateItems(estimateItems.map(item => {
      if (item.id === itemId) {
        const materialCost = item.qualityTier.unit_cost * quantity;
        const totalLaborCost = item.laborHours * quantity * LABOR_RATE_PER_HOUR;
        return {
          ...item,
          quantity,
          totalCost: materialCost + totalLaborCost,
          totalLaborCost
        };
      }
      return item;
    }));
  };
  const getTotalMaterialCost = () => {
    return assemblyEstimates.reduce((sum, assembly) => {
      return sum + assembly.totalMaterialCost * assembly.quantity;
    }, 0) + estimateItems.reduce((sum, item) => {
      return sum + item.qualityTier.unit_cost * item.quantity;
    }, 0);
  };
  const getTotalLaborCost = () => {
    return assemblyEstimates.reduce((sum, assembly) => {
      return sum + assembly.totalLaborCost * assembly.quantity;
    }, 0) + estimateItems.reduce((sum, item) => sum + item.totalLaborCost, 0);
  };
  const getTotalLaborHours = () => {
    return assemblyEstimates.reduce((sum, assembly) => {
      return sum + assembly.totalLaborHours * assembly.quantity;
    }, 0) + estimateItems.reduce((sum, item) => {
      return sum + item.laborHours * item.quantity;
    }, 0);
  };
  const getGrandTotal = () => {
    return getTotalMaterialCost() + getTotalLaborCost();
  };
  const getQualityBadgeVariant = (tierId: string): "default" | "secondary" | "destructive" => {
    if (tierId.includes('basic') || tierId.includes('standard')) return 'secondary';
    if (tierId.includes('premium')) return 'default';
    return 'destructive';
  };
  if (loading) {
    return <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="h-6 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-20 bg-muted animate-pulse rounded" />)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="h-6 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-10 bg-muted animate-pulse rounded" />
                <div className="h-20 bg-muted animate-pulse rounded" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>;
  }
  return <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Estimate Configurator</h1>
        <p className="text-muted-foreground">
          Build comprehensive cost estimates for data center construction projects
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Component and Assembly Library */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Build Your Estimate</CardTitle>
              <CardDescription>
                Select components or assemblies to build your estimate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                  <TabsTrigger value="components">Individual Components</TabsTrigger>
                  <TabsTrigger value="assemblies">Pre-built Assemblies</TabsTrigger>
                </TabsList>

                <TabsContent value="components">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input placeholder="Search components..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
                      </div>
                    </div>

                    <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                      <TabsList className="grid grid-cols-3 lg:grid-cols-4 gap-1">
                        <TabsTrigger value="All">All</TabsTrigger>
                        {categories.slice(0, 3).map(category => <TabsTrigger key={category} value={category} className="text-xs">
                            {category.split(' ')[0]}
                          </TabsTrigger>)}
                      </TabsList>

                      <div className="mt-4 max-h-[600px] overflow-y-auto space-y-3">
                        {components.map(component => <ComponentCard key={component.id} component={component} onAddToEstimate={addToEstimate} getQualityBadgeVariant={getQualityBadgeVariant} />)}
                      </div>
                    </Tabs>
                  </div>
                </TabsContent>

                <TabsContent value="assemblies">
                  <div className="space-y-4">
                    <div className="max-h-[600px] overflow-y-auto space-y-3">
                      {assemblies.length === 0 ? <div className="text-center py-8 text-muted-foreground">
                          <p>No assemblies available yet.</p>
                          <p className="text-sm">Create assemblies in the Assembly Builder first.</p>
                        </div> : assemblies.map(assembly => <AssemblyCard key={assembly.id} assembly={assembly} onAddToEstimate={addAssemblyToEstimate} />)}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Estimate Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Current Estimate
              </CardTitle>
              <CardDescription>
                {assemblyEstimates.length} assemblies, {estimateItems.length} individual components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="max-h-[400px] overflow-y-auto space-y-3">
                  {assemblyEstimates.length === 0 && estimateItems.length === 0 ? <div className="text-center py-8 text-muted-foreground">
                      No items added yet
                    </div> : <>
                      {/* Assembly Estimates */}
                      {assemblyEstimates.map(assembly => <AssemblyEstimateCard key={assembly.id} assembly={assembly} onQuantityChange={updateAssemblyQuantity} onRemove={removeAssemblyFromEstimate} />)}
                      
                      {/* Individual Component Estimates */}
                      {estimateItems.length > 0 && <div className="space-y-2">
                          {assemblyEstimates.length > 0 && <div className="text-sm font-medium text-muted-foreground border-t pt-2">
                              Individual Components
                            </div>}
                          {estimateItems.map(item => <Card key={item.id} className="p-3">
                              <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm truncate">{item.componentName}</h4>
                                    <Badge variant={getQualityBadgeVariant(item.qualityTier.id)} className="text-xs">
                                      {item.qualityTier.name}
                                    </Badge>
                                  </div>
                                  <Button size="sm" variant="destructive" onClick={() => removeFromEstimate(item.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="min-w-[40px] text-center">{item.quantity}</span>
                                  <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                  <span className="text-xs text-muted-foreground ml-2">{item.unit}</span>
                                </div>

                                <div className="text-sm space-y-1">
                                  <div className="flex justify-between">
                                    <span>Material:</span>
                                    <span>{formatCurrency(item.qualityTier.unit_cost * item.quantity)}</span>
                                  </div>
                                  {item.laborHours > 0 && <div className="flex justify-between">
                                      <span>Labor ({item.laborHours * item.quantity}h):</span>
                                      <span>{formatCurrency(item.totalLaborCost)}</span>
                                    </div>}
                                  <div className="flex justify-between font-medium border-t pt-1">
                                    <span>Total:</span>
                                    <span>{formatCurrency(item.totalCost)}</span>
                                  </div>
                                </div>
                              </div>
                            </Card>)}
                        </div>}
                    </>}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Material Cost:</span>
                    <span>{formatCurrency(getTotalMaterialCost())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Labor Cost ({getTotalLaborHours()}h):</span>
                    <span>{formatCurrency(getTotalLaborCost())}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Grand Total:</span>
                    <span>{formatCurrency(getGrandTotal())}</span>
                  </div>
                </div>

                <SaveEstimateDialog 
                  assemblyEstimates={assemblyEstimates}
                  estimateItems={estimateItems.map(item => ({
                    id: item.id,
                    componentId: item.componentId,
                    componentName: item.componentName,
                    qualityTier: {
                      id: item.qualityTier.id,
                      name: item.qualityTier.name,
                      unitCost: item.qualityTier.unit_cost,
                      description: item.qualityTier.description
                    },
                    quantity: item.quantity,
                    unit: item.unit,
                    totalCost: item.totalCost
                  }))}
                  onSaved={() => {
                    setEstimateItems([]);
                    setAssemblyEstimates([]);
                  }} 
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};

// Component Card Component
interface ComponentCardProps {
  component: EnhancedComponent;
  onAddToEstimate: (component: EnhancedComponent, qualityTier: QualityTier) => void;
  getQualityBadgeVariant: (tierId: string) => "default" | "secondary" | "destructive";
}
const ComponentCard = ({
  component,
  onAddToEstimate,
  getQualityBadgeVariant
}: ComponentCardProps) => {
  const [qualityTiers, setQualityTiers] = useState<QualityTier[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    loadQualityTiers();
  }, [component.id]);
  const loadQualityTiers = async () => {
    try {
      setLoading(true);
      const tiers = await datacenterComponentService.getQualityTiers(component.id);
      setQualityTiers(tiers);
    } catch (error) {
      console.error('Error loading quality tiers:', error);
    } finally {
      setLoading(false);
    }
  };
  return <Card className="p-4">
      <div className="space-y-3">
        <div>
          <h3 className="font-medium">{component.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{component.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">{component.category}</Badge>
            {component.labor_hours && <Badge variant="secondary" className="text-xs">
                {component.labor_hours}h labor
              </Badge>}
          </div>
        </div>

        {loading ? <div className="space-y-2">
            {[1, 2, 3].map(i => <div key={i} className="h-8 bg-muted animate-pulse rounded" />)}
          </div> : <div className="space-y-2">
            {qualityTiers.map(tier => <div key={tier.id} className="flex items-center justify-between p-2 bg-muted rounded">
                <div className="flex items-center gap-2">
                  <Badge variant={getQualityBadgeVariant(tier.id)} className="text-xs">
                    {tier.name}
                  </Badge>
                  <span className="text-sm font-medium">{formatCurrency(tier.unit_cost)}</span>
                  <span className="text-xs text-muted-foreground">per {component.unit}</span>
                </div>
                <Button size="sm" onClick={() => onAddToEstimate(component, tier)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>)}
          </div>}
      </div>
    </Card>;
};

// Assembly Card Component
interface AssemblyCardProps {
  assembly: Assembly;
  onAddToEstimate: (assembly: Assembly, quantity: number) => void;
}
const AssemblyCard = ({
  assembly,
  onAddToEstimate
}: AssemblyCardProps) => {
  const [quantity, setQuantity] = useState(1);
  return <Card className="p-4">
      <div className="space-y-3">
        <div>
          <h3 className="font-medium">{assembly.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{assembly.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {assembly.components?.length || 0} components
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {assembly.labor_hours || 0}h labor
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Components:</span>
              <span className="font-medium">{assembly.components?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Labor Hours:</span>
              <span className="font-medium">{assembly.labor_hours || 0}h</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-muted rounded">
            <div className="flex items-center gap-2">
              <label className="text-sm">Quantity:</label>
              <Input type="number" min="1" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 1)} className="w-20" />
            </div>
            <Button size="sm" onClick={() => onAddToEstimate(assembly, quantity)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Assembly
            </Button>
          </div>
        </div>
      </div>
    </Card>;
};