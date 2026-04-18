# CMS Setup & Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ and npm
- Git
- SQLite3 (included with Node)

### 1. Clone & Install (if starting fresh)
```bash
git clone https://github.com/vick-lam-data-bi-HK-bot/myprofile.git
cd myprofile
npm install
cd server && npm install && cd ..
```

### 2. Development Mode (Frontend + Backend)
```bash
# Terminal 1: Start backend server
cd server
npm start

# Terminal 2: Start frontend dev server
npm run dev:frontend
```

Access:
- **Frontend**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin
- **API**: http://localhost:5000/api

### 3. Admin Login
```
Username: Admin1
Password: QwertyPoiu@418!~
```

---

## 📁 Project Structure

```
myprofile/
├── src/                              # Frontend React components
│   ├── components/
│   │   ├── AdminDashboard.jsx       # Main admin panel
│   │   ├── AdminLogin.jsx           # Admin login form
│   │   ├── CMSProfilePicEditor.jsx  # Profile picture upload
│   │   ├── CommentsManager.jsx      # Comment moderation
│   │   ├── CommentBox.jsx           # Comment submission form
│   │   ├── CommentViewer.jsx        # Display approved comments
│   │   ├── TrafficAnalytics.jsx     # Traffic stats viewer
│   │   └── [other components]
│   ├── services/
│   │   └── api.js                   # API client & endpoints
│   └── styles/
│       ├── admin.css                # Admin panel styling
│       └── comments.css             # Comments styling
├── server/                          # Express backend
│   ├── index.js                     # Server entry point
│   ├── db.js                        # SQLite database setup
│   ├── routes/
│   │   ├── auth.js                  # Login/auth endpoints
│   │   ├── admin.js                 # Admin endpoints
│   │   ├── comments.js              # Comments API
│   │   └── traffic.js               # Traffic analytics API
│   ├── cms.db                       # SQLite database (auto-created)
│   ├── package.json
│   └── .env.example
├── dist/                            # Production build
├── package.json
└── vite.config.js
```

---

## 🔑 CMS Features

### 1. **Admin Authentication**
- Secure JWT-based authentication
- Default credentials: `Admin1 / QwertyPoiu@418!~`
- Token stored in localStorage (24-hour expiration)
- Protected admin routes

### 2. **Profile Picture Management**
- Upload custom profile picture (JPG, PNG, GIF)
- Max 5MB file size
- Base64 encoding for storage
- Displays on profile header
- Update history tracking

### 3. **Comment System**
- **Frontend**: Comment submission form with name, email, message
- **Backend**: Moderation panel in admin dashboard
- **Features**:
  - Pending/approved status
  - Admin approve/reject comments
  - Delete comments
  - Display approved comments on profile

### 4. **Traffic Analytics**
- Real-time visitor tracking
- Metrics:
  - Daily visit counts & unique visitors
  - Top pages/endpoints
  - Referrer statistics
  - Browser usage breakdown
- Timeframe options: 7 days, 30 days, all time
- Automatic IP tracking (respects privacy)

### 5. **Dashboard Statistics**
- Approved/pending comments count
- Total visitors (today & 7-day trends)
- Quick stats overview

---

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token

### Admin (Protected)
- `POST /api/admin/profile-pic` - Upload profile picture
- `GET /api/admin/profile-pic` - Get current profile picture
- `GET /api/admin/comments` - Get all comments
- `POST /api/admin/comments/:id/approve` - Approve/reject comment
- `DELETE /api/admin/comments/:id` - Delete comment
- `GET /api/admin/stats` - Get dashboard statistics

### Comments (Public)
- `POST /api/comments` - Submit comment
- `GET /api/comments` - Get approved comments

### Traffic (Protected)
- `GET /api/traffic/analytics?timeframe=7days` - Daily statistics
- `GET /api/traffic/top-pages` - Top visited pages
- `GET /api/traffic/referrers` - Traffic referrers
- `GET /api/traffic/browsers` - Browser statistics

---

## 📊 Database Schema

### admins table
```sql
id (INTEGER PRIMARY KEY)
username (TEXT UNIQUE)
password (TEXT - bcrypt hashed)
created_at (DATETIME)
```

### profile_data table
```sql
id (INTEGER PRIMARY KEY)
profile_pic (LONGBLOB - base64 encoded)
profile_pic_updated_at (DATETIME)
updated_by (TEXT)
updated_at (DATETIME)
```

### comments table
```sql
id (INTEGER PRIMARY KEY)
name (TEXT)
email (TEXT)
message (TEXT)
approved (INTEGER: 0/1)
created_at (DATETIME)
```

### traffic table
```sql
id (INTEGER PRIMARY KEY)
ip (TEXT)
endpoint (TEXT)
method (TEXT)
user_agent (TEXT)
referer (TEXT)
timestamp (DATETIME)
```

---

## 🚢 Production Deployment

### Option 1: Traditional VPS (Recommended)
```bash
# Build frontend
npm run build

# Backend runs with:
cd server
NODE_ENV=production npm start
```

### Option 2: Docker (Coming soon)
Create a Dockerfile to containerize the application.

### Option 3: Vercel + Render
- Frontend: Deploy to Vercel
- Backend: Deploy to Render
- Update `.env.production` with backend URL

### Security Checklist
- [ ] Change default admin password in production
- [ ] Set `SECRET_KEY` environment variable
- [ ] Use HTTPS only
- [ ] Enable CORS properly
- [ ] Set `NODE_ENV=production`
- [ ] Use environment variables for sensit data

---

## 🛠️ Environment Variables

### Frontend (.env.production)
```
VITE_API_URL=https://your-api-domain.com/api
```

### Backend (server/.env)
```
PORT=5000
SECRET_KEY=your-secure-random-key
NODE_ENV=production
```

---

## 📱 Mobile Responsiveness
- ✅ Admin dashboard responsive on tablet/mobile
- ✅ Comment section mobile-friendly
- ✅ Traffic analytics readable on small screens
- ✅ Form inputs touch-optimized

---

## 🎨 Customization

### Styling
- Admin CSS: `src/styles/admin.css`
- Comments CSS: `src/styles/comments.css`
- Main CSS: `src/styles.css`

### API Configuration
- API client: `src/services/api.js`
- Modify base URL for different backends
- Add custom headers if needed

### Database
- Modify schema in `server/db.js`
- Add new tables for additional features
- SQLite queries in route files

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000
# If needed, kill the process or change PORT in .env
```

### Login fails
- Verify admin credentials: `Admin1 / QwertyPoiu@418!~`
- Check database: `sqlite3 server/cms.db "SELECT * FROM admins"`

### Comments not appearing
- Check admin has approved them
- Verify traffic table is being updated

### CORS errors
- Ensure backend running on correct port
- Check `.env` API URL matches backend
- Verify CORS origin in server/index.js

---

## 📝 Future Enhancements

- [ ] Multiple admin users with roles
- [ ] Comment replies/threading
- [ ] Advanced analytics charts
- [ ] Email notifications
- [ ] Backup/restore functionality
- [ ] Rate limiting
- [ ] 2FA authentication
- [ ] API documentation (Swagger)

---

## 📞 Support

For issues or questions, contact: vic1608@gmail.com

---

## 📄 License

This project is private and owned by Vick LAM.

---

**Last Updated**: April 18, 2026
**Version**: 1.0.0 CMS
