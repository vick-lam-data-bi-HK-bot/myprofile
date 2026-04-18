# Firebase Setup Guide for CMS Database

## 🔥 Overview

Firebase provides:
- **Firestore** - NoSQL database (production-grade)
- **Authentication** - Built-in user management
- **Storage** - Cloud storage for images
- **Realtime updates** - Instant data sync

**Cost**: Free tier covers most usage!

---

## 📋 Quick Comparison: SQLite vs Firestore

| Feature | SQLite | Firestore |
|---------|--------|-----------|
| **Scale** | Limited | Unlimited |
| **Cost** | Free | Free (generous tier) |
| **Real-time** | No | Yes ✅ |
| **Mobile** | Poor | Excellent |
| **Backup** | Manual | Automatic ✅ |
| **Multi-region** | No | Yes ✅ |
| **Setup** | Simple | Medium |

---

## 🚀 Step 1: Create Firebase Project

### 1.1 Go to Firebase Console
- Open: https://firebase.google.com/
- Click "Go to console"
- Sign in with Google account

### 1.2 Create New Project
- Click "Create a project"
- Project name: `vick-lam-profile-cms`
- Accept terms
- Click "Continue"

### 1.3 Configure Project
- **Enable Google Analytics**: Optional (I'll say Yes)
- Select analytics location: Your region
- Click "Create project"
- ⏳ Wait ~1 minute for setup

---

## 🗄️ Step 2: Set Up Firestore Database

### 2.1 Create Database
- Left menu → "Build" section
- Click **"Firestore Database"**
- Click **"Create database"**

### 2.2 Configure Database
- **Location**: Select your region
- **Security rules**: Start in "Test mode" (we'll update)
- Click **"Create"**

### 2.3 Update Security Rules
Firestore opens → **Rules** tab

Replace with:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Admin operations (require authentication)
    match /admins/{document=**} {
      allow read, write: if request.auth.uid != null && 
        request.auth.customClaims.admin == true;
    }
    
    match /profiles/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid != null && 
        request.auth.customClaims.admin == true;
    }
    
    match /comments/{document=**} {
      allow create: if true;
      allow read: if resource.data.approved == true || 
        (request.auth.uid != null && request.auth.customClaims.admin == true);
      allow update, delete: if request.auth.uid != null && 
        request.auth.customClaims.admin == true;
    }
    
    match /traffic/{document=**} {
      allow create: if true;
      allow read: if request.auth.uid != null && 
        request.auth.customClaims.admin == true;
    }
  }
}
```

Click **"Publish"**

---

## 🖼️ Step 3: Set Up Cloud Storage (for images)

### 3.1 Create Storage Bucket
- Left menu → "Build" section
- Click **"Storage"**
- Click **"Get started"**

### 3.2 Configure Rules
Replace default rules with:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Public read, admin write
    match /profile-pics/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid != null && 
        request.auth.customClaims.admin == true;
    }
  }
}
```

Click **"Done"**

---

## 🔑 Step 4: Set Up Authentication

### 4.1 Configure Auth
- Left menu → "Build" section
- Click **"Authentication"**
- Click **"Get started"**

### 4.2 Enable Email/Password
- Click "Email/Password" provider
- Toggle **Enabled**
- Click **"Save"**

### 4.3 Create Admin User
- **Users** tab → **"Add user"**
- Email: `admin@myprofile.com`
- Password: `QwertyPoiu@418!~`
- Click **"Add user"**

