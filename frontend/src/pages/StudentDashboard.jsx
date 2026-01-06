import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { submissionService, authService } from '../services/api';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [submissionsData, userProfile] = await Promise.all([
        submissionService.getMySubmissions(),
        authService.getMe(),
      ]);
      setSubmissions(submissionsData);
      setUserData(userProfile);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Process skill data for charts
  const skillData = {};
  if (userData?.verifiedSkills) {
    userData.verifiedSkills.forEach((vs) => {
      if (!skillData[vs.skill]) {
        skillData[vs.skill] = [];
      }
      skillData[vs.skill].push({
        date: new Date(vs.verifiedAt).toLocaleDateString(),
        score: vs.score,
      });
    });
  }

  const skillBreakdown = Object.entries(skillData).map(([skill, data]) => ({
    skill,
    averageScore:
      data.reduce((sum, d) => sum + d.score, 0) / data.length,
    highestScore: Math.max(...data.map((d) => d.score)),
    count: data.length,
  }));

  const completedTasks = submissions.filter(
    (s) => s.status === 'evaluated'
  ).length;
  const pendingTasks = submissions.filter((s) => s.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Welcome, {user?.name}!
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Completed Tasks</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">
            {completedTasks}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Pending Tasks</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {pendingTasks}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Verified Skills</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {skillBreakdown.length}
          </p>
        </div>
      </div>

      {/* Skill Breakdown Chart */}
      {skillBreakdown.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Skill Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skill" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="averageScore" fill="#3b82f6" name="Average Score" />
              <Bar dataKey="highestScore" fill="#10b981" name="Highest Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Skill Progress Over Time */}
      {Object.keys(skillData).length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Skill Progress Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              {Object.entries(skillData).map(([skill, data], idx) => (
                <Line
                  key={skill}
                  type="monotone"
                  dataKey="score"
                  data={data}
                  name={skill}
                  stroke={`hsl(${idx * 60}, 70%, 50%)`}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Verified Skill Badges */}
      {skillBreakdown.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Verified Skill Badges
          </h2>
          <div className="flex flex-wrap gap-4">
            {skillBreakdown.map((skill) => (
              <div
                key={skill.skill}
                className="bg-primary-50 border-2 border-primary-200 rounded-lg px-4 py-2"
              >
                <div className="font-semibold text-primary-900">
                  {skill.skill}
                </div>
                <div className="text-sm text-primary-700">
                  Score: {Math.round(skill.averageScore)}/100
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Submissions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Recent Submissions
        </h2>
        <div className="space-y-4">
          {submissions.length === 0 ? (
            <p className="text-gray-500">No submissions yet.</p>
          ) : (
            submissions.slice(0, 5).map((submission) => (
              <div
                key={submission._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {submission.taskId?.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                    </p>
                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                        submission.status === 'evaluated'
                          ? 'bg-green-100 text-green-800'
                          : submission.status === 'evaluating'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {submission.status}
                    </span>
                  </div>
                  {submission.evaluationResult && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600">
                        {submission.evaluationResult.overallScore}
                      </div>
                      <div className="text-xs text-gray-500">Score</div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        {submissions.length > 5 && (
          <Link
            to="/tasks"
            className="block mt-4 text-center text-primary-600 hover:text-primary-700"
          >
            View all submissions →
          </Link>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;

