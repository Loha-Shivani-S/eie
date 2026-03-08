import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/lib/authContext";
import { AttendanceProvider } from "@/lib/attendanceContext";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import AttendancePage from "./pages/AttendancePage";
import FaceCapturePage from "./pages/FaceCapturePage";
import AbsenteesPage from "./pages/AbsenteesPage";
import LoginPage from "./pages/LoginPage";
import ManageVolunteersPage from "./pages/ManageVolunteersPage";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-3">
          <h1 className="text-xl font-bold text-destructive font-display">Access Denied</h1>
          <p className="text-sm text-muted-foreground">You are not authorized to access this system.</p>
          <p className="text-xs text-muted-foreground">Contact the admin for access.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AttendanceProvider>
              <Navbar />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/capture-faces" element={<FaceCapturePage />} />
                <Route path="/participants" element={<AttendancePage type="participants" />} />
                <Route path="/participants/absentees" element={<AbsenteesPage type="participants" />} />
                <Route path="/volunteers" element={<AttendancePage type="volunteers" />} />
                <Route path="/volunteers/absentees" element={<AbsenteesPage type="volunteers" />} />
                <Route path="/manage-volunteers" element={<ManageVolunteersPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AttendanceProvider>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
