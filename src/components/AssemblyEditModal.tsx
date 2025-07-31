import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Save, Package, Wrench } from "lucide-react";
import { Assembly, EnhancedComponent, QualityTier } from "@/types/datacenter";
import { datacenterService } from "@/services/datacenterService";
import { datacenterComponentService } from "@/services/datacenterComponentService";
import { useToast } from "@/hooks/use-toast";

interface AssemblyEditModalProps {
  assembly: Assembly | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

interface AssemblyComponent {
  id?: string;
  component_id: string;
  component: EnhancedComponent;
  quantity: number;
  unit: string;
  notes?: string;
  qualityTiers: QualityTier[];
  selectedTier?: QualityTier;
}

export const AssemblyEditModal = ({ assembly, open, onOpenChange, onSaved }: AssemblyEditModalProps) => {
  const [assemblyName, setAssemblyName] = useState("");
  const [assemblyDescription, setAssemblyDescription] = useState("");
  const [assemblyComponents, setAssemblyComponents] = useState<AssemblyComponent[]>([]);
  const [availableComponents, setAvailableComponents] = useState<EnhancedComponent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const categories = datacenterComponentService.getComponentCategories();

  useEffect(() => {
    if (assembly && open) {
      loadAssemblyData();
      loadAvailableComponents();
    }
  }, [assembly, open]);

  useEffect(() => {
    if (open) {
      loadAvailableComponents();
    }
  }, [searchTerm, selectedCategory, open]);

  const loadAssemblyData = async () => {
    if (!assembly) return;

    try {
      setLoading(true);
      const details = await datacenterService.getAssemblyDetails(assembly.id);
      
      setAssemblyName(details.name);
      setAssemblyDescription(details.description || "");
      
      // Load assembly components with quality tiers
      const components = await Promise.all(
        details.components.map(async (comp) => {
          const [componentData, qualityTiers] = await Promise.all([
            datacenterComponentService.getComponents().then(components => 
              components.find(c => c.id === comp.component_id)
            ),
            datacenterComponentService.getQualityTiers(comp.component_id)
          ]);

          if (!componentData) throw new Error(`Component not found: ${comp.component_id}`);

          // Find the selected tier or default to first tier
          const selectedTier = comp.selected_quality_tier_id 
            ? qualityTiers.find(t => t.id === comp.selected_quality_tier_id) || qualityTiers[0]
            : qualityTiers[0];

          return {
            id: comp.id,
            component_id: comp.component_id,
            component: componentData,
            quantity: comp.quantity,
            unit: comp.unit,
            notes: comp.notes,
            qualityTiers,
            selectedTier
          };
        })
      );

      setAssemblyComponents(components);
    } catch (error) {
      console.error('Error loading assembly data:', error);
      toast({
        title: "Error",
        description: "Failed to load assembly data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableComponents = async () => {
    try {
      let components: EnhancedComponent[];
      
      if (searchTerm) {
        components = await datacenterComponentService.searchComponents(searchTerm);
      } else if (selectedCategory === "All") {
        components = await datacenterComponentService.getComponents();
      } else {
        components = await datacenterComponentService.getComponentsByCategory(selectedCategory);
      }
      
      setAvailableComponents(components);
    } catch (error) {
      console.error('Error loading components:', error);
    }
  };

  const addComponent = async (component: EnhancedComponent) => {
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

      const newComponent: AssemblyComponent = {
        component_id: component.id,
        component,
        quantity: 1,
        unit: component.unit,
        notes: "",
        qualityTiers,
        selectedTier: qualityTiers[0]
      };

      setAssemblyComponents([...assemblyComponents, newComponent]);
    } catch (error) {
      console.error('Error adding component:', error);
      toast({
        title: "Error",
        description: "Failed to add component",
        variant: "destructive",
      });
    }
  };

  const removeComponent = (index: number) => {
    setAssemblyComponents(assemblyComponents.filter((_, i) => i !== index));
  };

  const updateComponent = (index: number, updates: Partial<AssemblyComponent>) => {
    const updated = [...assemblyComponents];
    updated[index] = { ...updated[index], ...updates };
    setAssemblyComponents(updated);
  };

  const calculateTotalCost = () => {
    return assemblyComponents.reduce((sum, comp) => {
      const tierCost = comp.selectedTier?.unit_cost || 0;
      return sum + (tierCost * comp.quantity);
    }, 0);
  };

  const calculateTotalLaborHours = () => {
    return assemblyComponents.reduce((sum, comp) => {
      const laborHours = comp.component.labor_hours || 0;
      return sum + (laborHours * comp.quantity);
    }, 0);
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

    try {
      setSaving(true);
      
      // Get labor rate and calculate costs
      const laborRate = await datacenterService.getUserLaborRate();
      const totalLaborHours = calculateTotalLaborHours();
      const totalMaterialCost = calculateTotalCost();
      const totalLaborCost = totalLaborHours * laborRate;
      
      // Update assembly with calculated costs
      await datacenterService.updateAssembly(assembly.id, {
        name: assemblyName,
        description: assemblyDescription,
        labor_hours: totalLaborHours,
        total_material_cost: totalMaterialCost,
        total_labor_cost: totalLaborCost
      });

      // Update assembly components with selected quality tiers
      const componentData = assemblyComponents.map(comp => ({
        component_id: comp.component_id,
        quantity: comp.quantity,
        unit: comp.unit,
        notes: comp.notes,
        selected_quality_tier_id: comp.selectedTier?.id
      }));

      await datacenterService.updateAssemblyComponents(assembly.id, componentData);

      toast({
        title: "Success",
        description: "Assembly updated successfully",
      });

      onSaved();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving assembly:', error);
      toast({
        title: "Error",
        description: "Failed to save assembly",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!assembly) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Edit Assembly: {assembly.name}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <div className="h-20 bg-muted animate-pulse rounded" />
            <div className="h-40 bg-muted animate-pulse rounded" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Basic Assembly Info */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="assembly-name">Assembly Name</Label>
                  <Input
                    id="assembly-name"
                    value={assemblyName}
                    onChange={(e) => setAssemblyName(e.target.value)}
                    placeholder="Assembly name..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="assembly-description">Description</Label>
                  <Textarea
                    id="assembly-description"
                    value={assemblyDescription}
                    onChange={(e) => setAssemblyDescription(e.target.value)}
                    placeholder="Assembly description..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="components" className="space-y-4">
              <TabsList>
                <TabsTrigger value="components">
                  Manage Components ({assemblyComponents.length})
                </TabsTrigger>
                <TabsTrigger value="add">Add Components</TabsTrigger>
              </TabsList>

              <TabsContent value="components" className="space-y-4">
                {/* Current Components */}
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Assembly Components ({assemblyComponents.length})</h3>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Total Cost</div>
                          <div className="text-xl font-bold">${calculateTotalCost().toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {assemblyComponents.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            No components in this assembly
                          </div>
                        ) : (
                          assemblyComponents.map((comp, index) => (
                            <Card key={index} className="p-4">
                              <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <h4 className="font-medium">{comp.component.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {comp.component.description}
                                    </p>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => removeComponent(index)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                  <div>
                                    <Label>Quantity</Label>
                                    <Input
                                      type="number"
                                      min="1"
                                      value={comp.quantity}
                                      onChange={(e) => updateComponent(index, { 
                                        quantity: parseInt(e.target.value) || 1 
                                      })}
                                    />
                                  </div>

                                  <div>
                                    <Label>Quality Tier</Label>
                                    <Select
                                      value={comp.selectedTier?.id}
                                      onValueChange={(tierId) => {
                                        const tier = comp.qualityTiers.find(t => t.id === tierId);
                                        updateComponent(index, { selectedTier: tier });
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {comp.qualityTiers.map((tier) => (
                                          <SelectItem key={tier.id} value={tier.id}>
                                            {tier.name} - ${tier.unit_cost.toLocaleString()}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div>
                                    <Label>Notes</Label>
                                    <Input
                                      value={comp.notes || ""}
                                      onChange={(e) => updateComponent(index, { notes: e.target.value })}
                                      placeholder="Optional notes..."
                                    />
                                  </div>

                                  <div>
                                    <Label>Total</Label>
                                    <div className="h-10 flex items-center font-medium">
                                      ${((comp.selectedTier?.unit_cost || 0) * comp.quantity).toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Total Labor Hours</div>
                          <div className="text-lg font-medium">{calculateTotalLaborHours()}h</div>
                        </div>
                        <div className="space-y-1 text-right">
                          <div className="text-sm text-muted-foreground">Total Material Cost</div>
                          <div className="text-xl font-bold">${calculateTotalCost().toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="add" className="space-y-4">
                {/* Add Components */}
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Search components..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="flex-1"
                        />
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All">All Categories</SelectItem>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="max-h-[400px] overflow-y-auto space-y-2">
                        {availableComponents.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No components found</p>
                            <p className="text-xs">Try adjusting your search or category filter</p>
                          </div>
                        ) : (
                          availableComponents.map((component) => (
                            <Card key={component.id} className="p-4 hover:bg-accent/50 transition-colors">
                              <div className="flex justify-between items-start gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-medium truncate">{component.name}</h4>
                                    <Badge variant="outline" className="text-xs shrink-0">
                                      {component.category}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                    {component.description}
                                  </p>
                                  <div className="flex items-center gap-3 text-xs">
                                    <span className="flex items-center gap-1">
                                      <Package className="h-3 w-3" />
                                      {component.unit}
                                    </span>
                                    {component.labor_hours && (
                                      <span className="flex items-center gap-1">
                                        <Wrench className="h-3 w-3" />
                                        {component.labor_hours}h
                                      </span>
                                    )}
                                    {component.skill_level && (
                                      <Badge variant="secondary" className="text-xs px-1 py-0">
                                        {component.skill_level}
                                      </Badge>
                                    )}
                                  </div>
                                  {component.vendor_info && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                      Vendor: {component.vendor_info.preferred_vendor || 'N/A'}
                                    </div>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => addComponent(component)}
                                  disabled={assemblyComponents.some(ac => ac.component_id === component.id)}
                                  className="shrink-0"
                                >
                                  {assemblyComponents.some(ac => ac.component_id === component.id) ? (
                                    'Added'
                                  ) : (
                                    <>
                                      <Plus className="h-3 w-3 mr-1" />
                                      Add
                                    </>
                                  )}
                                </Button>
                              </div>
                            </Card>
                          ))
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Save Button */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={saveAssembly} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Assembly"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};