#!/bin/bash

echo "🤖 xAI (Grok) API Key Quraşdırması"
echo "================================="

# API key-i environment variable olaraq təyin et
XAI_API_KEY="xai-B4n95hnsgqRnqmBZFo5nNaRpYf1v7Y8XhyYxlCqIhH7BJC1AqKV6fsRC8EJfCMoOFw8EeGEAEHk32qnN"

echo "📝 .env.local faylı yaradılır..."

# .env.local faylı yarat və ya yenilə
cat > .env.local << EOL
# xAI API Key (Grok)
XAI_API_KEY=${XAI_API_KEY}

# Alternative API Keys (optional)
OPENAI_API_KEY=your-openai-key-here

# Database
DATABASE_URL=sqlite:./testai.az.db

# Next.js
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Backend URL (optional)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
EOL

echo "✅ .env.local faylı yaradıldı!"
echo ""
echo "🚀 Növbəti addımlar:"
echo "1. npm run dev - development server restart edin"
echo "2. http://localhost:3000/dashboard - test yaradın"
echo "3. Grok AI-generated sualları yoxlayın"
echo ""
echo "💰 Qiymət məlumatı:"
echo "- Grok-3: ~$0.50-1.00 per 100 test"
echo "- Usage: https://console.x.ai/usage"
echo ""
echo "🔒 Təhlükəsizlik qeydi:"
echo "- .env.local faylı .gitignore-da olmalıdır"
echo "- API key-i heç vaxt public repository-də saxlamayın"
