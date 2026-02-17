import time
from collections import defaultdict

class IngestionMonitor:
    """
    Dəlillərin yüklənməsi prosesini izləyən modul.
    """
    def __init__(self):
        self.start_time = time.time()
        self.stats = defaultdict(int)
        self.scores = []
        self.corruption_ratios = []
        self.quality_distribution = defaultdict(int) # histogram buckets

    def log_chunk(self, score: float, corruption: float = 0.0):
        self.stats["total_chunks"] += 1
        if score < 0.75: # Production threshold
            self.stats["low_quality_skipped"] += 1
        else:
            self.stats["accepted"] += 1
        
        self.scores.append(score)
        self.corruption_ratios.append(corruption)
        
        # Quality distribution buckets (0.1 increments)
        bucket = int(score * 10) / 10.0
        self.quality_distribution[bucket] += 1

    def get_summary(self):
        duration = time.time() - self.start_time
        avg_score = sum(self.scores) / len(self.scores) if self.scores else 0
        avg_corruption = sum(self.corruption_ratios) / len(self.corruption_ratios) if self.corruption_ratios else 0
        
        return {
            "elapsed_time": round(duration, 2),
            "chunks_per_sec": round(self.stats["total_chunks"] / duration, 2) if duration > 0 else 0,
            "total_processed": self.stats["total_chunks"],
            "accepted": self.stats["accepted"],
            "skipped": self.stats["low_quality_skipped"],
            "low_quality_ratio": round(self.stats["low_quality_skipped"] / max(self.stats["total_chunks"], 1), 3),
            "average_quality": round(avg_score, 3),
            "average_corruption": round(avg_corruption, 3),
            "quality_distribution": dict(sorted(self.quality_distribution.items()))
        }
