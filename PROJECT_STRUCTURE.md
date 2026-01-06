# SkillBridge AI - Project Structure

## Complete File Tree

```
SkillBridge AI/
│
├── README.md                    # Main documentation
├── SETUP.md                     # Quick setup guide
├── PROJECT_STRUCTURE.md        # This file
│
├── backend/
│   ├── package.json
│   ├── server.js               # Express server entry point
│   ├── .gitignore
│   ├── README.md
│   │
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   │
│   ├── models/
│   │   ├── User.js             # User schema (Student/Provider/Recruiter)
│   │   ├── Task.js             # Task schema
│   │   ├── Submission.js        # Submission schema
│   │   └── SkillVerification.js # AI evaluation results
│   │
│   ├── controllers/
│   │   ├── authController.js   # Register, login, profile
│   │   ├── taskController.js   # Task CRUD operations
│   │   ├── submissionController.js # Submission & AI evaluation
│   │   └── recruiterController.js  # Recruiter search & reports
│   │
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth/*
│   │   ├── taskRoutes.js        # /api/tasks/*
│   │   ├── submissionRoutes.js # /api/submissions/*
│   │   └── recruiterRoutes.js   # /api/recruiter/*
│   │
│   ├── middleware/
│   │   ├── auth.js             # JWT auth & role-based access
│   │   └── errorHandler.js     # Error handling
│   │
│   └── services/
│       ├── azureOpenAI.js       # ⭐ CORE AI SERVICE
│       └── githubService.js     # GitHub API integration
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    ├── .gitignore
    ├── README.md
    │
    └── src/
        ├── main.jsx             # React entry point
        ├── index.css            # Tailwind imports
        ├── App.jsx              # Main app & routing
        │
        ├── context/
        │   └── AuthContext.jsx  # Authentication state
        │
        ├── services/
        │   └── api.js           # API service layer
        │
        ├── components/
        │   ├── Navbar.jsx       # Navigation bar
        │   └── PrivateRoute.jsx # Protected routes
        │
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── StudentDashboard.jsx    # Skill charts & stats
            ├── TaskMarketplace.jsx     # Browse tasks
            ├── TaskDetail.jsx          # Task details
            ├── SubmissionForm.jsx      # Submit solution
            ├── ProviderDashboard.jsx   # Provider tasks
            ├── RecruiterDashboard.jsx  # Recruiter home
            ├── RecruiterSearch.jsx     # Search students
            └── StudentProfile.jsx      # Student profile view
```

## Key Components

### Backend Core Files

1. **`services/azureOpenAI.js`** - ⭐ CRITICAL
   - Handles all AI evaluation logic
   - Builds structured prompts
   - Calls Azure OpenAI API
   - Validates and parses JSON responses
   - Returns deterministic skill verification results

2. **`controllers/submissionController.js`**
   - Creates submissions
   - Triggers async AI evaluation
   - Updates user verified skills
   - Handles GitHub and file submissions

3. **`models/SkillVerification.js`**
   - Stores AI evaluation results
   - Includes full audit trail (prompt + response)
   - Links to submissions and tasks

4. **`middleware/auth.js`**
   - JWT token verification
   - Role-based authorization (student/provider/recruiter)

### Frontend Core Files

1. **`pages/StudentDashboard.jsx`**
   - Skill breakdown charts (Recharts)
   - Skill progress over time
   - Verified skill badges
   - Recent submissions

2. **`pages/RecruiterSearch.jsx`**
   - Search students by skills
   - Filter by score, institution, year
   - View student profiles

3. **`pages/SubmissionForm.jsx`**
   - GitHub URL input
   - File upload (metadata)
   - Submission creation

## Data Flow

### Submission → Evaluation Flow

```
1. Student submits (GitHub URL or file)
   ↓
2. SubmissionController.createSubmission()
   ↓
3. GitHub metadata fetched (if applicable)
   ↓
4. Submission saved with status: "pending"
   ↓
5. Async evaluation triggered
   ↓
6. AzureOpenAIService.evaluateSubmission()
   - Builds prompt with task + submission data
   - Calls Azure OpenAI API
   - Validates JSON response
   ↓
7. SkillVerification document created
   ↓
8. Submission status → "evaluated"
   ↓
9. User.verifiedSkills updated
```

### Authentication Flow

```
1. User registers/logs in
   ↓
2. JWT token generated
   ↓
3. Token stored in localStorage (frontend)
   ↓
4. Token sent in Authorization header
   ↓
5. auth.js middleware verifies token
   ↓
6. User object attached to req.user
   ↓
7. Role-based access control enforced
```

## API Endpoints Summary

### Public
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/tasks` - Browse tasks
- `GET /api/tasks/:id` - View task

### Student Only
- `GET /api/auth/me` - Get profile
- `POST /api/submissions` - Submit solution
- `GET /api/submissions/my-submissions` - View submissions

### Provider Only
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/provider/my-tasks` - My tasks
- `GET /api/submissions/task/:taskId` - Task submissions

### Recruiter Only
- `GET /api/recruiter/search` - Search students
- `GET /api/recruiter/student/:id` - Student profile
- `GET /api/recruiter/verification/:id` - Verification report
- `GET /api/recruiter/student/:id/summary` - Download summary

## Environment Variables

### Backend (.env)
- `MONGODB_URI` - MongoDB connection
- `JWT_SECRET` - JWT signing secret
- `AZURE_OPENAI_ENDPOINT` - Azure OpenAI endpoint
- `AZURE_OPENAI_API_KEY` - Azure OpenAI API key
- `AZURE_OPENAI_DEPLOYMENT_NAME` - Model deployment name
- `GITHUB_TOKEN` - (Optional) GitHub token

### Frontend (.env)
- `VITE_API_URL` - Backend API URL

## Database Collections

1. **users** - All user accounts (students, providers, recruiters)
2. **tasks** - Micro-internship tasks
3. **submissions** - Student submissions
4. **skillverifications** - AI evaluation results

## Key Features Implemented

✅ Multi-role authentication (Student/Provider/Recruiter)
✅ JWT-based secure authentication
✅ Task marketplace with filtering
✅ GitHub repository integration
✅ File upload support (metadata)
✅ Azure OpenAI skill verification
✅ Structured AI JSON responses
✅ Student dashboard with skill charts
✅ Recruiter search and filtering
✅ Skill verification reports
✅ Resume bullet point generation
✅ Plagiarism risk assessment
✅ Full audit trail (AI prompts/responses)

## Production Considerations

1. **File Upload**: Currently stores metadata only. In production:
   - Implement multer middleware
   - Upload to cloud storage (S3, Azure Blob)
   - Store file URLs in database

2. **Error Handling**: Comprehensive error handling in place

3. **Security**: 
   - Password hashing (bcrypt)
   - JWT tokens
   - Role-based access control
   - Input validation

4. **Scalability**:
   - Async AI evaluation
   - Indexed database queries
   - Modular architecture

5. **Monitoring**: Add logging and monitoring in production

