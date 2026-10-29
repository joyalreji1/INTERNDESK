import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { PortalLayout } from '@/components/layout/PortalLayout';

// Public Pages
import { LandingPage } from '@/pages/public/LandingPage';
import { InternshipsPage } from '@/pages/public/InternshipsPage';
import { InternshipDetailPage } from '@/pages/public/InternshipDetailPage';
import { CompaniesPage } from '@/pages/public/CompaniesPage';
import { CompanyDetailPage } from '@/pages/public/CompanyDetailPage';
import { LoginPage } from '@/pages/public/LoginPage';
import { RegisterPage } from '@/pages/public/RegisterPage';
import { ForgotPasswordPage } from '@/pages/public/ForgotPasswordPage';

// Student Portal Pages
import { StudentDashboard } from '@/pages/student/StudentDashboard';
import { StudentProfilePage } from '@/pages/student/StudentProfilePage';
import { StudentInternshipsPage } from '@/pages/student/StudentInternshipsPage';
import { StudentApplicationsPage } from '@/pages/student/StudentApplicationsPage';
import { StudentApplicationDetailPage } from '@/pages/student/StudentApplicationDetailPage';
import { StudentResumePage } from '@/pages/student/StudentResumePage';
import { StudentNotificationsPage } from '@/pages/student/StudentNotificationsPage';
import { StudentSettingsPage } from '@/pages/student/StudentSettingsPage';

// Company Portal Pages
import { CompanyDashboard } from '@/pages/company/CompanyDashboard';
import { CompanyProfilePage } from '@/pages/company/CompanyProfilePage';
import { CompanyInternshipsPage } from '@/pages/company/CompanyInternshipsPage';
import { CreateInternshipPage } from '@/pages/company/CreateInternshipPage';
import { EditInternshipPage } from '@/pages/company/EditInternshipPage';
import { CompanyApplicantsPage } from '@/pages/company/CompanyApplicantsPage';
import { CompanyApplicantDetailPage } from '@/pages/company/CompanyApplicantDetailPage';
import { CompanyAnalyticsPage } from '@/pages/company/CompanyAnalyticsPage';
import { CompanySettingsPage } from '@/pages/company/CompanySettingsPage';

// Admin Portal Pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminStudentsPage } from '@/pages/admin/AdminStudentsPage';
import { AdminCompaniesPage } from '@/pages/admin/AdminCompaniesPage';
import { AdminInternshipsPage } from '@/pages/admin/AdminInternshipsPage';
import { AdminApplicationsPage } from '@/pages/admin/AdminApplicationsPage';
import { AdminReportsPage } from '@/pages/admin/AdminReportsPage';
import { AdminAuditLogsPage } from '@/pages/admin/AdminAuditLogsPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <LandingPage />
          </PublicLayout>
        }
      />
      <Route
        path="/internships"
        element={
          <PublicLayout>
            <InternshipsPage />
          </PublicLayout>
        }
      />
      <Route
        path="/internships/:id"
        element={
          <PublicLayout>
            <InternshipDetailPage />
          </PublicLayout>
        }
      />
      <Route
        path="/companies"
        element={
          <PublicLayout>
            <CompaniesPage />
          </PublicLayout>
        }
      />
      <Route
        path="/companies/:id"
        element={
          <PublicLayout>
            <CompanyDetailPage />
          </PublicLayout>
        }
      />
      <Route
        path="/login"
        element={
          <PublicLayout>
            <LoginPage />
          </PublicLayout>
        }
      />
      <Route
        path="/register"
        element={
          <PublicLayout>
            <RegisterPage />
          </PublicLayout>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicLayout>
            <ForgotPasswordPage />
          </PublicLayout>
        }
      />

      {/* Student Portal Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <PortalLayout>
              <StudentDashboard />
            </PortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <PortalLayout>
              <StudentProfilePage />
            </PortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/internships"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <PortalLayout>
              <StudentInternshipsPage />
            </PortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/applications"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <PortalLayout>
              <StudentApplicationsPage />
            </PortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/applications/:id"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <PortalLayout>
              <StudentApplicationDetailPage />
            </PortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/resume"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <PortalLayout>
              <StudentResumePage />
            </PortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/notifications"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <PortalLayout>
              <StudentNotificationsPage />
            </PortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/settings"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <PortalLayout>
              <StudentSettingsPage />
            </PortalLayout>
          </ProtectedRoute>
        }
      />

      {/* Company Portal Routes */}
      <Route
        path="/company/dashboard"
        element={
          <ProtectedRoute allowedRoles={['COMPANY']}>
            <PortalLayout>
              <CompanyDashboard />
            </PortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/profile"
        element={
          <ProtectedRoute allowedRoles={['COMPANY']}>
            <PortalLayout>
              <CompanyProfilePage />
            </PortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/internships"
        element={
          <ProtectedRoute allowedRoles={['COMPANY']}>
            <PortalLayout>
              <CompanyInternshipsPage />
            </PortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/internships/create"
        element={
          <ProtectedRoute allowedRoles={['COMPANY']}>
            <PortalLayout>
              <CreateInternshipPage />
            </PortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/internships/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['COMPANY']}>
            <PortalLayout>
              <EditInternshipPage />
            </PortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/applicants"
        element={
          <ProtectedRoute allowedRoles={['COMPANY']}>
            <PortalLayout>
              <CompanyApplicantsPage />
            </PortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/applicants/:id"
        element={
          <ProtectedRoute allowedRoles={['COMPANY']}>
            <PortalLayout>
              <CompanyApplicantDetailPage />
            </PortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/analytics"
        element={
          <ProtectedRoute allowedRoles={['COMPANY']}>
            <PortalLayout>
              <CompanyAnalyticsPage />
            </PortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/settings"
        element={
          <ProtectedRoute allowedRoles={['COMPANY']}>
            <PortalLayout>
              <CompanySettingsPage />
            </PortalLayout>
          </ProtectedRoute>
        }
      />

      {/* Administrator Portal Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <PortalLayout>
              <AdminDashboard />
            </PortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <PortalLayout>
              <AdminStudentsPage />
            </PortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/companies"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <PortalLayout>
              <AdminCompaniesPage />
            </PortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/internships"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <PortalLayout>
              <AdminInternshipsPage />
            </PortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/applications"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <PortalLayout>
              <AdminApplicationsPage />
            </PortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <PortalLayout>
              <AdminReportsPage />
            </PortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/audit-logs"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <PortalLayout>
              <AdminAuditLogsPage />
            </PortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <PortalLayout>
              <AdminSettingsPage />
            </PortalLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
export default App;

