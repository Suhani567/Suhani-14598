import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AdminLogin from './components/AdminLogin';
import Dashboard from './components/Dashboard';
import FormManager from './components/FormManager';
import FormBuilder from './components/FormBuilder';
import FormFiller from './components/FormFiller';
import DataViewer from './components/DataViewer';
import Analytics from './components/Analytics';
import Customize from './components/Customize';
import { Toaster } from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  const location = useLocation();
  return token ? children : <Navigate to="/admin/login" state={{ from: location }} replace />;
};

const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/login" replace />} />
      {/* Public */}
      <Route path="/forms/:id" element={<FormFiller />} />
      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/forms" element={<ProtectedRoute><FormManager /></ProtectedRoute>} />
      <Route path="/admin/forms/new" element={<ProtectedRoute><FormBuilder /></ProtectedRoute>} />
      <Route path="/admin/forms/:id/edit" element={<ProtectedRoute><FormBuilder isEdit /></ProtectedRoute>} />
      <Route path="/admin/data/:formId" element={<ProtectedRoute><DataViewer /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/admin/customize" element={<ProtectedRoute><Customize /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};


const App = () => (
  <AuthProvider>
    <AppContent />
    <Toaster position="top-right" />
  </AuthProvider>
);

export default App;
