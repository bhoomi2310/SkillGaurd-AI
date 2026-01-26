# Troubleshooting Guide

## Sign In/Sign Out Issues

### Backend Not Running
1. **Check if backend is running:**
   ```bash
   cd backend
   npm run dev
   ```
   You should see: `🚀 WorkMark API Server running`

2. **Test backend connection:**
   ```bash
   curl http://localhost:5000/api/health
   ```
   Should return: `{"status":"OK","message":"WorkMark API is running"}`

### Database Connection Issues
1. **Check MongoDB is running:**
   ```bash
   # Windows
   mongod
   
   # Or check if MongoDB service is running
   ```

2. **Verify MONGODB_URI in backend/.env:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/workmark
   ```

3. **Test database connection:**
   ```bash
   cd backend
   npm run test:backend
   ```

### Missing Environment Variables
1. **Backend .env file must have:**
   - `MONGODB_URI` (required)
   - `JWT_SECRET` (required)
   - `GOOGLE_CLIENT_ID` (optional, for Google OAuth)

2. **Frontend .env file (optional):**
   - `VITE_API_URL` (defaults to `/api` which uses proxy)
   - `VITE_GOOGLE_CLIENT_ID` (optional, for Google OAuth)

### Common Issues

#### "Invalid credentials" on login
- Check if user exists in database
- Verify password is correct
- Run `npm run seed:demo` to create demo users

#### "User already exists" on registration
- User with that email already exists
- Try a different email or login instead

#### "Not authorized, token failed"
- Token expired or invalid
- Clear browser localStorage and login again
- Check JWT_SECRET is set correctly

#### Network errors / Can't connect to server
- Ensure backend is running on port 5000
- Check CORS configuration
- Verify frontend proxy settings in vite.config.js

#### Logout not working
- Clear browser localStorage manually
- Check browser console for errors
- Ensure AuthContext is properly initialized

### Quick Fixes

1. **Reset everything:**
   ```bash
   # Backend
   cd backend
   rm -rf node_modules
   npm install
   
   # Frontend
   cd frontend
   rm -rf node_modules
   npm install
   ```

2. **Clear browser data:**
   - Open DevTools (F12)
   - Application tab → Local Storage
   - Clear all data
   - Refresh page

3. **Check console errors:**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

### Demo Users
To create demo accounts:
```bash
cd backend
npm run seed:demo
```

Then use:
- Student: `student@demo.com` / `demo123`
- Provider: `provider@demo.com` / `demo123`
- Recruiter: `recruiter@demo.com` / `demo123`
