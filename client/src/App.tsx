import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Companies } from './pages/Companies';
import { Employees } from './pages/Employees';
import { Projects } from './pages/Projects';
import { Tasks } from './pages/Tasks';
import { Knowledge } from './pages/Knowledge';
import { RevenuePage } from './pages/Revenue';
import { Analytics } from './pages/Analytics';
import { AICOO } from './pages/AICOO';
import { Billing } from './pages/Billing';
import { Operations } from './pages/Operations';
import { SecurityAudit } from './pages/SecurityAudit';

import { useAuth } from './context/AuthContext';

const RoleBasedRedirect: React.FC = () => {
  const { user } = useAuth();
  if (user?.role === 'Super Admin') return <Navigate to="/companies" replace />;
  return <Navigate to="/dashboard" replace />;
};

const AppLayout: React.FC = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="page-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Application Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<RoleBasedRedirect />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/ai-coo" element={<AICOO />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/operations" element={<Operations />} />
              <Route path="/knowledge" element={<Knowledge />} />
              <Route path="/revenue" element={<RevenuePage />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/security-audit" element={<SecurityAudit />} />
              <Route path="*" element={<RoleBasedRedirect />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