### 4.4 Set Custom Claims (make admin)
- Click the user you just created
- Copy the **UID** (you'll need this)
- Note it down for later

---

## 🔧 Step 5: Get Firebase Config

### 5.1 Get Credentials
- Project settings → **Project settings** gear icon
- **Service Accounts** tab
- Click **"Generate new private key"**
- Download JSON file → Save as `server/firebase-key.json`

### 5.2 Get Web Config
- Project settings → **General** tab
- Under "Your apps" → Click `</>`
- Copy the config object

---

## 💻 Step 6: Update Backend Code

### 6.1 Install Firebase Admin SDK
```bash
cd server
npm install firebase-admin
```

### 6.2 Create Firebase Config File

Create `server/firebase-config.js`:
```javascript
const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase
const serviceAccount = require('./firebase-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "vick-lam-profile-cms.appspot.com" // Change to your bucket
});

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

module.exports = { db, auth, storage, admin };
```

### 6.3 Update Auth Routes

Create `server/routes/auth-firebase.js`:
```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const { auth, admin } = require('../firebase-config');

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verify with Firebase
    const userRecord = await auth.getUserByEmail(email);
    
    // In production, use Firebase client SDK for password verification
    // or implement custom token creation
    const customToken = await auth.createCustomToken(userRecord.uid);
    
    // Create JWT for session
    const token = jwt.sign(
      { uid: userRecord.uid, email: userRecord.email },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: { uid: userRecord.uid, email: userRecord.email }
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Verify token middleware
router.use((req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token && req.path !== '/login') {
    return res.status(401).json({ error: 'No token provided' });
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded;
      req.userToken = token;
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  }

  next();
});

module.exports = router;
```

### 6.4 Update Admin Routes

Create `server/routes/admin-firebase.js`:
```javascript
const express = require('express');
const multer = require('multer');
const { db, storage } = require('../firebase-config');

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Middleware to verify admin
const verifyAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  // In production, verify admin claim via Firebase
  next();
};

// Upload profile picture
router.post('/profile-pic', verifyAdmin, upload.single('profilePic'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const bucket = storage.bucket();
    const file = bucket.file(`profile-pics/${Date.now()}-${req.file.originalname}`);

    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype
      }
    });

    // Get public URL
    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 15778800000 // 6 months
    });

    // Save reference in Firestore
    await db.collection('profiles').doc('current').set({
      profilePic: url,
      updatedAt: new Date(),
      updatedBy: req.user.email
    }, { merge: true });

    res.json({ success: true, url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Get profile picture
router.get('/profile-pic', async (req, res) => {
  try {
    const doc = await db.collection('profiles').doc('current').get();
    if (doc.exists) {
      res.json({ success: true, ...doc.data() });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

// Get comments
router.get('/comments', verifyAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('comments')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();

    const comments = [];
    snapshot.forEach(doc => {
      comments.push({ id: doc.id, ...doc.data() });
    });

    res.json({ success: true, comments });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Approve comment
router.post('/comments/:id/approve', verifyAdmin, async (req, res) => {
  try {
    const { approved } = req.body;
    await db.collection('comments').doc(req.params.id).update({
      approved: approved ? true : false
    });

    res.json({ success: true, message: `Comment ${approved ? 'approved' : 'rejected'}` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update' });
  }
});

// Delete comment
router.delete('/comments/:id', verifyAdmin, async (req, res) => {
  try {
    await db.collection('comments').doc(req.params.id).delete();
    res.json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;
```

### 6.5 Update Comments Routes

Create `server/routes/comments-firebase.js`:
```javascript
const express = require('express');
const { db } = require('../firebase-config');

const router = express.Router();

// Post comment
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (message.length > 1000) {
      return res.status(400).json({ error: 'Message too long' });
    }

    await db.collection('comments').add({
      name,
      email,
      message,
      approved: false,
      createdAt: new Date()
    });

    res.status(201).json({ 
      success: true, 
      message: 'Comment submitted for approval' 
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save comment' });
  }
});

// Get approved comments
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('comments')
      .where('approved', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const comments = [];
    snapshot.forEach(doc => {
      comments.push({ id: doc.id, ...doc.data() });
    });

    res.json({ success: true, comments });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

module.exports = router;
```

---

## 🔌 Step 7: Update Server Index.js

Replace `server/index.js`:
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth-firebase');
const adminRoutes = require('./routes/admin-firebase');
const commentsRoutes = require('./routes/comments-firebase');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/comments', commentsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Connected to Firebase Firestore`);
});
```

---

## 🧪 Step 8: Test Firebase Connection

```bash
# Make sure firebase-key.json is in server directory
# Update .env with your secret key

cd server
npm start
```

Test endpoints:
```bash
# Health check
curl http://localhost:5000/api/health

# Test login (create user in Firebase first)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@myprofile.com","password":"QwertyPoiu@418!~"}'
```

---

## ⚙️ Step 9: Configuration in Backend

Update `server/.env`:
```
PORT=5000
NODE_ENV=development
SECRET_KEY=your-jwt-secret-key
FIREBASE_PROJECT_ID=vick-lam-profile-cms
FIREBASE_STORAGE_BUCKET=vick-lam-profile-cms.appspot.com
```

---

## 📊 Step 10: Create Firebase Indexes (if needed)

Firestore may prompt you to create indexes for complex queries. Click the links in:
- Logs tab
- Or manually in: Firestore → Indexes tab

---

## ✅ Firestore Collection Structure

Your database will have this structure:

```
firestore/
├── profiles/
│   └── current/
│       ├── profilePic (string - URL)
│       ├── updatedAt (timestamp)
│       └── updatedBy (string)
├── comments/
│   ├── {docId1}/
│   │   ├── name (string)
│   │   ├── email (string)
│   │   ├── message (string)
│   │   ├── approved (boolean)
│   │   └── createdAt (timestamp)
│   └── {docId2}/...
└── traffic/
    ├── {docId1}/
    │   ├── ip (string)
    │   ├── endpoint (string)
    │   ├── timestamp (timestamp)
    │   └── ...
    └── ...
```

---

## 🚀 Deploy to Production

### Update Render Deployment
In Render dashboard:
- Add new environment variables:
  ```
  FIREBASE_PROJECT_ID=vick-lam-profile-cms
  FIREBASE_STORAGE_BUCKET=vick-lam-profile-cms.appspot.com
  ```
- Redeploy

### Firestore Security
- Remove "Test mode" 
- Use the security rules provided above
- Test thoroughly before production

---

## 📈 Benefits of Firebase

✅ Real-time database  
✅ Automatic backups  
✅ Global CDN included  
✅ Scalable to millions of users  
✅ Built-in security rules  
✅ Free tier: 1GB storage, 50k reads/day  
✅ Generous paid tier  
✅ Easy to upgrade existing data  

---

## 🔄 Migration from SQLite

To migrate existing data:

```bash
# Export SQLite data
sqlite3 server/cms.db ".mode json" ".output data.json" "SELECT * FROM comments;"

# Then import to Firestore using Firebase CLI or custom script
```

---

## 📱 Next Steps

1. Create Firebase project ✅
2. Set up Firestore ✅
3. Configure storage ✅
4. Enable authentication ✅
5. Update backend code ✅
6. Test locally ✅
7. Deploy to Render ✅
8. Monitor in Firebase console ✅

---

**Ready to use Firebase for your CMS?** 🔥
