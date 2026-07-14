from openai import OpenAI

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key="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"
)

# Test 1: Simple text request
print("=== TEST 1: Sadə mətn sorğusu ===")
try:
    completion = client.chat.completions.create(
        model="deepseek-ai/deepseek-v4-pro",
        messages=[{"role": "user", "content": "Alman dilində 'die Schule' nə deməkdir? Bir cümlə cavab ver."}],
        temperature=0.5,
        max_tokens=100,
        stream=False
    )
    print("✅ API açarı işləyir!")
    print(f"Cavab: {completion.choices[0].message.content}")
    print(f"Usage: {completion.usage}")
except Exception as e:
    print(f"❌ Xəta: {e}")

# Test 2: List available vision models
print("\n=== TEST 2: Mövcud modellər (vision) ===")
try:
    models = client.models.list()
    vision_models = [m.id for m in models.data if 'vision' in m.id.lower() or 'llava' in m.id.lower() or 'vl' in m.id.lower()]
    print(f"Vision modellər: {vision_models[:10]}")
    print(f"Ümumi model sayı: {len(models.data)}")
    all_models = [m.id for m in models.data]
    print(f"İlk 20 model: {all_models[:20]}")
except Exception as e:
    print(f"❌ Model siyahısı xətası: {e}")
