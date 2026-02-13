import os
import sys

# Add current directory to path for relative imports if needed
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from rag_pipeline import RAGIngestionPipeline
from adaptive_chunker import AdaptiveChunker
from vector_store import VectorStore
from monitoring import IngestionMonitor

class RAGOrchestrator:
    """
    Bütün RAG sistemini idarə edən mərkəzi sinif.
    """
    def __init__(self, embedding_model=None):
        self.pipeline = RAGIngestionPipeline()
        self.chunker = AdaptiveChunker()
        self.store = VectorStore(dimension=embedding_model.get_sentence_embedding_dimension() if embedding_model else 768)
        self.monitor = IngestionMonitor()
        self.embedding_model = embedding_model

    def ingest_document(self, content: str, meta: dict = None):
        """
        Sənədi tam emal edir və indeksləyir.
        """
        processed = self.pipeline.process(content)
        
        if processed["quality"]["score"] < 0.5:
            self.monitor.log_chunk(processed["quality"]["score"])
            return {"status": "skipped", "reason": "low_quality"}

        chunks = self.chunker.split(processed["text"], processed["quality"]["score"])
        
        embeddings = []
        if self.embedding_model:
            embeddings = self.embedding_model.encode(chunks)
            self.store.add(embeddings)
        
        for _ in chunks:
            self.monitor.log_chunk(processed["quality"]["score"])

        return {
            "status": "success",
            "chunks_count": len(chunks),
            "language": processed["language"],
            "quality": processed["quality"]["score"]
        }

    def get_stats(self):
        return self.monitor.get_summary()
