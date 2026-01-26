# WorkMark - AI-Powered Skill Verification Platform

A production-ready MERN stack application that enables companies/NGOs to post micro-tasks, students to submit real work, and AI-powered skill verification using Azure OpenAI.

## 🎯 Features

- **Multi-Role Authentication**: Students, Providers (Companies/NGOs), and Recruiters
- **Task Marketplace**: Browse and submit to real-world micro-tasks
- **AI Skill Verification**: Azure OpenAI evaluates submissions and generates verified skill scores
- **Student Dashboard**: Track skills, view charts, and see verified badges
- **Recruiter Tools**: Search students by verified skills and download reports
- **GitHub Integration**: Automatic repository metadata fetching
- **Structured AI Evaluation**: Deterministic JSON responses with skill breakdowns

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** authentication
- **Azure OpenAI** (GPT-4/GPT-4o)
- **bcryptjs** for password hashing

### Frontend
- **React 18** with **Vite**
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **React Router** for navigation
- **Axios** for API calls

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Azure OpenAI account with API key and endpoint
- (Optional) GitHub Personal Access Token for enhanced repo metadata

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd SkillGaurd-AI
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/workmark
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/workmark

# Google OAuth (for Google Sign-In)
GOOGLE_CLIENT_ID=your-google-client-id

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Azure OpenAI Configuration
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-azure-openai-api-key
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
AZURE_OPENAI_API_VERSION=2024-02-15-preview

# GitHub API (optional, for enhanced repo metadata)
GITHUB_TOKEN=your-github-token-optional
```

**Getting Azure OpenAI Credentials:**
1. Create an Azure account and set up an Azure OpenAI resource
2. Deploy a model (GPT-4 or GPT-4o) in your Azure OpenAI resource
3. Get your endpoint URL (format: `https://your-resource.openai.azure.com/`)
4. Get your API key from the Azure portal
5. Note your deployment name

**Getting GitHub Token (Optional):**
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with `public_repo` scope
3. Add it to your `.env` file

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory (optional):

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### 4. Start MongoDB

