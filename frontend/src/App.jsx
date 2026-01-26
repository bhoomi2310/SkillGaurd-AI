import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import StudentDashboard from './pages/StudentDashboard';
import TaskMarketplace from './pages/TaskMarketplace';
import TaskDetail from './pages/TaskDetail';
import SubmissionForm from './pages/SubmissionForm';
import ProviderDashboard from './pages/ProviderDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import RecruiterSearch from './pages/RecruiterSearch';
import StudentProfile from './pages/StudentProfile';
import JobPosting from './pages/JobPosting';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-dark-bg">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Onboarding */}
          <Route
            path="/onboarding"
            element={
              <PrivateRoute requireOnboarding={false}>
                <Onboarding />
              </PrivateRoute>
            }
          />
          
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
          <Route
            path="/recruiter/jobs/new"
            element={
              <PrivateRoute allowedRoles={['recruiter']}>
                <JobPosting />
              </PrivateRoute>
            }
          />

        </Routes>
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  );
}

export default App;

