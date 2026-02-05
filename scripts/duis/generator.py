import os
import json
import sys
from pathlib import Path

# Add root to path to import llm_utils
root_dir = str(Path(__file__).parent.parent.parent)
if root_dir not in sys.path:
    sys.path.append(root_dir)

from scripts.llm_utils import generate_gold_standard_question, generate_gold_standard_question_vision

class DuisGenerator:
    def __init__(self, chunks_base="data/chunks", bank_path="data/question_bank_duis.json"):
        self.chunks_base = chunks_base
        self.bank_path = bank_path
        if sys.stdout.encoding != 'utf-8':
            sys.stdout.reconfigure(encoding='utf-8')

    def load_bank(self):
        if os.path.exists(self.bank_path):
            with open(self.bank_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return []

    def save_bank(self, bank):
        with open(self.bank_path, "w", encoding="utf-8") as f:
            json.dump(bank, f, ensure_ascii=False, indent=2)

    def generate_for_book(self, book_id, grade, subject, limit=None):
        print(f"  [GENERATOR] Processing book: {book_id}")
        chunk_dir = os.path.join(self.chunks_base, book_id)
        if not os.path.exists(chunk_dir):
            print(f"  [ERROR] Chunk directory not found: {chunk_dir}")
            return False

        bank = self.load_bank()
        # Track existing to avoid duplicates
        existing_sources = set()
        for q in bank:
            if q.get("metadata", {}).get("book_id") == book_id:
                existing_sources.add(q.get("metadata", {}).get("chunk_file"))

        chunk_files = sorted([f for f in os.listdir(chunk_dir) if f.endswith(".txt")])
        new_count = 0

        for cf in chunk_files:
            if limit and new_count >= limit:
                break
                
            if cf in existing_sources:
                continue

            print(f"    -> Generating for {cf}...")
            cf_path = os.path.join(chunk_dir, cf)
            
            with open(cf_path, "r", encoding="utf-8") as f:
                lines = f.readlines()
            
            title = lines[0].replace("TITLE:", "").strip()
            content = "".join(lines[3:]) # Skip Title and Source lines
            
            # Determine mode
            joined_lines = "".join(lines)
            is_scanned = "MODE: SCANNED_IMAGES" in joined_lines
            print(f"      [DEBUG] is_scanned: {is_scanned} for {cf}")
            
            if is_scanned:
                print(f"      [VISION] Processing scanned images for {cf}...")
                image_refs = [line.replace("IMAGE_PATH:", "").strip() for line in lines if line.startswith("IMAGE_PATH:")]
                # Resolve image paths relative to textbook_dir
                # Note: book_id is something like 'azerbaycan-tarixi'
                # For History 8, textbook_dir is 'public/textbooks/8/azerbaycan-tarixi'
                # We need to find or pass the textbook_dir here.
                # Since orchestrator knows it, we'll assume it's passed or searchable.
                
                # Search common locations
                resolved_images = []
                common_roots = [
                    f"public/textbooks/{grade}/" + book_id,
                    f"public/textbooks/{grade}/" + book_id.replace("_", "-"),
                    "public/textbooks/8/azerbaycan-tarixi" # Hardcoded fallback for now
                ]
                
                for ref in image_refs:
                    found = False
                    for root in common_roots:
                        full_p = os.path.join(root, ref)
                        if os.path.exists(full_p):
                            resolved_images.append(full_p)
                            found = True
                            break
                
                if not resolved_images:
                    print(f"      [ERROR] Could not resolve images for {cf}")
                    continue
                
                response = generate_gold_standard_question_vision(
                    subject=subject,
                    grade=grade,
                    image_paths=resolved_images,
                    bloom="Təhlil",
                    skill=title
                )
            else:
                if len(content) < 100:
                    print(f"      [SKIP] Content too short for {cf}")
                    continue

                response = generate_gold_standard_question(
                    subject=subject,
                    grade=grade,
                    context=content,
                    bloom="Təhlil",
                    skill=title
                )

            if response:
                try:
                    # Parse response (handling potential markdown)
                    clean_json = response.replace("```json", "").replace("```", "").strip()
                    if "{" in clean_json:
                        start = clean_json.find("{")
                        end = clean_json.rfind("}") + 1
                        clean_json = clean_json[start:end]
                    
                    parsed = json.loads(clean_json)
                    questions = []
                    if isinstance(parsed, list):
                        questions = parsed
                    elif "questions" in parsed:
                        questions = parsed["questions"]
                    else:
                        questions = [parsed]

                    for q in questions:
                        q["metadata"] = {
                            "book_id": book_id,
                            "grade": grade,
                            "subject": subject,
                            "topic": title,
                            "chunk_file": cf
                        }
                        bank.append(q)
                    
                    new_count += 1
                    # Save after each successful chunk to prevent data loss
                    self.save_bank(bank)
                    print(f"      ✅ Success: {len(questions)} questions added.")
                except Exception as e:
                    print(f"      ❌ Parse Error for {cf}: {e}")
            else:
                print(f"      ❌ API Failure for {cf}")

        print(f"  [GENERATOR] Added questions for {new_count} chunks.")
        return True

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="DUİS Generator")
    parser.add_argument("--book_id", required=True)
    parser.add_argument("--grade", required=True)
    parser.add_argument("--subject", required=True)
    parser.add_argument("--limit", type=int, default=None)

    args = parser.parse_args()
    gen = DuisGenerator()
    gen.generate_for_book(args.book_id, args.grade, args.subject, args.limit)
