#!/bin/bash

echo "🚀 FastAPI Backend Deploy Təlimatı"
echo "=================================="

echo ""
echo "📋 Backend hosting seçimləri:"
echo ""

echo "1️⃣ Railway (Tövsiyə edilir)"
echo "   • https://railway.app saytına daxil olun"
echo "   • GitHub repo-nu connect edin"
echo "   • Python template seçin"
echo "   • scripts/fastapi_with_scraper.py faylını main.py olaraq təyin edin"
echo "   • Deploy edin"
echo ""

echo "2️⃣ Render"
echo "   • https://render.com saytına daxil olun"
echo "   • New Web Service yaradın"
echo "   • GitHub repo-nu connect edin"
echo "   • Build Command: pip install -r requirements.txt"
echo "   • Start Command: python scripts/fastapi_with_scraper.py"
echo ""

echo "3️⃣ Heroku"
echo "   • Procfile yaradın: web: python scripts/fastapi_with_scraper.py"
echo "   • requirements.txt faylını root-da yerləşdirin"
echo "   • git push heroku main"
echo ""

echo "4️⃣ Vercel Environment Variables"
echo "   • Vercel Dashboard → Project → Settings → Environment Variables"
echo "   • Name: NEXT_PUBLIC_BACKEND_URL"
echo "   • Value: https://your-backend-url.com"
echo "   • Environment: Production, Preview, Development"
echo ""

echo "✅ Deploy etdikdən sonra:"
echo "   • Backend URL-ni Vercel-də təyin edin"
echo "   • http://localhost:3000/admin səhifəsində status yoxlayın"
echo "   • Test yaradıb AI funksiyasını sınayın"
