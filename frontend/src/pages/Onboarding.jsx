import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

const Onboarding = () => {
  const { user, fetchUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    bio: '',
    skills: [],
    institution: '',
    year: '',
    location: '',
    phone: '',
    website: '',
    linkedin: '',
    github: '',
    portfolio: '',
    experience: '',
    education: '',
    company: '', // For providers/recruiters
  });

  useEffect(() => {
    if (user?.onboardingCompleted) {
      navigate('/dashboard');
    }
    if (user?.profile) {
      setFormData({
        bio: user.profile.bio || '',
        skills: user.profile.skills || [],
        institution: user.profile.institution || '',
        year: user.profile.year || '',
        location: user.profile.location || '',
        phone: user.profile.phone || '',
        website: user.profile.website || '',
        linkedin: user.profile.linkedin || '',
        github: user.profile.github || '',
        portfolio: user.profile.portfolio || '',
        experience: user.profile.experience || '',
        education: user.profile.education || '',
        company: user.profile.company || '',
      });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSkillsChange = (e) => {
    const skillsString = e.target.value;
    const skillsArray = skillsString.split(',').map(s => s.trim()).filter(s => s);
    setFormData({ ...formData, skills: skillsArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.updateProfile(formData, true);
      await fetchUser();
      toast.success('Profile completed successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStudent = user?.role === 'student';
  const isProvider = user?.role === 'provider';
  const isRecruiter = user?.role === 'recruiter';

  return (
    <div className="min-h-screen bg-dark-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Complete Your Profile</h1>
          <p className="text-dark-text-secondary">Help us get to know you better</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-surface text-dark-text-secondary border border-dark-border'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > s ? 'bg-primary-600' : 'bg-dark-surface'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-dark-text-secondary">
            <span className={step === 1 ? 'text-primary-400' : ''}>Basic Info</span>
            <span className={step === 2 ? 'text-primary-400' : ''}>Profile Details</span>
            <span className={step === 3 ? 'text-primary-400' : ''}>Additional Info</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-dark-surface border border-dark-border rounded-xl p-8">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  rows="4"
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>

              {isStudent && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                      Institution/School
                    </label>
                    <input
                      type="text"
                      name="institution"
                      className="w-full px-4 py-3 bg-dark-bg border border-dark-border text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                      placeholder="Your school or university"
                      value={formData.institution}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                      Year/Grade
                    </label>
                    <input
                      type="text"
                      name="year"
                      className="w-full px-4 py-3 bg-dark-bg border border-dark-border text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                      placeholder="e.g., 3rd Year, Senior, etc."
                      value={formData.year}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {(isProvider || isRecruiter) && (
                <div>
                  <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    name="company"
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="Your company or organization"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {/* Step 2: Skills & Links */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">Skills & Links</h2>
              
              <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="e.g., JavaScript, React, Python, Node.js"
                  value={formData.skills.join(', ')}
                  onChange={handleSkillsChange}
                />
                <p className="mt-2 text-xs text-dark-text-secondary">
                  Current skills: {formData.skills.length > 0 ? formData.skills.join(', ') : 'None'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                  GitHub Profile
                </label>
                <input
                  type="url"
                  name="github"
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="https://github.com/username"
                  value={formData.github}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  name="linkedin"
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.linkedin}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                  Portfolio Website
                </label>
                <input
                  type="url"
                  name="portfolio"
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="https://yourportfolio.com"
                  value={formData.portfolio}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="https://yourwebsite.com"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {/* Step 3: Additional Information */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">Additional Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                  Education
                </label>
                <textarea
                  name="education"
                  rows="3"
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="Your educational background..."
                  value={formData.education}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                  Experience
                </label>
                <textarea
                  name="experience"
                  rows="4"
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="Your work experience, projects, achievements..."
                  value={formData.experience}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-dark-border">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              className="px-6 py-3 bg-dark-bg border border-dark-border text-white rounded-lg hover:bg-dark-border disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition"
              >
                {loading ? 'Saving...' : 'Complete Profile'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
