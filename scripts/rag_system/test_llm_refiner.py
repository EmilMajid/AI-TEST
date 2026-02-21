# test_llm_refiner.py
import sys
import os
import logging

# Ensure we can import from current dir
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from llm_refiner import LLMContentRefiner
from rag_pipeline import RAGIngestionPipeline

def test_perfection():
    logging.basicConfig(level=logging.INFO)
    pipeline = RAGIngestionPipeline()
    
    # User's "bad" example
    bad_text = "Addm 1. Stkanlardan birini isti su, digrini is soyuq su ilə doldurun. Addm 2. Stkanlarn hr birin eyni əldə qnd paras lav edib qardrn. Ntic xarn. Qnd hans stkandak suda daha tez hll olur? Brk maddnin suda hll olmas hlledicinin temperaturu artdqca srtlnir."
    
    print("\n" + "="*50)
    print("TESTING OCR PERFECTION PIPELINE")
    print("="*50)
    print(f"INPUT (Corrupted):\n{bad_text}")
    
    # Process through pipeline
    result = pipeline.process(bad_text, subject="Təbiət")
    
    print("\n" + "-"*30)
    print(f"OUTPUT (Refined):\n{result['text']}")
    print("-"*30)
    print(f"Refinement used: {result['refinement_used']}")
    print(f"Final Quality: {result['quality']['score']}")
    print(f"Vowel Loss Ratio: {result['quality']['vowel_loss_ratio']}")
    
    # Expected fragments
    expected = ["Addım", "isti su", "soyuq su", "qarışdırın", "həll olur", "sürətlənir"]
    found = [f for f in expected if f in result['text']]
    
    print(f"\nRestored fragments: {len(found)}/{len(expected)}")
    if len(found) == len(expected):
        print("✅ SUCCESS: Text perfectly restored!")
    else:
        print("⚠️ PARTIAL SUCCESS: Check output.")

if __name__ == "__main__":
    test_perfection()
