import os
import sys
from pathlib import Path

# Add scripts to path
sys.path.append(str(Path(__file__).parent / "scripts"))

from llm_utils import call_gemini_vision, call_xai_vision, get_api_key

def test_vision():
    # Find a sample image
    sample_img = Path("public/textbooks/8/ingilis-dili/OEBPS/assets/img/10.jpg")
    if not sample_img.exists():
        print(f"Sample image not found: {sample_img}")
        return

    prompt = "Bu sənəddəki mətni oxu."
    
    print("--- Testing Gemini ---")
    gemini_key = get_api_key("gemini")
    if gemini_key:
        print(f"Gemini key found (starts with {gemini_key[:5]}...)")
        res = call_gemini_vision(prompt, [str(sample_img)], gemini_key)
        print(f"Gemini Result: {res[:100] if res else 'FAILED'}")
    else:
        print("Gemini key NOT FOUND")

    print("\n--- Testing XAI ---")
    xai_key = get_api_key("xai")
    if xai_key:
        print(f"XAI key found (starts with {xai_key[:5]}...)")
        res = call_xai_vision(prompt, [str(sample_img)], xai_key)
        print(f"XAI Result: {res[:100] if res else 'FAILED'}")
    else:
        print("XAI key NOT FOUND")

if __name__ == "__main__":
    test_vision()
