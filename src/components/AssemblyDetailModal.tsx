import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Package, Clock, DollarSign } from "lucide-react";
import { Assembly } from "@/types/datacenter";
import { datacenterService } from "@/services/datacenterService";
import { useToast } from "@/hooks/use-toast";

interface AssemblyDetailModalProps {
  assembly: Assembly | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AssemblyDetailComponent {
  id: string;
  component_id: string;
  component_name: string;
  component_description: string;
  quantity: number;
  unit: string;
  notes?: string;
  labor_hours?: number;
  selected_quality_tier_id?: string;
  quality_tiers: Array<{
    id: string;
    name: string;
    unit_cost: number;
    description?: string;
  }>;
  selected_quality_tier?: {
    id: string;
    name: string;
    unit_cost: number;
    description?: string;
  };
}

interface AssemblyDetails {
  id: string;
  name: string;
  description: string | null;
  category_id: string | null;
  labor_hours: number | null;
  total_material_cost?: number | null;
  total_labor_cost?: number | null;
  installation_sequence: number | null;
  user_id: string | null;
  created_at: Date;
  updated_at: Date;
  components: AssemblyDetailComponent[];
}

export const AssemblyDetailModal = ({ assembly, open, onOpenChange }: AssemblyDetailModalProps) => {
  const [assemblyDetails, setAssemblyDetails] = useState<AssemblyDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedComponents, setExpandedComponents] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    if (assembly && open) {
      loadAssemblyDetails();
    }
  }, [assembly, open]);

  const loadAssemblyDetails = async () => {
    if (!assembly) return;
    
    try {
      setLoading(true);
      const details = await datacenterService.getAssemblyDetails(assembly.id);
      
      // Convert date strings to Date objects
      const transformedDetails: AssemblyDetails = {
        ...details,
        created_at: new Date(details.created_at),
        updated_at: new Date(details.updated_at)
      };
      
      setAssemblyDetails(transformedDetails);
    } catch (error) {
      console.error('Error loading assembly details:', error);
      toast({
        title: "Error",
        description: "Failed to load assembly details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleComponentExpansion = (componentId: string) => {
    const newExpanded = new Set(expandedComponents);
    if (newExpanded.has(componentId)) {
      newExpanded.delete(componentId);
    } else {
      newExpanded.add(componentId);
    }
    setExpandedComponents(newExpanded);
  };

  const calculateComponentTotalCost = (component: AssemblyDetailComponent) => {
    // Use selected quality tier if available, otherwise use first tier
    const selectedTier = component.selected_quality_tier || component.quality_tiers[0];
    return selectedTier ? selectedTier.unit_cost * component.quantity : 0;
  };

  const calculateTotalMaterialCost = () => {
    if (!assemblyDetails) return 0;
    
    // Use stored cost if available, otherwise calculate
    if (assemblyDetails.total_material_cost !== undefined) {
      return assemblyDetails.total_material_cost;
    }
    
    return assemblyDetails.components.reduce((sum, component) => {
      return sum + calculateComponentTotalCost(component);
    }, 0);
  };

  const calculateTotalLaborCost = () => {
    if (!assemblyDetails) return 0;
    
    // Use stored cost if available, otherwise calculate with default rate
    if (assemblyDetails.total_labor_cost !== undefined) {
      return assemblyDetails.total_labor_cost;
    }
    
    // Fallback calculation with $50/hour labor rate
    const laborRate = 50;
    return (assemblyDetails.labor_hours || 0) * laborRate;
  };

  if (!assembly) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Assembly Details: {assembly.name}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <div className="h-20 bg-muted animate-pulse rounded" />
            <div className="h-40 bg-muted animate-pulse rounded" />
          </div>
        ) : assemblyDetails ? (
          <div className="space-y-6">
            {/* Assembly Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground">
                    {assemblyDetails.description || "No description provided"}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Package className="h-4 w-4" />
                      Components
                    </div>
                    <div className="text-2xl font-bold">{assemblyDetails.components.length}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Labor Hours
                    </div>
                    <div className="text-2xl font-bold">{assemblyDetails.labor_hours || 0}h</div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      Material Cost
                    </div>
                    <div className="text-2xl font-bold">${calculateTotalMaterialCost().toLocaleString()}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      Labor Cost
                    </div>
                    <div className="text-2xl font-bold">${calculateTotalLaborCost().toLocaleString()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Components List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Components ({assemblyDetails.components.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {assemblyDetails.components.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No components in this assembly
                  </div>
                ) : (
                  assemblyDetails.components.map((component) => (
                    <Collapsible key={component.id}>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-between p-4 h-auto"
                          onClick={() => toggleComponentExpansion(component.id)}
                        >
                          <div className="flex items-center gap-3 text-left">
                            {expandedComponents.has(component.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <div className="flex-1">
                              <div className="font-medium">{component.component_name}</div>
                              <div className="text-sm text-muted-foreground">
                                Qty: {component.quantity} {component.unit}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              ${calculateComponentTotalCost(component).toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {component.labor_hours ? `${component.labor_hours}h labor` : ''}
                            </div>
                          </div>
                        </Button>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="px-4 pb-4">
                        <div className="ml-7 space-y-3 border-l-2 border-muted pl-4">
                          <div>
                            <h5 className="font-medium text-sm mb-1">Description</h5>
                            <p className="text-sm text-muted-foreground">
                              {component.component_description || "No description available"}
                            </p>
                          </div>

                          {component.notes && (
                            <div>
                              <h5 className="font-medium text-sm mb-1">Notes</h5>
                              <p className="text-sm text-muted-foreground">{component.notes}</p>
                            </div>
                          )}

                          <div>
                            <h5 className="font-medium text-sm mb-2">Quality Tiers Available</h5>
                            <div className="space-y-2">
                              {component.quality_tiers.map((tier) => (
                                <div key={tier.id} className="flex justify-between items-center p-2 rounded border">
                                  <div>
                                    <div className="font-medium text-sm">{tier.name}</div>
                                    {tier.description && (
                                      <div className="text-xs text-muted-foreground">{tier.description}</div>
                                    )}
                                  </div>
                                  <Badge variant="outline">
                                    ${tier.unit_cost.toLocaleString()}/{component.unit}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Failed to load assembly details
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};