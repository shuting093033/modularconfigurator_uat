import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Estimates from "./pages/Estimates";

import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AssemblyBuilder from "./pages/AssemblyBuilder";
import ComponentLibrary from "./pages/ComponentLibrary";
import DataCenterBuilder from "./pages/DataCenterBuilder";
import AIEstimateBuilder from "./pages/AIEstimateBuilder";
import ExecutiveDashboardPage from "./pages/ExecutiveDashboard";
import AdvancedReportingPage from "./pages/AdvancedReporting";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={
              <Layout>
                <Dashboard />
              </Layout>
            } />
            <Route path="/analytics" element={
              <Layout>
                <Analytics />
              </Layout>
            } />
            <Route path="/estimates" element={
              <Layout>
                <Estimates />
              </Layout>
            } />
            <Route path="/assembly-builder" element={
              <Layout>
                <AssemblyBuilder />
              </Layout>
            } />
            <Route path="/component-library" element={
              <Layout>
                <ComponentLibrary />
              </Layout>
            } />
            <Route path="/datacenter-builder" element={
              <Layout>
                <DataCenterBuilder />
              </Layout>
            } />
            <Route path="/ai-estimate-builder" element={
              <Layout>
                <AIEstimateBuilder />
              </Layout>
            } />
            <Route path="/executive-dashboard" element={
              <Layout>
                <ExecutiveDashboardPage />
              </Layout>
            } />
            <Route path="/advanced-reporting" element={
              <Layout>
                <AdvancedReportingPage />
              </Layout>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
