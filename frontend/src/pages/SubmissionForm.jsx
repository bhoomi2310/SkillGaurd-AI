import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { submissionService, taskService } from '../services/api';
import toast from 'react-hot-toast';

const SubmissionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submissionType, setSubmissionType] = useState('github');
  const [githubUrl, setGithubUrl] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let submissionData = {
        taskId: id,
        submissionType,
      };

      if (submissionType === 'github') {
        if (!githubUrl) {
          toast.error('Please provide a GitHub URL');
          setLoading(false);
          return;
        }
        submissionData.githubRepo = { url: githubUrl };
      } else {
        if (!file) {
          toast.error('Please select a file');
          setLoading(false);
          return;
        }
        // In a real app, you would upload the file first and get the metadata
        // For now, we'll send basic file info
        submissionData.fileUpload = {
          filename: file.name,
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
          storagePath: 'placeholder', // In production, upload to S3/storage first
        };
      }

      await submissionService.createSubmission(submissionData);
      toast.success('Submission created! Evaluation will begin shortly.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Submit Solution</h1>

      <div className="bg-white rounded-lg shadow p-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Submission Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="github"
                  checked={submissionType === 'github'}
                  onChange={(e) => setSubmissionType(e.target.value)}
                  className="mr-2"
                />
                GitHub Repository
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="file"
                  checked={submissionType === 'file'}
                  onChange={(e) => setSubmissionType(e.target.value)}
                  className="mr-2"
                />
                File Upload
              </label>
            </div>
          </div>

          {submissionType === 'github' ? (
            <div className="mb-6">
              <label
                htmlFor="githubUrl"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                GitHub Repository URL
              </label>
              <input
                id="githubUrl"
                type="url"
                placeholder="https://github.com/username/repo"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Provide the full GitHub repository URL. You can optionally include a branch
                (e.g., /tree/branch-name).
              </p>
            </div>
          ) : (
            <div className="mb-6">
              <label
                htmlFor="file"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Upload File
              </label>
              <input
                id="file"
                type="file"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Upload your project files. Supported formats: ZIP, code files, etc.
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-md font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md font-medium transition disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmissionForm;

