import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, DollarSign, Package, Hash } from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import { estimateService, SavedEstimate, SavedEstimateItem } from "@/services/estimateService";
import { useToast } from "@/hooks/use-toast";
import { HierarchicalEstimate } from "@/types/estimate";
import { AssemblyEstimateCard } from "@/components/AssemblyEstimateCard";

interface EstimateDetailModalProps {
  estimateId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EstimateDetailModal({ estimateId, open, onOpenChange }: EstimateDetailModalProps) {
  const [estimate, setEstimate] = useState<SavedEstimate | null>(null);
  const [items, setItems] = useState<SavedEstimateItem[]>([]);
  const [hierarchicalEstimate, setHierarchicalEstimate] = useState<HierarchicalEstimate | null>(null);
  const [isHierarchical, setIsHierarchical] = useState(false);
  const [loading, setLoading] = useState(true);
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

  const getQualityBadgeVariant = (tierId: string) => {
    switch (tierId) {
      case 'basic': return 'secondary';
      case 'standard': return 'default';
      case 'premium': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {isHierarchical ? hierarchicalEstimate?.name || 'Loading...' : estimate?.name || 'Loading...'}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading estimate details...</span>
          </div>
        ) : isHierarchical && hierarchicalEstimate ? (
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="pr-4">
                <div className="space-y-6">
                  {/* Hierarchical Estimate Summary */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Created</p>
                        <p className="font-medium">
                          {new Date(hierarchicalEstimate.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Assemblies</p>
                        <p className="font-medium">{hierarchicalEstimate.assemblies.length} assemblies</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Cost</p>
                        <p className="font-semibold text-lg">
                          ${hierarchicalEstimate.totalCost.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Assembly Breakdown */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Assembly Breakdown</h3>
                    <div className="space-y-4">
                      {hierarchicalEstimate.assemblies.map((assembly) => (
                        <Card key={assembly.id} className="border-l-4 border-l-primary">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{assembly.assemblyName}</CardTitle>
                                {assembly.quantity > 1 && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Quantity: {assembly.quantity}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-primary">
                                  {formatCurrency((assembly.totalMaterialCost + assembly.totalLaborCost) * assembly.quantity)}
                                </div>
                                <p className="text-xs text-muted-foreground">Total Assembly Cost</p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-3">
                              {assembly.components.map((component) => (
                                <Card key={component.id} className="p-3">
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm leading-tight">{component.componentName}</h4>
                                        <Badge 
                                          variant={getQualityBadgeVariant(component.qualityTier.id)}
                                          className="text-xs mt-1"
                                        >
                                          {component.qualityTier.name}
                                        </Badge>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-medium">{component.quantity * assembly.quantity}</span>
                                      <span className="text-xs text-muted-foreground">{component.unit}</span>
                                      <span className="text-xs">@</span>
                                      <span className="text-xs font-medium">
                                        {formatCurrency(component.qualityTier.unitCost)}
                                      </span>
                                    </div>
                                    
                                    <div className="text-right">
                                      <span className="font-semibold">
                                        {formatCurrency(component.totalCost * assembly.quantity)}
                                      </span>
                                    </div>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="pr-4">
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
                          ${estimate?.total_cost.toLocaleString()}
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
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm leading-tight">{item.component_name}</h4>
                              <Badge 
                                variant={getQualityBadgeVariant(item.quality_tier_id)}
                                className="text-xs mt-1"
                              >
                                {item.quality_tier_name}
                              </Badge>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs font-medium">{item.quantity}</span>
                                <span className="text-xs text-muted-foreground">{item.unit}</span>
                                <span className="text-xs">@</span>
                                <span className="text-xs font-medium">
                                  {formatCurrency(item.quality_tier_unit_cost)}
                                </span>
                              </div>
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
              </div>
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}