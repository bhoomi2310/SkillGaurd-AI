# Quick Setup Guide

## Prerequisites Checklist

- [ ] Node.js v18+ installed
- [ ] MongoDB installed and running (or MongoDB Atlas account)
- [ ] Azure OpenAI account with:
  - [ ] Resource created
  - [ ] Model deployed (GPT-4 or GPT-4o)
  - [ ] Endpoint URL
  - [ ] API key
- [ ] (Optional) GitHub Personal Access Token

## Step-by-Step Setup

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/workmark
GOOGLE_CLIENT_ID=your-google-client-id
JWT_SECRET=change-this-to-a-random-secret-key
JWT_EXPIRE=7d
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
AZURE_OPENAI_API_VERSION=2024-02-15-preview
GITHUB_TOKEN=optional-github-token
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env` (optional):

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### 3. Start Services

**Terminal 1 - MongoDB:**
```bash
mongod
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## First Steps

1. Register a user (choose role: student, provider, or recruiter)
2. If provider: Create a task
3. If student: Browse tasks and submit a solution
4. Wait for AI evaluation (check submission status)
5. View results in dashboard

## Troubleshooting

**Backend won't start:**
- Check MongoDB is running
- Verify all `.env` variables are set
- Check port 5000 is available

**Frontend won't connect:**
- Ensure backend is running
- Check `VITE_API_URL` matches backend port
- Check browser console for errors

**Azure OpenAI errors:**
- Verify endpoint URL ends with `/`
- Check API key is correct
- Ensure deployment name matches Azure resource
- Verify model is deployed and active

**MongoDB connection fails:**
- Check MongoDB is running: `mongosh` or `mongo`
- Verify connection string format
- For Atlas: Check network access and credentials

