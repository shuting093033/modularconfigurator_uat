import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrencyWithUnit, formatCurrency } from '@/utils/currency';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Calculator, Save } from 'lucide-react';
import { unitRateLibrary, componentCategories } from '@/data/unitRateLibrary';
import { Component, EstimateItem, QualityTier } from '@/types/estimate';
import { SaveEstimateDialog } from './SaveEstimateDialog';

export const EstimateBuilder = () => {
  const [estimateItems, setEstimateItems] = useState<EstimateItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Foundation');

  const addToEstimate = (component: Component, qualityTier: QualityTier) => {
    const newItem: EstimateItem = {
      id: `${component.id}-${qualityTier.id}-${Date.now()}`,
      componentId: component.id,
      componentName: component.name,
      qualityTier,
      quantity: 1,
      unit: component.unit,
      totalCost: qualityTier.unitCost
    };
    setEstimateItems([...estimateItems, newItem]);
  };

  const removeFromEstimate = (itemId: string) => {
    setEstimateItems(estimateItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setEstimateItems(estimateItems.map(item => 
      item.id === itemId 
        ? { ...item, quantity, totalCost: quantity * item.qualityTier.unitCost }
        : item
    ));
  };

  const totalEstimate = estimateItems.reduce((sum, item) => sum + item.totalCost, 0);

  const filteredComponents = unitRateLibrary.filter(
    component => component.category === selectedCategory
  );

  const getQualityBadgeVariant = (tierId: string) => {
    switch (tierId) {
      case 'basic': return 'secondary' as const;
      case 'standard': return 'default' as const;
      case 'premium': return 'destructive' as const;
      default: return 'secondary' as const;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Component Library */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Unit Rate Library
                </CardTitle>
                <CardDescription>
                  Select components to add to your estimate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                  <TabsList className="grid grid-cols-4 lg:grid-cols-6 gap-1 h-auto p-1">
                    {componentCategories.slice(0, 6).map((category) => (
                      <TabsTrigger 
                        key={category} 
                        value={category}
                        className="text-xs px-2 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {componentCategories.slice(0, 6).map((category) => (
                    <TabsContent key={category} value={category} className="mt-4">
                      <div className="space-y-4">
                        {filteredComponents.map((component) => (
                          <Card key={component.id} className="border-l-4 border-l-primary">
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-lg">{component.name}</CardTitle>
                                  <CardDescription className="mt-1">
                                    {component.description} • Unit: {component.unit}
                                  </CardDescription>
                                </div>
                                <Badge variant="outline">{component.category}</Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="grid gap-3">
                                {component.qualityTiers.map((tier) => (
                                  <div 
                                    key={tier.id}
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                                  >
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <Badge variant={getQualityBadgeVariant(tier.id)}>
                                          {tier.name}
                                        </Badge>
                        <span className="font-semibold text-lg">
                          {formatCurrencyWithUnit(tier.unitCost, component.unit)}
                        </span>
                                      </div>
                                      <p className="text-sm text-muted-foreground">
                                        {tier.description}
                                      </p>
                                    </div>
                                    <Button 
                                      onClick={() => addToEstimate(component, tier)}
                                      size="sm"
                                      className="ml-4"
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Current Estimate */}
          <div>
            <Card className="shadow-card sticky top-6">
              <CardHeader>
                <CardTitle>Current Estimate</CardTitle>
                <CardDescription>
                  {estimateItems.length} item{estimateItems.length !== 1 ? 's' : ''} selected
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {estimateItems.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calculator className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No items in estimate</p>
                      <p className="text-sm">Add components from the library</p>
                    </div>
                  ) : (
                    estimateItems.map((item) => (
                      <Card key={item.id} className="p-3">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm leading-tight">{item.componentName}</h4>
                              <Badge 
                                variant={getQualityBadgeVariant(item.qualityTier.id)}
                                className="text-xs mt-1"
                              >
                                {item.qualityTier.name}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromEstimate(item.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, Number(e.target.value) || 0)}
                              className="h-8 w-20 text-sm"
                              min="0"
                              step="0.1"
                            />
                            <span className="text-xs text-muted-foreground">{item.unit}</span>
                            <span className="text-xs">@</span>
                            <span className="text-xs font-medium">
                              {formatCurrency(item.qualityTier.unitCost)}
                            </span>
                          </div>
                          
                          <div className="text-right">
                            <span className="font-semibold">
                              {formatCurrency(item.totalCost)}
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
                
                {estimateItems.length > 0 && (
                  <div className="border-t pt-4 mt-4 space-y-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total Estimate:</span>
                      <span className="text-primary">{formatCurrency(totalEstimate)}</span>
                    </div>
                    <SaveEstimateDialog 
                      estimateItems={estimateItems}
                      onSaved={() => setEstimateItems([])}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
};