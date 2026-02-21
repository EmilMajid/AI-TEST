
# noise_remover.py
from collections import Counter
from typing import List, Set

class NoiseRemover:
    """
    Global Noise Remover for Production RAG 2.0.
    Detects and removes repetitive headers/footers across the entire document.
    """
    
    def __init__(self, repeat_threshold_ratio: float = 0.10, min_repeats: int = 5):
        """
        Args:
            repeat_threshold_ratio: If line appears in >10% of pages (empirically mapped to ~total lines ratio)
            min_repeats: Absolute minimum number of repetitions to consider as noise
        """
        self.repeat_threshold_ratio = repeat_threshold_ratio
        self.min_repeats = min_repeats

    def remove_noise(self, text: str) -> str:
        """
        Analyzes full document text and removes globally repetitive noise lines.
        """
        lines = text.split('\n')
        total_lines = len(lines)
        
        if total_lines < 50:
            return text
            
        # 1. Frequency Analysis (Normalized)
        # We map normalized line -> list of original indices
        norm_map = {}
        for i, line in enumerate(lines):
            stripped = line.strip()
            if not stripped: continue
            
            norm = stripped.lower()
            if norm not in norm_map:
                norm_map[norm] = []
            norm_map[norm].append(i)
            
        # 2. Identify Noise Candidates
        noise_indices: Set[int] = set()
        
        # Heuristic: A line is noise if it repeats often AND is relatively short
        # We approximate "pages" by total_lines / 30 (avg lines per page)
        estimated_pages = max(1, total_lines / 30)
        
        for norm, indices in norm_map.items():
            count = len(indices)
            
            # Rule 1: High frequency short lines (Page numbers, headers)
            if count > max(self.min_repeats, estimated_pages * self.repeat_threshold_ratio):
                if len(norm) < 100: # Don't remove long repetitive paragraphs (rare but possible in legal texts)
                    for idx in indices:
                        noise_indices.add(idx)
                        
            # Rule 2: Digits only (Page numbers) - stricter
            # If a line is just a number and appears > 3 times, likely page number
            elif norm.isdigit() and count > 3:
                for idx in indices:
                    noise_indices.add(idx)

        # 3. Reconstruct Text
        clean_lines = []
        removed_count = 0
        
        for i, line in enumerate(lines):
            if i not in noise_indices:
                clean_lines.append(line)
            else:
                removed_count += 1
                
        # print(f"  [NoiseRemover] Removed {removed_count} repetitive lines.")
        return '\n'.join(clean_lines)

if __name__ == "__main__":
    remover = NoiseRemover()
    
    # Simulate a document with headers
    doc = []
    for i in range(1, 20):
        doc.append(f"AZƏRBAYCAN TARİXİ - 5") # Header
        doc.append(f"Bölmə {i}: Maraqlı hadisələr...")
        doc.append("Burada çox vacib mətn var.")
        doc.append(f"{i}") # Footer (Page num)
        
    full_text = "\n".join(doc)
    
    print(f"Original Lines: {len(doc)}")
    clean_text = remover.remove_noise(full_text)
    print(f"Clean Lines: {len(clean_text.splitlines())}")
    
    print("\n--- SAMPLE CLEAN TEXT ---")
    print(clean_text[:200])
