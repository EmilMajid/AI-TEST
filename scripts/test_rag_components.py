import sys
import os
from pathlib import Path

# Fix import path
sys.path.append(str(Path.cwd() / "scripts"))

try:
    from rag_cleaner import RAGCleaner
    from quality_scorer import QualityScorer
except ImportError:
    print("Classes not found in scripts/")
    sys.exit(1)

def test_components():
    cleaner = RAGCleaner()
    scorer = QualityScorer()

    # User's provided bad example
    bad_text = "1 nnnnnnnnnnn nenleмen n e K ooooooooooo iiiiiiiiiii ttttttttttt kkkkkkkkkkk eeeeeeeeeee LLLLLLLLLLL Grammatik • Personalpronomen"
    
    # A normal German sentence
    good_text = "Ich heiße Murad. Ich komme aus Aserbaidschan. Das ist mein Buch."
    
    # A simplified version of what we expect after cleaning bad text
    # (Though the bad text above is very noisy, let's see what happens)
    
    samples = [
        ("Bad Text", bad_text),
        ("Good Text", good_text),
        ("Mixed Text", "W h e r  k o m m s t  d u? I c h  k o m m e  a u s  B a k u.")
    ]

    print("=== Testing RAG Components ===\n")

    for name, text in samples:
        print(f"--- {name} ---")
        print(f"Original: {text[:100]}...")
        
        cleaned = cleaner.clean(text)
        print(f"Cleaned:  {cleaned[:100]}...")
        
        score_data = scorer.score(cleaned)
        print(f"Score Data: {score_data}")
        
        # Check if it would pass validation (threshold 60)
        final_score = score_data["score"] * 100
        print(f"Final Score: {final_score}")
        if final_score < 60:
            print("RESULT: REJECTED (< 60)")
        else:
            print("RESULT: ACCEPTED")
        print()

if __name__ == "__main__":
    test_components()
