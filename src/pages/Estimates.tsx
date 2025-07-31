import { EstimatesDashboard } from "@/components/EstimatesDashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const Estimates = () => {
  return (
    <ProtectedRoute>
      <EstimatesDashboard />
    </ProtectedRoute>
  );
};

export default Estimates;