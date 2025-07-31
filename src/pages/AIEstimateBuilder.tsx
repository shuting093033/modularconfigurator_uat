import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { NaturalLanguageEstimateBuilder } from "@/components/NaturalLanguageEstimateBuilder";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { aiActionIntegrationService } from "@/services/aiActionIntegrationService";
import { ConversationContext } from "@/services/aiEstimateService";

const AIEstimateBuilder = () => {
  const [searchParams] = useSearchParams();
  const estimateId = searchParams.get('estimateId');
  const [estimateContext, setEstimateContext] = useState<ConversationContext | undefined>();

  useEffect(() => {
    if (estimateId) {
      aiActionIntegrationService.getCurrentEstimateContext(estimateId)
        .then(context => {
          if (context) {
            setEstimateContext(context);
          }
        })
        .catch(console.error);
    }
  }, [estimateId]);

  const handleEstimateUpdated = () => {
    if (estimateId) {
      aiActionIntegrationService.getCurrentEstimateContext(estimateId)
        .then(context => {
          if (context) {
            setEstimateContext(context);
          }
        })
        .catch(console.error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-6">
        <NaturalLanguageEstimateBuilder 
          estimateId={estimateId || undefined}
          currentEstimate={estimateContext}
          onEstimateUpdated={handleEstimateUpdated}
        />
      </div>
    </ProtectedRoute>
  );
};

export default AIEstimateBuilder;