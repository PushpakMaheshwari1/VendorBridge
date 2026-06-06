import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LoginPage from '@/features/auth/LoginPage';
import RegisterPage from '@/features/auth/RegisterPage';
import DashboardPage from '@/features/dashboard/DashboardPage';
import VendorListPage from '@/features/vendors/VendorListPage';
import UserListPage from '@/features/users/UserListPage';
import RfqListPage from '@/features/rfqs/RfqListPage';
import BidComparisonPage from '@/features/quotations/BidComparisonPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/vendors" element={<VendorListPage />} />
          <Route path="/categories" element={<div>Categories Page</div>} />
          <Route path="/rfqs" element={<RfqListPage />} />
          <Route path="/comparison/:rfqId" element={<BidComparisonPage />} />
          <Route path="/quotations" element={<div>Quotations Page</div>} />
          <Route path="/approvals" element={<div>Approvals Page</div>} />
          <Route path="/users" element={<UserListPage />} />
          <Route path="/settings" element={<div>Settings Page</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
