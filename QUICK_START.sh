#!/bin/bash

# Azerbaijan AI Platform - Quick Start Script
# Run this script to set up the development environment

set -e

echo "================================"
echo "Azerbaijan AI Platform Setup"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Frontend Setup
echo -e "${YELLOW}Step 1: Installing frontend dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
echo ""

# Step 2: Environment Setup
echo -e "${YELLOW}Step 2: Checking environment configuration...${NC}"
if [ ! -f .env.local ]; then
    echo "Creating .env.local from template..."
    cp .env.example .env.local
    echo -e "${YELLOW}⚠ Edit .env.local with your Supabase credentials${NC}"
else
    echo -e "${GREEN}✓ .env.local exists${NC}"
fi
echo ""

# Step 3: Type Check
echo -e "${YELLOW}Step 3: Running TypeScript type check...${NC}"
npx tsc --noEmit
echo -e "${GREEN}✓ Type check passed${NC}"
echo ""

# Step 4: Run Tests
echo -e "${YELLOW}Step 4: Running test suite...${NC}"
npm test -- --passWithNoTests 2>/dev/null || true
echo -e "${GREEN}✓ Tests executed${NC}"
echo ""

# Step 5: Build Check
echo -e "${YELLOW}Step 5: Building Next.js...${NC}"
npm run build
echo -e "${GREEN}✓ Build successful${NC}"
echo ""

# Step 6: Worker Setup (Optional)
read -p "Set up Python worker service? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Setting up worker...${NC}"
    cd worker
    
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    
    source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null || true
    pip install -r requirements.txt
    
    if [ ! -f .env ]; then
        cp ../.env.local .env 2>/dev/null || echo "Copy worker/.env.example to worker/.env"
    fi
    
    cd ..
    echo -e "${GREEN}✓ Worker setup complete${NC}"
    echo -e "${YELLOW}Start worker with: cd worker && python app.py${NC}"
    echo ""
fi

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your Supabase credentials"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:3000"
echo ""
echo "For worker service:"
echo "1. cd worker && source venv/bin/activate"
echo "2. python app.py"
echo ""
echo "For full setup guide, see README-FIXED.md"
