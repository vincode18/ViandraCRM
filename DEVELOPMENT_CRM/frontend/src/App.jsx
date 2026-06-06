import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ConsolePage from './pages/ConsolePage';
import CasesPage from './pages/CasesPage';
import CaseDetailPage from './pages/CaseDetailPage';
import NewCasePage from './pages/NewCasePage';
import WorkOrdersPage from './pages/WorkOrdersPage';
import WorkOrderDetailPage from './pages/WorkOrderDetailPage';
import ServiceAppointmentsPage from './pages/ServiceAppointmentsPage';
import ServiceAppointmentDetailPage from './pages/ServiceAppointmentDetailPage';
import FieldServicePage from './pages/FieldServicePage';
import ServiceAreaPage from './pages/ServiceAreaPage';
import PlantDetailPage from './pages/PlantDetailPage';
import WorkCenterDetailPage from './pages/WorkCenterDetailPage';
import ServiceTerritoryDetailPage from './pages/ServiceTerritoryDetailPage';
import ShiftsPage from './pages/ShiftsPage';
import ShiftDetailPage from './pages/ShiftDetailPage';
import AssetsPage from './pages/AssetsPage';
import AssetDetailPage from './pages/AssetDetailPage';
import AssetHierarchyPage from './pages/AssetHierarchyPage';
import AppLayout from './components/layout/AppLayout';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />

          <Route
            path="/register"
            element={
              <GuestRoute>
                <RegisterPage />
              </GuestRoute>
            }
          />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard"   element={<ConsolePage />} />
            <Route path="/cases"       element={<CasesPage />} />
            <Route path="/cases/new"   element={<NewCasePage />} />
            <Route path="/cases/:id"   element={<CaseDetailPage />} />
            <Route path="/workorders"  element={<WorkOrdersPage />} />
            <Route path="/workorders/:id" element={<WorkOrderDetailPage />} />
            <Route path="/serviceappointments"     element={<ServiceAppointmentsPage />} />
            <Route path="/serviceappointments/:id" element={<ServiceAppointmentDetailPage />} />
            <Route path="/fieldservice"            element={<FieldServicePage />} />

            {/* Service Area module (Plant · Work Center · Service Territory) */}
            <Route path="/plants"          element={<ServiceAreaPage />} />
            <Route path="/plants/:id"      element={<PlantDetailPage />} />
            <Route path="/workcenters"     element={<ServiceAreaPage />} />
            <Route path="/workcenters/:id" element={<WorkCenterDetailPage />} />
            <Route path="/territories"     element={<ServiceAreaPage />} />
            <Route path="/territories/:id" element={<ServiceTerritoryDetailPage />} />

            {/* Shift Management module */}
            <Route path="/shifts"          element={<ShiftsPage />} />
            <Route path="/shifts/:id"      element={<ShiftDetailPage />} />

            {/* Asset Management module (Unit / Fleet) */}
            <Route path="/assets"                element={<AssetsPage />} />
            <Route path="/assets/:id"            element={<AssetDetailPage />} />
            <Route path="/assets/:id/hierarchy"  element={<AssetHierarchyPage />} />

            <Route path="*"            element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
}
