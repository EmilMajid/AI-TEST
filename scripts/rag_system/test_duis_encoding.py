# test_duis_encoding.py
import sys
import os
import logging

# Ensure we can import from current dir
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from encoding_fixer import EncodingFixer
from quality_scorer import QualityScorer

def test_duis_perfection():
    logging.basicConfig(level=logging.INFO)
    fixer = EncodingFixer()
    scorer = QualityScorer()
    
    # User's "bad" encoding example
    bad_text = "øù,49Ԥ*g50Ԥ 47 )ԥDOL\\ԥW TԥOLPDW $GGÕP G]ԥOGLQ 1ԥWLFԥ"
    
    print("\n" + "="*50)
    print("TESTING DUİS ENCODING REPAIR")
    print("="*50)
    print(f"INPUT (Corrupted):\n{bad_text}")
    
    # Check anomalies before
    stats_before = fixer.detect_anomalies(bad_text)
    print(f"Stats Before: Ratio {stats_before['ratio']}, Confidence {stats_before['confidence']}")
    
    # Fix
    fixed = fixer.fix(bad_text)
    
    # Check quality after
    quality = scorer.score(fixed)
    
    print("\n" + "-"*30)
    print(f"OUTPUT (Fixed):\n{fixed}")
    print("-"*30)
    print(f"Final Quality Score: {quality['score']}")
    print(f"Remaining Anomaly Ratio: {quality['anomaly_ratio']}")
    
    # Verify expected words
    expected = ["ə", "ş", "h", "fəaliyyət", "Təlimat", "Addım", "düzəldin", "Nəticə"]
    found = [word.lower() for word in expected if word.lower() in fixed.lower()]
    
    print(f"\nRestored elements: {len(found)}/{len(expected)}")
    if "ə" in fixed and "təlimat" in fixed.lower() and "addım" in fixed.lower():
        print("✅ SUCCESS: DUİS mapping works!")
    else:
        print("⚠️ PARTIAL SUCCESS: Check mappings.")

if __name__ == "__main__":
    test_duis_perfection()
