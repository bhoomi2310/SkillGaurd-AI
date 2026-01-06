import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { taskService } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const TaskDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const data = await taskService.getTask(id);
      setTask(data);
    } catch (error) {
      toast.error('Failed to load task');
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

  if (!task) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-gray-500">Task not found.</p>
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/tasks"
        className="text-primary-600 hover:text-primary-700 mb-4 inline-block"
      >
        ← Back to Tasks
      </Link>

      <div className="bg-white rounded-lg shadow p-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
              task.difficulty
            )}`}
          >
            {task.difficulty}
          </span>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Description
          </h2>
          <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Required Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {task.requiredSkills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Instructions
          </h2>
          <p className="text-gray-700 whitespace-pre-wrap">
            {task.instructions}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Evaluation Criteria
          </h2>
          <p className="text-gray-700 whitespace-pre-wrap">
            {task.evaluationCriteria}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <span className="text-sm text-gray-500">Deadline:</span>
            <p className="font-medium">
              {new Date(task.deadline).toLocaleDateString()}
            </p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Provider:</span>
            <p className="font-medium">
              {task.providerId?.name || task.providerId?.profile?.company}
            </p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Status:</span>
            <p className="font-medium capitalize">{task.status}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Submissions:</span>
            <p className="font-medium">
              {task.currentSubmissions}
              {task.maxSubmissions ? ` / ${task.maxSubmissions}` : ''}
            </p>
          </div>
        </div>

        {user?.role === 'student' && task.status === 'active' && (
          <Link
            to={`/tasks/${id}/submit`}
            className="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md font-medium transition"
          >
            Submit Solution
          </Link>
        )}
      </div>
    </div>
  );
};

export default TaskDetail;

