#!/bin/bash
# Step-by-step deployment script

set -e

echo "🚀 Starting Deployment Process..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Building Frontend...${NC}"
npm run build

echo -e "${BLUE}Step 2: Preparing for Deployment...${NC}"
echo "Frontend built in dist/ directory ✅"

echo ""
echo -e "${GREEN}✅ Local Build Complete!${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Deploy Backend to Render:"
echo "   - Go to https://render.com"
echo "   - Create new Web Service"
echo "   - Connect GitHub repo: vick-lam-data-bi-HK-bot/myprofile"
echo "   - Build Command: cd server && npm install"
echo "   - Start Command: cd server && npm start"
echo "   - Add environment variables (see DEPLOYMENT_GUIDE.md)"
echo ""
echo "2. Deploy Frontend to Vercel:"
echo "   - Install Vercel CLI: npm i -g vercel"
echo "   - Run: vercel --prod"
echo "   - Set VITE_API_URL to your Render backend URL"
echo ""
echo "3. Push to GitHub:"
echo "   git add -A && git commit -m 'deployment: production configuration' && git push"
echo ""
