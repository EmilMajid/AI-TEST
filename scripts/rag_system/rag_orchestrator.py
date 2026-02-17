# rag_orchestrator.py
import os
import sys

# Add current directory to path for relative imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from config import Config
from rag_pipeline import RAGIngestionPipeline
from adaptive_chunker import AdaptiveChunker
from vector_store import VectorStoreFactory
from monitoring import IngestionMonitor
from semantic_filter import SemanticDeduplicator
from embedding_cache import EmbeddingCache

class RAGOrchestrator:
    """
    Central orchestrator using Production-Grade components.
    """
    def __init__(self, embedding_model=None):
        self.cfg = Config()
        self.pipeline = RAGIngestionPipeline()
        self.chunker = AdaptiveChunker(
            min_chunk_size=self.cfg.CHUNK_MIN,
            max_chunk_size=self.cfg.CHUNK_MAX,
            overlap=self.cfg.CHUNK_OVERLAP
        )
        # Using Factory to get vector store implementation
        self.store = VectorStoreFactory.get_store(
            store_type=self.cfg.VECTOR_DB_TYPE,
            dimension=self.cfg.EMBEDDING_DIM
        )
        self.monitor = IngestionMonitor()
        self.deduplicator = SemanticDeduplicator(threshold=self.cfg.DUP_THRESHOLD)
        self.cache = EmbeddingCache()
        self.embedding_model = embedding_model
        
        if self.embedding_model is None:
            print("[WARN] No embedding model provided. Deduplication will be limited to exact matches.")

    def _get_dummy_embedding(self, text: str):
        import hashlib
        import numpy as np
        h = hashlib.md5(text.encode()).digest()
        # Create a pseudo-random but deterministic vector from hash
        np.random.seed(int.from_bytes(h, "big") % 2**32)
        return np.random.rand(self.cfg.EMBEDDING_DIM).astype("float32")

    def ingest_document(self, content: str, meta: dict = None):
        """
        Processes and indexes a document with full production-grade flow.
        """
        # 1. Process via Pipeline (Norm -> Repair -> Lang -> Score)
        processed = self.pipeline.process(content)
        
        # 2. Quality Gate (using Config threshold + Corruption check)
        quality_score = processed["quality"]["score"]
        corruption_ratio = processed["quality"].get("corruption_ratio", 0)
        
        if quality_score < self.cfg.MIN_QUALITY or corruption_ratio > 0.4:
            self.monitor.log_chunk(quality_score, corruption_ratio)
            return {
                "status": "skipped", 
                "reason": "low_quality" if quality_score < self.cfg.MIN_QUALITY else "high_corruption", 
                "quality": quality_score,
                "corruption": corruption_ratio,
                "details": processed["quality"]
            }

        # 3. Adaptive Chunking
        chunks = self.chunker.split(processed["text"], processed["quality"]["score"])
        
        # 4. Ingestion & Deduplication
        final_chunks = []
        final_embeddings = []
        final_metadata = []

        model_name = self.cfg.EMBEDDING_MODEL_NAME

        for chunk_text in chunks:
            # Check Cache
            emb = self.cache.get(chunk_text, model_name)
            
            if emb is None:
                if self.embedding_model:
                    try:
                        # Generate and cache
                        emb = self.embedding_model.encode([chunk_text])[0]
                        self.cache.set(chunk_text, emb, model_name)
                    except Exception as e:
                        print(f"[ERROR] Embedding failed: {e}. Using dummy fallback.")
                        emb = self._get_dummy_embedding(chunk_text)
                else:
                    emb = self._get_dummy_embedding(chunk_text)
            
            if emb is not None:
                if not self.deduplicator.is_duplicate(emb):
                    final_chunks.append(chunk_text)
                    final_embeddings.append(emb)
                    
                    # Metadata enrichment
                    chunk_meta = meta.copy() if meta else {}
                    chunk_meta.update({
                        "text": chunk_text,
                        "quality": processed["quality"]["score"],
                        "language": processed["language"],
                        "corruption_ratio": processed["quality"].get("corruption_ratio", 0)
                    })
                    final_metadata.append(chunk_meta)
            else:
                # Fallback if no embedding model and not in cache
                final_chunks.append(chunk_text)

        # 5. Store in Vector DB if any
        if final_embeddings:
            self.store.add(final_embeddings, final_metadata)

        # Log stats for monitoring
        for _ in final_chunks:
            self.monitor.log_chunk(processed["quality"]["score"], processed["quality"].get("corruption_ratio", 0))

        return {
            "status": "success",
            "chunks_count": len(final_chunks),
            "duplicates_removed": len(chunks) - len(final_chunks),
            "language": processed["language"],
            "quality": processed["quality"]["score"],
            "chunks": final_chunks,
            "metadata": final_metadata
        }

    def get_stats(self):
        return self.monitor.get_summary()

    def reset_deduplicator(self):
        self.deduplicator.reset()
