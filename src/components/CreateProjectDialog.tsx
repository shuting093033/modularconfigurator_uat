import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { datacenterService } from "@/services/datacenterService";
import { Project, ProjectType } from "@/types/datacenter";
import { useToast } from "@/hooks/use-toast";
import { SecurityValidator } from "@/utils/validation";
import { ErrorHandler } from "@/utils/errorHandling";

interface CreateProjectDialogProps {
  onProjectCreated?: (project: Project) => void;
  trigger?: React.ReactNode;
}

export const CreateProjectDialog = ({ onProjectCreated, trigger }: CreateProjectDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    project_type: "datacenter" as ProjectType,
    capacity_mw: "",
    location: "",
    total_budget: "",
    start_date: "",
    target_completion_date: ""
  });

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate project name
    const nameValidation = SecurityValidator.validateProjectName(formData.name);
    if (!nameValidation.isValid) {
      toast({
        title: "Validation Error",
        description: nameValidation.error,
        variant: "destructive"
      });
      return;
    }

    // Validate capacity if provided
    if (formData.capacity_mw) {
      const capacityValidation = SecurityValidator.validateNumeric(formData.capacity_mw, "Capacity");
      if (!capacityValidation.isValid) {
        toast({
          title: "Validation Error",
          description: capacityValidation.error,
          variant: "destructive"
        });
        return;
      }
    }

    // Validate budget if provided
    if (formData.total_budget) {
      const budgetValidation = SecurityValidator.validateCurrency(formData.total_budget, "Budget");
      if (!budgetValidation.isValid) {
        toast({
          title: "Validation Error",
          description: budgetValidation.error,
          variant: "destructive"
        });
        return;
      }
    }

    // Validate dates if provided
    if (formData.start_date) {
      const startDateValidation = SecurityValidator.validateDate(formData.start_date, true);
      if (!startDateValidation.isValid) {
        toast({
          title: "Validation Error",
          description: "Start date: " + startDateValidation.error,
          variant: "destructive"
        });
        return;
      }
    }

    if (formData.target_completion_date) {
      const endDateValidation = SecurityValidator.validateDate(formData.target_completion_date, true);
      if (!endDateValidation.isValid) {
        toast({
          title: "Validation Error",
          description: "Target completion date: " + endDateValidation.error,
          variant: "destructive"
        });
        return;
      }
    }

    // Validate date order
    if (formData.start_date && formData.target_completion_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.target_completion_date);
      if (startDate >= endDate) {
        toast({
          title: "Validation Error",
          description: "Target completion date must be after start date",
          variant: "destructive"
        });
        return;
      }
    }

    try {
      setLoading(true);
      
      const projectData = {
        name: SecurityValidator.sanitizeText(formData.name),
        description: formData.description ? SecurityValidator.sanitizeText(formData.description) : undefined,
        project_type: formData.project_type,
        capacity_mw: formData.capacity_mw ? parseFloat(formData.capacity_mw) : undefined,
        location: formData.location ? SecurityValidator.sanitizeText(formData.location) : undefined,
        total_budget: formData.total_budget ? parseFloat(formData.total_budget) : undefined,
        start_date: formData.start_date ? new Date(formData.start_date) : undefined,
        target_completion_date: formData.target_completion_date ? new Date(formData.target_completion_date) : undefined,
        status: "planning" as const
      };

      const project = await datacenterService.createProject(projectData);
      
      toast({
        title: "Success",
        description: "Project created successfully"
      });
      
      setOpen(false);
      setFormData({
        name: "",
        description: "",
        project_type: "datacenter",
        capacity_mw: "",
        location: "",
        total_budget: "",
        start_date: "",
        target_completion_date: ""
      });
      
      onProjectCreated?.(project);
    } catch (error) {
      const secureError = ErrorHandler.sanitizeError(error);
      ErrorHandler.logSecurityEvent('PROJECT_CREATION_FAILED', { 
        projectName: formData.name,
        error: secureError.logMessage 
      }, 'medium');
      
      toast({
        title: "Error",
        description: secureError.userMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Data Center Project</DialogTitle>
            <DialogDescription>
              Set up a new construction project for tracking costs and progress
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="col-span-3"
                placeholder="Enter project name"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project_type" className="text-right">
                Type
              </Label>
              <Select 
                value={formData.project_type} 
                onValueChange={(value) => handleInputChange("project_type", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="datacenter">Data Center</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="renovation">Renovation</SelectItem>
                  <SelectItem value="expansion">Expansion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity_mw" className="text-right">
                Capacity (MW)
              </Label>
              <Input
                id="capacity_mw"
                type="number"
                step="0.1"
                value={formData.capacity_mw}
                onChange={(e) => handleInputChange("capacity_mw", e.target.value)}
                className="col-span-3"
                placeholder="100"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="col-span-3"
                placeholder="City, State"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="total_budget" className="text-right">
                Budget ($)
              </Label>
              <Input
                id="total_budget"
                type="number"
                step="1000"
                value={formData.total_budget}
                onChange={(e) => handleInputChange("total_budget", e.target.value)}
                className="col-span-3"
                placeholder="500000000"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start_date" className="text-right">
                Start Date
              </Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange("start_date", e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="target_completion_date" className="text-right">
                Target Completion
              </Label>
              <Input
                id="target_completion_date"
                type="date"
                value={formData.target_completion_date}
                onChange={(e) => handleInputChange("target_completion_date", e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="col-span-3"
                placeholder="Project description and objectives"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};