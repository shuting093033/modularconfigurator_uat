import { ComponentLibrary } from "@/components/ComponentLibrary";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const ComponentLibraryPage = () => {
  return (
    <ProtectedRoute>
      <ComponentLibrary />
    </ProtectedRoute>
  );
};

export default ComponentLibraryPage;