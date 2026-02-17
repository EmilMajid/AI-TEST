# embedding_cache.py
import sqlite3
import hashlib
import json
import numpy as np
from pathlib import Path

class EmbeddingCache:
    """
    SQLite-based persistent cache for text embeddings.
    """
    def __init__(self, cache_dir="data/cache", db_name="embeddings.db"):
        self.cache_path = Path(cache_dir)
        self.cache_path.mkdir(parents=True, exist_ok=True)
        self.db_path = self.cache_path / db_name
        self._init_db()

    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS cache (
                    hash TEXT PRIMARY KEY,
                    text TEXT,
                    embedding TEXT,
                    model_name TEXT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)
            conn.execute("CREATE INDEX IF NOT EXISTS idx_model ON cache(model_name)")

    def _get_hash(self, text: str) -> str:
        return hashlib.sha256(text.encode('utf-8')).hexdigest()

    def get(self, text: str, model_name: str) -> np.ndarray:
        h = self._get_hash(text)
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(
                "SELECT embedding FROM cache WHERE hash = ? AND model_name = ?", 
                (h, model_name)
            )
            row = cursor.fetchone()
            if row:
                return np.array(json.loads(row[0]))
        return None

    def set(self, text: str, embedding: np.ndarray, model_name: str):
        h = self._get_hash(text)
        emb_json = json.dumps(embedding.tolist())
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "INSERT OR REPLACE INTO cache (hash, text, embedding, model_name) VALUES (?, ?, ?, ?)",
                (h, text, emb_json, model_name)
            )
