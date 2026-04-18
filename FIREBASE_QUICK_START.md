# 🔥 Firebase Quick Setup (5 mins)

## TL;DR - Fastest Way to Set Up

### 1. Create Firebase Project
```bash
# Go to https://firebase.google.com
# Click "Go to console"
# Create new project: "vick-lam-profile-cms"
# Take note of your Project ID
```

### 2. Set Up Firestore
```bash
# In Firebase console:
# Build → Firestore Database → Create Database
# Choose your region → Test mode → Create
```

### 3. Set Up Storage
```bash
# Build → Storage → Get Started
# Use default bucket location
```

### 4. Enable Authentication
```bash
# Build → Authentication → Get Started
# Email/Password → Enable
# Create admin user:
#   Email: admin@myprofile.com
#   Password: QwertyPoiu@418!~
```

### 5. Get Service Account Key
```bash
# Project Settings (gear icon) → Service Accounts
# Generate Python key (downloads JSON)
# Rename to: server/firebase-key.json
# Add to .gitignore!
```

### 6. Update Backend
```bash
cd server
npm install firebase-admin
# Replace index.js with index-firebase.js
cp index.js index-sqlite.js
cp index-firebase.js index.js
npm start
```

### 7. Test
```bash
curl http://localhost:5000/api/health
# Should show: {"status":"ok",...,"database":"firebase"}
```

---

## 🚀 That's it! Firebase is running.

---

## 📊 Firestore Security Rules Reference

```
✅ CREATE: Anyone can submit comments
✅ READ: Public can see approved comments
✅ UPDATE: Only admin can approve
✅ DELETE: Only admin can delete
```

---

## 📁 File Mapping (SQLite → Firebase)

| SQLite | Firebase |
|--------|----------|
| `index.js` | `index-firebase.js` |
| `routes/auth.js` | `routes/auth-firebase.js` |
| `routes/admin.js` | `routes/admin-firebase.js` |
| `routes/comments.js` | `routes/comments-firebase.js` |
| `routes/traffic.js` | `routes/traffic-firebase.js` |

---

## 🔄 Switch Back to SQLite
```bash
cp index.js index-firebase-backup.js
cp index-sqlite.js index.js
npm start
```

---

## 💾 File Management

### Don't commit to git:
```
server/firebase-key.json (add to .gitignore)
```

### Safe to commit:
```
All other configuration files
All route files
```

---

## 🆘 Quick Troubleshoot

| Error | Fix |
|-------|-----|
| `PERMISSION_DENIED` | Check Firestore rules |
| `UNAUTHENTICATED` | Verify JWT token |
| `file-not-found (firebase-key.json)` | Download from Firebase console |
| `Cannot read properties of undefined (reading 'firestore')` | Check firebase-admin initialized |

---

**Ready!** Your CMS is now powered by Firebase! 🔥