Make sure MongoDB is running:

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud) - no local setup needed
```

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

### 6. Seed Demo Users (Optional)

To create demo accounts for testing:

```bash
cd backend
npm run seed:demo
```

This will create three demo accounts:
- **Student**: `student@demo.com` / `demo123`
- **Provider**: `provider@demo.com` / `demo123`
- **Recruiter**: `recruiter@demo.com` / `demo123`

These credentials are also displayed on the login page for easy access.

## 📁 Project Structure

```
WorkMark/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── taskController.js    # Task CRUD operations
│   │   ├── submissionController.js # Submission handling & AI evaluation
│   │   └── recruiterController.js # Recruiter search & reports
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication & authorization
│   │   └── errorHandler.js      # Error handling middleware
│   ├── models/
│   │   ├── User.js              # User schema (Student/Provider/Recruiter)
│   │   ├── Task.js              # Task schema
│   │   ├── Submission.js        # Submission schema
│   │   └── SkillVerification.js # AI evaluation results schema
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── taskRoutes.js        # Task endpoints
│   │   ├── submissionRoutes.js  # Submission endpoints
│   │   └── recruiterRoutes.js   # Recruiter endpoints
│   ├── services/
│   │   ├── azureOpenAI.js       # Azure OpenAI integration (CORE AI LOGIC)
│   │   └── githubService.js    # GitHub API integration
│   ├── server.js                # Express server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Navigation component
│   │   │   └── PrivateRoute.jsx # Protected route wrapper
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── StudentDashboard.jsx # Skill charts & stats
│   │   │   ├── TaskMarketplace.jsx
│   │   │   ├── TaskDetail.jsx
│   │   │   ├── SubmissionForm.jsx
│   │   │   ├── ProviderDashboard.jsx
│   │   │   ├── RecruiterDashboard.jsx
│   │   │   ├── RecruiterSearch.jsx
│   │   │   └── StudentProfile.jsx
│   │   ├── services/
│   │   │   └── api.js           # API service layer
│   │   ├── App.jsx              # Main app component
│   │   └── main.jsx             # React entry point
│   └── package.json
│
└── README.md
```

## 🔑 Key Features Explained

### AI Skill Verification

The core AI evaluation happens in `backend/services/azureOpenAI.js`. When a student submits:

1. **Submission Processing**: The system extracts submission metadata (GitHub repo info or file details)
2. **Prompt Construction**: A structured prompt is built with:
   - Task details (title, description, required skills, difficulty)
   - Evaluation criteria
   - Submission content/metadata
3. **Azure OpenAI Call**: The prompt is sent to Azure OpenAI with:
   - `temperature: 0.3` for deterministic results
   - `response_format: { type: 'json_object' }` to force JSON output
4. **Response Validation**: The AI response is parsed and validated against the required schema
5. **Database Storage**: Results are saved to `SkillVerification` collection with full audit trail

**AI Response Format:**
```json
{
  "overallScore": 85,
  "skillBreakdown": {
    "JavaScript": 90,
    "React": 85,
    "Node.js": 80
  },
  "strengths": ["Clean code structure", "Good error handling"],
  "weaknesses": ["Missing tests", "Could improve documentation"],
  "resumeBullet": "Developed a full-stack web application using React and Node.js, demonstrating proficiency in modern JavaScript frameworks and RESTful API design.",
  "plagiarismRisk": "low"
}
```

### Authentication Flow

1. User registers with email, password, and role
2. Password is hashed using bcryptjs
3. JWT token is generated and returned
4. Token is stored in localStorage (frontend)
5. All protected routes require valid JWT token
6. Role-based access control enforced via middleware

### Submission Pipeline

1. **Student submits**: GitHub URL or file upload
2. **GitHub processing** (if applicable):
   - URL parsed to extract owner/repo/branch
   - GitHub API fetches metadata (language, stars, README, etc.)
3. **Submission saved** with status: `pending`
4. **Async evaluation triggered**:
   - Status changes to `evaluating`
   - Azure OpenAI service called
   - Results saved to `SkillVerification`
   - Status changes to `evaluated`
   - User's `verifiedSkills` array updated

## 🧪 Testing the Application

### 1. Register Test Users

Create accounts for each role:
- **Student**: Register with role "student"
- **Provider**: Register with role "provider"
- **Recruiter**: Register with role "recruiter"

### 2. Create a Task (Provider)

1. Login as a provider
2. Navigate to Provider Dashboard
3. Create a new task with:
   - Title, description
   - Required skills (e.g., "JavaScript", "React")
   - Difficulty level
   - Deadline
   - Instructions and evaluation criteria

### 3. Submit a Solution (Student)

1. Login as a student
2. Browse tasks in the marketplace
3. Click on a task to view details
4. Click "Submit Solution"
5. Choose GitHub URL or file upload
6. Submit and wait for AI evaluation

### 4. View Results

- **Student**: Check dashboard for skill scores and charts
- **Recruiter**: Search students and view detailed profiles

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control (RBAC)
- Input validation with express-validator
- Protected API routes
- CORS configuration

## 📊 Database Schema

### User
- Basic info (name, email, password)
- Role (student/provider/recruiter)
- Profile (bio, skills, institution, etc.)
- Verified skills array (populated by AI evaluations)

### Task
- Title, description, instructions
- Provider reference
- Required skills array
- Difficulty, deadline, status
- Submission limits

### Submission
- Task and student references
- Submission type (github/file)
- GitHub metadata or file info
- Status (pending/evaluating/evaluated/failed)
- Evaluation result reference

### SkillVerification
- Submission reference
- Overall score and skill breakdown
- Strengths, weaknesses
- Resume bullet point
- Plagiarism risk assessment
- Full AI prompt and response (audit trail)

## 🚨 Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify network connectivity for Atlas

**Azure OpenAI Errors:**
- Verify endpoint URL format (must end with `/`)
- Check API key is correct
- Ensure deployment name matches your Azure resource
- Verify API version is supported

**JWT Errors:**
- Check `JWT_SECRET` is set
- Ensure token is sent in Authorization header: `Bearer <token>`

### Frontend Issues

**API Connection Errors:**
- Verify backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Check browser console for CORS errors

**Authentication Issues:**
- Clear localStorage and re-login
- Check token expiration (default: 7 days)

## 📝 Environment Variables Reference

### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment mode | No |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret for JWT signing | Yes |
| `JWT_EXPIRE` | Token expiration | No (default: 7d) |
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI endpoint URL | Yes |
| `AZURE_OPENAI_API_KEY` | Azure OpenAI API key | Yes |
| `AZURE_OPENAI_DEPLOYMENT_NAME` | Model deployment name | Yes |
| `AZURE_OPENAI_API_VERSION` | API version | No (default: 2024-02-15-preview) |
| `GITHUB_TOKEN` | GitHub personal access token | No |

### Frontend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | No (default: /api) |



