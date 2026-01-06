import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TaskMarketplace from './pages/TaskMarketplace';
import TaskDetail from './pages/TaskDetail';
import SubmissionForm from './pages/SubmissionForm';
import ProviderDashboard from './pages/ProviderDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import RecruiterSearch from './pages/RecruiterSearch';
import StudentProfile from './pages/StudentProfile';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Student Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <StudentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <TaskMarketplace />
              </PrivateRoute>
            }
          />
          <Route
            path="/tasks/:id"
            element={
              <PrivateRoute>
                <TaskDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/tasks/:id/submit"
            element={
              <PrivateRoute>
                <SubmissionForm />
              </PrivateRoute>
            }
          />

          {/* Provider Routes */}
          <Route
            path="/provider/dashboard"
            element={
              <PrivateRoute allowedRoles={['provider']}>
                <ProviderDashboard />
              </PrivateRoute>
            }
          />

          {/* Recruiter Routes */}
          <Route
            path="/recruiter/dashboard"
            element={
              <PrivateRoute allowedRoles={['recruiter']}>
                <RecruiterDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/recruiter/search"
            element={
              <PrivateRoute allowedRoles={['recruiter']}>
                <RecruiterSearch />
              </PrivateRoute>
            }
          />
          <Route
            path="/recruiter/student/:id"
            element={
              <PrivateRoute allowedRoles={['recruiter']}>
                <StudentProfile />
              </PrivateRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  );
}

export default App;

