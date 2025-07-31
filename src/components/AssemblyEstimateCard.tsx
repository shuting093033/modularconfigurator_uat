import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Minus, Plus } from "lucide-react";
import { AssemblyEstimateItem } from "@/types/estimate";

interface AssemblyEstimateCardProps {
  assembly: AssemblyEstimateItem;
  onQuantityChange: (assemblyId: string, quantity: number) => void;
  onRemove: (assemblyId: string) => void;
}

export function AssemblyEstimateCard({ assembly, onQuantityChange, onRemove }: AssemblyEstimateCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quantity, setQuantity] = useState(assembly.quantity);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
      onQuantityChange(assembly.id, newQuantity);
    }
  };

  const totalAssemblyCost = assembly.totalMaterialCost + assembly.totalLaborCost;

  const getQualityBadgeVariant = (tierId: string) => {
    switch (tierId) {
      case 'budget': return 'secondary';
      case 'standard': return 'default';
      case 'premium': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{assembly.assemblyName}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(assembly.id)}
            className="text-destructive hover:text-destructive"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Assembly Summary */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Material Cost:</span>
            <div className="text-muted-foreground">
              ${(assembly.totalMaterialCost * quantity).toLocaleString()}
            </div>
          </div>
          <div>
            <span className="font-medium">Labor Cost:</span>
            <div className="text-muted-foreground">
              ${(assembly.totalLaborCost * quantity).toLocaleString()}
            </div>
          </div>
          <div>
            <span className="font-medium">Labor Hours:</span>
            <div className="text-muted-foreground">
              {(assembly.totalLaborHours * quantity).toFixed(1)} hrs
            </div>
          </div>
          <div>
            <span className="font-medium">Total Cost:</span>
            <div className="font-semibold text-primary">
              ${(totalAssemblyCost * quantity).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Quantity:</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
            className="w-20 text-center"
            min="1"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Component Details Collapsible */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="text-sm font-medium">
                Components ({assembly.components.length})
              </span>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-2 mt-3">
            {assembly.components.map((component) => (
              <div
                key={component.id}
                className="border rounded-lg p-3 bg-muted/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-medium">{component.componentName}</h4>
                    <Badge 
                      variant={getQualityBadgeVariant(component.qualityTier.id)}
                      className="text-xs mt-1"
                    >
                      {component.qualityTier.name}
                    </Badge>
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-medium">
                      ${(component.totalCost * quantity).toLocaleString()}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {component.quantity * quantity} {component.unit}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>
                    Unit Cost: ${component.qualityTier.unitCost.toLocaleString()}
                  </div>
                  <div>
                    Qty per Assembly: {component.quantity}
                  </div>
                </div>
                
                {component.qualityTier.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {component.qualityTier.description}
                  </p>
                )}
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}