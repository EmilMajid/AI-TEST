#!/bin/bash

echo "🤖 OpenAI API Key Quraşdırması"
echo "=============================="

# API key-i environment variable olaraq təyin et
API_KEY="sk-abcdef1234567890abcdef1234567890abcdef12"

echo "📝 .env.local faylı yaradılır..."

# .env.local faylı yarat və ya yenilə
cat > .env.local << EOL
# OpenAI API Key
OPENAI_API_KEY=${API_KEY}

# Alternative API Keys (optional)
XAI_API_KEY=your-xai-key-here

# Database
DATABASE_URL=sqlite:./edutest.db

# Next.js
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
EOL

echo "✅ .env.local faylı yaradıldı!"
echo ""
echo "🚀 Növbəti addımlar:"
echo "1. npm run dev - development server restart edin"
echo "2. http://localhost:3000/dashboard - test yaradın"
echo "3. AI-generated sualları yoxlayın"
echo ""
echo "💰 Qiymət məlumatı:"
echo "- GPT-4o: ~$0.50-1.00 per 100 test"
echo "- Usage: https://platform.openai.com/usage"
echo ""
echo "🔒 Təhlükəsizlik qeydi:"
echo "- .env.local faylı .gitignore-da olmalıdır"
echo "- API key-i heç vaxt public repository-də saxlamayın"
