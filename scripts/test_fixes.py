import sys
import os
from pathlib import Path

# Add the scripts directory to sys.path to find the components
scripts_dir = Path(__file__).parent.parent
sys.path.append(str(scripts_dir))
sys.path.append(str(scripts_dir / "rag_system"))

from rag_system.normalizer import Normalizer
from rag_system.ocr_repair import OCRRepair
from rag_system.auto_language_correction import AutoLanguageCorrector

def test_fixes():
    # Initialize components
    normalizer = Normalizer()
    repairer = OCRRepair()
    corrector = AutoLanguageCorrector()
    
    test_cases = [
        # Hyphenation cases
        {
            "input": "2020-ci ilin noyabrın 8-də Azərbaycan tele- viziyası elan etdi",
            "expected_fragment": "televiziyası"
        },
        {
            "input": "Qara- bağ Azərbaycandır!",
            "expected_fragment": "Qarabağ"
        },
        {
            "input": "Bu- dur, canlı yayım başlandı.",
            "expected_fragment": "Budur"
        },
        # Vowel loss cases
        {
            "input": "Sinir sisteminin n kimi hmiyyti vardr?",
            "expected_fragment": "əhəmiyyəti"
        },
        {
            "input": "Onun saysind bdnimizi dz vziyytd saxlaya",
            "expected_fragment": "bədənimizi"
        },
        {
            "input": "Smk sn zaman gips sars qoyulmasnn n kimi hmiyyti vardr?",
            "expected_fragment": "Sümük"
        },
        {
            "input": "nsan orqanizmind qan hans orqanda oksigenl znginlir?",
            "expected_fragment": "insan"
        }
    ]
    
    print("\n--- RAG PIPELINE EMERGENCY FIX TEST ---\n")
    all_passed = True
    
    for i, case in enumerate(test_cases, 1):
        # Apply normalization
        norm = normalizer.normalize(case["input"])
        # Apply repair
        rep = repairer.repair(norm)
        # Apply correction
        final = corrector.correct(rep)
        
        passed = case["expected_fragment"].lower() in final.lower()
        status = "PASSED" if passed else "FAILED"
        if not passed: all_passed = False
        
        print(f"Test {i}: {status}")
        print(f"  Input: {case['input']}")
        print(f"  Output: {final}")
        print(f"  Expected: {case['expected_fragment']}\n")
        
    if all_passed:
        print("ALL TESTS PASSED! Pipeline is now robust.")
    else:
        print("SOME TESTS FAILED. Needs further tuning.")

if __name__ == "__main__":
    test_fixes()
