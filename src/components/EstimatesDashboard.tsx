import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye, Calendar, DollarSign, FileText } from "lucide-react";
import { estimateService, SavedEstimate } from "@/services/estimateService";
import { useToast } from "@/hooks/use-toast";
import { EnhancedEstimateDetailModal } from "./EnhancedEstimateDetailModal";

export function EstimatesDashboard() {
  const [estimates, setEstimates] = useState<SavedEstimate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEstimateId, setSelectedEstimateId] = useState<string | null>(null);
  const { toast } = useToast();

  const loadEstimates = async () => {
    try {
      const data = await estimateService.getEstimates();
      setEstimates(data);
    } catch (error) {
      toast({
        title: "Load Failed",
        description: "Failed to load estimates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEstimates();
  }, []);

  const handleDelete = async (estimateId: string, estimateName: string) => {
    if (!confirm(`Are you sure you want to delete "${estimateName}"?`)) {
      return;
    }

    try {
      await estimateService.deleteEstimate(estimateId);
      setEstimates(estimates.filter(est => est.id !== estimateId));
      toast({
        title: "Estimate Deleted",
        description: `"${estimateName}" has been deleted.`,
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete estimate. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading estimates...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Estimates Dashboard</h1>
        <p className="text-muted-foreground">
          Manage and review your saved construction estimates
        </p>
      </div>

      {estimates.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Estimates Found</h3>
            <p className="text-muted-foreground mb-4">
              You haven't saved any estimates yet. Create your first estimate to get started.
            </p>
            <Button onClick={() => window.location.href = "/"}>
              Create New Estimate
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {estimates.map((estimate) => (
            <Card key={estimate.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{estimate.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(estimate.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    ${estimate.total_cost.toLocaleString()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedEstimateId(estimate.id)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(estimate.id, estimate.name)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedEstimateId && (
        <EnhancedEstimateDetailModal
          estimateId={selectedEstimateId}
          open={!!selectedEstimateId}
          onOpenChange={(open) => !open && setSelectedEstimateId(null)}
        />
      )}
    </div>
  );
}