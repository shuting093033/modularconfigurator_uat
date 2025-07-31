import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus } from "lucide-react";
import { datacenterComponentService } from "@/services/datacenterComponentService";
import { toast } from "sonner";
import { SecurityValidator } from "@/utils/validation";

const formSchema = z.object({
  id: z.string()
    .min(1, "Component ID is required")
    .max(50, "Component ID must not exceed 50 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Component ID can only contain letters, numbers, hyphens, and underscores"),
  name: z.string()
    .min(1, "Component name is required")
    .max(100, "Component name must not exceed 100 characters"),
  category: z.string().min(1, "Category is required"),
  description: z.string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
  unit: z.string().min(1, "Unit is required"),
  skill_level: z.enum(['entry', 'intermediate', 'expert', 'specialist']).optional(),
  labor_hours: z.number().min(0).max(1000, "Labor hours must not exceed 1000").optional(),
  lead_time_days: z.number().min(0).max(365, "Lead time must not exceed 365 days").optional(),
  installation_notes: z.string()
    .max(1000, "Installation notes must not exceed 1000 characters")
    .optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AddComponentDialogProps {
  onComponentAdded: () => void;
}

export const AddComponentDialog = ({ onComponentAdded }: AddComponentDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      name: "",
      category: "",
      description: "",
      unit: "",
      skill_level: undefined,
      labor_hours: undefined,
      lead_time_days: undefined,
      installation_notes: "",
    },
  });

  const onSubmit = async (values: FormData) => {
    setIsSubmitting(true);
    try {
      // Additional server-side validation
      const nameValidation = SecurityValidator.validateProjectName(values.name);
      if (!nameValidation.isValid) {
        toast.error(nameValidation.error);
        return;
      }

      // Sanitize text inputs
      const componentData = {
        id: values.id,
        name: values.name,
        category: values.category,
        unit: values.unit,
        description: values.description ? SecurityValidator.sanitizeText(values.description) : undefined,
        skill_level: values.skill_level,
        labor_hours: values.labor_hours,
        lead_time_days: values.lead_time_days,
        installation_notes: values.installation_notes ? SecurityValidator.sanitizeText(values.installation_notes) : undefined,
      };

      await datacenterComponentService.createComponent(componentData);
      toast.success("Component added successfully!");
      form.reset();
      setOpen(false);
      onComponentAdded();
    } catch (error) {
      console.error("Error adding component:", error);
      toast.error("Failed to add component. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = datacenterComponentService.getComponentCategories();
  const skillLevels = ['entry', 'intermediate', 'expert', 'specialist'];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Component
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Component</DialogTitle>
          <DialogDescription>
            Create a new data center component for the library.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Component ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., DC-POWER-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Component Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Server Rack" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., each, sq ft, linear ft" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the component's purpose and specifications..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="skill_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select skill level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {skillLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="labor_hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Labor Hours</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lead_time_days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lead Time (Days)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="installation_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Installation Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Special installation requirements or notes..."
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Component"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};