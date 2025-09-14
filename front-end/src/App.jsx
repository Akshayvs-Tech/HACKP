import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import GalleryPage from './pages/GalleryPage';
import AnnotationsPage from './pages/AnnotationsPage';
import SettingsPage from './pages/SettingsPage';
import { ToastContainer } from './components/ui/Toast';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Root route - redirect to register for new users */}
            <Route path="/" element={<Navigate to="/register" replace />} />
            
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="annotations" element={<AnnotationsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            
            {/* Individual protected routes */}
            <Route path="/gallery" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<GalleryPage />} />
            </Route>
            <Route path="/annotations" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<AnnotationsPage />} />
            </Route>
            <Route path="/settings" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<SettingsPage />} />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/register" replace />} />
          </Routes>
        </Router>
        <ToastContainer />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
