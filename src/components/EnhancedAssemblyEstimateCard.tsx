import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Clock, DollarSign, Package2 } from "lucide-react";
import { AssemblyEstimateItem } from "@/types/estimate";
import { formatCurrency } from "@/utils/currency";

interface EnhancedAssemblyEstimateCardProps {
  assembly: AssemblyEstimateItem;
  readOnly?: boolean;
}

export function EnhancedAssemblyEstimateCard({ assembly, readOnly = false }: EnhancedAssemblyEstimateCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalAssemblyCost = (assembly.totalMaterialCost + assembly.totalLaborCost) * assembly.quantity;
  const totalMaterialCost = assembly.totalMaterialCost * assembly.quantity;
  const totalLaborCost = assembly.totalLaborCost * assembly.quantity;
  const totalLaborHours = assembly.totalLaborHours * assembly.quantity;

  const getQualityBadgeVariant = (tierId: string) => {
    switch (tierId.toLowerCase()) {
      case 'budget':
      case 'basic': 
        return 'secondary';
      case 'standard': 
        return 'default';
      case 'premium': 
        return 'destructive';
      default: 
        return 'outline';
    }
  };

  return (
    <Card className="w-full border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-colors">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Package2 className="h-5 w-5 text-primary" />
            {assembly.assemblyName}
          </CardTitle>
          {assembly.quantity > 1 && (
            <Badge variant="outline" className="font-medium">
              Qty: {assembly.quantity}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Cost Summary Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Material Cost</span>
            </div>
            <div className="text-lg font-semibold text-primary">
              {formatCurrency(totalMaterialCost)}
            </div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Labor Cost</span>
            </div>
            <div className="text-lg font-semibold text-primary">
              {formatCurrency(totalLaborCost)}
            </div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Labor Hours</span>
            </div>
            <div className="text-lg font-semibold">
              {totalLaborHours.toFixed(1)} hrs
            </div>
          </div>
          
          <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Total Cost</span>
            </div>
            <div className="text-lg font-bold text-primary">
              {formatCurrency(totalAssemblyCost)}
            </div>
          </div>
        </div>

        {/* Component Details Collapsible */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <Package2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Components ({assembly.components.length})
                </span>
              </div>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-3 mt-4">
            <div className="grid gap-3">
              {assembly.components.map((component) => (
                <Card
                  key={component.id}
                  className="border-l-2 border-l-muted bg-muted/20"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="space-y-1">
                        <h4 className="font-medium text-sm">{component.componentName}</h4>
                        <Badge 
                          variant={getQualityBadgeVariant(component.qualityTier.id)}
                          className="text-xs"
                        >
                          {component.qualityTier.name}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {formatCurrency(component.totalCost * assembly.quantity)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {(component.quantity * assembly.quantity).toLocaleString()} {component.unit}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="text-muted-foreground">Unit Cost</div>
                        <div className="font-medium">
                          {formatCurrency(component.qualityTier.unitCost)}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground">Qty per Assembly</div>
                        <div className="font-medium">
                          {component.quantity} {component.unit}
                        </div>
                      </div>
                    </div>
                    
                    {component.qualityTier.description && (
                      <div className="mt-2 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
                        {component.qualityTier.description}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}