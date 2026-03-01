
import sys
import os
sys.path.append(os.path.join(os.getcwd(), "scripts", "rag_system"))
from skeleton_refiner import SkeletonRefiner

refiner = SkeletonRefiner()
test_words = ["hisslr", "gstrrk", "myyn", "Hceyr", "yaamamz", "salam", "olmamz"]
print("Testing SkeletonRefiner on tebiet-5-h1 crumbs:")
for w in test_words:
    print(f"{w} -> {refiner.refine_word(w)}")
