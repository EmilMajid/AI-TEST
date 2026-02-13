from typing import List, Optional
import numpy as np

class VectorStore:
    """
    FAISS əsaslı vektor bazası meneceri.
    """
    def __init__(self, mode="faiss", dimension=768):
        self.mode = mode
        self.dimension = dimension
        self.index = None

        if mode == "faiss":
            try:
                import faiss
                self.index = faiss.IndexFlatL2(dimension)
            except ImportError:
                print("FAISS not installed. Using numpy fallback for storage.")

    def add(self, embeddings: List[List[float]]):
        if not embeddings: return
        vectors = np.array(embeddings).astype("float32")
        
        if self.index:
            self.index.add(vectors)
        else:
            # Fallback storage if no vector DB
            if not hasattr(self, '_storage'): self._storage = []
            self._storage.extend(embeddings)

    def search(self, query_vector: List[float], top_k=5):
        if self.index:
            q = np.array([query_vector]).astype("float32")
            D, I = self.index.search(q, top_k)
            return I[0].tolist(), D[0].tolist()
        return [], []
