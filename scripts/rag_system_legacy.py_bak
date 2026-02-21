"""
RAG System - Retrieval-Augmented Generation sistemi
"""
from sentence_transformers import SentenceTransformer
import faiss
import json
from pathlib import Path
from typing import List, Dict, Any
import numpy as np

class RAGSystem:
    """RAG əsaslı kontekst axtarış sistemi"""
    
    def __init__(self, index_dir: str = "vector_index"):
        self.model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")
        self.index = None
        self.metadata = []
        self.index_dir = Path(index_dir)
        self.load_index()
        
        # Caching System
        self._cache = {}
        self._cache_size = 1000
        self._cache_stats = {"hits": 0, "misses": 0}
    
    def load_index(self):
        """FAISS indeksini yükləyir"""
        index_file = self.index_dir / "textbook_index.faiss"
        metadata_file = self.index_dir / "index_metadata.json"
        
        if index_file.exists() and metadata_file.exists():
            self.index = faiss.read_index(str(index_file))
            
            with open(metadata_file, "r", encoding="utf-8") as f:
                self.metadata = json.load(f)
            
            print(f"✅ RAG System loaded: {self.index.ntotal} vectors")
            return True
        else:
            print("⚠️ RAG index not found. Please run vectorizer first.")
            return False
    
    def retrieve_context(
        self, 
        query: str, 
        grade: int, 
        subject: str, 
        k: int = 5,
        min_score: float = 0.3
    ) -> str:
        """Sorğuya uyğun kontekst məlumatları gətirir"""
        
        # 1. Check Cache
        cache_key = f"ctx:{grade}:{subject}:{query.lower().strip()}:{k}:{min_score}"
        if cache_key in self._cache:
            self._cache_stats["hits"] += 1
            print(f"⚡ Cache HIT for: '{query}'")
            return self._cache[cache_key]
        
        self._cache_stats["misses"] += 1

        
        if self.index is None or not self.metadata:
            return self._get_fallback_context(grade, subject, query)
        
        # Enrich query
        enriched_query = f"{grade} sinif {subject} fənni: {query}"
        
        # Generate embedding
        query_embedding = self.model.encode([enriched_query])
        faiss.normalize_L2(query_embedding)
        
        # Search
        distances, indices = self.index.search(
            query_embedding.astype(np.float32),
            k * 2  # Get more for filtering
        )
        
        # Build context from results
        context_parts = []
        seen_texts = set()
        
        for dist, idx in zip(distances[0], indices[0]):
            if idx < 0 or idx >= len(self.metadata):
                continue
            
            meta = self.metadata[idx]
            
            # Filter by grade, subject, and score
            if (meta["grade"] == grade and 
                meta["subject"] == subject and 
                dist >= min_score):
                
                # Avoid duplicates
                text_key = meta["text"][:100]
                if text_key not in seen_texts:
                    context_parts.append(
                        f"[Mənbə: {meta['source']}, Səhifə: {meta['page']}]\n"
                        f"{meta['text']}\n"
                    )
                    seen_texts.add(text_key)
                    
                    if len(context_parts) >= k:
                        break
        
        if context_parts:
            context = "\n---\n".join(context_parts)
            result = f"""Dərslik Konteksti ({grade}-ci sinif {subject}):

{context}

Yuxarıdakı dərslik məlumatlarına əsasən mövzu: {query}
"""
            # Store in cache
            self._cache[cache_key] = result
            # Simple eviction policy (Random/FIFO-ish) if full
            if len(self._cache) > self._cache_size:
                self._cache.pop(next(iter(self._cache)))
                
            return result
        else:
            return self._get_fallback_context(grade, subject, query)
    
    def _get_fallback_context(self, grade: int, subject: str, query: str) -> str:
        """Fallback kontekst (RAG işləməyəndə)"""
        return f"""Mövzu: {query}
Sinif: {grade}
Fənn: {subject}

Bu mövzu üzrə dərslik konteksti hal-hazırda əlçatan deyil. 
Ümumi biliklərinizə əsasən suallar yaradın.
"""
    
    def get_related_topics(
        self, 
        query: str, 
        grade: int, 
        subject: str, 
        k: int = 3
    ) -> List[str]:
        """Əlaqəli mövzuları gətirir"""
        
        # Check Cache
        cache_key = f"topics:{grade}:{subject}:{query.lower().strip()}:{k}"
        if cache_key in self._cache:
            return self._cache[cache_key]
        
        if self.index is None:
            return []
        
        enriched_query = f"{grade} sinif {subject}: {query}"
        query_embedding = self.model.encode([enriched_query])
        faiss.normalize_L2(query_embedding)
        
        distances, indices = self.index.search(
            query_embedding.astype(np.float32),
            k * 3
        )
        
        topics = set()
        for idx in indices[0]:
            if idx >= 0 and idx < len(self.metadata):
                meta = self.metadata[idx]
                if meta["grade"] == grade and meta["subject"] == subject:
                    # Extract first sentence as topic
                    text = meta["text"]
                    first_sentence = text.split('.')[0]
                    if len(first_sentence) < 100:
                        topics.add(first_sentence)
                        
                        if len(topics) >= k:
                            break
                            
        result = list(topics)
        self._cache[cache_key] = result
        return result

    def get_cache_stats(self):
        return self._cache_stats

# Singleton instance
_rag_system = None

def get_rag_system() -> RAGSystem:
    """RAG sistem instance-ını qaytarır"""
    global _rag_system
    if _rag_system is None:
        _rag_system = RAGSystem()
    return _rag_system

if __name__ == "__main__":
    # Test RAG system
    rag = RAGSystem()
    
    context = rag.retrieve_context(
        query="Nyuton qanunları və qüvvə",
        grade=8,
        subject="fizika",
        k=3
    )
    
    print("Retrieved Context:")
    print(context)
    
    print("\n" + "="*50 + "\n")
    
    topics = rag.get_related_topics(
        query="Nyuton qanunları",
        grade=8,
        subject="fizika"
    )
    
    print("Related Topics:")
    for topic in topics:
        print(f"  - {topic}")
