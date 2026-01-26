import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(-1);
  const navRef = useRef(null);
  const blobRef = useRef(null);

  useEffect(() => {
    // Set active index based on current route
    const path = location.pathname;
    if (path.includes('/dashboard')) setActiveIndex(0);
    else if (path.includes('/tasks')) setActiveIndex(1);
    else if (path.includes('/recruiter')) setActiveIndex(2);
    else setActiveIndex(-1);
  }, [location]);

  useEffect(() => {
    const blob = blobRef.current;
    const nav = navRef.current;
    if (!blob || !nav) return;

    const handleMouseMove = (e) => {
      const rect = nav.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      blob.style.left = `${x}px`;
      blob.style.top = `${y}px`;
      blob.style.transform = 'translate(-50%, -50%) scale(1)';
    };

    const handleMouseLeave = () => {
      blob.style.transform = 'translate(-50%, -50%) scale(0.8)';
      blob.style.opacity = '0.3';
    };

    const handleMouseEnter = () => {
      blob.style.opacity = '1';
    };

    nav.addEventListener('mousemove', handleMouseMove);
    nav.addEventListener('mouseleave', handleMouseLeave);
    nav.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      nav.removeEventListener('mousemove', handleMouseMove);
      nav.removeEventListener('mouseleave', handleMouseLeave);
      nav.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavItems = () => {
    if (!user) return [];
    
    if (user.role === 'student') {
      return [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/tasks', label: 'Marketplace' },
      ];
    } else if (user.role === 'provider') {
      return [
        { to: '/provider/dashboard', label: 'Dashboard' },
      ];
    } else if (user.role === 'recruiter') {
      return [
        { to: '/recruiter/dashboard', label: 'Dashboard' },
        { to: '/recruiter/search', label: 'Search' },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-4">
      <div className="relative bg-dark-surface/80 backdrop-blur-xl border border-dark-border/50 rounded-2xl p-2 shadow-2xl" ref={navRef}>
        {/* Gooey blob effect */}
        <div
          ref={blobRef}
          className="absolute w-32 h-16 bg-primary-500/40 rounded-full blur-3xl transition-all duration-500 pointer-events-none"
          style={{ 
            transform: 'translate(-50%, -50%) scale(0.8)',
            opacity: 0.3,
            left: '50%',
            top: '50%'
          }}
        />

        <div className="relative flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group z-10">
            <Logo className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-xl font-bold text-white">WorkMark</span>
          </Link>

          {/* Navigation Items */}
          {user && navItems.length > 0 && (
            <div className="flex items-center space-x-2">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.to || 
                  (item.to === '/dashboard' && location.pathname.startsWith('/dashboard'));
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(-1)}
                    className={`relative px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 z-10 ${
                      isActive
                        ? 'text-white bg-primary-500/20'
                        : 'text-dark-text-secondary hover:text-white'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <div className="absolute inset-0 bg-primary-500/10 rounded-xl blur-sm" />
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-3 z-10">
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-dark-text-secondary">
                  <span className="text-sm font-medium">{user.name?.split(' ')[0] || 'User'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-dark-text-secondary hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all duration-300"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
