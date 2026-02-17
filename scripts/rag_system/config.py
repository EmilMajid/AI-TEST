# config.py

class Config:
    # Thresholds
    MIN_QUALITY = 0.75
    DUP_THRESHOLD = 0.92

    # Chunking limits
    CHUNK_MIN = 350
    CHUNK_MAX = 900
    CHUNK_OVERLAP = 100

    # Models
    # Using a robust multilingual model
    EMBEDDING_MODEL_NAME = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    EMBEDDING_DIM = 384

    # Vector Store
    VECTOR_DB_TYPE = "faiss" # Default to faiss for local stability
    COLLECTION_NAME = "azerbaijan_textbooks"
    
    # OCR Settings
    DEFAULT_OCR_LANG = "aze+eng+rus"
