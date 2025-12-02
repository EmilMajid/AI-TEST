#!/bin/bash

echo "🤖 OpenAI API Key Quraşdırması"
echo "=============================="

# İlk API key-i seç
OPENAI_API_KEY="sk-abcdef1234567890abcdef1234567890abcdef12"

echo "📝 .env.local faylı yaradılır..."

# .env.local faylı yarat və ya yenilə
cat > .env.local << EOL
# OpenAI API Key
OPENAI_API_KEY=${OPENAI_API_KEY}

# xAI API Key (optional)
XAI_API_KEY=xai-B4n95hnsgqRnqmBZFo5nNaRpYf1v7Y8XhyYxlCqIhH7BJC1AqKV6fsRC8EJfCMoOFw8EeGEAEHk32qnN

# Database
DATABASE_URL=sqlite:./edutest.db

# Next.js
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Backend URL (optional)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
EOL

echo "✅ .env.local faylı yaradıldı!"
echo ""
echo "🔑 Təyin edilən API Key: ${OPENAI_API_KEY}"
echo ""
echo "🚀 Növbəti addımlar:"
echo "1. npm run dev - development server restart edin"
echo "2. http://localhost:3000/dashboard - test yaradın"
echo "3. OpenAI GPT-4o AI-generated sualları yoxlayın"
echo ""
echo "💰 Qiymət məlumatı:"
echo "- GPT-4o: ~$0.50-1.00 per 100 test"
echo "- Usage: https://platform.openai.com/usage"
echo ""
echo "🔒 Təhlükəsizlik qeydi:"
echo "- .env.local faylı .gitignore-da olmalıdır"
echo "- API key-i heç vaxt public repository-də saxlamayın"
