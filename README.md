# Vick LAM — Professional Profile CMS

A full-stack professional profile with admin CMS, built with React + Vite (frontend) and Express + Node.js (backend).

## 🎯 Features

### Frontend
- ✅ Modern modular design (React 18 + Vite)
- ✅ Responsive layout
- ✅ Dark/light theme ready
- ✅ Public comment submission
- ✅ Admin panel (/admin route)
- ✅ Profile picture upload & display
- ✅ Traffic analytics

### Backend
- ✅ Express.js REST API
- ✅ JWT authentication
- ✅ SQLite database (local) OR Firebase Firestore (recommended)
- ✅ Image storage (local files OR Cloud Storage)
- ✅ Comment moderation system
- ✅ Visitor analytics & tracking

### Deployment
- ✅ Frontend → Vercel
- ✅ Backend → Render
- ✅ Database → SQLite OR Firebase Firestore
- ✅ Images → Local OR Google Cloud Storage

---

## 🚀 Quick Start

### Development Mode

```bash
# Install dependencies
npm install

# Terminal 1: Start frontend (Vite dev server)
npm run dev
# Runs on: http://localhost:5173

# Terminal 2: Start backend (Express server)
cd server
npm install
npm start
# Runs on: http://localhost:5000
```

### First Time Login
- **URL:** http://localhost:5173/admin
- **Username:** Admin1
- **Password:** QwertyPoiu@418!~

---

## 🔥 Firebase Setup (Recommended)

For production deployment, use Firebase Firestore instead of SQLite.

### Quick Setup (5 minutes)
```bash
# See complete guide:
cat FIREBASE_START_HERE.md
```

Then follow: [FIREBASE_QUICK_START.md](FIREBASE_QUICK_START.md)

### Or Full Setup Guide
If you want details: [FIREBASE_SETUP_GUIDE.md](FIREBASE_SETUP_GUIDE.md)

### Validate Firebase Setup
```bash
cd server
npm run validate:firebase
```

### Switch Between Databases
```bash
# Use Firebase
npm run switch:firebase

# Use SQLite
npm run switch:sqlite

# Check current
npm run db:status
```

---

## 📁 Project Structure

```
myprofile/
├── src/
│   ├── components/
│   │   ├── Header.jsx          (Profile header with avatar)
│   │   ├── About.jsx           (About section)
│   │   ├── Experience.jsx      (Work experience)
│   │   ├── Skills.jsx          (Technical skills)
│   │   ├── Projects.jsx        (Portfolio projects)
│   │   ├── Contact.jsx         (Contact section)
│   │   ├── Footer.jsx          (Footer)
│   │   ├── AdminLogin.jsx      (Login page)
│   │   ├── AdminDashboard.jsx  (Admin panel)
│   │   └── ...
│   ├── services/
│   │   └── api.js              (API client)
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── server/
│   ├── index.js                (Express server)
│   ├── index-firebase.js       (Firebase version)
│   ├── routes/
│   │   ├── auth.js             (SQLite auth)
│   │   ├── auth-firebase.js    (Firebase auth)
│   │   ├── admin.js            (SQLite admin routes)
│   │   ├── admin-firebase.js   (Firebase admin routes)
│   │   ├── comments.js         (SQLite comments)
│   │   ├── comments-firebase.js (Firebase comments)
│   │   ├── traffic.js          (SQLite analytics)
│   │   └── traffic-firebase.js (Firebase analytics)
│   ├── db.js                   (SQLite connection)
│   ├── firebase-config.js      (Firebase init)
│   ├── cms.db                  (SQLite database)
│   ├── switch-database.js      (DB switcher tool)
│   └── validate-firebase-setup.js
├── public/
│   └── resume.pdf
├── vite.config.js
├── index.html
└── README.md
```

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| [FIREBASE_START_HERE.md](FIREBASE_START_HERE.md) | **→ Start here for Firebase setup** |
| [FIREBASE_QUICK_START.md](FIREBASE_QUICK_START.md) | 5-minute Firebase setup |
| [FIREBASE_SETUP_GUIDE.md](FIREBASE_SETUP_GUIDE.md) | Complete Firebase reference |
| [FIREBASE_MIGRATION_GUIDE.md](FIREBASE_MIGRATION_GUIDE.md) | Migrating from SQLite |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Production deployment |
| [CMS_SETUP_GUIDE.md](CMS_SETUP_GUIDE.md) | Local CMS setup |

