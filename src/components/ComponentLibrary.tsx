import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Package, Zap, Settings, Users, Shield, Building, Server, Eye, Edit, Trash2 } from "lucide-react";
import { datacenterComponentService } from "@/services/datacenterComponentService";
import { EnhancedComponent, QualityTier } from "@/types/datacenter";
import { useToast } from "@/hooks/use-toast";
import { AddComponentDialog } from "@/components/AddComponentDialog";

import { formatCurrency } from "@/utils/currency";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Electrical Infrastructure':
      return <Zap className="h-4 w-4" />;
    case 'Mechanical Systems':
      return <Settings className="h-4 w-4" />;
    case 'IT Infrastructure':
      return <Server className="h-4 w-4" />;
    case 'Security Systems':
      return <Shield className="h-4 w-4" />;
    case 'Foundation Systems':
      return <Building className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

const getSkillBadgeVariant = (skill: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (skill) {
    case 'entry':
      return 'secondary';
    case 'intermediate':
      return 'default';
    case 'expert':
      return 'destructive';
    case 'specialist':
      return 'outline';
    default:
      return 'outline';
  }
};

export const ComponentLibrary = () => {
  const [components, setComponents] = useState<EnhancedComponent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComponent, setSelectedComponent] = useState<EnhancedComponent | null>(null);
  const [qualityTiers, setQualityTiers] = useState<QualityTier[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const categories = datacenterComponentService.getComponentCategories();

  useEffect(() => {
    loadComponents();
  }, [selectedCategory, searchTerm]);

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

  const loadQualityTiers = async (componentId: string) => {
    try {
      const tiers = await datacenterComponentService.getQualityTiers(componentId);
      setQualityTiers(tiers);
    } catch (error) {
      console.error('Error loading quality tiers:', error);
      toast({
        title: "Error",
        description: "Failed to load quality tiers",
        variant: "destructive",
      });
    }
  };

  const handleComponentClick = async (component: EnhancedComponent) => {
    setSelectedComponent(component);
    setIsEditing(false);
    setFormData({
      name: component.name,
      description: component.description,
      category: component.category,
      unit: component.unit,
      skill_level: component.skill_level,
      labor_hours: component.labor_hours,
      lead_time_days: component.lead_time_days,
      installation_notes: component.installation_notes,
    });
    await loadQualityTiers(component.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (selectedComponent) {
      setFormData({
        name: selectedComponent.name,
        description: selectedComponent.description,
        category: selectedComponent.category,
        unit: selectedComponent.unit,
        skill_level: selectedComponent.skill_level,
        labor_hours: selectedComponent.labor_hours,
        lead_time_days: selectedComponent.lead_time_days,
        installation_notes: selectedComponent.installation_notes,
      });
    }
  };

  const handleSaveEdit = async () => {
    console.log('=== SAVE EDIT DEBUG START ===');
    console.log('selectedComponent:', selectedComponent);
    console.log('formData before processing:', formData);
    
    if (!selectedComponent) {
      console.log('ERROR: No selected component');
      return;
    }
    
    // Validate required fields
    if (!formData.name || formData.name.trim().length === 0) {
      toast({
        title: "Validation Error",
        description: "Component name is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.category || formData.category.trim().length === 0) {
      toast({
        title: "Validation Error", 
        description: "Component category is required",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log('Starting component update...');
      
      // Clean and prepare data for database
      const updateData = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        description: formData.description ? formData.description.trim() : null,
        unit: formData.unit ? formData.unit.trim() : selectedComponent.unit,
        skill_level: formData.skill_level || null,
        labor_hours: formData.labor_hours && formData.labor_hours !== '' ? Number(formData.labor_hours) : null,
        lead_time_days: formData.lead_time_days && formData.lead_time_days !== '' ? Number(formData.lead_time_days) : null,
        installation_notes: formData.installation_notes ? formData.installation_notes.trim() : null,
      };
      
      console.log('updateData after processing:', updateData);
      console.log('Calling updateComponent with ID:', selectedComponent.id);
      
      const result = await datacenterComponentService.updateComponent(selectedComponent.id, updateData);
      console.log('Update result:', result);
      
      toast({
        title: "Success",
        description: "Component updated successfully",
      });
      
      setIsEditing(false);
      console.log('Reloading components...');
      await loadComponents();
      
      // Update selected component with new data
      const updatedComponent = { ...selectedComponent, ...updateData };
      console.log('Updated component:', updatedComponent);
      setSelectedComponent(updatedComponent);
      
      console.log('=== SAVE EDIT SUCCESS ===');
      
    } catch (error) {
      console.error('=== SAVE EDIT ERROR ===');
      console.error('Error type:', typeof error);
      console.error('Error object:', error);
      console.error('Error message:', error instanceof Error ? error.message : String(error));
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update component",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      console.log('=== SAVE EDIT DEBUG END ===');
    }
  };

  const handleDeleteComponent = async (componentId: string) => {
    try {
      await datacenterComponentService.deleteComponent(componentId);
      toast({
        title: "Success",
        description: "Component deleted successfully",
      });
      loadComponents();
    } catch (error) {
      console.error('Error deleting component:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete component",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="space-y-6">
          <div className="h-8 bg-muted animate-pulse rounded" />
          <div className="h-10 bg-muted animate-pulse rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-6 bg-muted animate-pulse rounded" />
                  <div className="h-4 bg-muted animate-pulse rounded" />
                </CardHeader>
                <CardContent>
                  <div className="h-16 bg-muted animate-pulse rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Component Library</h1>
          <p className="text-muted-foreground">
            Browse and explore data center construction components with detailed specifications
          </p>
        </div>
        <AddComponentDialog onComponentAdded={loadComponents} />
      </div>

      <div className="space-y-6">
        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search components by name, description, or specifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid grid-cols-4 lg:grid-cols-9 gap-1">
            <TabsTrigger value="All">All</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {category.split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {components.map((component) => (
                <Card key={component.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {getCategoryIcon(component.category)}
                        <CardTitle className="text-lg truncate">{component.name}</CardTitle>
                      </div>
                      <div className="flex gap-1">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Component</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{component.name}"? This action cannot be undone and will also delete all associated quality tiers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteComponent(component.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleComponentClick(component)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <DialogTitle className="flex items-center gap-2">
                                  {getCategoryIcon(component.category)}
                                  {isEditing ? (
                                    <Input
                                      value={formData.name || ''}
                                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                      className="text-lg font-semibold"
                                    />
                                  ) : (
                                    component.name
                                  )}
                                </DialogTitle>
                                <DialogDescription>
                                  {isEditing ? (
                                    <Input
                                      value={formData.description || ''}
                                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                      placeholder="Component description"
                                    />
                                  ) : (
                                    component.description
                                  )}
                                </DialogDescription>
                              </div>
                              <div className="flex gap-2">
                                {!isEditing ? (
                                  <Button onClick={handleEdit} variant="outline" size="sm">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </Button>
                                ) : (
                                  <>
                                    <Button onClick={handleCancelEdit} variant="outline" size="sm">
                                      Cancel
                                    </Button>
                                    <Button 
                                      onClick={handleSaveEdit} 
                                      disabled={isSubmitting}
                                      size="sm"
                                    >
                                      {isSubmitting ? "Saving..." : "Save"}
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </DialogHeader>
                          
                          {selectedComponent && (
                            <div className="space-y-6">
                              {/* Basic Information */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Component Details</h4>
                                  <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2">
                                      <strong>Category:</strong> 
                                      {isEditing ? (
                                        <select 
                                          value={formData.category || ''}
                                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                          className="border rounded px-2 py-1"
                                        >
                                          {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                          ))}
                                        </select>
                                      ) : (
                                        selectedComponent.category
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <strong>Unit:</strong>
                                      {isEditing ? (
                                        <Input
                                          value={formData.unit || ''}
                                          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                          className="w-20"
                                        />
                                      ) : (
                                        selectedComponent.unit
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <strong>Labor Hours:</strong>
                                      {isEditing ? (
                                        <Input
                                          type="number"
                                          value={formData.labor_hours || ''}
                                          onChange={(e) => setFormData({ ...formData, labor_hours: e.target.value })}
                                          className="w-20"
                                        />
                                      ) : (
                                        selectedComponent.labor_hours && `${selectedComponent.labor_hours}h`
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <strong>Skill Level:</strong>
                                      {isEditing ? (
                                        <select 
                                          value={formData.skill_level || ''}
                                          onChange={(e) => setFormData({ ...formData, skill_level: e.target.value })}
                                          className="border rounded px-2 py-1"
                                        >
                                          <option value="entry">Entry</option>
                                          <option value="intermediate">Intermediate</option>
                                          <option value="expert">Expert</option>
                                          <option value="specialist">Specialist</option>
                                        </select>
                                      ) : (
                                        selectedComponent.skill_level && (
                                          <Badge variant={getSkillBadgeVariant(selectedComponent.skill_level)}>
                                            {selectedComponent.skill_level}
                                          </Badge>
                                        )
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <strong>Lead Time:</strong>
                                      {isEditing ? (
                                        <Input
                                          type="number"
                                          value={formData.lead_time_days || ''}
                                          onChange={(e) => setFormData({ ...formData, lead_time_days: e.target.value })}
                                          className="w-20"
                                        />
                                      ) : (
                                        selectedComponent.lead_time_days && `${selectedComponent.lead_time_days} days`
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Technical Specifications */}
                                {selectedComponent.technical_specs && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Technical Specifications</h4>
                                    <div className="space-y-1 text-sm">
                                      {Object.entries(selectedComponent.technical_specs as Record<string, string>).map(([key, value]) => (
                                        <div key={key}>
                                          <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {value}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Vendor Information */}
                              {selectedComponent.vendor_info && (
                                <div>
                                  <h4 className="font-semibold mb-2">Vendor Information</h4>
                                  <div className="space-y-1 text-sm">
                                    {Object.entries(selectedComponent.vendor_info as Record<string, string>).map(([key, value]) => (
                                      <div key={key}>
                                        <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {value}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Quality Tiers */}
                              <div>
                                <h4 className="font-semibold mb-2">Quality Tiers & Pricing</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  {qualityTiers.map((tier) => (
                                    <Card key={tier.id} className="p-3">
                                      <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                          <Badge variant={tier.name === 'Standard' ? 'secondary' : tier.name === 'Premium' ? 'default' : 'destructive'}>
                                            {tier.name}
                                          </Badge>
                                          <span className="font-bold text-lg">{formatCurrency(tier.unit_cost)}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{tier.description}</p>
                                      </div>
                                    </Card>
                                  ))}
                                </div>
                              </div>

                              {/* Installation Notes */}
                              <div>
                                <h4 className="font-semibold mb-2">Installation Notes</h4>
                                {isEditing ? (
                                  <textarea
                                    value={formData.installation_notes || ''}
                                    onChange={(e) => setFormData({ ...formData, installation_notes: e.target.value })}
                                    className="w-full p-3 border rounded text-sm"
                                    rows={3}
                                    placeholder="Installation notes and requirements..."
                                  />
                                ) : (
                                  <p className="text-sm bg-muted p-3 rounded">
                                    {selectedComponent.installation_notes || 'No installation notes available'}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {component.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{component.category}</Badge>
                        <div className="text-sm text-muted-foreground">
                          per {component.unit}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        {component.labor_hours && (
                          <Badge variant="secondary" className="text-xs">
                            {component.labor_hours}h labor
                          </Badge>
                        )}
                        {component.skill_level && (
                          <Badge variant={getSkillBadgeVariant(component.skill_level)} className="text-xs">
                            {component.skill_level}
                          </Badge>
                        )}
                        {component.lead_time_days && (
                          <Badge variant="outline" className="text-xs">
                            {component.lead_time_days}d lead
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {components.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">No components found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search terms or category filter
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

    </div>
  );
};