import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardHome from './pages/dashboard/DashboardHome';
import UniversitiesPage from './pages/dashboard/UniversitiesPage';
import UniversityDetailPage from './pages/dashboard/UniversityDetailPage';
import CourseDetailPage from './pages/dashboard/CourseDetailPage';
import ScholarshipsPage from './pages/dashboard/ScholarshipsPage';
import ApplicationTrackerPage from './pages/dashboard/ApplicationTrackerPage';
import DocumentChecklistPage from './pages/dashboard/DocumentChecklistPage';
import MyAccountPage from './pages/dashboard/MyAccountPage';
import UpgradePage from './pages/dashboard/UpgradePage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentCancelPage from './pages/PaymentCancelPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminUniversitiesPage from './pages/admin/AdminUniversitiesPage';
import AdminCoursesPage from './pages/admin/AdminCoursesPage';
import AdminScholarshipsPage from './pages/admin/AdminScholarshipsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
});

function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">🚧</div>
      <h2 className="text-2xl font-bold text-brand-text mb-2">{title}</h2>
      <p className="text-gray-500">This feature is coming in a future phase.</p>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="universities" element={<UniversitiesPage />} />
              <Route path="universities/:id" element={<UniversityDetailPage />} />
              <Route path="universities/:id/courses/:courseId" element={<CourseDetailPage />} />
              <Route path="tracker" element={<ApplicationTrackerPage />} />
              <Route path="documents" element={<DocumentChecklistPage />} />
              <Route path="scholarships" element={<ScholarshipsPage />} />
              <Route path="account" element={<MyAccountPage />} />
              <Route path="upgrade" element={<UpgradePage />} />
            </Route>

            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/payment/cancel"  element={<PaymentCancelPage />} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="universities" element={<AdminUniversitiesPage />} />
              <Route path="courses" element={<AdminCoursesPage />} />
              <Route path="scholarships" element={<AdminScholarshipsPage />} />
              <Route path="users" element={<AdminUsersPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