---

## 🔐 Admin Features

After logging in at `/admin`:

### Profile Picture Management
- Upload new profile picture
- File size limit: 5MB
- Supported formats: JPEG, PNG, GIF, WebP

### Comment Moderation
- View all submitted comments
- Approve/reject comments
- Delete comments
- Public comments appear on main page

### Traffic Analytics
- Daily visitor counts
- Top visited pages
- Referrer tracking
- Browser statistics
- Filter by date range

---

## 🌐 API Endpoints

### Authentication
```
POST   /api/auth/login                Login with admin credentials
POST   /api/auth/verify               Verify JWT token
```

### Admin Routes (Protected)
```
GET    /api/admin/stats               Dashboard statistics
POST   /api/admin/profile-pic         Upload profile picture
GET    /api/admin/profile-pic         Get profile picture
GET    /api/admin/comments            List all comments
POST   /api/admin/comments/approve/:id Approve comment
POST   /api/admin/comments/reject/:id  Reject comment
DELETE /api/admin/comments/:id        Delete comment
GET    /api/traffic/daily             Daily visitor stats
GET    /api/traffic/pages             Top pages
GET    /api/traffic/referrers         Referrer statistics
GET    /api/traffic/browsers          Browser statistics
```

### Public Routes
```
POST   /api/comments                  Submit a comment
GET    /api/comments                  Get approved comments
```

---

## 🛠️ Tech Stack

### Frontend
- React 18.2.0
- Vite 4.5.14
- React Router 6.14.0
- Axios 1.4.0
- CSS3

### Backend
- Node.js 24.11.1
- Express 4.18.2
- SQLite 5.1.6 OR Firebase Admin 11.10.0
- JWT 9.0.0 (jsonwebtoken)
- bcryptjs 2.4.3
- Multer 1.4.5

### Deployment
- Vercel (Frontend)
- Render (Backend)
- Firebase/Cloud Storage (Optional)

---

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Firebase account (optional, for cloud database)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Backend setup
cd server
npm install
cd ..

# 3. Environment configuration
cp server/.env.example server/.env
# Edit with your settings

# 4. Start development
npm run dev
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

---

## 🚀 Production Deployment

### Deploy Frontend to Vercel
See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md#vercel-frontend)

### Deploy Backend to Render
See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md#render-backend)

### Use Firebase Database
See [FIREBASE_SETUP_GUIDE.md](FIREBASE_SETUP_GUIDE.md)

---

## 🧪 Testing

### Test Backend Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"Admin1","password":"QwertyPoiu@418!~"}'

# Get comments
curl http://localhost:5000/api/comments
```

### Test Frontend
```bash
# Navigate to http://localhost:5173
# Click Admin link
# Login with credentials above
# Explore dashboard
```

---

## 🔒 Security Notes

- ⚠️ Never commit `firebase-key.json` to git
- ⚠️ Never commit `.env` files with secrets
- ⚠️ Always use HTTPS in production
- ✅ Keep firebase-key.json in .gitignore
- ✅ Use strong JWT_SECRET in production
- ✅ Enable Firestore security rules (template provided)

---

## 📋 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-here
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure-password
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
```

See [server/.env.firebase](server/.env.firebase) for complete template.

---

## 🆘 Troubleshooting

### Backend won't start
```bash
# Check Node version
node --version

# Check if port 5000 is in use
lsof -i :5000

# Check dependencies
npm install
```

### Firebase connection issues
```bash
# Validate Firebase setup
cd server
npm run validate:firebase
```

### Database errors
```bash
# Check current database
npm run db:status

# Switch databases if needed
npm run switch:firebase      # use Firebase
npm run switch:sqlite        # use SQLite
```

See [Troubleshooting](FIREBASE_SETUP_GUIDE.md#troubleshooting) in detailed guides.

---

## 📝 License

Personal use - Copyright © 2024 Vick LAM

---

## 🤝 Support

For issues or questions:
1. Check relevant documentation file
2. See troubleshooting section
3. Review API endpoint documentation

---

## 🎯 Next Steps

- [ ] Customize profile content in `src/components/`
- [ ] Set up Firebase (recommended)
- [ ] Deploy to production with [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- [ ] Configure custom domain
- [ ] Set up analytics monitoring

**Start here:** [FIREBASE_START_HERE.md](FIREBASE_START_HERE.md)

