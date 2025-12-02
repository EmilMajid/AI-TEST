#!/bin/bash

echo "🔧 EduTest AZ Environment Quraşdırması"
echo "======================================"

# .env faylı yaradın
if [ ! -f .env ]; then
    echo "📝 .env faylı yaradılır..."
    cat > .env << EOL
# xAI API Key
XAI_API_KEY=your-xai-api-key-here

# Alternative API Keys (optional)
OPENAI_API_KEY=your-openai-key-here
ANTHROPIC_API_KEY=your-anthropic-key-here

# Database
DATABASE_URL=sqlite:./edutest.db

# Next.js
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
EOL
    echo "✅ .env faylı yaradıldı"
else
    echo "ℹ️ .env faylı artıq mövcuddur"
fi

echo ""
echo "📋 Növbəti addımlar:"
echo "1. https://console.x.ai saytından API key əldə edin"
echo "2. .env faylında XAI_API_KEY-i dəyişin"
echo "3. npm run dev - development server başladın"
echo "4. http://localhost:3000/setup - quraşdırma səhifəsi"

echo ""
echo "💡 Alternativ API providers:"
echo "- OpenAI: https://platform.openai.com"
echo "- Anthropic: https://console.anthropic.com"
echo "- Local Ollama: https://ollama.ai"
