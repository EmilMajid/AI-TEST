"""
RAG Vectorizer - Məlumatları vektorlaşdırıb FAISS indeksləyir
"""
from sentence_transformers import SentenceTransformer
import numpy as np
import faiss
import json
import os
from pathlib import Path
from typing import List, Dict, Any

class VectorIndexer:
    """Mətn məlumatlarını vektorlaşdırıb indeksləyir"""
    
    def __init__(self, model_name: str = "paraphrase-multilingual-MiniLM-L12-v2"):
        print(f"Loading embedding model: {model_name}")
        self.model = SentenceTransformer(model_name)
        self.index = None
        self.metadata = []
        self.dimension = 384  # Model embedding dimension
    
    def create_index(self, data_dir: str = "extracted_data"):
        """JSONL fayllardan FAISS indeksi yaradır"""
        all_texts = []
        self.metadata = []
        
        data_path = Path(data_dir)
        if not data_path.exists():
            print(f"Error: Directory {data_dir} does not exist")
            return
        
        # Load all JSONL files
        for jsonl_file in data_path.glob("*.jsonl"):
            print(f"Processing: {jsonl_file}")
            
            with open(jsonl_file, "r", encoding="utf-8") as f:
                for line in f:
                    item = json.loads(line)
                    
                    # Process each chunk
                    for chunk in item.get("chunks", []):
                        all_texts.append(chunk["text"])
                        
                        # Store metadata
                        self.metadata.append({
                            "grade": item["grade"],
                            "subject": item["subject"],
                            "source": item["source"],
                            "page": chunk["page"],
                            "chunk_id": chunk["id"],
                            "text": chunk["text"][:200] + "..."  # Preview
                        })
        
        if not all_texts:
            print("No texts found to index")
            return
        
        print(f"Generating embeddings for {len(all_texts)} chunks...")
        
        # Generate embeddings
        embeddings = self.model.encode(
            all_texts,
            show_progress_bar=True,
            batch_size=32
        )
        
        print(f"Creating FAISS index with dimension {self.dimension}...")
        
        # Create FAISS index (Inner Product for cosine similarity)
        self.index = faiss.IndexFlatIP(self.dimension)
        
        # Normalize embeddings for cosine similarity
        faiss.normalize_L2(embeddings)
        
        # Add to index
        self.index.add(embeddings.astype(np.float32))
        
        print(f"Index created with {self.index.ntotal} vectors")
        
        # Save index and metadata
        self.save_index()
    
    def save_index(self, index_dir: str = "vector_index"):
        """İndeksi və metadata-nı saxlayır"""
        index_path = Path(index_dir)
        index_path.mkdir(exist_ok=True)
        
        # Save FAISS index
        index_file = index_path / "textbook_index.faiss"
        faiss.write_index(self.index, str(index_file))
        print(f"Index saved to: {index_file}")
        
        # Save metadata
        metadata_file = index_path / "index_metadata.json"
        with open(metadata_file, "w", encoding="utf-8") as f:
            json.dump(self.metadata, f, ensure_ascii=False, indent=2)
        print(f"Metadata saved to: {metadata_file}")
    
    def load_index(self, index_dir: str = "vector_index"):
        """İndeksi yükləyir"""
        index_path = Path(index_dir)
        
        # Load FAISS index
        index_file = index_path / "textbook_index.faiss"
        if index_file.exists():
            self.index = faiss.read_index(str(index_file))
            print(f"Loaded index with {self.index.ntotal} vectors")
        else:
            print(f"Index file not found: {index_file}")
            return False
        
        # Load metadata
        metadata_file = index_path / "index_metadata.json"
        if metadata_file.exists():
            with open(metadata_file, "r", encoding="utf-8") as f:
                self.metadata = json.load(f)
            print(f"Loaded {len(self.metadata)} metadata entries")
        else:
            print(f"Metadata file not found: {metadata_file}")
            return False
        
        return True
    
    def search(self, query: str, grade: int, subject: str, k: int = 5) -> List[Dict[str, Any]]:
        """Sorğuya uyğun kontekst axtarır"""
        if self.index is None:
            print("Index not loaded")
            return []
        
        # Enrich query with educational context
        enriched_query = f"{grade} sinif {subject} fənni: {query}"
        
        # Generate query embedding
        query_embedding = self.model.encode([enriched_query])
        faiss.normalize_L2(query_embedding)
        
        # Search in index
        distances, indices = self.index.search(
            query_embedding.astype(np.float32), 
            k * 3  # Get more results to filter
        )
        
        # Filter by grade and subject
        results = []
        for dist, idx in zip(distances[0], indices[0]):
            if idx >= 0 and idx < len(self.metadata):
                meta = self.metadata[idx]
                
                # Filter by grade and subject
                if meta["grade"] == grade and meta["subject"] == subject:
                    results.append({
                        "text": meta["text"],
                        "score": float(dist),
                        "source": meta["source"],
                        "page": meta["page"],
                        "grade": meta["grade"],
                        "subject": meta["subject"]
                    })
                    
                    if len(results) >= k:
                        break
        
        return results

def create_vector_index():
    """Vektor indeksi yaradır"""
    indexer = VectorIndexer()
    indexer.create_index()
    print("\n✅ Vector index created successfully!")

def test_search():
    """Axtarış funksiyasını test edir"""
    indexer = VectorIndexer()
    
    if not indexer.load_index():
        print("Failed to load index. Run create_vector_index() first.")
        return
    
    # Test search
    results = indexer.search(
        query="Nyuton qanunları",
        grade=8,
        subject="fizika",
        k=3
    )
    
    print("\nTest Search Results:")
    for i, result in enumerate(results, 1):
        print(f"\n{i}. Score: {result['score']:.4f}")
        print(f"   Source: {result['source']} (Page {result['page']})")
        print(f"   Text: {result['text']}")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "test":
        test_search()
    else:
        create_vector_index()
