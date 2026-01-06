import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { recruiterService } from '../services/api';
import toast from 'react-hot-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const StudentProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const data = await recruiterService.getStudentProfile(id);
      setProfile(data);
    } catch (error) {
      toast.error('Failed to load student profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSummary = async () => {
    try {
      await recruiterService.getStudentSummary(id);
      toast.success('Summary downloaded');
    } catch (error) {
      toast.error('Failed to download summary');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-gray-500">Student profile not found.</p>
      </div>
    );
  }

  const skillChartData = profile.skillStatistics.map((stat) => ({
    skill: stat.skill,
    averageScore: Math.round(stat.averageScore),
    verificationCount: stat.verificationCount,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {profile.student.name}'s Profile
        </h1>
        <button
          onClick={handleDownloadSummary}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md font-medium"
        >
          Download Summary (JSON)
        </button>
      </div>

      {/* Student Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Student Information
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-500">Name:</span>
            <p className="font-medium">{profile.student.name}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Email:</span>
            <p className="font-medium">{profile.student.email}</p>
          </div>
          {profile.student.profile?.institution && (
            <div>
              <span className="text-sm text-gray-500">Institution:</span>
              <p className="font-medium">{profile.student.profile.institution}</p>
            </div>
          )}
          {profile.student.profile?.year && (
            <div>
              <span className="text-sm text-gray-500">Year:</span>
              <p className="font-medium">{profile.student.profile.year}</p>
            </div>
          )}
        </div>
      </div>

      {/* Skill Statistics */}
      {skillChartData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Skill Statistics
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skill" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="averageScore" fill="#3b82f6" name="Average Score" />
              <Bar
                dataKey="verificationCount"
                fill="#10b981"
                name="Verifications"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Verifications */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Skill Verifications
        </h2>
        <div className="space-y-4">
          {profile.verifications.length === 0 ? (
            <p className="text-gray-500">No verifications yet.</p>
          ) : (
            profile.verifications.map((verification) => (
              <div
                key={verification._id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {verification.taskId?.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Verified: {new Date(verification.verifiedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">
                      {verification.overallScore}
                    </div>
                    <div className="text-xs text-gray-500">Overall Score</div>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    Skill Breakdown:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(verification.skillBreakdown).map(
                      ([skill, score]) => (
                        <span
                          key={skill}
                          className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs"
                        >
                          {skill}: {score}/100
                        </span>
                      )
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Strengths:
                    </div>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {verification.strengths.map((strength, idx) => (
                        <li key={idx}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Weaknesses:
                    </div>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {verification.weaknesses.map((weakness, idx) => (
                        <li key={idx}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    Resume Bullet:
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    {verification.resumeBullet}
                  </p>
                </div>
                <div className="mt-2">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      verification.plagiarismRisk === 'low'
                        ? 'bg-green-100 text-green-800'
                        : verification.plagiarismRisk === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    Plagiarism Risk: {verification.plagiarismRisk}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;

