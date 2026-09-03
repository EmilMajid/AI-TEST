#!/bin/bash

echo "🔧 API Key Formatı Düzəltmə"
echo "============================"

# Mövcud .env.local faylını yoxla
if [ -f .env.local ]; then
    echo "📝 Mövcud .env.local faylı tapıldı"
    
    # xAI key-i yoxla
    if grep -q "XAI_API_KEY" .env.local; then
        XAI_KEY=$(grep "XAI_API_KEY" .env.local | cut -d'=' -f2)
        if [[ $XAI_KEY == xai-* ]]; then
            echo "✅ xAI API key düzgün formatdadır"
        else
            echo "❌ xAI API key səhv formatdadır (xai- ilə başlamalıdır)"
        fi
    else
        echo "⚠️ xAI API key tapılmadı"
    fi
    
    # OpenAI key-i yoxla
    if grep -q "OPENAI_API_KEY" .env.local; then
        OPENAI_KEY=$(grep "OPENAI_API_KEY" .env.local | cut -d'=' -f2)
        if [[ $OPENAI_KEY == sk-* ]]; then
            echo "✅ OpenAI API key düzgün formatdadır"
        else
            echo "❌ OpenAI API key səhv formatdadır (sk- ilə başlamalıdır)"
        fi
    else
        echo "⚠️ OpenAI API key tapılmadı"
    fi
else
    echo "📝 .env.local faylı yaradılır..."
    cat > .env.local << EOL
# xAI API Key (Grok)
XAI_API_KEY=xai-B4n95hnsgqRnqmBZFo5nNaRpYf1v7Y8XhyYxlCqIhH7BJC1AqKV6fsRC8EJfCMoOFw8EeGEAEHk32qnN

# OpenAI API Key (əgər varsa)
# OPENAI_API_KEY=sk-your-openai-key-here

# Database
DATABASE_URL=sqlite:./testai.az.db

# Next.js
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Backend URL (optional)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
EOL
    echo "✅ .env.local faylı yaradıldı"
fi

echo ""
echo "🔑 API Key Format Qaydaları:"
echo "- xAI API Key: xai- ilə başlamalıdır"
echo "- OpenAI API Key: sk- ilə başlamalıdır"
echo ""
echo "🚀 Növbəti addımlar:"
echo "1. .env.local faylında API key-ləri yoxlayın"
echo "2. npm run dev - serveri restart edin"
echo "3. http://localhost:3000/dashboard - test yaradın"
