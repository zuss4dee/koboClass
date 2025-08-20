import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UnregisterSWOnce } from './components/UnregisterSWOnce';
import EnvironmentCheck from './components/EnvironmentCheck';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import HostClassPage from './pages/HostClassPage';
import LiveClassPage from './pages/LiveClassPage';
import CheckoutPage from './pages/CheckoutPage';
import RatingPage from './pages/RatingPage';
import SettingsPage from './pages/SettingsPage';
import HostDashboardPage from './pages/HostDashboardPage';
import CreatorsPage from './pages/CreatorsPage';
import FeaturesPage from './pages/FeaturesPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  return (
    <AuthProvider>
      <UnregisterSWOnce />
      <EnvironmentCheck />
      <Router>
        <div className="min-h-screen bg-white">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={
              <SignupPage />
            } />
            <Route path="/login" element={
              <LoginPage />
            } />
            <Route path="/forgot-password" element={
              <ForgotPasswordPage />
            } />
            <Route path="/reset-password" element={
              <ResetPasswordPage />
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/host-dashboard" element={
              <ProtectedRoute requireHost={true}>
                <HostDashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/host" element={
              <ProtectedRoute requireApprovedHost={true}>
                <HostClassPage />
              </ProtectedRoute>
            } />
            <Route path="/host/edit/:classId" element={
              <ProtectedRoute requireApprovedHost={true}>
                <HostClassPage />
              </ProtectedRoute>
            } />
            <Route path="/class/:classId/live" element={
              <ProtectedRoute>
                <LiveClassPage />
              </ProtectedRoute>
            } />
            <Route path="/class/:classId/checkout" element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            } />
            <Route path="/class/:classId/rating" element={
              <ProtectedRoute>
                <RatingPage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            <Route path="/creators" element={<CreatorsPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;