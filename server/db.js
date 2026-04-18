const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('✅ Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  // Admin users table
  db.run(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Profile data table
  db.run(`
    CREATE TABLE IF NOT EXISTS profile_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      profile_pic LONGBLOB,
      profile_pic_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_by TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Comments table
  db.run(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      approved INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Traffic analytics table
  db.run(`
    CREATE TABLE IF NOT EXISTS traffic (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT,
      endpoint TEXT,
      method TEXT,
      user_agent TEXT,
      referer TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create default admin if not exists
  const bcryptjs = require('bcryptjs');
  const hashedPassword = bcryptjs.hashSync('QwertyPoiu@418!~', 10);
  
  db.run(
    'INSERT OR IGNORE INTO admins (username, password) VALUES (?, ?)',
    ['Admin1', hashedPassword],
    (err) => {
      if (err) {
        console.error('Error creating default admin:', err);
      } else {
        console.log('✅ Default admin user ready (Admin1)');
      }
    }
  );
}

module.exports = db;
