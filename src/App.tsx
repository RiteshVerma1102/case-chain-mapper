import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { CaseProvider } from "@/context/CaseContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";

// CaseChain Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Cases from "./pages/Cases";
import CaseDetail from "./pages/CaseDetail";
import Investigations from "./pages/Investigations";
import Entities from "./pages/Entities";
import CaseNetwork from "./pages/CaseNetwork";
import Timeline from "./pages/Timeline";
import Evidence from "./pages/Evidence";
import Alerts from "./pages/Alerts";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner position="top-right" richColors />
      <AuthProvider>
        <CaseProvider>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected CaseChain Platform */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="cases" element={<Cases />} />
              <Route path="cases/:id" element={<CaseDetail />} />
              <Route path="investigations" element={<Investigations />} />
              <Route path="entities" element={<Entities />} />
              <Route path="network" element={<CaseNetwork />} />
              <Route path="timeline" element={<Timeline />} />
              <Route path="evidence" element={<Evidence />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />

              {/* Legacy ProSched route redirects */}
              <Route path="orders" element={<Navigate to="/cases" replace />} />
              <Route path="machines" element={<Navigate to="/network" replace />} />
              <Route path="workers" element={<Navigate to="/entities" replace />} />
              <Route path="schedule" element={<Navigate to="/timeline" replace />} />
            </Route>

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CaseProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
