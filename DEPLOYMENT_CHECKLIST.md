# 🚀 Production Deployment Checklist

## Pre-Deployment (Local)

- [ ] Update `VITE_API_URL` in `.env.production` with your backend URL
- [ ] Run `npm run build` and test locally with `npm run preview`
- [ ] Commit all changes: `git add -A && git commit -m "prep: production deployment"`
- [ ] Push to main: `git push origin main`

---

## Backend Deployment (Render)

### 1. Create Render Account
- [ ] Go to https://render.com
- [ ] Sign up with GitHub
- [ ] Authorize the GitHub app

### 2. Create Web Service
- [ ] Click "New +" → "Web Service"
- [ ] Select `vick-lam-data-bi-HK-bot/myprofile` repo
- [ ] Click "Connect"

### 3. Configure Service
- [ ] **Name**: `myprofile-cms-backend`
- [ ] **Environment**: Node
- [ ] **Region**: Frankfurt (or closest)
- [ ] **Build Command**: `cd server && npm install`
- [ ] **Start Command**: `cd server && npm start`
- [ ] **Plan**: Free (or Starter if errors)

### 4. Environment Variables
Click "Environment" and add:
```
NODE_ENV = production
PORT = 5000
SECRET_KEY = [generate: openssl rand -base64 32]
```

### 5. Deploy
- [ ] Click "Create Web Service"
- [ ] Wait for green "Live" badge (3-5 min)
- [ ] Copy the service URL (e.g., `https://myprofile-cms-backend.onrender.com`)
- [ ] Note the URL for frontend configuration

### 6. Test Backend
```bash
curl https://[your-render-url]/api/health
# Should return: {"status":"ok","timestamp":"..."}
```

---

## Frontend Deployment (Vercel)

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
# Opens browser to authenticate
```

### 3. Deploy Project
```bash
vercel --prod
```

Answers:
- **Link to existing project?** → `No` (first time)
- **Project name** → `myprofile-cms`
- **Framework** → `React`
- **Root directory** → `./`
- **Build command** → Keep default
- **Settings stored** → `Yes`

### 4. Configure Environment Variable
In Vercel Dashboard:
- [ ] Go to Project Settings
- [ ] Environment Variables
- [ ] Add new:
  ```
  Name: VITE_API_URL
  Value: https://[your-render-url]/api
  Environments: Production
  ```

### 5. Redeploy Frontend
```bash
vercel --prod --env-file .env.production
```
Or through Vercel Dashboard → Redeploy

### 6. Get Frontend URL
- [ ] Copy Vercel domain from dashboard (e.g., `https://myprofile-cms.vercel.app`)

### 7. Test Frontend
- [ ] Open `https://[vercel-url]`
- [ ] Check profile loads
- [ ] Open admin panel
- [ ] Try to login

---

## Final Testing

### Test Profile Page
- [ ] Homepage loads with profile info
- [ ] Resume, skills, experience sections visible
- [ ] Comments section visible
- [ ] Links work (LinkedIn, email)

### Test Comments
- [ ] Submit a comment from homepage
- [ ] Check backend receives data
- [ ] Admin can see it in dashboard

### Test Admin Panel
- [ ] Login with `Admin1 / QwertyPoiu@418!~`
- [ ] View dashboard statistics
- [ ] Upload profile picture
- [ ] Manage comments
- [ ] View traffic analytics

### Test API Endpoints
```bash
# Test backend API
curl https://[your-render-url]/api/health

# Test comments
curl https://[your-render-url]/api/comments

# Test admin (should fail without auth)
curl https://[your-render-url]/api/admin/stats
```

---

## Post-Deployment

- [ ] Save both URLs somewhere safe
- [ ] Update GitHub README with production URLs
- [ ] Monitor first few hours for errors
- [ ] Check Render logs for database issues
- [ ] Verify HTTPS is working on both

### Sharing
- [ ] Share profile URL with portfolio/resume
- [ ] Update LinkedIn profile with new URL
- [ ] Test from mobile/different networks

---

## Monitoring & Maintenance

### Daily
- [ ] Check Vercel analytics
- [ ] Monitor Render logs

### Weekly
- [ ] Review traffic analytics in admin panel
- [ ] Check for new comments

### Monthly
- [ ] Update resume/profile data if needed
- [ ] Review and approve comments
- [ ] Check error logs

---

## Troubleshooting

### Backend won't deploy
- [ ] Check Render build logs (Live tab)
- [ ] Verify Node version compatibility
- [ ] Ensure npm install succeeds
- [ ] Check start command runs without errors

### Frontend shows 404 for admin
- [ ] Verify `VITE_API_URL` is correct
- [ ] Check environment variable is set in Vercel
- [ ] Redeploy after changing env vars

### API calls fail
- [ ] Check CORS is enabled in backend
- [ ] Verify backend URL in .env.production
- [ ] Test with curl first
- [ ] Check browser console for exact error

### Database errors
- [ ] Check Render disk is mounted
- [ ] Verify database file permissions
- [ ] Check application logs for SQL errors
- [ ] Consider enabling Render backups

---

## URLs After Deployment

| Service | URL |
|---------|-----|
| Profile | `https://[vercel-url]` |
| Admin | `https://[vercel-url]/admin` |
| Backend API | `https://[render-url]/api` |
| Health Check | `https://[render-url]/api/health` |

---

## Next Steps

1. **Automate Deploys** (Optional)
   - Both Render and Vercel auto-deploy on push to main
   - No manual steps needed after initial setup

2. **Custom Domain** (Optional)
   - Render: Add custom domain in settings
   - Vercel: Add custom domain in settings

3. **Monitoring** (Optional)
   - Set up error tracking (Sentry, etc.)
   - Enable email alerts for downtime
   - Monitor database usage

4. **Scale** (Future)
   - Upgrade Render to paid for better performance
   - Add more features based on analytics

---

**Need Help?**
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Project Repo: https://github.com/vick-lam-data-bi-HK-bot/myprofile

**Status**: Ready for Production Deployment ✅
