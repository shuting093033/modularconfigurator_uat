import { AdvancedAnalyticsDashboard } from "@/components/AdvancedAnalyticsDashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const Analytics = () => {
  return (
    <ProtectedRoute>
      <AdvancedAnalyticsDashboard />
    </ProtectedRoute>
  );
};

export default Analytics;