import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recruiterService } from '../services/api';
import toast from 'react-hot-toast';

const RecruiterSearch = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    skills: '',
    minScore: '',
    institution: '',
    year: '',
  });

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await recruiterService.searchStudents(filters);
      setStudents(data);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Search Students</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g., JavaScript, Python"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              value={filters.skills}
              onChange={(e) => handleFilterChange('skills', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Score
            </label>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="0-100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              value={filters.minScore}
              onChange={(e) => handleFilterChange('minScore', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Institution
            </label>
            <input
              type="text"
              placeholder="Filter by institution..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              value={filters.institution}
              onChange={(e) => handleFilterChange('institution', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            <input
              type="text"
              placeholder="e.g., 2024, Senior"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Students List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 text-lg">No students found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {students.map((student) => (
            <div
              key={student._id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {student.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{student.email}</p>
                  {student.profile && (
                    <div className="text-sm text-gray-500 mb-4">
                      {student.profile.institution && (
                        <span>Institution: {student.profile.institution}</span>
                      )}
                      {student.profile.year && (
                        <span className="ml-4">Year: {student.profile.year}</span>
                      )}
                    </div>
                  )}
                  {student.verifiedSkills && student.verifiedSkills.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Verified Skills:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {student.verifiedSkills.slice(0, 5).map((vs, idx) => (
                          <span
                            key={idx}
                            className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
                          >
                            {vs.skill}: {vs.score}/100
                          </span>
                        ))}
                        {student.verifiedSkills.length > 5 && (
                          <span className="text-gray-500 text-sm">
                            +{student.verifiedSkills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <Link
                    to={`/recruiter/student/${student._id}`}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md font-medium inline-block"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterSearch;

