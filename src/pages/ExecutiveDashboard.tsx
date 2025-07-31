import { ExecutiveDashboard } from "@/components/ExecutiveDashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const ExecutiveDashboardPage = () => {
  return (
    <ProtectedRoute>
      <ExecutiveDashboard />
    </ProtectedRoute>
  );
};

export default ExecutiveDashboardPage;