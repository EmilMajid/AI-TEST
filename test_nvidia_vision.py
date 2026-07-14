import fitz
import base64
import io
from openai import OpenAI

NVIDIA_KEY = "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"

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=NVIDIA_KEY
)

# Use the textbook PDF from public directory
pdf_path = "public/textbooks/6/alman-dili/book.pdf"
doc = fitz.open(pdf_path)

# Convert page 6 (index 5) to image - likely TOC/Lektion list
def pdf_page_to_base64(doc, page_idx, dpi=150):
    page = doc[page_idx]
    mat = fitz.Matrix(dpi/72, dpi/72)
    pix = page.get_pixmap(matrix=mat)
    img_bytes = pix.tobytes("png")
    return base64.b64encode(img_bytes).decode('utf-8')

print("=== TEST: Vision ilə PDF Mövzu Çıxarması ===")
print(f"PDF: {pdf_path}, Pages: {doc.page_count}")
print()

# Test with pages 5,6,7,8 (TOC area)
for page_idx in [5, 6, 7, 8, 9, 10]:
    print(f"Səhifə {page_idx+1} işlənir...")
    try:
        img_b64 = pdf_page_to_base64(doc, page_idx, dpi=200)
        
        response = client.chat.completions.create(
            model="meta/llama-3.2-11b-vision-instruct",
            messages=[{
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/png;base64,{img_b64}"
                        }
                    },
                    {
                        "type": "text",
                        "text": """Bu Alman dili dərslik səhifəsidir. 
Bu səhifədəki bütün mətni dəqiq oxu. 
Lektion başlıqları, mövzu adları, söz siyahıları varsa hamısını yaz.
Sadəcə mətni ver, başqa heç nə yazma."""
                    }
                ]
            }],
            temperature=0.1,
            max_tokens=2000
        )
        
        text = response.choices[0].message.content
        print(f"  ✅ Cavab ({len(text)} char):")
        print(f"  {text[:600]}")
        print()
        
    except Exception as e:
        print(f"  ❌ Xəta: {e}")
        print()

doc.close()
