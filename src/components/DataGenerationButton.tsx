import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Database, Loader2, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { estimateDataService } from '@/services/estimateDataService';
import { useToast } from './ui/use-toast';

export const DataGenerationButton = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generationResult, setGenerationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [dataCounts, setDataCounts] = useState<any>(null);
  const [isLoadingCounts, setIsLoadingCounts] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadDataCounts();
  }, []);

  const loadDataCounts = async () => {
    try {
      setIsLoadingCounts(true);
      const counts = await estimateDataService.getDataCounts();
      setDataCounts(counts);
    } catch (error) {
      console.error('Failed to load data counts:', error);
    } finally {
      setIsLoadingCounts(false);
    }
  };

  const handleGenerateEstimateData = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to generate estimate data.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setError(null);
    setGenerationResult(null);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 300);

      const result = await estimateDataService.generateEstimateData(user.id);
      
      clearInterval(progressInterval);
      setProgress(100);
      setGenerationResult(result);
      
      // Reload counts to reflect new data
      await loadDataCounts();
      
      toast({
        title: "Estimate Data Generated",
        description: `Successfully generated ${result.summary.estimates} estimates with ${result.summary.estimateItems} items and actual cost data.`,
      });

    } catch (err: any) {
      setError(err.message || 'Failed to generate estimate data');
      toast({
        title: "Generation Failed",
        description: err.message || "An error occurred while generating estimate data.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const hasBaseData = dataCounts && dataCounts.components > 0 && dataCounts.qualityTiers > 0;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          Generate Estimate & Analytics Data
        </CardTitle>
        <CardDescription>
          Generate 25 realistic estimates with actual cost data for variance analysis. 
          This creates comprehensive data for testing the analytics dashboard using your existing components and assemblies.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoadingCounts ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading data overview...</span>
          </div>
        ) : dataCounts && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium mb-2">Current Database Status:</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Components:</span> <span className="font-mono">{dataCounts.components}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Quality Tiers:</span> <span className="font-mono">{dataCounts.qualityTiers}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Assemblies:</span> <span className="font-mono">{dataCounts.assemblies}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Estimates:</span> <span className="font-mono">{dataCounts.estimates}</span>
              </div>
            </div>
          </div>
        )}

        {!hasBaseData ? (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Base data required:</strong> No components or quality tiers found. Please ensure you have component library data before generating estimates.
            </p>
          </div>
        ) : !isGenerating && !generationResult && !error && (
          <Button 
            onClick={handleGenerateEstimateData}
            disabled={!user || !hasBaseData}
            className="w-full"
            size="lg"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Generate Estimates & Variance Data
          </Button>
        )}

        {isGenerating && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm font-medium">Generating estimate and variance data...</span>
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-xs text-muted-foreground">
              Creating estimates, estimate items, and actual cost records for analytics...
            </p>
          </div>
        )}

        {generationResult && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Estimate data generated successfully!</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p><strong>Estimates:</strong> {generationResult.summary.estimates}</p>
                <p><strong>Estimate Items:</strong> {generationResult.summary.estimateItems}</p>
              </div>
              <div className="space-y-1">
                <p><strong>Actual Costs:</strong> {generationResult.summary.actualCosts}</p>
                <p><strong>Projects:</strong> {generationResult.summary.projects}</p>
              </div>
            </div>
            
            <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-200">
                Your analytics dashboard now has realistic estimate vs actual cost data for variance analysis. 
                Navigate to the Analytics section to explore the insights.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Generation failed</span>
            </div>
            <p className="text-sm text-red-600">{error}</p>
            <Button 
              onClick={handleGenerateEstimateData}
              variant="outline"
              className="w-full"
            >
              Try Again
            </Button>
          </div>
        )}

        {!user && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Please log in to generate estimate data.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};