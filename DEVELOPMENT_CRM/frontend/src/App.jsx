import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: 'monospace', background: '#1a1a2e', color: '#ff6b6b', minHeight: '100vh' }}>
          <h2 style={{ color: '#ffd700' }}>⚠ Runtime Error</h2>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 13 }}>{this.state.error?.message}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 11, color: '#aaa', marginTop: 12 }}>{this.state.error?.stack}</pre>
          <button onClick={() => this.setState({ error: null })} style={{ marginTop: 20, padding: '8px 16px', cursor: 'pointer' }}>Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { TabProvider } from './contexts/TabContext';
import { SubtabProvider } from './contexts/SubtabContext';
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
import AccountListPage from './pages/AccountListPage';
import AccountDetailPage from './pages/AccountDetailPage';
import ContactListPage from './pages/ContactListPage';
import ContactDetailPage from './pages/ContactDetailPage';
import TimesheetDetailPage from './pages/TimesheetDetailPage';
import TimesheetApprovalPage from './pages/TimesheetApprovalPage';
import EMRListPage from './pages/EMRListPage';
import EMRDetailPage from './pages/EMRDetailPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import OpportunitiesListPage from './pages/OpportunitiesListPage';
import OpportunityDetailPage from './pages/OpportunityDetailPage';
import QuotesListPage from './pages/QuotesListPage';
import QuoteDetailPage from './pages/QuoteDetailPage';
import QueryConsolePage from './pages/QueryConsolePage';
import QueryInterfacePage from './pages/QueryInterfacePage';
import ApplicationLogPage from './pages/ApplicationLogPage';
import AppBuilderCanvasPage from './pages/AppBuilderCanvasPage';
import FlowsListPage from './pages/FlowsListPage';
import FlowBuilderCanvasPage from './pages/FlowBuilderCanvasPage';
import ReportsListPage from './pages/ReportsListPage';
import ReportBuilderPage from './pages/ReportBuilderPage';
import DeploymentPipelinePage from './pages/DeploymentPipelinePage';
import OutboundChangeSetsPage from './pages/OutboundChangeSetsPage';
import ChangeSetDetailPage from './pages/ChangeSetDetailPage';
import InboundChangeSetsPage from './pages/InboundChangeSetsPage';
import DeploymentHistoryPage from './pages/DeploymentHistoryPage';
import FieldServiceMobilePage from './pages/FieldServiceMobilePage';
import WorkOrderDetailMobile from './pages/WorkOrderDetailMobile';
import TimesheetMobilePage from './pages/TimesheetMobilePage';
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
    <ErrorBoundary>
    <ThemeProvider>
    <AuthProvider>
    <TabProvider>
    <SubtabProvider>
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

            {/* Account module */}
            <Route path="/accounts"              element={<AccountListPage />} />
            <Route path="/accounts/:id"          element={<AccountDetailPage />} />

            {/* Contact module */}
            <Route path="/contacts"              element={<ContactListPage />} />
            <Route path="/contacts/:id"          element={<ContactDetailPage />} />

            {/* Opportunity module */}
            <Route path="/opportunities"         element={<OpportunitiesListPage />} />
            <Route path="/opportunities/:id"     element={<OpportunityDetailPage />} />

            {/* Quote module */}
            <Route path="/quotes"                element={<QuotesListPage />} />
            <Route path="/quotes/:id"            element={<QuoteDetailPage />} />

            {/* Query Console module (PRD-01) */}
            <Route path="/settings/query-console" element={<QueryConsolePage />} />

            {/* Application Log module */}
            <Route path="/settings/application-log" element={<ApplicationLogPage />} />

            {/* App Builder Canvas module */}
            <Route path="/settings/app-builder" element={<AppBuilderCanvasPage />} />

            {/* Deployment Pipeline module */}
            <Route path="/settings/deployment/pipeline" element={<DeploymentPipelinePage />} />
            <Route path="/settings/deployment/outbound" element={<OutboundChangeSetsPage />} />
            <Route path="/settings/deployment/outbound/:changeSetId" element={<ChangeSetDetailPage />} />
            <Route path="/settings/deployment/inbound" element={<InboundChangeSetsPage />} />
            <Route path="/settings/deployment/history" element={<DeploymentHistoryPage />} />

            {/* Flow Builder module */}
            <Route path="/flows" element={<FlowsListPage />} />
            <Route path="/flows/builder/:flowId" element={<FlowBuilderCanvasPage />} />

            {/* Report Builder module */}
            <Route path="/reports" element={<ReportsListPage />} />
            <Route path="/reports/builder/:reportId" element={<ReportBuilderPage />} />

            {/* Query Interface module (PRD-02) */}
            <Route path="/console/query-interface" element={<QueryInterfacePage />} />

            {/* Timesheet module */}
            <Route path="/timesheets/approval"   element={<TimesheetApprovalPage />} />
            <Route path="/timesheets/:id"        element={<TimesheetDetailPage />} />

            {/* EMR module */}
            <Route path="/emr"                   element={<EMRListPage />} />
            <Route path="/emr/:id"               element={<EMRDetailPage />} />

            {/* Admin Settings */}
            <Route path="/settings"              element={<AdminSettingsPage />} />
            <Route path="/admin"                 element={<AdminSettingsPage />} />

            {/* Field Service Mobile PWA */}
            <Route path="/field/today"           element={<FieldServiceMobilePage />} />
            <Route path="/field/jobs"            element={<FieldServiceMobilePage />} />
            <Route path="/field/jobs/:id"        element={<WorkOrderDetailMobile />} />
            <Route path="/field/appointments"    element={<FieldServiceMobilePage />} />
            <Route path="/field/timesheet"       element={<TimesheetMobilePage />} />

            <Route path="*"            element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SubtabProvider>
    </TabProvider>
    </AuthProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
}
