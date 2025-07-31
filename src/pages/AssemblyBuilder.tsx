import { AssemblyBuilder } from "@/components/AssemblyBuilder";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const AssemblyBuilderPage = () => {
  return (
    <ProtectedRoute>
      <AssemblyBuilder />
    </ProtectedRoute>
  );
};

export default AssemblyBuilderPage;