#!/bin/bash
# Automated deployment script for Render backend

# This file should be committed to GitHub for use with Render

echo "🚀 Starting CMS Backend Server in Production Mode"

# Set production environment
export NODE_ENV=production

# Run database initialization and start server
cd server
npm install --production
npm start
