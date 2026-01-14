import os
import sys
# Add scripts dir to path to find other modules if needed, but here we just import local llm_utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from kag_prototyping.llm_utils import extract_triples

def run_test():
    # Sample text from a hypothetical biology textbook
    sample_text = """
    Tənəffüs sistemi orqanizmin oksigenlə təmin olunmasını və karbon qazının xaric edilməsini həyata keçirir.
    İnsanda tənəffüs sistemi havaaparıcı yollar və ağciyərlərdən ibarətdir.
    Havaaparıcı yollara burun boşluğu, udlaq, qırtlaq, nəfəs borusu və bronxlar aiddir.
    Ağciyərlər döş qəfəsində yerləşir.
    """
    
    print(f"Input Text:\n{sample_text}\n")
    print("Extracting Triples (using Gemini)...")
    
    # We assume GEMINI_API_KEY is set in the environment. 
    # If not, the user needs to provide it or we fallback to another provider if configured.
    
    try:
        result = extract_triples(sample_text, provider="gemini")
        print("\n--- Extracted Data ---\n")
        print(result)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    run_test()
