# Vercel Deployment Guide

## Frontend Deployment

### Step 1: Configure Vercel

1. **Connect your repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Set the **Root Directory** to `frontend`

2. **Build Settings:**
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

3. **Environment Variables:**
   Add these in Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend-url.vercel.app/api
   VITE_GOOGLE_CLIENT_ID=your-google-client-id (optional)
   ```

### Step 2: Verify Configuration

The `frontend/vercel.json` file is already configured to handle SPA routing:
- All routes are rewritten to `/index.html` for React Router
- This fixes the 404 errors on page refresh

### Step 3: Deploy

1. Push your code to GitHub
2. Vercel will automatically deploy
3. Check the deployment logs for any errors

## Backend Deployment

### Option 1: Deploy Backend Separately

1. Create a new Vercel project for the backend
2. Set **Root Directory** to `backend`
3. Add environment variables from `backend/.env`
4. Update `VITE_API_URL` in frontend to point to backend URL

### Option 2: Use Vercel Serverless Functions

The backend can be deployed as serverless functions, but requires additional configuration.

## Common Issues

### 404 Errors on Refresh
✅ **Fixed** - The `vercel.json` rewrite rule handles this

### API Routes Not Working
- Ensure `VITE_API_URL` is set correctly
- Check CORS settings in backend
- Verify backend is deployed and accessible

### Build Errors
- Check Node.js version (should be 18+)
- Verify all dependencies are in `package.json`
- Check build logs in Vercel dashboard

## Testing Deployment

After deployment, test these routes:
- `/` - Landing page
- `/login` - Login page
- `/register` - Register page
- `/dashboard` - Should redirect to login if not authenticated
