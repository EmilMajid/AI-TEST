import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from typing import List

class SemanticDeduplicator:
    """
    Prevents redundant chunks from being indexed using vector similarity.
    """
    def __init__(self, threshold=0.92):
        self.threshold = threshold
        self.embeddings = []

    def is_duplicate(self, new_embedding) -> bool:
        """
        Checks if the new embedding is too similar to existing ones.
        new_embedding should be a 1D numpy array or list.
        """
        if not self.embeddings:
            self.embeddings.append(new_embedding)
            return False

        # Convert to 2D for sklearn
        new_emb_2d = np.array(new_embedding).reshape(1, -1)
        existing_embs_2d = np.array(self.embeddings)

        # Calculate cosine similarity
        sims = cosine_similarity(new_emb_2d, existing_embs_2d)[0]

        if np.max(sims) > self.threshold:
            return True

        self.embeddings.append(new_embedding)
        return False

    def reset(self):
        """Clear historical embeddings for a new session/book if needed"""
        self.embeddings = []
