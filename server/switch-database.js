#!/usr/bin/env node

/**
 * Database Switcher
 * Easily switch between SQLite and Firebase
 * Usage: node switch-database.js [sqlite|firebase]
 */

const fs = require('fs');
const path = require('path');

const serverDir = __dirname;
const indexPath = path.join(serverDir, 'index.js');
const indexSqlitePath = path.join(serverDir, 'index-sqlite.js');
const indexFirebasePath = path.join(serverDir, 'index-firebase.js');

function switchTo(database) {
  console.log(`\n🔄 Switching to ${database.toUpperCase()} database...\n`);

  try {
    if (database === 'sqlite') {
      // Backup current and restore SQLite version
      if (fs.existsSync(indexPath)) {
        fs.writeFileSync(
          path.join(serverDir, 'index-firebase-backup.js'),
          fs.readFileSync(indexPath, 'utf8')
        );
      }
      
      if (!fs.existsSync(indexSqlitePath)) {
        console.log('❌ index-sqlite.js not found. Checking if index.js uses SQLite...');
        const indexContent = fs.readFileSync(indexPath, 'utf8');
        if (indexContent.includes('db.json') || indexContent.includes('cms.db')) {
          console.log('✅ Current index.js appears to use SQLite');
          console.log('✅ No changes needed - already using SQLite');
          process.exit(0);
        }
      }

      if (fs.existsSync(indexSqlitePath)) {
        fs.writeFileSync(indexPath, fs.readFileSync(indexSqlitePath, 'utf8'));
        console.log('✅ Switched to SQLite');
        console.log('\nNext steps:');
        console.log('  npm install');
        console.log('  npm start');
      }

    } else if (database === 'firebase') {
      // Backup current and switch to Firebase version
      if (fs.existsSync(indexPath)) {
        fs.writeFileSync(
          path.join(serverDir, 'index-sqlite-backup.js'),
          fs.readFileSync(indexPath, 'utf8')
        );
      }

      if (!fs.existsSync(indexFirebasePath)) {
        console.log('❌ index-firebase.js not found');
        console.log('Create it first with: npm run setup:firebase');
        process.exit(1);
      }

      fs.writeFileSync(indexPath, fs.readFileSync(indexFirebasePath, 'utf8'));
      console.log('✅ Switched to Firebase');
      console.log('\nNext steps:');
      console.log('  1. Verify firebase-key.json exists');
      console.log('  2. node validate-firebase-setup.js');
      console.log('  3. npm install');
      console.log('  4. npm start');

    } else {
      console.log('❌ Invalid database. Use: sqlite or firebase');
      process.exit(1);
    }

    console.log('\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Get argument
const arg = process.argv[2];

if (!arg) {
  console.log('\n📊 Current Database Status:\n');
  
  try {
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    if (indexContent.includes('firebase')) {
      console.log('📍 Currently using: FIREBASE');
    } else if (indexContent.includes('db.json') || indexContent.includes('cms.db')) {
      console.log('📍 Currently using: SQLITE');
    } else {
      console.log('📍 Could not determine current database');
    }

    console.log('\nUsage: node switch-database.js [sqlite|firebase]\n');
    console.log('Examples:');
    console.log('  node switch-database.js sqlite    # Switch to SQLite');
    console.log('  node switch-database.js firebase  # Switch to Firebase\n');

  } catch (error) {
    console.error('Error:', error.message);
  }
  
  process.exit(0);
}

switchTo(arg.toLowerCase());
