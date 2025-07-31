import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { EstimateItem, AssemblyEstimateItem } from "@/types/estimate";
import { estimateService } from "@/services/estimateService";
import { useToast } from "@/hooks/use-toast";
import { SecurityValidator } from "@/utils/validation";

interface SaveEstimateDialogProps {
  estimateItems?: EstimateItem[];
  assemblyEstimates?: AssemblyEstimateItem[];
  onSaved?: () => void;
}

export function SaveEstimateDialog({ estimateItems = [], assemblyEstimates = [], onSaved }: SaveEstimateDialogProps) {
  const [open, setOpen] = useState(false);
  const [estimateName, setEstimateName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!estimateName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your estimate.",
        variant: "destructive",
      });
      return;
    }

    // Validate estimate name
    const nameValidation = SecurityValidator.validateProjectName(estimateName);
    if (!nameValidation.isValid) {
      toast({
        title: "Invalid Name",
        description: nameValidation.error,
        variant: "destructive",
      });
      return;
    }

    if (estimateItems.length === 0 && assemblyEstimates.length === 0) {
      toast({
        title: "No Items",
        description: "Please add items to your estimate before saving.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      if (assemblyEstimates.length > 0) {
        // Use assembly-based save method
        await estimateService.saveAssemblyEstimate(estimateName, assemblyEstimates);
      } else {
        // Use legacy flat save method
        await estimateService.saveEstimate(estimateName, estimateItems);
      }
      
      toast({
        title: "Estimate Saved",
        description: `"${estimateName}" has been saved successfully.`,
      });
      setOpen(false);
      setEstimateName("");
      onSaved?.();
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save estimate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate totals based on what data we have
  const totalCost = assemblyEstimates.length > 0
    ? assemblyEstimates.reduce((sum, assembly) => 
        sum + (assembly.totalMaterialCost + assembly.totalLaborCost) * assembly.quantity, 0)
    : estimateItems.reduce((sum, item) => sum + item.totalCost, 0);
  
  const totalItems = assemblyEstimates.length > 0
    ? `${assemblyEstimates.length} assemblies`
    : `${estimateItems.length} components`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="w-full"
          disabled={estimateItems.length === 0 && assemblyEstimates.length === 0}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Estimate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Estimate</DialogTitle>
          <DialogDescription>
            Save your current estimate with a name for future reference.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={estimateName}
              onChange={(e) => setEstimateName(e.target.value)}
              className="col-span-3"
              placeholder="Enter estimate name..."
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-muted-foreground">
              Items
            </Label>
            <div className="col-span-3 text-sm">
              {totalItems}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-muted-foreground">
              Total
            </Label>
            <div className="col-span-3 font-semibold">
              ${totalCost.toLocaleString()}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Estimate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}