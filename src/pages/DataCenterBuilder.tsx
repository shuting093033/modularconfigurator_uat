import { DataCenterEstimateBuilder } from "@/components/DataCenterEstimateBuilder";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const DataCenterBuilder = () => {
  return (
    <ProtectedRoute>
      <DataCenterEstimateBuilder />
    </ProtectedRoute>
  );
};

export default DataCenterBuilder;