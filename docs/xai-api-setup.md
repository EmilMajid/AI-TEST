# xAI API Key Əldə Etmə Təlimatı

## 🔑 xAI API Key Necə Əldə Edilir

### 1. xAI Hesabı Yaradın
- [console.x.ai](https://console.x.ai) saytına daxil olun
- "Sign Up" düyməsini basın
- Email və şifrə ilə qeydiyyatdan keçin
- Email təsdiqini tamamlayın

### 2. API Key Yaradın
- Console-a daxil olun
- "API Keys" bölməsinə keçin
- "Create API Key" düyməsini basın
- Key-ə ad verin (məsələn: "TESTAI-AZ")
- Key-i kopyalayın və təhlükəsiz yerdə saxlayın

### 3. Kredit Əlavə Edin
- "Billing" bölməsinə keçin
- Kredit kartı əlavə edin
- Minimum $5-10 kredit əlavə edin
- Grok-3 modeli üçün kifayətdir

### 4. API Key-i Proyektə Əlavə Edin

#### .env faylı yaradın:
\`\`\`env
XAI_API_KEY=xai-your-api-key-here
\`\`\`

#### Və ya environment variable təyin edin:
\`\`\`bash
export XAI_API_KEY="xai-your-api-key-here"
\`\`\`

## 💰 Qiymət Məlumatları

### Grok-3 Model Qiymətləri:
- **Input**: $2.50 per 1M tokens
- **Output**: $10.00 per 1M tokens

### Test üçün təxmini xərc:
- 100 test sualı: ~$0.50-1.00
- 1000 test sualı: ~$5.00-10.00

## 🔧 Alternativ Həllər

### 1. OpenAI API (daha ucuz)
\`\`\`bash
export OPENAI_API_KEY="sk-your-openai-key"
\`\`\`

### 2. Anthropic Claude
\`\`\`bash
export ANTHROPIC_API_KEY="sk-ant-your-key"
\`\`\`

### 3. Local Model (pulsuz)
- Ollama ilə local Llama model
- Heç bir API key tələb etmir

## 🚀 Sürətli Test

API key əldə etdikdən sonra test edin:

\`\`\`bash
curl -X POST "https://api.x.ai/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -d '{
    "messages": [
      {
        "role": "user", 
        "content": "Salam, test mesajı"
      }
    ],
    "model": "grok-3",
    "stream": false
  }'
