import re
from typing import List

class AdaptiveChunker:
    """
    Keyfiyyətə görə ölçüsünü tənzimləyən chunking sistemi.
    """
    def __init__(self, base_chunk_size=600, min_chunk_size=300, max_chunk_size=1200, overlap=100):
        self.base_chunk_size = base_chunk_size
        self.min_chunk_size = min_chunk_size
        self.max_chunk_size = max_chunk_size
        self.overlap = overlap

    def split(self, text: str, quality_score: float) -> List[str]:
        # Keyfiyyət yüksəkdirsə daha böyük chunklar götürülə bilər
        target_size = self._get_size(quality_score)
        
        # Cümlələr üzrə böl
        sentences = re.split(r'(?<=[.!?])\s+', text)
        
        chunks = []
        current_chunk = ""
        
        for sentence in sentences:
            if len(current_chunk) + len(sentence) < target_size:
                current_chunk += (" " if current_chunk else "") + sentence
            else:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                current_chunk = sentence

        if current_chunk:
            chunks.append(current_chunk.strip())

        return self._apply_overlap(chunks)

    def _get_size(self, score):
        if score > 0.85: return self.max_chunk_size
        if score > 0.65: return self.base_chunk_size
        return self.min_chunk_size

    def _apply_overlap(self, chunks):
        if len(chunks) <= 1: return chunks
        
        overlapped = []
        for i in range(len(chunks)):
            if i == 0:
                overlapped.append(chunks[i])
            else:
                # Əvvəlki chunk-ın sonundan gələn hissəni əlavə et
                prev_tail = chunks[i-1][-self.overlap:] if len(chunks[i-1]) > self.overlap else chunks[i-1]
                overlapped.append(prev_tail + " " + chunks[i])
        return overlapped
