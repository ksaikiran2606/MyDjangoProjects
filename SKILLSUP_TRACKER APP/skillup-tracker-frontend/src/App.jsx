import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Loader from './components/Loader';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ActivityList from './pages/ActivityList';
import AddActivity from './pages/AddActivity';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  return !user ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Navbar />
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/activities" 
            element={
              <ProtectedRoute>
                <Navbar />
                <ActivityList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-activity" 
            element={
              <ProtectedRoute>
                <Navbar />
                <AddActivity />
              </ProtectedRoute>
            } 
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          
          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;