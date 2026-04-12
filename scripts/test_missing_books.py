import sys
import os
from pathlib import Path

# Add paths
sys.path.append(os.path.join(os.getcwd(), "scripts"))
sys.path.append(os.path.join(os.getcwd(), "scripts", "rag_system"))

try:
    from ederslik_extractor import EDerslikExtractor
except ImportError as e:
    print(f"Import error: {e}")
    sys.exit(1)

def test_ids():
    extractor = EDerslikExtractor()
    test_ids = ["393", "795"]
    
    for eid in test_ids:
        print(f"Testing ID: {eid}...")
        try:
            pages = extractor.fetch_book(eid)
            print(f"  Result: Found {len(pages)} pages.")
        except Exception as e:
            print(f"  Result: FAILED with error: {e}")

if __name__ == "__main__":
    test_ids()
