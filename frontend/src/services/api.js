import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Unable to connect to server. Please check if the backend is running.'));
    }

    // 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Only redirect if not already on login/register page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }

    // Log error in development
    if (import.meta.env.DEV) {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
    }

    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }).then((res) => res.data),
  register: (userData) =>
    api.post('/auth/register', userData).then((res) => res.data),
  googleAuth: (token, role) =>
    api.post('/auth/google', { token, role }).then((res) => res.data),
  getMe: () => api.get('/auth/me').then((res) => res.data),
  updateProfile: (profile, onboardingCompleted) =>
    api.put('/auth/profile', { profile, onboardingCompleted }).then((res) => res.data),
};

// Task Service
export const taskService = {
  getTasks: (params) =>
    api.get('/tasks', { params }).then((res) => res.data),
  getTask: (id) => api.get(`/tasks/${id}`).then((res) => res.data),
  createTask: (taskData) =>
    api.post('/tasks', taskData).then((res) => res.data),
  updateTask: (id, taskData) =>
    api.put(`/tasks/${id}`, taskData).then((res) => res.data),
  deleteTask: (id) => api.delete(`/tasks/${id}`).then((res) => res.data),
  getMyTasks: () =>
    api.get('/tasks/provider/my-tasks').then((res) => res.data),
};

// Submission Service
export const submissionService = {
  createSubmission: (submissionData) =>
    api.post('/submissions', submissionData).then((res) => res.data),
  getMySubmissions: () =>
    api.get('/submissions/my-submissions').then((res) => res.data),
  getSubmission: (id) =>
    api.get(`/submissions/${id}`).then((res) => res.data),
  getTaskSubmissions: (taskId) =>
    api.get(`/submissions/task/${taskId}`).then((res) => res.data),
};

// Recruiter Service
export const recruiterService = {
  searchStudents: (params) =>
    api.get('/recruiter/search', { params }).then((res) => res.data),
  getStudentProfile: (studentId) =>
    api.get(`/recruiter/student/${studentId}`).then((res) => res.data),
  getVerificationReport: (verificationId) =>
    api
      .get(`/recruiter/verification/${verificationId}`)
      .then((res) => res.data),
  getStudentSummary: (studentId) =>
    api
      .get(`/recruiter/student/${studentId}/summary`, {
        responseType: 'blob',
      })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `student-${studentId}-summary.json`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }),
};

export default api;

