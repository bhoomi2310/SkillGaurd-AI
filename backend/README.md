# SkillBridge AI - Backend

## Quick Start

1. Install dependencies: `npm install`
2. Create `.env` file (see README.md in root for template)
3. Start MongoDB
4. Run: `npm run dev`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Tasks
- `GET /api/tasks` - Get all tasks (with filters)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task (Provider only)
- `PUT /api/tasks/:id` - Update task (Provider only)
- `DELETE /api/tasks/:id` - Delete task (Provider only)
- `GET /api/tasks/provider/my-tasks` - Get provider's tasks

### Submissions
- `POST /api/submissions` - Create submission (Student only)
- `GET /api/submissions/my-submissions` - Get student's submissions
- `GET /api/submissions/:id` - Get submission details
- `GET /api/submissions/task/:taskId` - Get task submissions (Provider/Recruiter)

### Recruiter
- `GET /api/recruiter/search` - Search students
- `GET /api/recruiter/student/:studentId` - Get student profile
- `GET /api/recruiter/verification/:verificationId` - Get verification report
- `GET /api/recruiter/student/:studentId/summary` - Download student summary (JSON)

## Environment Variables

See root README.md for complete list.

