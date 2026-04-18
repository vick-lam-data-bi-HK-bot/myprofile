# Production Deployment Guide

## Quick Overview

| Component | Platform | Service | Cost |
|-----------|----------|---------|------|
| **Backend** | Render.com | Web Service | Free (with limits) |
| **Frontend** | Vercel | Static Site | Free |
| **Database** | SQLite (on Render) | Included | Free |

---

## 🚀 Step 1: Deploy Backend to Render

### Prerequisites
- Render account (free at render.com)
- GitHub repository with code

### Instructions

1. **Go to [render.com](https://render.com)** → Sign up with GitHub
2. **Create new Web Service**:
   - Connect your GitHub repo: `vick-lam-data-bi-HK-bot/myprofile`
   - Select repository
   - Click "Connect"

3. **Configure Service**:
   - **Name**: `myprofile-cms-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Region**: Frankfurt (or closest to you)

4. **Add Environment Variables**:
   - Click "Environment"
   - Add these:
     ```
     NODE_ENV = production
     PORT = 5000
     SECRET_KEY = (generate random: openssl rand -base64 32)
     ```

5. **Deploy**
   - Render automatically deploys when you push to main
   - Wait for green "Live" status
   - Copy your backend URL (e.g., `https://myprofile-cms-backend.onrender.com`)

---

## 🚀 Step 2: Update Frontend Config

### 1. Create `.env.production` (if not exists)

```bash
VITE_API_URL=https://myprofile-cms-backend.onrender.com/api
```

Replace with your actual Render backend URL.

### 2. Update `vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/myprofile/',  // For GitHub Pages
  plugins: [react()],
  build: {
    rollupOptions: {
      input: 'src/index.html'
    }
  }
})
```

---

## 🚀 Step 3: Deploy Frontend to Vercel

### Instructions

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

   Configure when prompted:
   - **Link to existing project?** → No (unless you have one)
   - **Project Name**: `myprofile-cms`
   - **Framework Preset**: React
   - **Root Directory**: `./` (correct)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Add Environment Variable**:
   - Go to Vercel Dashboard
   - Project Settings → Environment Variables
   - Add:
     ```
     VITE_API_URL=https://myprofile-cms-backend.onrender.com/api
     ```
   - Redeploy

---

## 🌐 Step 4: Update Backend Database (Optional)

For persistent data between deployments, consider:

### Option A: Use Render Disk (Recommended)
- Render automatically backs up SQLite
- Data persists across deployments
- No additional setup needed

### Option B: Use PostgreSQL (Advanced)
- Render offers free PostgreSQL
- Requires code changes to switch from SQLite
- Better for scale

---

## ✅ Final URLs After Deployment

| Service | URL |
|---------|-----|
| Profile | `https://myprofile-cms.vercel.app` |
| Admin | `https://myprofile-cms.vercel.app/admin` |
| API | `https://myprofile-cms-backend.onrender.com/api` |
| Backend Health | `https://myprofile-cms-backend.onrender.com/api/health` |

---

## 🧪 Test the Deployment

### 1. Test Backend API
```bash
curl https://myprofile-cms-backend.onrender.com/api/health
# Should return: {"status":"ok","timestamp":"..."}
```

### 2. Test Frontend
Open: `https://myprofile-cms.vercel.app`

### 3. Test Admin Panel
- Go to: `https://myprofile-cms.vercel.app/admin`
- Login with: `Admin1 / QwertyPoiu@418!~`

### 4. Test Comments
- Submit a comment on profile
- Check admin panel to approve it

### 5. Test Profile Picture Upload
- Login to admin panel
- Upload new profile picture
- Refresh profile page to verify

---

## 🔄 Automatic Deployments

Both platforms auto-deploy when you push to GitHub:

```bash
git add -A
git commit -m "update: production deployment"
git push origin main
```

- **Backend**: Automatically deploys on Render (2-3 min)
- **Frontend**: Automatically deploys on Vercel (1-2 min)

---

## 📊 Monitoring & Logs

### Render (Backend)
- Dashboard → Your Service
- View real-time logs
- Monitor CPU/Memory usage

### Vercel (Frontend)
- Deployments tab shows all builds
- Analytics shows traffic stats

---

## 🔐 Security Checklist

- [ ] Change default admin password (in production database)
- [ ] Set strong `SECRET_KEY` in environment
- [ ] Use HTTPS only (automatic on Render/Vercel)
- [ ] Enable CORS for your domain only
- [ ] Set `NODE_ENV=production`
- [ ] Monitor logs for errors
- [ ] Set up error tracking (optional)

---

## 💾 Database Backup

SQLite on Render persists, but for safety:

```bash
# Download database from Render shell
render-shell myprofile-cms-backend
# Then access the cms.db file
```

Or enable Render Disk backups in settings.

---

## 🚨 Troubleshooting

### Backend returns 503 Service Unavailable
- Check Render dashboard for crashes
- Verify environment variables set correctly
- Check logs for database errors

### "Temporary Failure in Resolving" Error
- Render might be spinning up (cold starts)
- Wait 30 seconds and retry
- Consider upgrading to paid plan for no cold starts

### Frontend shows "Cannot POST /admin"
- Verify `VITE_API_URL` is correct
- Check environment variables in Vercel
- Redeploy frontend after changing env vars

### Comments not saving
- Check backend API is accessible
- Verify database permissions on Render
- Check browser console for API errors

---

## 📈 Upgrade Options (Paid)

**Render - $7/month/service**:
- Removes cold starts
- Dedicated resources
- 24/7 uptime

**Vercel - Pro $20/month**:
- Priority support
- Advanced analytics
- More serverless functions

---

## Alternative Deployment Platforms

If Render has issues, try:

### Backend Options
- **Railway.app** - Similar to Render, great UX
- **Fly.io** - Edge computing, fast globally
- **AWS EC2** - More control, paid
- **Heroku** - Classic PaaS (paid only now)

### Frontend Options
- **GitHub Pages** - Free but needs static build
- **Netlify** - Similar to Vercel, free tier available
- **AWS S3 + CloudFront** - Paid but cheaper at scale

---

## 📞 Support & Next Steps

1. Follow the deployment steps above
2. Share your Vercel URL with others
3. If issues, check platform documentation
4. Contact support on Render/Vercel dashboards

---

**Last Updated**: April 18, 2026  
**Status**: Deployment Ready 🚀
