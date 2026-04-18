# Firebase Migration Guide: SQLite → Firestore

## Backup First! ⚠️

```bash
# Backup current state
cp server/cms.db server/cms.db.backup
git add -A
git commit -m "backup: sqlite database before firestore migration"
```

---

## Step 1: Set Up Firebase (See FIREBASE_QUICK_START.md)

Complete the Firebase setup steps first.

---

## Step 2: Export SQLite Data (Optional)

If you have existing data:

```bash
# Export comments
sqlite3 server/cms.db ".mode json" ".output comments.json" \
  "SELECT * FROM comments;"

# Export profile data
sqlite3 server/cms.db ".mode json" ".output profile.json" \
  "SELECT * FROM profile_data;"
```

---

## Step 3: Modify Server Configuration

### Option A: Quick Switch (Keep SQLite as fallback)

```bash
# Keep original
mv server/index.js server/index-sqlite.js

# Use Firebase version
cp server/index-firebase.js server/index.js

# Test it works
npm start
```

### Option B: Full Migration (Remove SQLite)

```bash
# Update index.js to use Firebase routes
nano server/index.js
# Replace all routes:
# const authRoutes = require('./routes/auth-firebase')
# const adminRoutes = require('./routes/admin-firebase')
# etc.
```

---

## Step 4: Install Firebase Admin SDK

```bash
cd server
npm install firebase-admin
```

---

## Step 5: Add Firebase Key

```bash
# Download from Firebase Console → Project Settings → Service Accounts
# Save as: server/firebase-key.json

# Add to .gitignore
echo "server/firebase-key.json" >> .gitignore
```

---

## Step 6: Test Connection

```bash
cd server
npm start

# In another terminal:
curl http://localhost:5000/api/health
# Expected: {"status":"ok","database":"firebase"}
```

---

## Step 7: Migrate Data (if needed)

### Create Migration Script

`server/migrate.js`:
```javascript
const admin = require('firebase-admin');
const sqlite3 = require('sqlite3');
const db = admin.firestore();

// Load Firebase config
require('./firebase-config');

// Connect to SQLite
const sqliteDb = new sqlite3.Database('./cms.db');

// Migrate comments
sqliteDb.all('SELECT * FROM comments', async (err, rows) => {
  if (err) console.error(err);
  
  for (let row of rows) {
    await db.collection('comments').add({
      name: row.name,
      email: row.email,
      message: row.message,
      approved: row.approved === 1,
      createdAt: new Date(row.created_at)
    });
  }
  
  console.log('✅ Comments migrated');
});

// Migrate profile data
sqliteDb.get('SELECT * FROM profile_data ORDER BY id DESC LIMIT 1', async (err, row) => {
  if (err) console.error(err);
  
  if (row) {
    await db.collection('profiles').doc('current').set({
      profilePic: row.profile_pic, // Base64 string
      updatedAt: new Date(row.profile_pic_updated_at),
      updatedBy: row.updated_by
    });
    
    console.log('✅ Profile data migrated');
  }
});
```

### Run Migration

```bash
node server/migrate.js
```

---

## Step 8: Update Frontend API URL

If using Firestore on Render:

`.env.production`:
```
VITE_API_URL=https://your-render-backend.onrender.com/api
```

---

## Step 9: Test Everything

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@myprofile.com","password":"QwertyPoiu@418!~"}'
```

### Get Profile Picture
```bash
curl http://localhost:5000/api/admin/profile-pic
```

### Submit Comment
```bash
curl -X POST http://localhost:5000/api/comments \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Hello"}'
```

---

## Step 10: Commit Changes

```bash
git add -A
git commit -m "feat: migrate from SQLite to Firebase Firestore

- Replace SQLite with Firestore database
- Add firebase-admin SDK
- Update all routes to use Firestore
- Add Cloud Storage for images
- Maintain same API interface"

git push origin main
```

---

## 🔄 Rollback (if needed)

If you need to go back to SQLite:

```bash
# Restore from backup
git reset --hard HEAD~1

# Or switch version
cp server/index-sqlite.js server/index.js
rm server/firebase-key.json
npm start
```

---

## ✅ Validation Checklist

After migration:

- [ ] Backend starts without errors
- [ ] `/api/health` returns firebase database
- [ ] Can login with admin credentials
- [ ] Can submit comments
- [ ] Can view comments in admin panel
- [ ] Can upload profile pictures
- [ ] Traffic analytics working
- [ ] All API endpoints respond correctly
- [ ] No SQLite errors in logs
- [ ] Firestore has data in collections

---

## 📊 Cost Comparison

| Database | Free Tier | Monthly Cost |
|----------|-----------|--------------|
| **SQLite** | Yes | $0 |
| **Firestore** | Generous | $6/month (typical) |
| **Firestore** | Large scale | $25+/month |

**Free tier includes:**
- 25k read operations/day
- 25k write operations/day
- 1GB storage

---

## 🎉 Benefits After Migration

✅ Automatic backups  
✅ Real-time database  
✅ Global CDN for images  
✅ Scales automatically  
✅ No manual database management  
✅ Built-in security  
✅ Mobile app compatible  

---

**Ready to migrate?** Start with FIREBASE_QUICK_START.md! 🔥
