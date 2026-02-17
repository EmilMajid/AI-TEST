# adaptive_chunker.py
import re
from typing import List

class AdaptiveChunker:
    """
    Paragraph-aware adaptive chunking.
    Adjusts size based on quality to ensure context preservation.
    """
    def __init__(self, base_chunk_size=600, min_chunk_size=350, max_chunk_size=900, overlap=100):
        self.base_chunk_size = base_chunk_size
        self.min_chunk_size = min_chunk_size
        self.max_chunk_size = max_chunk_size
        self.overlap = overlap

    def split(self, text: str, quality_score: float) -> List[str]:
        # 1. Determine target size based on quality
        target_size = self._get_size(quality_score)
        
        # 2. Split by paragraphs first (preserves semantic blocks)
        paragraphs = re.split(r'\n{2,}', text)
        
        chunks = []
        current_chunk = ""
        
        for p in paragraphs:
            p = p.strip()
            if not p: continue
            
            # If paragraph is too large, split it by sentences
            if len(p) > target_size:
                sentences = re.split(r'(?<=[.!?])\s+', p)
                for sent in sentences:
                    if len(current_chunk) + len(sent) < target_size:
                        current_chunk += (" " if current_chunk else "") + sent
                    else:
                        if current_chunk:
                            chunks.append(current_chunk.strip())
                        current_chunk = sent
            else:
                if len(current_chunk) + len(p) < target_size:
                    current_chunk += ("\n\n" if current_chunk else "") + p
                else:
                    if current_chunk:
                        chunks.append(current_chunk.strip())
                    current_chunk = p

        if current_chunk:
            chunks.append(current_chunk.strip())

        # 3. Post-process: Merge very small chunks to avoid over-segmentation
        # (Audit requirement: threshold ~400 chars)
        final_chunks = []
        temp_chunk = ""
        
        for c in chunks:
            if not temp_chunk:
                temp_chunk = c
            elif len(temp_chunk) < self.min_chunk_size:
                temp_chunk += "\n\n" + c
            else:
                final_chunks.append(temp_chunk)
                temp_chunk = c
        
        if temp_chunk:
            if len(temp_chunk) < self.min_chunk_size and final_chunks:
                # Append last small chunk to previous instead of keeping it alone
                final_chunks[-1] += "\n\n" + temp_chunk
            else:
                final_chunks.append(temp_chunk)

        return final_chunks

    def _get_size(self, score):
        if score > 0.85: return self.max_chunk_size
        if score > 0.65: return self.base_chunk_size
        return self.min_chunk_size
