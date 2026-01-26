import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

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
          const buttonDiv = document.getElementById('google-signup-button');
          if (buttonDiv && window.google.accounts.id) {
            window.google.accounts.id.renderButton(buttonDiv, {
              theme: 'outline',
              size: 'large',
              width: '100%',
              text: 'signup_with',
            });
          }
        }
      };
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      toast.success('Registration successful!');
      navigate('/onboarding');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCallback = async (response) => {
    setGoogleLoading(true);
    try {
      const result = await googleLogin(response.credential, formData.role);
      toast.success('Registration successful!');
      navigate('/onboarding');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google sign up failed');
    } finally {
      setGoogleLoading(false);
    }
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
            Create your account
          </h2>
          <p className="text-dark-text-secondary">
            Join WorkMark and start proving your skills
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-dark-text-secondary mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-3 bg-dark-surface border border-dark-border placeholder-dark-text-secondary text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent sm:text-sm"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-text-secondary mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 bg-dark-surface border border-dark-border placeholder-dark-text-secondary text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent sm:text-sm"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-dark-text-secondary mb-2">
                Role
              </label>
              <select
                id="role"
                name="role"
                className="w-full px-4 py-3 bg-dark-surface border border-dark-border text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent sm:text-sm"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="student">Student</option>
                <option value="provider">Provider (Company/NGO)</option>
                <option value="recruiter">Recruiter</option>
              </select>
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
                minLength={6}
                className="w-full px-4 py-3 bg-dark-surface border border-dark-border placeholder-dark-text-secondary text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent sm:text-sm"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-text-secondary mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="w-full px-4 py-3 bg-dark-surface border border-dark-border placeholder-dark-text-secondary text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent sm:text-sm"
                value={formData.confirmPassword}
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
              {loading ? 'Creating account...' : 'Register'}
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
              <div id="google-signup-button" className="w-full"></div>
            ) : (
              <p className="text-xs text-dark-text-secondary text-center">
                Google Sign-In not configured. Set VITE_GOOGLE_CLIENT_ID in .env
              </p>
            )}
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="text-primary-400 hover:text-primary-300 text-sm"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
