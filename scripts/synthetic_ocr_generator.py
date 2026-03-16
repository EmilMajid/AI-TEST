
import json
import random
import re
from pathlib import Path

class SyntheticOCRGenerator:
    def __init__(self, source_file: str, output_file: str):
        self.source_file = source_file
        self.output_file = output_file
        
        # OCR Confusion Characters (based on user request & common errors)
        self.confusion_map = {
            'v': ['a', 'u'],
            'a': ['v', 'o'],
            'l': ['i', 'f', 't'],
            'i': ['l', '1'],
            'rn': ['m'],
            'm': ['rn', 'nn'],
            '0': ['o', 'O'],
            'o': ['0', 'a'],
            'ə': ['e', 'x', 'o'],
            's': ['ş', '5'],
            'ş': ['s'],
            'c': ['ç'],
            'ç': ['c'],
            'e': ['ə'],
            'ı': ['i', 'l']
        }

    def corrupt_word(self, word: str) -> str:
        if len(word) < 2: return word
        
        chars = list(word)
        # 1. Random character swap
        for i in range(len(chars)):
            if random.random() < 0.1: # 10% chance per char
                c = chars[i].lower()
                if c in self.confusion_map:
                    chars[i] = random.choice(self.confusion_map[c])
        
        # 2. Random vowel drop (especially 'ə', 'ı')
        if random.random() < 0.05:
            chars = [c for c in chars if c.lower() not in 'əı' or random.random() > 0.5]
            
        return "".join(chars)

    def generate(self, limit=5000):
        if not Path(self.source_file).exists():
            print(f"Error: Source file {self.source_file} not found.")
            return
            
        print(f"[*] Loading Gold Standard data from {self.source_file}...")
        results = []
        
        with open(self.source_file, "r", encoding="utf-8") as f:
            for line in f:
                try:
                    chunk = json.loads(line)
                    # Only use high-quality sources (type: html) for training target
                    if chunk.get("type") != "html": continue
                    
                    target_text = chunk.get("text", "").strip()
                    if not target_text or len(target_text) < 50: continue
                    
                    # Split into sentences or smaller blocks for training
                    # Simple split by punctuation
                    blocks = re.split(r'(?<=[.!?])\s+', target_text)
                    
                    for block in blocks:
                        if len(block) < 20: continue
                        
                        # Create corrupted version
                        words = block.split()
                        corrupted_words = []
                        
                        for i, w in enumerate(words):
                            cw = self.corrupt_word(w)
                            
                            # 3. Random concatenation (Word segmentation error)
                            if i > 0 and random.random() < 0.1: # 10% chance to join with previous
                                if corrupted_words:
                                    corrupted_words[-1] = corrupted_words[-1] + cw
                                else:
                                    corrupted_words.append(cw)
                            else:
                                corrupted_words.append(cw)
                                
                        input_text = " ".join(corrupted_words)
                        
                        results.append({
                            "input": input_text,
                            "target": block
                        })
                        
                        if len(results) >= limit: break
                    if len(results) >= limit: break
                except: continue
                
        print(f"[*] Generated {len(results)} synthetic training pairs.")
        
        with open(self.output_file, "w", encoding="utf-8") as f:
            for item in results:
                json.dump(item, f, ensure_ascii=False)
                f.write("\n")
                
        print(f"[✓] Training dataset saved to: {self.output_file}")

if __name__ == "__main__":
    import pathlib
    base_dir = pathlib.Path(__file__).parent.parent
    generator = SyntheticOCRGenerator(
        str(base_dir / "data" / "textbook-chunks.jsonl"),
        str(base_dir / "data" / "ocr_repair_training.jsonl")
    )
    generator.generate(limit=10000)
