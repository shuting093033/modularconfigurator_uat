import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Package, Wrench, Clock } from "lucide-react";
import { datacenterComponentService } from "@/services/datacenterComponentService";
import { datacenterService } from "@/services/datacenterService";
import { EnhancedComponent, QualityTier, Assembly, AssemblyComponent } from "@/types/datacenter";
import { useToast } from "@/hooks/use-toast";
import { AssemblyDetailModal } from "./AssemblyDetailModal";
import { AssemblyEditModal } from "./AssemblyEditModal";

interface AssemblyItem {
  component: EnhancedComponent;
  quantity: number;
  qualityTier: QualityTier;
  notes?: string;
}

export const AssemblyBuilder = () => {
  const [components, setComponents] = useState<EnhancedComponent[]>([]);
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [assemblyItems, setAssemblyItems] = useState<AssemblyItem[]>([]);
  const [assemblyName, setAssemblyName] = useState("");
  const [assemblyDescription, setAssemblyDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("browse");
  const [selectedAssembly, setSelectedAssembly] = useState<Assembly | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [laborRate, setLaborRate] = useState<number>(50);
  const { toast } = useToast();

  const categories = datacenterComponentService.getComponentCategories();

  useEffect(() => {
    loadComponents();
    loadAssemblies();
    loadLaborRate();
  }, [selectedCategory, searchTerm]);

  const loadLaborRate = async () => {
    try {
      const rate = await datacenterService.getUserLaborRate();
      setLaborRate(rate);
    } catch (error) {
      console.error('Error loading labor rate:', error);
    }
  };

  const loadAssemblies = async () => {
    try {
      const assembliesData = await datacenterService.getAssemblies();
      setAssemblies(assembliesData);
    } catch (error) {
      console.error('Error loading assemblies:', error);
      toast({
        title: "Error",
        description: "Failed to load assemblies",
        variant: "destructive",
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
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addComponentToAssembly = async (component: EnhancedComponent) => {
    try {
      const qualityTiers = await datacenterComponentService.getQualityTiers(component.id);
      if (qualityTiers.length === 0) {
        toast({
          title: "Error",
          description: "No quality tiers available for this component",
          variant: "destructive",
        });
        return;
      }

      const newItem: AssemblyItem = {
        component,
        quantity: 1,
        qualityTier: qualityTiers[0], // Default to first (cheapest) tier
        notes: ""
      };

      setAssemblyItems([...assemblyItems, newItem]);
    } catch (error) {
      console.error('Error adding component:', error);
      toast({
        title: "Error",
        description: "Failed to add component to assembly",
        variant: "destructive",
      });
    }
  };

  const removeComponentFromAssembly = (index: number) => {
    setAssemblyItems(assemblyItems.filter((_, i) => i !== index));
  };

  const updateAssemblyItem = (index: number, updates: Partial<AssemblyItem>) => {
    const updatedItems = [...assemblyItems];
    updatedItems[index] = { ...updatedItems[index], ...updates };
    setAssemblyItems(updatedItems);
  };

  const saveAssembly = async () => {
    if (!assemblyName.trim()) {
      toast({
        title: "Validation Error",
        description: "Assembly name is required",
        variant: "destructive",
      });
      return;
    }

    if (assemblyItems.length === 0) {
      toast({
        title: "Validation Error", 
        description: "Assembly must contain at least one component",
        variant: "destructive",
      });
      return;
    }

    try {
      const totalLaborHours = assemblyItems.reduce((sum, item) => {
        return sum + (item.component.labor_hours || 0) * item.quantity;
      }, 0);
      
      const totalMaterialCost = assemblyItems.reduce((sum, item) => {
        return sum + (item.qualityTier.unit_cost * item.quantity);
      }, 0);
      
      const totalLaborCost = totalLaborHours * laborRate;

      // Create the assembly
      const assembly = await datacenterService.createAssembly({
        name: assemblyName,
        description: assemblyDescription,
        labor_hours: totalLaborHours,
        total_material_cost: totalMaterialCost,
        total_labor_cost: totalLaborCost,
        installation_sequence: 1
      });

      // Create assembly components
      if (assemblyItems.length > 0) {
        const components = assemblyItems.map(item => ({
          component_id: item.component.id,
          quantity: item.quantity,
          unit: item.component.unit,
          notes: item.notes,
          selected_quality_tier_id: item.qualityTier.id
        }));
        
        await datacenterService.createAssemblyComponents(assembly.id, components);
      }

      toast({
        title: "Success",
        description: `Assembly "${assemblyName}" saved successfully`,
      });

      // Reset form
      setAssemblyName("");
      setAssemblyDescription("");
      setAssemblyItems([]);
      
      // Reload assemblies to show the new one
      await loadAssemblies();
    } catch (error) {
      console.error('Error saving assembly:', error);
      toast({
        title: "Error",
        description: "Failed to save assembly",
        variant: "destructive",
      });
    }
  };

  const getTotalMaterialCost = () => {
    return assemblyItems.reduce((sum, item) => {
      return sum + (item.qualityTier.unit_cost * item.quantity);
    }, 0);
  };

  const getTotalLaborHours = () => {
    return assemblyItems.reduce((sum, item) => {
      return sum + ((item.component.labor_hours || 0) * item.quantity);
    }, 0);
  };

  const getTotalLaborCost = () => {
    return getTotalLaborHours() * laborRate;
  };

  const getTotalCost = () => {
    return getTotalMaterialCost() + getTotalLaborCost();
  };

  const handleViewDetails = (assembly: Assembly) => {
    setSelectedAssembly(assembly);
    setShowDetailModal(true);
  };

  const handleEditAssembly = (assembly: Assembly) => {
    setSelectedAssembly(assembly);
    setShowEditModal(true);
  };

  const handleAssemblySaved = async () => {
    await loadAssemblies();
    toast({
      title: "Success",
      description: "Assembly updated successfully",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="h-6 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-muted animate-pulse rounded" />
                ))}
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
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Assembly Builder</h1>
        <p className="text-muted-foreground">
          Create and manage reusable component assemblies for data center construction
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="browse">Browse Assemblies</TabsTrigger>
          <TabsTrigger value="create">Create Assembly</TabsTrigger>
        </TabsList>

        <TabsContent value="browse">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Existing Assemblies ({assemblies.length})
              </CardTitle>
              <CardDescription>
                Browse and manage your existing component assemblies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assemblies.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    No assemblies created yet. Switch to "Create Assembly" tab to get started.
                  </div>
                ) : (
                  assemblies.map((assembly) => (
                    <Card key={assembly.id} className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-medium">{assembly.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {assembly.description}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {assembly.components?.length || 0} components
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {assembly.labor_hours || 0}h labor
                            </Badge>
                          </div>
                          
                          <div className="text-sm">
                            <div className="flex justify-between">
                              <span>Labor Hours:</span>
                              <span className="font-medium">
                                {assembly.labor_hours || 0}h
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => handleViewDetails(assembly)}
                          >
                            View Details
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditAssembly(assembly)}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Component Library */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Component Library
            </CardTitle>
            <CardDescription>
              Browse and add components to your assembly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search components..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>

              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="grid grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-1">
                  <TabsTrigger value="All">All</TabsTrigger>
                  {categories.slice(0, 2).map((category) => (
                    <TabsTrigger key={category} value={category} className="text-xs">
                      {category.split(' ')[0]}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <div className="mt-4 max-h-[500px] overflow-y-auto space-y-2">
                  {components.map((component) => (
                    <Card key={component.id} className="p-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{component.name}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {component.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {component.category}
                            </Badge>
                            {component.labor_hours && (
                              <Badge variant="secondary" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                {component.labor_hours}h
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addComponentToAssembly(component)}
                          className="shrink-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Assembly Builder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Assembly Configuration
            </CardTitle>
            <CardDescription>
              Configure your assembly details and components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="assembly-name">Assembly Name</Label>
                <Input
                  id="assembly-name"
                  placeholder="e.g., Power Distribution Unit Assembly"
                  value={assemblyName}
                  onChange={(e) => setAssemblyName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="assembly-description">Description</Label>
                <Textarea
                  id="assembly-description"
                  placeholder="Describe this assembly..."
                  value={assemblyDescription}
                  onChange={(e) => setAssemblyDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label>Components ({assemblyItems.length})</Label>
                <div className="max-h-[300px] overflow-y-auto space-y-2 mt-2">
                  {assemblyItems.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No components added yet
                    </div>
                  ) : (
                    assemblyItems.map((item, index) => (
                      <Card key={index} className="p-3">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h5 className="font-medium text-sm">{item.component.name}</h5>
                              <p className="text-xs text-muted-foreground">
                                {item.qualityTier.name} - ${item.qualityTier.unit_cost.toLocaleString()}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeComponentFromAssembly(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateAssemblyItem(index, { 
                                quantity: parseInt(e.target.value) || 1 
                              })}
                              className="w-20"
                            />
                            <Input
                              placeholder="Notes..."
                              value={item.notes || ""}
                              onChange={(e) => updateAssemblyItem(index, { notes: e.target.value })}
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Material Cost:</span>
                  <span className="font-medium">${getTotalMaterialCost().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Labor Cost:</span>
                  <span className="font-medium">${getTotalLaborCost().toLocaleString()} ({getTotalLaborHours()}h @ ${laborRate}/hr)</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t pt-2">
                  <span>Total Cost:</span>
                  <span>${getTotalCost().toLocaleString()}</span>
                </div>
              </div>

              <Button 
                onClick={saveAssembly} 
                className="w-full"
                disabled={!assemblyName.trim() || assemblyItems.length === 0}
              >
                Save Assembly
              </Button>
            </div>
          </CardContent>
        </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AssemblyDetailModal
        assembly={selectedAssembly}
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
      />
      
      <AssemblyEditModal
        assembly={selectedAssembly}
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onSaved={handleAssemblySaved}
      />
    </div>
  );
};