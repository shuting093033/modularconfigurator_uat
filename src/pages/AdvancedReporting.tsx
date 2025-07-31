import { AdvancedReportingDashboard } from "@/components/AdvancedReportingDashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const AdvancedReportingPage = () => {
  return (
    <ProtectedRoute>
      <AdvancedReportingDashboard />
    </ProtectedRoute>
  );
};

export default AdvancedReportingPage;