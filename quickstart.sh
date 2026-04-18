#!/bin/bash
# Quick start script for development

echo "🚀 Starting Vick LAM Profile CMS..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Check if server node_modules exists
if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd server && npm install && cd ..
fi

echo ""
echo "✅ Dependencies installed"
echo ""
echo "📋 Starting services..."
echo ""
echo "🔷 Backend (Port 5000):"
echo "   Command: cd server && npm start"
echo ""
echo "🔷 Frontend (Port 5173):"
echo "   Command: npm run dev"
echo ""
echo "🔷 Admin Access:"
echo "   URL: http://localhost:5173/admin"
echo "   Login: Admin1"
echo "   Password: QwertyPoiu@418!~"
echo ""
echo "Start both services in separate terminals to run the full application."
echo ""
