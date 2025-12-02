#!/bin/bash

echo "🤖 Real OpenAI API Key Quraşdırması"
echo "=================================="

# Real OpenAI API key
OPENAI_API_KEY="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"

echo "📝 .env.local faylı yaradılır..."

# .env.local faylı yarat və ya yenilə
cat > .env.local << EOL
# OpenAI API Key (Real)
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

echo "✅ .env.local faylı real OpenAI API key ilə yaradıldı!"
echo ""
echo "🔑 Təyin edilən API Key: ${OPENAI_API_KEY:0:20}..."
echo ""
echo "🚀 Növbəti addımlar:"
echo "1. npm run dev - development server restart edin"
echo "2. http://localhost:3000/dashboard - test yaradın"
echo "3. Real OpenAI GPT-4o AI-generated sualları yoxlayın"
echo ""
echo "💰 Real API Key ilə:"
echo "- GPT-4o: ~$0.50-1.00 per 100 test"
echo "- Usage: https://platform.openai.com/usage"
echo "- Billing: https://platform.openai.com/account/billing"
echo ""
echo "🔒 Təhlükəsizlik qeydi:"
echo "- Bu real API key-dir, diqqətlə istifadə edin"
echo "- .env.local faylı .gitignore-da olmalıdır"
echo "- API key-i heç vaxt public repository-də saxlamayın"
