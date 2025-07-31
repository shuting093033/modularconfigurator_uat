import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Receipt, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { datacenterService } from "@/services/datacenterService";
import { datacenterComponentService } from "@/services/datacenterComponentService";
import { Project, EnhancedComponent, ActualCost } from "@/types/datacenter";
import { useToast } from "@/hooks/use-toast";
import { SecurityValidator } from "@/utils/validation";
import { ErrorHandler } from "@/utils/errorHandling";

interface ActualCostEntryProps {
  projects: Project[];
  onCostAdded?: () => void;
}

export const ActualCostEntry = ({ projects, onCostAdded }: ActualCostEntryProps) => {
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedComponent, setSelectedComponent] = useState<string>("");
  const [components, setComponents] = useState<EnhancedComponent[]>([]);
  const [formData, setFormData] = useState({
    actual_quantity: "",
    actual_unit_cost: "",
    vendor_name: "",
    purchase_order_number: "",
    invoice_number: "",
    notes: ""
  });
  const [costDate, setCostDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadComponents();
  }, []);

  const loadComponents = async () => {
    try {
      const componentsData = await datacenterComponentService.getComponents();
      setComponents(componentsData);
    } catch (error) {
      console.error('Error loading components:', error);
      toast({
        title: "Error",
        description: "Failed to load components",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProject || !selectedComponent || !costDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!formData.actual_quantity || !formData.actual_unit_cost) {
      toast({
        title: "Validation Error",
        description: "Quantity and unit cost are required",
        variant: "destructive",
      });
      return;
    }

    // Validate quantity
    const quantityValidation = SecurityValidator.validateNumeric(formData.actual_quantity, "Quantity");
    if (!quantityValidation.isValid) {
      toast({
        title: "Validation Error",
        description: quantityValidation.error,
        variant: "destructive",
      });
      return;
    }

    // Validate unit cost
    const costValidation = SecurityValidator.validateCurrency(formData.actual_unit_cost, "Unit cost");
    if (!costValidation.isValid) {
      toast({
        title: "Validation Error",
        description: costValidation.error,
        variant: "destructive",
      });
      return;
    }

    // Validate cost date (should not be in future)
    const dateValidation = SecurityValidator.validateDate(costDate, false);
    if (!dateValidation.isValid) {
      toast({
        title: "Validation Error",
        description: dateValidation.error,
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const actualQuantity = parseFloat(formData.actual_quantity);
      const actualUnitCost = parseFloat(formData.actual_unit_cost);
      const actualTotalCost = actualQuantity * actualUnitCost;

      // Validate calculated total
      if (actualTotalCost > 999999999999) {
        toast({
          title: "Validation Error",
          description: "Total cost exceeds maximum allowed value",
          variant: "destructive",
        });
        return;
      }

      await datacenterService.addActualCost({
        project_id: selectedProject,
        component_id: selectedComponent,
        actual_quantity: actualQuantity,
        actual_unit_cost: actualUnitCost,
        actual_total_cost: actualTotalCost,
        cost_date: costDate,
        vendor_name: formData.vendor_name ? SecurityValidator.sanitizeText(formData.vendor_name) : undefined,
        purchase_order_number: formData.purchase_order_number ? SecurityValidator.sanitizeText(formData.purchase_order_number) : undefined,
        invoice_number: formData.invoice_number ? SecurityValidator.sanitizeText(formData.invoice_number) : undefined,
        notes: formData.notes ? SecurityValidator.sanitizeText(formData.notes) : undefined
      });

      toast({
        title: "Success",
        description: "Actual cost recorded successfully",
      });

      // Reset form
      setSelectedProject("");
      setSelectedComponent("");
      setFormData({
        actual_quantity: "",
        actual_unit_cost: "",
        vendor_name: "",
        purchase_order_number: "",
        invoice_number: "",
        notes: ""
      });
      setCostDate(new Date());

      if (onCostAdded) {
        onCostAdded();
      }
    } catch (error) {
      const secureError = ErrorHandler.sanitizeError(error);
      ErrorHandler.logSecurityEvent('COST_ENTRY_FAILED', { 
        projectId: selectedProject,
        componentId: selectedComponent,
        error: secureError.logMessage 
      }, 'medium');
      
      toast({
        title: "Error",
        description: secureError.userMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedComponentData = components.find(c => c.id === selectedComponent);
  const calculatedTotal = formData.actual_quantity && formData.actual_unit_cost 
    ? parseFloat(formData.actual_quantity) * parseFloat(formData.actual_unit_cost)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Record Actual Costs
        </CardTitle>
        <CardDescription>
          Enter actual costs incurred for project components
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Project Selection */}
            <div>
              <Label htmlFor="project">Project *</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Component Selection */}
            <div>
              <Label htmlFor="component">Component *</Label>
              <Select value={selectedComponent} onValueChange={setSelectedComponent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select component" />
                </SelectTrigger>
                <SelectContent>
                  {components.map((component) => (
                    <SelectItem key={component.id} value={component.id}>
                      <div className="flex items-center gap-2">
                        <span>{component.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {component.category}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Component Details */}
          {selectedComponentData && (
            <Card className="p-3 bg-muted">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{selectedComponentData.name}</h4>
                  <Badge variant="outline">{selectedComponentData.unit}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{selectedComponentData.description}</p>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Quantity */}
            <div>
              <Label htmlFor="quantity">Actual Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                placeholder="Enter quantity"
                value={formData.actual_quantity}
                onChange={(e) => setFormData({ ...formData, actual_quantity: e.target.value })}
              />
            </div>

            {/* Unit Cost */}
            <div>
              <Label htmlFor="unit-cost">Actual Unit Cost *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="unit-cost"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.actual_unit_cost}
                  onChange={(e) => setFormData({ ...formData, actual_unit_cost: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Total Cost (calculated) */}
            <div>
              <Label>Total Cost</Label>
              <div className="h-10 px-3 py-2 bg-muted rounded-md flex items-center font-medium">
                ${calculatedTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cost Date */}
            <div>
              <Label>Cost Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !costDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {costDate ? format(costDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={costDate}
                    onSelect={setCostDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Vendor */}
            <div>
              <Label htmlFor="vendor">Vendor</Label>
              <Input
                id="vendor"
                placeholder="Vendor name"
                value={formData.vendor_name}
                onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PO Number */}
            <div>
              <Label htmlFor="po">Purchase Order Number</Label>
              <Input
                id="po"
                placeholder="PO-2024-001"
                value={formData.purchase_order_number}
                onChange={(e) => setFormData({ ...formData, purchase_order_number: e.target.value })}
              />
            </div>

            {/* Invoice Number */}
            <div>
              <Label htmlFor="invoice">Invoice Number</Label>
              <Input
                id="invoice"
                placeholder="INV-2024-001"
                value={formData.invoice_number}
                onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about this cost entry..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Recording..." : "Record Actual Cost"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};