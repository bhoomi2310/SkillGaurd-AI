import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import FloatingLines from '../components/FloatingLines';
import TypewriterText from '../components/TypewriterText';
import { useState, useEffect } from 'react';

const Landing = () => {
  const { user } = useAuth();
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Start animation after component mounts
    const timer = setTimeout(() => setShowText(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { number: '10K+', label: 'Verified Skills' },
    { number: '5K+', label: 'Active Students' },
    { number: '500+', label: 'Companies' },
    { number: '98%', label: 'Success Rate' },
  ];

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'AI-Powered Verification',
      description: 'Advanced AI algorithms powered by Azure OpenAI evaluate your real-world work submissions with precision and fairness. Get comprehensive skill breakdowns, detailed feedback, and verified scores that employers trust. Our deterministic evaluation system ensures consistent and reliable results every time.',
      gradient: 'from-blue-500 to-cyan-500',
      colSpan: 'md:col-span-1',
      rowSpan: 'md:row-span-1',
      pattern: 'dots',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Micro-Internship Marketplace',
      description: 'Access real-world tasks and projects from leading companies and NGOs. Build practical experience while earning verified credentials. Each completed task adds to your professional portfolio and demonstrates your capabilities to potential employers.',
      gradient: 'from-purple-500 to-pink-500',
      colSpan: 'md:col-span-1',
      rowSpan: 'md:row-span-1',
      pattern: 'dots',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Skill Analytics',
      description: 'Track your verified skills with detailed analytics, performance scores, and professional badges. Visualize your growth over time with interactive charts and graphs. Monitor your progress across different skill categories and identify areas for improvement.',
      gradient: 'from-green-500 to-emerald-500',
      colSpan: 'md:col-span-1',
      rowSpan: 'md:row-span-1',
      pattern: 'dots',
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Software Engineering Student',
      content: 'WorkMark helped me verify my React skills and land my dream internship at a top tech company!',
      avatar: 'PS',
    },
    {
      name: 'Arjun Patel',
      role: 'Data Science Graduate',
      content: 'The AI verification process is incredibly thorough. My verified Python skills opened so many doors.',
      avatar: 'AP',
    },
    {
      name: 'Ananya Reddy',
      role: 'Full Stack Developer',
      content: 'I love how WorkMark connects me with real projects. The skill verification is a game-changer!',
      avatar: 'AR',
    },
  ];

  return (
    <div className="min-h-screen bg-dark-bg overflow-hidden relative">
      {/* Floating Lines Background - Must be above dark veils */}
      <div className="fixed inset-0 z-[1]">
        <FloatingLines />
      </div>
      
      {/* Dark Veil Overlay - Very light to show bright lines */}
      <div className="fixed inset-0 bg-gradient-to-b from-dark-bg/40 via-dark-bg/20 to-dark-bg/40 z-[2] pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-r from-dark-bg/20 via-transparent to-dark-bg/20 z-[2] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-32 z-10">
        <div className="max-w-7xl mx-auto text-center relative">
          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight">
            {showText ? (
              <>
                <span className="block text-white">
                  <TypewriterText text="Verify Your" speed={100} />
                </span>
                <span className="block">
                  <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient inline-block">
                    <TypewriterText text="Skills with AI" speed={100} />
                  </span>
                </span>
              </>
            ) : (
              <>
                <span className="block">Verify Your</span>
                <span className="block bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                  Skills with AI
                </span>
              </>
            )}
          </h1>

          <p className="text-xl md:text-2xl text-dark-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed">
            The future of skill verification. Get your abilities validated by advanced AI,
            build your portfolio, and stand out to employers.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            {!user ? (
              <>
                <Link
                  to="/register"
                  className="group relative px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/50"
                >
                  <span className="relative z-10">Get Started Free</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 text-lg font-semibold text-white bg-dark-surface/80 backdrop-blur-sm border-2 border-dark-border rounded-xl hover:border-primary-500 transition-all duration-300 hover:scale-105"
                >
                  Sign In
                </Link>
              </>
            ) : (
              <Link
                to={user.onboardingCompleted ? '/dashboard' : '/onboarding'}
                className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/50"
              >
                Go to Dashboard
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-dark-surface/60 backdrop-blur-sm border border-dark-border/50 rounded-2xl p-6 hover:border-primary-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-sm text-dark-text-secondary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Magic Bento Features Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Everything You Need to
              <span className="block bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                Succeed
              </span>
            </h2>
            <p className="text-xl text-dark-text-secondary max-w-2xl mx-auto">
              Powerful features designed to help you verify, showcase, and advance your skills
            </p>
          </div>

          {/* Magic Bento Grid - Optimized layout to fill space */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(280px,auto)]">
            {features.map((feature, index) => {
              const getPatternStyle = (pattern) => {
                const patterns = {
                  dots: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z'/%3E%3C/g%3E%3C/svg%3E")`,
                  grid: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  lines: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 100 0 L 0 0 0 100' fill='none' stroke='%23ffffff' stroke-width='1' opacity='0.03'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23grid)' /%3E%3C/svg%3E")`,
                  waves: `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,60 Q30,40 60,60 T120,60' stroke='%23ffffff' stroke-width='1' fill='none' opacity='0.03'/%3E%3Cpath d='M0,80 Q30,60 60,80 T120,80' stroke='%23ffffff' stroke-width='1' fill='none' opacity='0.03'/%3E%3C/svg%3E")`,
                  circles: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  diagonal: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M0 38l38-38h2l-40 40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                };
                return patterns[pattern] || patterns.dots;
              };
              
              return (
                <div
                  key={index}
                  className={`group relative ${feature.colSpan} ${feature.rowSpan} bg-gradient-to-br from-dark-surface/80 to-dark-surface/40 backdrop-blur-xl border border-dark-border/50 rounded-2xl p-6 hover:border-primary-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary-500/20 overflow-hidden`}
                  style={{
                    backgroundImage: getPatternStyle(feature.pattern),
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Animated gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  {/* Glow effect */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 w-fit`}>
                      <div className="text-white">{feature.icon}</div>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-dark-text-secondary leading-relaxed text-sm md:text-base">
                      {feature.description}
                    </p>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/5 to-transparent rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/5 to-transparent rounded-full blur-2xl" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-dark-surface/30 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Loved by
              <span className="block bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                Students Worldwide
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-dark-bg/60 backdrop-blur-sm border border-dark-border/50 rounded-2xl p-8 hover:border-primary-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-dark-text-secondary">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-dark-text-secondary leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 rounded-3xl p-12 md:p-16 overflow-hidden">
            {/* Background Pattern */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat'
              }}
            />
            <div className="relative z-10 text-center">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Ready to Transform Your Career?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                Join thousands of students who are already building their verified skill portfolios
              </p>
              {!user && (
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold text-primary-600 bg-white rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl"
                >
                  Start Your Journey Today
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
