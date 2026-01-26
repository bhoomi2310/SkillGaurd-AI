import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const role = new URLSearchParams(location.search).get('role') || 'student';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login(formData.email, formData.password);
      toast.success('Login successful!');
      if (response.onboardingCompleted) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load Google Identity Services
    if (import.meta.env.VITE_GOOGLE_CLIENT_ID && !window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleCallback,
          });

          // Render button
          const buttonDiv = document.getElementById('google-signin-button');
          if (buttonDiv && window.google.accounts.id) {
            window.google.accounts.id.renderButton(buttonDiv, {
              theme: 'outline',
              size: 'large',
              width: '100%',
              text: 'signin_with',
            });
          }
        }
      };
    }
  }, []);

  const handleGoogleCallback = async (response) => {
    setGoogleLoading(true);
    try {
      const result = await googleLogin(response.credential, role);
      toast.success('Login successful!');
      if (result.onboardingCompleted) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google login failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  const demoCredentials = [
    { role: 'Student', email: 'student@demo.com', password: 'demo123' },
    { role: 'Provider', email: 'provider@demo.com', password: 'demo123' },
    { role: 'Recruiter', email: 'recruiter@demo.com', password: 'demo123' },
  ];

  const fillDemoCredentials = (email, password) => {
    setFormData({ email, password });
    toast.success('Demo credentials filled!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Logo className="w-16 h-16" />
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-dark-text-secondary">
            Sign in to continue to WorkMark
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="bg-dark-surface/60 backdrop-blur-sm border border-dark-border rounded-xl p-4">
          <div className="text-xs font-semibold text-primary-400 mb-3 uppercase tracking-wide">
            🚀 Quick Demo Login
          </div>
          <div className="space-y-2">
            {demoCredentials.map((demo, index) => (
              <button
                key={index}
                onClick={() => fillDemoCredentials(demo.email, demo.password)}
                className="w-full text-left px-3 py-2 bg-dark-bg/50 hover:bg-dark-bg border border-dark-border hover:border-primary-500/50 rounded-lg transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-white group-hover:text-primary-400 transition-colors">
                      {demo.role}
                    </div>
                    <div className="text-xs text-dark-text-secondary font-mono">
                      {demo.email}
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-dark-text-secondary group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-text-secondary mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3 bg-dark-surface border border-dark-border placeholder-dark-text-secondary text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent sm:text-sm"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-text-secondary mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 bg-dark-surface border border-dark-border placeholder-dark-text-secondary text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent sm:text-sm"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-dark-bg text-dark-text-secondary">Or continue with</span>
            </div>
          </div>

          <div>
            {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
              <div id="google-signin-button" className="w-full"></div>
            ) : (
              <p className="text-xs text-dark-text-secondary text-center">
                Google Sign-In not configured. Set VITE_GOOGLE_CLIENT_ID in .env
              </p>
            )}
          </div>

          <div className="text-center">
            <Link
              to="/register"
              className="text-primary-400 hover:text-primary-300 text-sm"
            >
              Don't have an account? Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
