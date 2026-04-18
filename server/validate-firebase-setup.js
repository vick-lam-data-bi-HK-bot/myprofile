#!/usr/bin/env node

/**
 * Firebase Setup Validator
 * Checks if all Firebase requirements are properly configured
 * Usage: node validate-firebase-setup.js
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const serverDir = __dirname;
const rootDir = path.join(serverDir, '..');

console.log('\n🔥 Firebase Setup Validator\n');
console.log('='.repeat(50));

let passCount = 0;
let failCount = 0;
let warnCount = 0;

function check(name, condition, message = '') {
  if (condition) {
    console.log(`✅ ${name}`);
    passCount++;
  } else {
    console.log(`❌ ${name}`);
    if (message) console.log(`   → ${message}`);
    failCount++;
  }
}

function warn(name, message = '') {
  console.log(`⚠️  ${name}`);
  if (message) console.log(`   → ${message}`);
  warnCount++;
}

// --- Check 1: Node environments ---
console.log('\n📦 Requirements:');
check('Node.js installed', process.version.startsWith('v'));
check('npm available', require('child_process').execSync('npm -v', { encoding: 'utf8' }).trim());

// --- Check 2: Firebase key file ---
console.log('\n🔐 Firebase Credentials:');
const firebaseKeyPath = path.join(serverDir, 'firebase-key.json');
const hasFirebaseKey = fs.existsSync(firebaseKeyPath);
check(
  'firebase-key.json exists',
  hasFirebaseKey,
  'Download from Firebase Console → Project Settings → Service Accounts'
);

if (hasFirebaseKey) {
  try {
    const keyContent = JSON.parse(fs.readFileSync(firebaseKeyPath, 'utf8'));
    check('firebase-key.json valid JSON', true);
    check(
      'firebase-key.json has project_id',
      keyContent.project_id !== undefined,
      `project_id: ${keyContent.project_id || 'missing'}`
    );
    check(
      'firebase-key.json has private_key',
      keyContent.private_key !== undefined,
      keyContent.private_key ? '(key present)' : 'missing'
    );
  } catch (e) {
    check('firebase-key.json valid JSON', false, `Parse error: ${e.message}`);
  }
}

// --- Check 3: .env configuration ---
console.log('\n⚙️  Configuration:');
const envPath = path.join(serverDir, '.env');
const hasEnv = fs.existsSync(envPath);
check('.env file exists', hasEnv, 'Copy .env.firebase to .env');

if (hasEnv) {
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    check('FIREBASE_PROJECT_ID set', envContent.includes('FIREBASE_PROJECT_ID') && !envContent.match(/FIREBASE_PROJECT_ID=your-/));
    check('FIREBASE_STORAGE_BUCKET set', envContent.includes('FIREBASE_STORAGE_BUCKET') && !envContent.match(/FIREBASE_STORAGE_BUCKET=your-/));
    check('JWT_SECRET set', envContent.includes('JWT_SECRET') && !envContent.match(/JWT_SECRET=your-/));
    
    if (envContent.includes('NODE_ENV=development') || envContent.includes('NODE_ENV=production')) {
      check('NODE_ENV configured', true);
    } else {
      warn('NODE_ENV not set', 'Add NODE_ENV=development or production to .env');
    }
  } catch (e) {
    check('.env readable', false, e.message);
  }
}

// --- Check 4: Dependencies ---
console.log('\n📚 Dependencies:');
const packageJsonPath = path.join(serverDir, 'package.json');
try {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  check('firebase-admin in package.json', pkg.dependencies['firebase-admin'] !== undefined);
  check('express in package.json', pkg.dependencies['express'] !== undefined);
  check('dotenv in package.json', pkg.dependencies['dotenv'] !== undefined);
  check('cors in package.json', pkg.dependencies['cors'] !== undefined);
} catch (e) {
  check('package.json readable', false, e.message);
}

// --- Check 5: Firebase route files ---
console.log('\n📁 Firebase Routes:');
const routes = [
  'auth-firebase.js',
  'admin-firebase.js',
  'comments-firebase.js',
  'traffic-firebase.js'
];
const routesDir = path.join(serverDir, 'routes');
routes.forEach(route => {
  const routePath = path.join(routesDir, route);
  check(`${route} exists`, fs.existsSync(routePath));
});

// --- Check 6: Firebase config file ---
console.log('\n🔧 Firebase Configuration:');
const fbConfigPath = path.join(serverDir, 'firebase-config.js');
check('firebase-config.js exists', fs.existsSync(fbConfigPath));

// --- Check 7: Server entry points ---
console.log('\n🚀 Server Entry Points:');
const indexFirebasePath = path.join(serverDir, 'index-firebase.js');
const indexPath = path.join(serverDir, 'index.js');
check('index-firebase.js exists', fs.existsSync(indexFirebasePath));
check('index.js exists', fs.existsSync(indexPath));

const indexContent = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, 'utf8') : '';
if (indexContent.includes('firebase')) {
  check('index.js configured for Firebase', true);
} else {
  warn('index.js may not use Firebase', 'Consider running: cp server/index-firebase.js server/index.js');
}

// --- Check 8: .gitignore ---
console.log('\n🔒 Security:');
const gitignorePath = path.join(rootDir, '.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  check(
    'firebase-key.json in .gitignore',
    gitignoreContent.includes('firebase-key.json'),
    'Add "server/firebase-key.json" to .gitignore'
  );
  check(
    '.env in .gitignore',
    gitignoreContent.includes('.env'),
    'Add "server/.env" to .gitignore'
  );
} else {
  warn('.gitignore missing', 'Create one to protect credentials');
}

// --- Summary ---
console.log('\n' + '='.repeat(50));
console.log('\n📊 Summary:');
console.log(`   ✅ Passed: ${passCount}`);
console.log(`   ❌ Failed: ${failCount}`);
console.log(`   ⚠️  Warnings: ${warnCount}`);

if (failCount === 0) {
  console.log('\n🎉 All checks passed! Firebase is ready.\n');
  console.log('Next steps:');
  console.log('  1. npm install');
  console.log('  2. npm start');
  console.log('  3. Visit http://localhost:5000/api/health\n');
  process.exit(0);
} else {
  console.log('\n⚠️  Please fix the errors above before proceeding.\n');
  console.log('Need help?');
  console.log('  → See FIREBASE_QUICK_START.md');
  console.log('  → See FIREBASE_MIGRATION_GUIDE.md\n');
  process.exit(1);
}
