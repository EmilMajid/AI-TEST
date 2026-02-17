# vector_store.py
from abc import ABC, abstractmethod
from typing import List, Optional
import numpy as np

class VectorStoreBase(ABC):
    @abstractmethod
    def add(self, embeddings: List[List[float]], metadata: List[dict] = None):
        pass

    @abstractmethod
    def search(self, query_vector: List[float], top_k=5):
        pass

class FAISSStore(VectorStoreBase):
    def __init__(self, dimension=768):
        self.dimension = dimension
        self.metadata = []
        try:
            import faiss
            self.index = faiss.IndexFlatL2(dimension)
        except ImportError:
            print("FAISS not found. Falling back to numpy.")
            self.index = None
            self._storage = []

    def add(self, embeddings: List[List[float]], metadata: List[dict] = None):
        if not embeddings: return
        vectors = np.array(embeddings).astype("float32")
        
        if self.index:
            self.index.add(vectors)
        else:
            self._storage.extend(embeddings)
            
        if metadata:
            self.metadata.extend(metadata)
        else:
            self.metadata.extend([{} for _ in range(len(embeddings))])

    def search(self, query_vector: List[float], top_k=5):
        if self.index:
            q = np.array([query_vector]).astype("float32")
            D, I = self.index.search(q, top_k)
            return I[0].tolist(), D[0].tolist()
        return [], []

class QdrantStore(VectorStoreBase):
    # Simplified placeholder as Qdrant client might not be available
    def __init__(self, url="http://localhost:6333", collection="textbooks"):
        self.url = url
        self.collection = collection
        print(f"Connecting to Qdrant at {url} (Mock)")

    def add(self, embeddings, metadata=None):
        print(f"Upserting {len(embeddings)} vectors to Qdrant")

    def search(self, query_vector, top_k=5):
        return [], []

class VectorStoreFactory:
    @staticmethod
    def get_store(store_type: str, dimension=768) -> VectorStoreBase:
        if store_type.lower() == "faiss":
            return FAISSStore(dimension)
        if store_type.lower() == "qdrant":
            return QdrantStore()
        raise ValueError(f"Unknown store type: {store_type}")

# For backward compatibility
VectorStore = FAISSStore
