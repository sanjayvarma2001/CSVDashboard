# Render Deployment Guide

## Backend Deployment (CSVDashboard API)

### 1. Prerequisites
- Render account (already have one)
- GitHub repo (already pushed: `sanjayvarma2001/CSVDashboard`)
- Production PostgreSQL database URL
- Gemini API key

### 2. Create PostgreSQL Database on Render (or use existing)
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "PostgreSQL"
3. Name: `csvdashboard-db`
4. PostgreSQL Version: 14+
5. Create
6. Copy the **Internal Database URL** (starts with `postgres://`)
   - Example: `postgresql://user:password@host:5432/dbname`

### 3. Deploy Backend Service
1. Go to Render Dashboard → "New +" → "Web Service"
2. Connect GitHub account (if not already connected)
3. Select repo: `CSVDashboard`
4. Configure:
   - **Name**: `csvdashboard-api`
   - **Environment**: Docker
   - **Build Command**: Leave empty (uses Dockerfile)
   - **Start Command**: Leave empty (uses Dockerfile)
5. Click "Advanced" and add **Environment Variables**:
   - `DATABASE_URL`: Paste the PostgreSQL URL from step 2
   - `GEMINI_API_KEY`: Paste your Gemini API key from Google Cloud
   - `PORT`: `8000` (Render will map this)
6. Click "Create Web Service"
7. Wait 5-10 minutes for deployment
8. Once live, copy the **Service URL** (e.g., `https://csvdashboard-api.onrender.com`)

### 4. Verify Deployment
Test the health endpoint:
```bash
curl https://csvdashboard-api.onrender.com/health
```

Expected response:
```json
{"status": "healthy", "database": "connected"}
```

---

## Frontend Deployment (Vercel)

### 1. Prerequisites
- Vercel account (free)
- Backend URL from step 3 above

### 2. Deploy to Vercel
1. Go to [Vercel](https://vercel.com/)
2. Click "Add New..." → "Project"
3. Select your GitHub repo: `CSVDashboard`
4. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
5. Add **Environment Variable**:
   - Key: `NEXT_PUBLIC_API_BASE`
   - Value: `https://csvdashboard-api.onrender.com` (from step 3.8 above)
6. Click "Deploy"
7. Wait for deployment (usually 2-3 minutes)
8. Copy the **Vercel URL** (e.g., `https://csvdashboard.vercel.app`)

### 3. Verify Frontend
1. Open the Vercel URL in your browser
2. Upload a CSV file
3. Verify AI insights generate
4. Test chat functionality

---

## Complete URLs
Once both are deployed:

- **Frontend**: `https://csvdashboard.vercel.app` (or your Vercel domain)
- **Backend API**: `https://csvdashboard-api.onrender.com`
- **Database**: Render PostgreSQL (internal only)

---

## Troubleshooting

### Backend won't deploy
1. Check Render logs: Dashboard → Service → "Logs"
2. Common issues:
   - Missing `DATABASE_URL` env var → set it
   - Missing `GEMINI_API_KEY` → set it
   - Dockerfile path wrong → ensure it's in repo root
3. Try manual rebuild: Click "Manual Deploy"

### Frontend won't connect to backend
1. Check `NEXT_PUBLIC_API_BASE` is set correctly in Vercel
2. Verify backend URL is correct (test with `curl`)
3. Check CORS settings in `Backend/app.py` (should allow all origins for testing)

### Database connection fails
1. Verify `DATABASE_URL` format: `postgresql://user:password@host:port/dbname`
2. Ensure Render PostgreSQL service is running (check Render dashboard)
3. Test connection locally: `psql DATABASE_URL`

---

## Optional: Enable Auto-Deploy
- Render dashboard → Service → Settings → "Auto-Deploy"
- Set to "On" to auto-deploy on GitHub push

---

**Estimated Cost**:
- Render free tier: 1 web service + 1 PostgreSQL ($7/month)
- Vercel free tier: ∞ (included)
- **Total**: ~$7/month or free if using shared Postgres

---

**Next Steps**:
1. Get PostgreSQL URL from Render
2. Deploy backend
3. Test `/health` endpoint
4. Deploy frontend
5. Test end-to-end upload & chat
