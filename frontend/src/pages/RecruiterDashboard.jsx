import { Link } from 'react-router-dom';

const RecruiterDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Recruiter Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/recruiter/search"
          className="bg-white rounded-lg shadow p-8 hover:shadow-lg transition text-center"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Search Students
          </h2>
          <p className="text-gray-600">
            Search and filter students by verified skills, scores, and other criteria
          </p>
        </Link>

        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Quick Stats
          </h2>
          <p className="text-gray-600">
            Dashboard statistics and analytics coming soon...
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;

